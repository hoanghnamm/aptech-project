const https = require('https');

// Fallback high-quality Unsplash dog images
const FALLBACK_THUMBNAILS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&h=400&fit=crop'
];

const DOG_KEYWORDS = [
  'dog',
  'dogs',
  'puppy',
  'canine',
  'dog health',
  'dog care',
  'dog nutrition',
  'veterinary dog topics'
];

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
let newsCache = {
  data: null,
  timestamp: 0
};

/**
 * Fetch text content from a URL with a timeout and redirect handling.
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000
    };
    
    const req = https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve(data); });
    });
    
    req.on('error', (err) => { reject(err); });
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

/**
 * Parses RSS XML format into standard article objects.
 */
function parseRss(xml, sourceName) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml))) {
    const itemContent = match[1];
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    const pubDateMatch = itemContent.match(/<pubDate>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/pubDate>/);
    
    const enclosureMatch = itemContent.match(/<enclosure[^>]+url=["']([^"']+)["']/);
    const mediaContentMatch = itemContent.match(/<media:content[^>]+url=["']([^"']+)["']/);
    const mediaThumbnailMatch = itemContent.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/);
    const imgInDescriptionMatch = itemContent.match(/<description>[\s\S]*?src=["']([^"']+)["']/);
    const imgInContentMatch = itemContent.match(/<content:encoded>[\s\S]*?src=["']([^"']+)["']/);
    
    if (titleMatch && linkMatch) {
      const title = titleMatch[1].trim().replace(/\s+/g, ' ');
      const url = linkMatch[1].trim();
      const publishedAt = pubDateMatch ? new Date(pubDateMatch[1].trim()).toISOString() : new Date().toISOString();
      const thumbnail = (enclosureMatch && enclosureMatch[1]) ||
                        (mediaContentMatch && mediaContentMatch[1]) ||
                        (mediaThumbnailMatch && mediaThumbnailMatch[1]) ||
                        (imgInDescriptionMatch && imgInDescriptionMatch[1]) ||
                        (imgInContentMatch && imgInContentMatch[1]) ||
                        '';
                        
      items.push({
        title,
        thumbnail,
        url,
        publishedAt,
        source: sourceName
      });
    }
  }
  return items;
}

/**
 * Scrapes articles from HTML search/archives of AKC if RSS fails.
 */
function scrapeHtmlFallback(html, sourceName) {
  const articles = [];
  const linkRegex = /content_url:\s*"https:\\\/\\\/www\.akc\.org\\\/expert-advice\\\/health\\\/([^\\/]+)\\\/",\s*content_title:\s*"([^"]+)"/g;
  let match;
  let imgIndex = 0;
  
  while ((match = linkRegex.exec(html))) {
    const slug = match[1];
    const title = match[2]
      .trim()
      .replace(/&#[0-9]+;/g, ' ')
      .replace(/\s+/g, ' ');
      
    if (!['page', 'common-conditions', 'puppy-health', 'general-health', 'senior-dog-health', 'flea-tick', 'dental-health'].includes(slug)) {
      articles.push({
        title,
        thumbnail: FALLBACK_THUMBNAILS[imgIndex % FALLBACK_THUMBNAILS.length],
        url: `https://www.akc.org/expert-advice/health/${slug}/`,
        publishedAt: new Date().toISOString(),
        source: sourceName
      });
      imgIndex++;
    }
  }
  return articles;
}

/**
 * Check if the article title matches dog-related keywords.
 */
function isDogRelated(article) {
  const content = `${article.title}`.toLowerCase();
  return DOG_KEYWORDS.some(keyword => content.includes(keyword));
}

/**
 * Removes duplicate articles by URL first, then by normalized title.
 */
function removeDuplicates(articles) {
  const seenUrls = new Set();
  const seenTitles = new Set();
  const unique = [];
  
  for (const article of articles) {
    if (seenUrls.has(article.url)) continue;
    
    const normalizedTitle = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .trim();
      
    if (seenTitles.has(normalizedTitle)) continue;
    
    seenUrls.add(article.url);
    seenTitles.add(normalizedTitle);
    unique.push(article);
  }
  
  return unique;
}

/**
 * Fetches fresh dog health news articles from RSS and/or HTML fallbacks.
 */
async function fetchFreshData() {
  let allArticles = [];
  let rssFailedCount = 0;
  
  // 1. Fetch AKC Health RSS Feed
  try {
    const xml = await fetchUrl('https://www.akc.org/expert-advice/feed/?category=health');
    const parsed = parseRss(xml, 'AKC Health');
    allArticles = allArticles.concat(parsed);
  } catch (err) {
    console.error('Error fetching AKC Health RSS:', err.message);
    rssFailedCount++;
  }
  
  // 2. Fetch AKC Nutrition RSS Feed
  try {
    const xml = await fetchUrl('https://www.akc.org/expert-advice/feed/?category=nutrition');
    const parsed = parseRss(xml, 'AKC Nutrition');
    allArticles = allArticles.concat(parsed);
  } catch (err) {
    console.error('Error fetching AKC Nutrition RSS:', err.message);
    rssFailedCount++;
  }
  
  // 3. Fallback: If both RSS feeds failed, attempt HTML scraping
  if (rssFailedCount === 2) {
    console.log('All RSS feeds failed. Falling back to HTML scraping of AKC health category...');
    try {
      const html = await fetchUrl('https://www.akc.org/expert-advice/health/');
      const scraped = scrapeHtmlFallback(html, 'AKC Web Scraper');
      allArticles = allArticles.concat(scraped);
    } catch (err) {
      console.error('Error scraping HTML fallback:', err.message);
    }
  }
  
  // 4. Fill in missing thumbnails
  allArticles = allArticles.map((article, idx) => {
    if (!article.thumbnail) {
      return {
        ...article,
        thumbnail: FALLBACK_THUMBNAILS[idx % FALLBACK_THUMBNAILS.length]
      };
    }
    return article;
  });
  
  // 5. Filter for dog-related content (AKC is dog-only, but keyword filter is required)
  const filtered = allArticles.filter(isDogRelated);
  
  // 6. Deduplicate
  const unique = removeDuplicates(filtered);
  
  // 7. Sort by publishedAt descending
  unique.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  
  // 8. Return top 3 articles
  return unique.slice(0, 3);
}

/**
 * Returns top 3 dog health news articles, caching results for 10 minutes.
 */
async function getLatestDogNews() {
  const now = Date.now();
  if (newsCache.data && (now - newsCache.timestamp < CACHE_DURATION)) {
    console.log('Serving dog news from cache');
    return newsCache.data;
  }
  
  console.log('Cache expired or empty. Fetching fresh dog news...');
  const data = await fetchFreshData();
  
  // Only update cache if we actually retrieved some items (avoids caching empty errors if offline/down)
  if (data && data.length > 0) {
    newsCache = {
      data,
      timestamp: now
    };
  } else if (newsCache.data) {
    // If fetching failed completely but we have stale cache, serve stale cache instead of empty array
    console.log('Fetch returned empty, serving stale cache');
    return newsCache.data;
  }
  
  return data;
}

module.exports = {
  getLatestDogNews
};
