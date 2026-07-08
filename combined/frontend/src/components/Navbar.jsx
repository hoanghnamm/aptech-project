import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const LINKS = [
  { to: "/encyclopedia", label: "Encyclopedia" },
  { to: "/identify", label: "Identify" },
  { to: "/recommend", label: "Recommend" },
  { to: "/search", label: "Search" },
  { to: "/chat", label: "Assistant" },
  { to: "/nutrition", label: "Nutrition" },
  { to: "/gallery", label: "Gallery" },
  { to: "/vets", label: "Vet Care" },
  { to: "/insights", label: "For You" },
];

export function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const linkBase =
    "font-label-md uppercase tracking-widest text-[11px] pb-1 border-b-2 transition-all duration-300 ease-out cursor-pointer whitespace-nowrap hover:scale-108 transform active:scale-95 origin-center";
  
  const cls = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "text-surface border-surface font-bold"
        : "text-white/70 border-transparent hover:text-white"
    }`;

  return (
    <header className="bg-primary border-b border-white/10 sticky top-0 z-50 text-white shadow-md">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-[1280px] mx-auto w-full">
        {/* Logo with smooth hover scaling */}
        <div
          className="font-headline-lg text-surface tracking-tight cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 ease-out origin-left"
          onClick={() => navigate("/")}
        >
          Canis Archive
        </div>

        {/* Desktop nav with scaling links */}
        <nav className="hidden lg:flex gap-6 items-center">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white bg-transparent border-0 cursor-pointer flex items-center hover:scale-110 active:scale-90 transition-transform"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[28px]">
            {open ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden border-t border-white/10 bg-primary-container px-margin-mobile py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `${linkBase} self-start ${
                  isActive
                    ? "text-surface border-surface font-bold"
                    : "text-white/70 border-transparent hover:text-white"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Navbar;
