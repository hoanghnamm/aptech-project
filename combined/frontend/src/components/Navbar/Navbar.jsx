import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check active navigation states
  const isEncyclopedia = pathname === "/encyclopedia" || pathname.startsWith("/breeds/");
  const isIdentify = pathname === "/identify";

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const serviceItems = [
    { path: "/chatbot", label: "AI Health Assistant" },
    { path: "/nutrition", label: "AI Nutrition Plan" },
    { path: "/gallery", label: "AI Photo Gallery" },
    { path: "/insights", label: "Personal Insights" },
    { path: "/vet", label: "Emergency Vets" },
  ];

  const linkBase =
    "cursor-pointer pb-1 border-b-2 transition-all duration-300 ease-out hover:scale-108 transform active:scale-95 origin-center";

  return (
    <header className="bg-primary border-b border-white/10 sticky top-0 z-50 text-white shadow-md">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 max-w-[1280px] mx-auto w-full">
        {/* Brand Logo with smooth hover scaling */}
        <div
          className="font-headline-lg text-surface tracking-tighter cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-out origin-left"
          onClick={() => handleNavigate("/")}
        >
          Canis Archive
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-4 xl:gap-6 items-center font-label-md uppercase tracking-widest text-[11px] relative whitespace-nowrap">
          <span
            onClick={() => handleNavigate("/encyclopedia")}
            className={`${linkBase} ${
              isEncyclopedia
                ? "text-surface border-surface font-bold"
                : "text-white/70 border-transparent hover:text-white"
            }`}
          >
            Encyclopedia
          </span>
          <span
            onClick={() => handleNavigate("/identify")}
            className={`${linkBase} ${
              isIdentify
                ? "text-surface border-surface font-bold"
                : "text-white/70 border-transparent hover:text-white"
            }`}
          >
            Identify
          </span>

          {/* AI Services */}
          {serviceItems.map((item) => (
            <span
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`${linkBase} ${
                pathname === item.path
                  ? "text-surface border-surface font-bold"
                  : "text-white/70 border-transparent hover:text-white"
              }`}
            >
              {item.label}
            </span>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 text-white/80 hover:text-white bg-transparent border-none cursor-pointer hover:scale-110 active:scale-90 transition-transform"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-container border-b border-white/10 px-margin-mobile py-4 flex flex-col gap-4 text-left">
          <span
            onClick={() => handleNavigate("/encyclopedia")}
            className={`font-label-md uppercase tracking-widest text-[12px] cursor-pointer py-2 border-b border-white/10 transition-colors ${
              isEncyclopedia ? "text-surface font-bold" : "text-white/70 hover:text-white"
            }`}
          >
            Encyclopedia
          </span>
          <span
            onClick={() => handleNavigate("/identify")}
            className={`font-label-md uppercase tracking-widest text-[12px] cursor-pointer py-2 border-b border-white/10 transition-colors ${
              isIdentify ? "text-surface font-bold" : "text-white/70 hover:text-white"
            }`}
          >
            Identify
          </span>

          <div className="flex flex-col gap-2 pl-3 border-l border-white/10">
            <div className="font-label-md text-white/50 text-[10px] uppercase tracking-widest mb-1">
              AI Services
            </div>
            {serviceItems.map((item) => (
              <span
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`font-body-sm text-[13px] cursor-pointer py-1.5 transition-colors ${
                  pathname === item.path ? "text-surface font-semibold" : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
