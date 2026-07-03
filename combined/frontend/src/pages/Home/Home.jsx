import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBreeds } from "../../api/breed.api";
import { BreedCard } from "../../components/breed/BreedCard";

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
  const [featuredBreeds, setFeaturedBreeds] = useState([]);
  const [loadingBreeds, setLoadingBreeds] = useState(true);
  const [heroBreed, setHeroBreed] = useState(null);

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

  return (
    <main className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-16 selection:bg-tertiary selection:text-on-tertiary">
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
            className="w-full h-full object-cover"
          />
          {heroBreed && (
            <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-surface/90 text-on-surface font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-md group-hover:bg-surface transition-colors">
              {heroBreed.name}
            </span>
          )}
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {FEATURES.map((f) => (
          <article
            key={f.path}
            onClick={() => navigate(f.path)}
            className="group cursor-pointer border border-secondary/20 bg-surface hover:bg-surface-container transition-colors p-6 flex flex-col gap-4"
          >
            <span className="material-symbols-outlined text-3xl text-primary">
              {f.icon}
            </span>
            <span className="self-start px-2.5 py-1 bg-[#e3a392]/25 text-on-surface font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm">
              {f.tag}
            </span>
            <h2 className="font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">
              {f.title}
            </h2>
            <p className="font-body-sm text-on-surface-variant leading-relaxed">
              {f.desc}
            </p>
            <div className="mt-auto border-t border-secondary/20 pt-3 flex justify-between items-center">
              <span className="font-body-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
                {f.cta}
              </span>
              <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary transition-colors">
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
