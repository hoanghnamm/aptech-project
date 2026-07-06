import React, { useState, useEffect } from "react";
import { getLatestDogNews } from "../../api/news.api";
import { DogNewsCard } from "./DogNewsCard";

export function DogNewsSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getLatestDogNews();
        setArticles(data || []);
      } catch (err) {
        console.error("Error fetching dog news:", err);
        setError("Could not load latest news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <section className="flex flex-col gap-6 py-4">
      <div className="flex flex-col gap-1 border-b border-secondary/20 pb-4">
        <span className="font-label-md uppercase tracking-widest text-[11px] text-tertiary-container font-semibold">
          Expert Insights & News
        </span>
        <h2 className="font-headline-lg text-3xl text-primary font-display">
          Latest Dog Health News
        </h2>
      </div>

      {loading ? (
        <div className="w-full py-16 flex justify-center items-center">
          <div className="w-8 h-8 border-2 border-secondary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-6 bg-surface-container/30 border border-secondary/10 text-center rounded-lg">
          <p className="font-body-md text-on-surface-variant italic">{error}</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <DogNewsCard key={article.url || idx} article={article} />
          ))}
        </div>
      ) : (
        <p className="font-body-md text-on-surface-variant italic text-center py-8">
          No news articles available at the moment.
        </p>
      )}
    </section>
  );
}
