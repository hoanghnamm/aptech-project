import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar/Navbar";
import { Footer } from "./components/Footer";

// Shared shell so every page has consistent nav, footer, and theme background.
export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface font-body-md">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
