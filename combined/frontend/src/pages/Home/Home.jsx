import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getBreeds } from "../../api/breed.api";
import { BreedCard } from "../../components/breed/BreedCard";
import { DogNewsSection } from "../../components/news/DogNewsSection";
import { useAuth } from "../../context/AuthContext";

const FEATURES = [
  {
    icon: "photo_camera",
    tag: "AI Identify",
    title: "Identify Any Breed",
    desc: "Upload a photo and our AI instantly recognizes the breed, with confidence scores and a full archival profile.",
    cta: "Start identifying",
    path: "/identify",
  },
  {
    icon: "gallery_thumbnail",
    tag: "AI Tagging Gallery",
    title: "Your Dog's Moments",
    desc: "Build a photo collection of your companion — every image is automatically tagged by breed and theme.",
    cta: "Open gallery",
    path: "/gallery",
  },
  {
    icon: "emergency",
    tag: "Emergency Hub",
    title: "Emergency Vet Assistance",
    desc: "Find 24/7 veterinary clinics near you and get first-aid guidance while you're on the way.",
    cta: "Find a vet",
    path: "/vet",
  },
];

const FALLBACK_HERO =
  "https://images.unsplash.com/photo-1633722715463-d30628f26704?w=900&h=675&fit=crop";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredBreeds, setFeaturedBreeds] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(true);
  const [heroBreed, setHeroBreed] = useState(null);
  const [showWelcomePrompt, setShowWelcomePrompt] = useState(false);

  // Scroll reveal visibility for Feature cards
  const [cardsVisible, setCardsVisible] = useState(false);
  const cardsRef = useRef(null);

  useEffect(() => {
    // Show banner only if user is not logged in and hasn't closed it before
    const isDismissed = localStorage.getItem("pawintel_hide_welcome_prompt") === "true";
    if (!user && !isDismissed) {
      setShowWelcomePrompt(true);
    } else {
      setShowWelcomePrompt(false);
    }
  }, [user]);

  const handleDismissPrompt = () => {
    localStorage.setItem("pawintel_hide_welcome_prompt", "true");
    setShowWelcomePrompt(false);
  };

  useEffect(() => {
    const fetchFeaturedBreeds = async () => {
      try {
        const data = await getBreeds({ limit: 3 });
        setFeaturedBreeds(data.items || []);

        // Pick one random record from the whole archive for the hero image
        if (data.total > 0) {
          const page = 1 + Math.floor(Math.random() * data.total);
          const random = await getBreeds({ limit: 1, page });
          if (random.items?.[0]?.thumbnail) setHeroBreed(random.items[0]);
        }
      } catch (err) {
        console.error("Error loading featured breeds:", err);
      } finally {
        setLoadingBreeds(false);
      }
    };
    fetchFeaturedBreeds();
  }, []);

  // IntersectionObserver for Feature cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardsRef.current) {
      observer.observe(cardsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-16 selection:bg-tertiary selection:text-on-tertiary">
      {/* Welcome Sign Up / Sign In Banner */}
      {showWelcomePrompt && (
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, #154212, #0d2f0c)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "var(--radius-md)",
          padding: "2rem var(--space-4)",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          boxShadow: "0 10px 30px rgba(21, 66, 18, 0.15)",
          animation: "fadeIn 0.5s ease-out",
        }}>
          {/* Dismiss Icon */}
          <button
            onClick={handleDismissPrompt}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.25rem",
              borderRadius: "50%",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
              e.currentTarget.style.background = "none";
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", paddingRight: "2rem" }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.3rem, 1rem + 1vw, 1.8rem)",
              fontWeight: 600,
              color: "#fff",
              margin: 0,
            }}>
              Join the Canine Field Guide Today
            </h2>
            <p style={{
              fontFamily: "var(--font-ui)",
              fontSize: "var(--fs-400)",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.8)",
              margin: 0,
              maxWidth: "800px",
            }}>
              Sign up or Sign in for a better experience! Unlock cloud-synced breed research dossiers, continuous AI chatbot consultation sessions, and photo uploads tagged with your own profile.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "#fff",
                color: "#154212",
                border: "none",
                borderRadius: "9999px",
                padding: "0.625rem 1.75rem",
                fontFamily: "var(--font-ui)",
                fontSize: "var(--fs-300)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                borderRadius: "9999px",
                padding: "0.625rem 1.75rem",
                fontFamily: "var(--font-ui)",
                fontSize: "var(--fs-300)",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#fff";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      )}
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-5">
          <span className="font-label-md uppercase tracking-widest text-[11px] text-tertiary-container font-semibold">
            The Canine Field Guide
          </span>
          <h1 className="font-headline-xl text-primary text-4xl md:text-5xl leading-tight tracking-tight">
            A scholarly archive for the modern dog lover
          </h1>
          <p className="font-body-md text-on-surface-variant leading-relaxed max-w-prose">
            Explore breed records, identify dogs from photos, and keep your
            companion healthy with AI-assisted nutrition and care — all in one
            quiet, well-curated place.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <button
              onClick={() => navigate("/encyclopedia")}
              className="bg-primary text-white font-label-md uppercase tracking-widest text-[11px] px-6 py-3.5 rounded cursor-pointer border-none hover:bg-primary-container transition-colors"
            >
              Browse the Encyclopedia
            </button>
            <button
              onClick={() => navigate("/nutrition")}
              className="bg-transparent text-primary font-label-md uppercase tracking-widest text-[11px] px-6 py-3.5 rounded cursor-pointer border border-secondary/30 hover:bg-surface-container transition-colors"
            >
              AI Nutrition Plan
            </button>
          </div>
        </div>
        <div
          className={`aspect-[4/3] w-full overflow-hidden rounded-lg border border-secondary/20 bg-surface-container-high relative ${
            heroBreed ? "cursor-pointer group" : ""
          }`}
          onClick={() => heroBreed && navigate(`/breeds/${heroBreed.breedId}`)}
        >
          <img
            src={heroBreed?.thumbnail || FALLBACK_HERO}
            alt={heroBreed ? `${heroBreed.name} portrait` : "Portrait of a dog"}
            className="w-full h-full object-cover animate-[fadeIn_0.8s_ease-out]"
          />
          {heroBreed && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-surface/90 text-on-surface font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-md group-hover:bg-surface transition-colors">
              {heroBreed.name}
            </span>
          )}
        </div>
      </section>

      {/* Latest Dog Health News Section */}
      <DogNewsSection />

      {/* Feature cards with staggered slide reveal animation */}
      <section
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-hidden py-4"
      >
        {FEATURES.map((f, index) => (
          <article
            key={f.path}
            onClick={() => navigate(f.path)}
            style={{ transitionDelay: `${index * 150}ms` }}
            className={`group cursor-pointer border border-secondary/15 bg-white p-6 flex flex-col gap-4 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-1.5 hover:shadow-[0_12px_24px_rgba(21,66,18,0.06)] hover:bg-white transition-all duration-500 transform ease-out ${
              cardsVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="material-symbols-outlined text-3xl text-primary transform group-hover:scale-110 transition-transform duration-300">
              {f.icon}
            </span>
            <span className="self-start px-2.5 py-1 bg-[#e3a392]/20 text-[#1e1c10] font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm">
              {f.tag}
            </span>
            <h2 className="font-display font-semibold text-2xl text-primary group-hover:text-primary-coral-hover transition-colors leading-snug">
              {f.title}
            </h2>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              {f.desc}
            </p>
            <div className="mt-auto border-t border-secondary/15 pt-3 flex justify-between items-center">
              <span className="font-body-sm text-on-surface-variant uppercase tracking-widest text-[11px] group-hover:text-primary transition-colors">
                {f.cta}
              </span>
              <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
          </article>
        ))}
      </section>

      {/* Featured encyclopedia records */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-secondary/20 pb-4">
          <div className="flex flex-col gap-1">
            <span className="font-label-md uppercase tracking-widest text-[11px] text-tertiary-container font-semibold">
              From the Archive
            </span>
            <h2 className="font-headline-lg text-3xl text-primary">
              Featured Breed Records
            </h2>
          </div>
          <button
            onClick={() => navigate("/encyclopedia")}
            className="bg-transparent text-primary font-label-md uppercase tracking-widest text-[11px] cursor-pointer border-none p-0 pb-1 border-b-2 border-primary hover:opacity-70 transition-opacity inline-flex items-center gap-1"
          >
            View all records
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </button>
        </div>

        {loadingBreeds ? (
          <div className="w-full py-16 flex justify-center items-center">
            <div className="w-8 h-8 border-2 border-secondary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : featuredBreeds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBreeds.map((breed) => (
              <BreedCard
                key={breed.breedId}
                breed={breed}
                onClick={() => navigate(`/breeds/${breed.breedId}`)}
              />
            ))}
          </div>
        ) : (
          <p className="font-body-md text-on-surface-variant italic text-center py-8">
            No breed records available yet.
          </p>
        )}
      </section>
    </main>
  );
}
