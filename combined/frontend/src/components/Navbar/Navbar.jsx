import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Dropdown states
  const [personalOpen, setPersonalOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const personalRef = useRef(null);
  const accountRef = useRef(null);
  const personalTimerRef = useRef(null);
  const accountTimerRef = useRef(null);

  // Check active navigation states
  const isEncyclopedia = pathname === "/encyclopedia" || pathname.startsWith("/breeds/");
  const isIdentify = pathname === "/identify";

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setPersonalOpen(false);
    setAccountOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (personalRef.current && !personalRef.current.contains(e.target)) setPersonalOpen(false);
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Main nav items (standalone)
  const mainItems = [
    { path: "/chatbot", label: "AI Health Assistant" },
    { path: "/nutrition", label: "AI Nutrition Plan" },
  ];

  // Personal dropdown items
  const personalItems = [
    { path: "/insights", label: "Personal Insights", icon: "analytics" },
    { path: "/gallery", label: "AI Photo Gallery", icon: "photo_library" },
    { path: "/vet", label: "Emergency Vets", icon: "local_hospital" },
  ];

  const isPersonalActive = personalItems.some((i) => pathname === i.path);

  const linkBase =
    "cursor-pointer pb-1 border-b-2 transition-all duration-300 ease-out hover:scale-108 transform active:scale-95 origin-center";

  // User initial for avatar
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <header className="bg-primary border-b border-white/10 sticky top-0 z-50 text-white shadow-md">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 max-w-[1280px] mx-auto w-full">
        {/* Brand Logo */}
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

          {/* Standalone AI services */}
          {mainItems.map((item) => (
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

          {/* Personal Dropdown */}
          <div
            ref={personalRef}
            className="relative"
            onMouseEnter={() => {
              clearTimeout(personalTimerRef.current);
              setPersonalOpen(true);
            }}
            onMouseLeave={() => {
              personalTimerRef.current = setTimeout(() => setPersonalOpen(false), 200);
            }}
          >
            <span
              className={`${linkBase} flex items-center gap-1 ${
                isPersonalActive
                  ? "text-surface border-surface font-bold"
                  : "text-white/70 border-transparent hover:text-white"
              }`}
            >
              Personal
              <span
                className="material-symbols-outlined transition-transform duration-200"
                style={{
                  fontSize: "16px",
                  transform: personalOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                expand_more
              </span>
            </span>

            {/* Dropdown Menu */}
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                left: "50%",
                transform: "translateX(-50%)",
                minWidth: "13rem",
                background: "#fff",
                borderRadius: "0.5rem",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid rgba(30, 28, 16, 0.1)",
                padding: "0.375rem",
                opacity: personalOpen ? 1 : 0,
                visibility: personalOpen ? "visible" : "hidden",
                transition: "opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease",
                transformOrigin: "top center",
                zIndex: 100,
              }}
            >
              {personalItems.map((item) => (
                <div
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                    background: pathname === item.path ? "#f3f4ed" : "transparent",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4ed")}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      pathname === item.path ? "#f3f4ed" : "transparent")
                  }
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "18px",
                      color: pathname === item.path ? "#154212" : "#625e50",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "13px",
                      fontWeight: pathname === item.path ? 600 : 500,
                      color: pathname === item.path ? "#154212" : "#1e1c10",
                      textTransform: "none",
                      letterSpacing: "0",
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Circle */}
          <div ref={accountRef} className="relative ml-2">
            {user ? (
              /* Logged-in: avatar with initial */
              <div
                onClick={() => setAccountOpen(!accountOpen)}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d5a27, #154212)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid rgba(255,255,255,0.3)",
                  transition: "all 0.2s ease",
                  boxShadow: accountOpen ? "0 0 0 3px rgba(255,255,255,0.2)" : "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)")}
              >
                <span
                  style={{
                    fontFamily: "'Hanken Grotesk', sans-serif",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {userInitial}
                </span>
              </div>
            ) : (
              /* Not logged in: account_circle icon */
              <span
                className="material-symbols-outlined cursor-pointer text-white/70 hover:text-white transition-colors"
                style={{ fontSize: "28px" }}
                onClick={() => handleNavigate("/login")}
              >
                account_circle
              </span>
            )}

            {/* Account Dropdown (logged-in only) */}
            {user && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 0.5rem)",
                  right: 0,
                  minWidth: "14rem",
                  background: "#fff",
                  borderRadius: "0.5rem",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(30, 28, 16, 0.1)",
                  padding: "0.375rem",
                  opacity: accountOpen ? 1 : 0,
                  visibility: accountOpen ? "visible" : "hidden",
                  transition: "opacity 0.2s ease, visibility 0.2s ease",
                  zIndex: 100,
                }}
              >
                {/* User info */}
                <div
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid rgba(30, 28, 16, 0.08)",
                    marginBottom: "0.25rem",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e1c10",
                      textTransform: "none",
                      letterSpacing: "0",
                    }}
                  >
                    {user.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "12px",
                      color: "#625e50",
                      textTransform: "none",
                      letterSpacing: "0",
                    }}
                  >
                    {user.email}
                  </div>
                </div>

                {/* Logout button */}
                <div
                  onClick={() => {
                    logout();
                    setAccountOpen(false);
                    handleNavigate("/");
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.625rem 0.75rem",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#ffdad6")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "18px", color: "#ba1a1a" }}
                  >
                    logout
                  </span>
                  <span
                    style={{
                      fontFamily: "'Hanken Grotesk', sans-serif",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#ba1a1a",
                      textTransform: "none",
                      letterSpacing: "0",
                    }}
                  >
                    Sign Out
                  </span>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Mobile Account Circle */}
          {user ? (
            <div
              onClick={() => setAccountOpen(!accountOpen)}
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2d5a27, #154212)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                {userInitial}
              </span>
            </div>
          ) : (
            <span
              className="material-symbols-outlined cursor-pointer text-white/70 hover:text-white transition-colors"
              style={{ fontSize: "28px" }}
              onClick={() => handleNavigate("/login")}
            >
              account_circle
            </span>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center p-2 text-white/80 hover:text-white bg-transparent border-none cursor-pointer hover:scale-110 active:scale-90 transition-transform"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Account Dropdown */}
      {user && accountOpen && (
        <div className="md:hidden bg-white border-b border-white/10 px-margin-mobile py-3">
          <div style={{ padding: "0.5rem 0", borderBottom: "1px solid rgba(30,28,16,0.08)", marginBottom: "0.5rem" }}>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1e1c10" }}>{user.name}</div>
            <div style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "12px", color: "#625e50" }}>{user.email}</div>
          </div>
          <div
            onClick={() => { logout(); setAccountOpen(false); handleNavigate("/"); }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0", cursor: "pointer" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#ba1a1a" }}>logout</span>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: "13px", fontWeight: 500, color: "#ba1a1a" }}>Sign Out</span>
          </div>
        </div>
      )}

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

          {/* AI Services */}
          <div className="flex flex-col gap-2 pl-3 border-l border-white/10">
            <div className="font-label-md text-white/50 text-[10px] uppercase tracking-widest mb-1">
              AI Services
            </div>
            {mainItems.map((item) => (
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

          {/* Personal */}
          <div className="flex flex-col gap-2 pl-3 border-l border-white/10">
            <div className="font-label-md text-white/50 text-[10px] uppercase tracking-widest mb-1">
              Personal
            </div>
            {personalItems.map((item) => (
              <span
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`font-body-sm text-[13px] cursor-pointer py-1.5 transition-colors flex items-center gap-2 ${
                  pathname === item.path ? "text-surface font-semibold" : "text-white/70 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{item.icon}</span>
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
