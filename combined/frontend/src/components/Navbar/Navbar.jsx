import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  // Check active navigation states
  const isEncyclopedia = pathname === "/" || pathname.startsWith("/breeds/");
  const isIdentify = pathname === "/identify";
  const isServiceTab = ["/chatbot", "/nutrition", "/recommendation", "/gallery", "/insights", "/vet"].includes(pathname);

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setServicesOpen(false);
  };

  const serviceItems = [
    { path: "/chatbot", label: "💬 AI Health Assistant" },
    { path: "/nutrition", label: "🦴 AI Nutrition Plan" },
    { path: "/recommendation", label: "🧭 AI Breed Match" },
    { path: "/gallery", label: "🖼️ AI Photo Gallery" },
    { path: "/insights", label: "✨ Personal Insights" },
    { path: "/vet", label: "🚑 Emergency Vets" },
  ];

  return (
    <header className="bg-surface border-b border-secondary/10 sticky top-0 z-50">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 max-w-[1280px] mx-auto w-full">
        {/* Brand Logo */}
        <div
          className="font-headline-lg text-primary tracking-tighter cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleNavigate("/")}
        >
          Canis Archive
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10 items-center font-label-md uppercase tracking-widest text-[11px] relative">
          <span
            onClick={() => handleNavigate("/")}
            className={`cursor-pointer pb-1 border-b-2 transition-all duration-300 ${
              isEncyclopedia
                ? "text-primary font-bold border-primary"
                : "text-on-surface-variant border-transparent hover:text-primary"
            }`}
          >
            Encyclopedia
          </span>
          <span
            onClick={() => handleNavigate("/identify")}
            className={`cursor-pointer pb-1 border-b-2 transition-all duration-300 ${
              isIdentify
                ? "text-primary font-bold border-primary"
                : "text-on-surface-variant border-transparent hover:text-primary"
            }`}
          >
            Identify
          </span>

          {/* AI Services Dropdown */}
          <div className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              onBlur={() => setTimeout(() => setServicesOpen(false), 200)}
              className={`flex items-center gap-1 cursor-pointer pb-1 border-b-2 bg-transparent font-label-md uppercase tracking-widest text-[11px] transition-all duration-300 ${
                isServiceTab
                  ? "text-primary font-bold border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              }`}
            >
              AI Services
              <span className="material-symbols-outlined text-[14px]">
                {servicesOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {servicesOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-surface border border-secondary/10 rounded shadow-xl flex flex-col p-2 z-[999] text-left">
                {serviceItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full text-left font-body-sm px-4 py-3 rounded hover:bg-surface-container transition-colors cursor-pointer border-none bg-transparent ${
                      pathname === item.path ? "text-primary font-semibold" : "text-on-surface"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:text-primary bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-secondary/10 px-margin-mobile py-4 flex flex-col gap-4 text-left">
          <span
            onClick={() => handleNavigate("/")}
            className={`font-label-md uppercase tracking-widest text-[12px] cursor-pointer py-2 border-b border-secondary/5 ${
              isEncyclopedia ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            Encyclopedia
          </span>
          <span
            onClick={() => handleNavigate("/identify")}
            className={`font-label-md uppercase tracking-widest text-[12px] cursor-pointer py-2 border-b border-secondary/5 ${
              isIdentify ? "text-primary font-bold" : "text-on-surface-variant"
            }`}
          >
            Identify
          </span>

          <div className="flex flex-col gap-2 pl-3 border-l border-secondary/10">
            <div className="font-label-md text-secondary/60 text-[10px] uppercase tracking-widest mb-1">
              AI Services
            </div>
            {serviceItems.map((item) => (
              <span
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`font-body-sm text-[13px] cursor-pointer py-1.5 ${
                  pathname === item.path ? "text-primary font-semibold" : "text-on-surface-variant"
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
