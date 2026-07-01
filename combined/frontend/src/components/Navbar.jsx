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
    "font-label-md uppercase tracking-widest text-[11px] pb-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap";
  const cls = ({ isActive }) =>
    `${linkBase} ${
      isActive
        ? "text-primary border-primary font-bold"
        : "text-on-surface-variant border-transparent hover:text-primary"
    }`;

  return (
    <header className="bg-surface border-b border-secondary/20 sticky top-0 z-50">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-[1280px] mx-auto w-full">
        <div
          className="font-headline-lg text-primary tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate("/")}
        >
          Canis Archive
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex gap-6 items-center">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={cls}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-primary bg-transparent border-0 cursor-pointer flex items-center"
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
        <nav className="lg:hidden border-t border-secondary/20 bg-surface-container-low px-margin-mobile py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cls}
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
