import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, PawPrint } from "lucide-react";

const NAV_ITEMS = [
  { path: "/identify", label: "Identify" },
  { path: "/chatbot", label: "Ask PawPal" },
  { path: "/recommendation", label: "Find My Dog" },
  { path: "/search", label: "Search" },
  { path: "/nutrition", label: "Nutrition" },
];

export function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path) => pathname === path || pathname.startsWith(path + "/");

  return (
    <header className="bg-surface/90 backdrop-blur border-b border-primary/10 sticky top-0 z-50">
      <div className="flex justify-between items-center gap-4 px-margin-mobile md:px-margin-desktop py-4 max-w-[1280px] mx-auto w-full">
        {/* Brand */}
        <button
          onClick={() => go("/")}
          className="flex items-center gap-2.5 bg-transparent border-none cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
            <PawPrint size={20} className="text-on-tertiary" />
          </span>
          <span className="font-headline-lg text-[1.5rem] font-bold text-on-surface tracking-tight">
            PawPal
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 font-body-md text-[0.95rem]">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className={`px-3.5 py-2 rounded-full cursor-pointer border-none bg-transparent transition-colors ${
                isActive(item.path)
                  ? "text-primary font-semibold bg-primary-container"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:text-primary bg-transparent border-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-surface border-t border-primary/10 px-margin-mobile py-3 flex flex-col">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => go(item.path)}
              className={`text-left px-3 py-3 rounded-lg cursor-pointer border-none bg-transparent font-body-md ${
                isActive(item.path)
                  ? "text-primary font-semibold bg-primary-container"
                  : "text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
