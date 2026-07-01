import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { trackPageView } from "@/services/api";

/**
 * Standard page shell: sticky Navbar, content area, Footer.
 * `wide` switches the inner container to the full 1280px editorial width.
 */
export function Layout({ children, wide = true }) {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-tertiary selection:text-on-tertiary">
      <Navbar />
      <main
        className={`flex-grow w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 ${
          wide ? "max-w-[1280px]" : "max-w-3xl"
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
