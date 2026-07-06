import React, { useEffect, useRef, useState } from "react";

export function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert("Thank you for subscribing to Canis Archive newsletter!");
  };

  return (
    <footer
      ref={footerRef}
      className={`w-full bg-[#0d2f0c] text-white border-t border-white/10 mt-20 md:mt-28 transition-all duration-1000 ease-out transform ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-98"
      }`}
    >
      {/* 1. Newsletter subscription section - Compact Py */}
      <div className="border-b border-white/10 py-5 bg-[#0a2509]">
        <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-0.5 text-center md:text-left">
            <h3 className="font-display text-lg font-semibold text-surface">
              Subscribe to Canis Archive's Newsletter
            </h3>
            <p className="text-white/50 text-[11px]">
              Get the latest dog health, nutrition updates, and expert breed advice.
            </p>
          </div>
          
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-sm">
            <input
              type="email"
              required
              placeholder="Email Address"
              className="bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs px-3.5 py-2 rounded-l-lg focus:outline-none focus:bg-white/15 focus:border-white/40 flex-grow md:w-56 transition-colors"
            />
            <button
              type="submit"
              className="bg-surface text-primary font-bold text-xs px-5 py-2 rounded-r-lg hover:bg-white hover:scale-102 active:scale-98 transition-all cursor-pointer border-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Footer links and brand - Compact Py */}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Logo and Brand description */}
          <div className="flex flex-col gap-2">
            <div className="font-headline-lg text-2xl text-surface tracking-tight">
              Canis Archive
            </div>
            <p className="text-white/50 text-[11px] max-w-sm leading-relaxed">
              A premium, scholarly field guide for the modern dog lover. Powered by AI
              breed recognition, nutrition recommendations, and veterinary assistance.
            </p>
          </div>

          {/* Social media icons */}
          <div className="flex gap-3">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all text-white"
              aria-label="Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all text-white"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            {/* Pinterest */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-white/10 flex justify-center items-center hover:bg-white/20 hover:scale-110 active:scale-95 transition-all text-white"
              aria-label="Pinterest"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>

        {/* 3. Link Grid - Compact Py */}
        <div className="flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-4 border-t border-white/10 pt-5 text-[11px] text-white/60">
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-medium">
            <a href="/about" className="hover:text-surface transition-colors">About us</a>
            <a href="/write-for-us" className="hover:text-surface transition-colors">Write for us</a>
            <a href="/contact" className="hover:text-surface transition-colors">Contact us</a>
            <a href="/licensing" className="hover:text-surface transition-colors">Licensing</a>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-medium">
            {/* Your Privacy Choices */}
            <a href="/privacy-choices" className="hover:text-surface flex items-center transition-colors">
              <svg className="w-5 h-3 inline mr-1" viewBox="0 0 30 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="14" rx="7" fill="#007A87" />
                <circle cx="23" cy="7" r="5" fill="white" />
                <path d="M8 7H14" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M11 4.5V9.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Your Privacy Choices
            </a>
            <a href="/privacy" className="hover:text-surface transition-colors">Privacy policy</a>
            <a href="/legal" className="hover:text-surface transition-colors">Legal notices</a>
            <a href="/sitemap" className="hover:text-surface transition-colors">Site map</a>
          </div>
        </div>

        {/* 4. Copyright & PawPal Branding */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-white/40">
          <div>
            &copy; {new Date().getFullYear()} Canis Archive. All biological and archival records reserved.
          </div>
          
          <div className="flex items-center gap-1.5">
            <span>Powered by</span>
            <span className="font-headline-lg font-bold italic tracking-wide text-white/60 text-xs">PawPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
