import React from "react";

/* Shared Tailwind class strings for editorial form controls */
export const inputClass =
  "w-full bg-surface-container-low border border-secondary/30 focus:border-primary focus:ring-0 px-4 py-3 font-body-md text-on-surface placeholder:text-on-surface-variant/60 outline-none transition-colors rounded-sm shadow-none";

export const selectClass = inputClass + " cursor-pointer appearance-none";

export function PageHeading({ title, subtitle, align = "center" }) {
  return (
    <div
      className={`max-w-2xl flex flex-col gap-4 mb-12 ${
        align === "center" ? "text-center mx-auto" : "text-left"
      }`}
    >
      <h1 className="font-headline-xl text-primary leading-tight">{title}</h1>
      {subtitle && (
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-surface-container-lowest border border-secondary/20 rounded-sm p-8 shadow-none ${className}`}
    >
      {children}
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-label-md text-secondary uppercase tracking-widest text-[11px]">
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`bg-primary text-white font-label-md uppercase tracking-[0.15em] px-8 py-3.5 rounded-sm hover:bg-[#b65a3d] transition-colors duration-300 border-none cursor-pointer shadow-none disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", active = false, ...props }) {
  return (
    <button
      {...props}
      className={`font-label-md uppercase tracking-[0.15em] text-[11px] px-5 py-2.5 rounded-sm border transition-colors cursor-pointer shadow-none ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-transparent text-secondary border-secondary/30 hover:border-primary hover:text-primary"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function Spinner({ label }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-2 border-secondary/20 border-t-primary rounded-full animate-spin"></div>
      {label && (
        <p className="font-body-md text-on-surface-variant italic">{label}</p>
      )}
    </div>
  );
}

export function ErrorNote({ children }) {
  return (
    <div className="w-full bg-error-container/40 border-l-2 border-error rounded-sm p-5 flex items-center gap-3">
      <span className="material-symbols-outlined text-error">error</span>
      <p className="font-body-md text-on-surface">{children}</p>
    </div>
  );
}

export function Chip({ children, className = "" }) {
  return (
    <span
      className={`bg-surface-container-high text-secondary font-label-md px-3 py-1 border border-secondary/10 uppercase tracking-widest text-[10px] rounded-sm ${className}`}
    >
      {children}
    </span>
  );
}
