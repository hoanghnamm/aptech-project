import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

const SERVICES = [
  { to: "/encyclopedia", icon: "menu_book", title: "The Breed Repository", desc: "An archival collection of canine specimens, cataloged for scholarly review." },
  { to: "/identify", icon: "view_in_ar", title: "Digitize Specimen", desc: "Upload a photograph to engage the AI identification matrix." },
  { to: "/recommend", icon: "favorite", title: "Companion Matching", desc: "Match your lifestyle to the most compatible breeds." },
  { to: "/search", icon: "search", title: "Semantic Search", desc: "Describe what you want in plain language; the archive interprets it." },
  { to: "/chat", icon: "forum", title: "Veterinary Assistant", desc: "Consult the AI veterinary scholar about care and symptoms." },
  { to: "/nutrition", icon: "nutrition", title: "Nutritional Analysis", desc: "Calculate optimal portions from breed biology and lifestyle." },
  { to: "/gallery", icon: "photo_library", title: "Visual Archive", desc: "Upload photos; the AI tags each by detected breed." },
  { to: "/vets", icon: "local_hospital", title: "Clinical Directory", desc: "Locate veterinary clinics near you, ranked by distance." },
  { to: "/insights", icon: "auto_awesome", title: "Curated For You", desc: "Personalized suggestions based on what you've explored." },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Hero */}
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-6 mb-16">
        <span className="font-label-md text-tertiary uppercase tracking-[0.3em] text-[11px]">
          A Scholarly Digital Arboretum
        </span>
        <h1 className="font-headline-xl text-primary leading-none text-[clamp(40px,8vw,72px)]">
          The Canis Archive
        </h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed text-[18px]">
          A curated intelligence suite for the study and stewardship of canine
          companions — combining biological records with applied AI for
          identification, nutrition, care, and discovery.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mt-2">
          <button
            onClick={() => navigate("/encyclopedia")}
            className="bg-primary text-white font-label-md uppercase tracking-[0.15em] px-8 py-3.5 rounded-sm hover:bg-[#0f2e0d] transition-colors border-none cursor-pointer"
          >
            Browse the Archive
          </button>
          <button
            onClick={() => navigate("/identify")}
            className="bg-transparent text-primary font-label-md uppercase tracking-[0.15em] px-8 py-3.5 rounded-sm border border-primary/30 hover:border-primary transition-colors cursor-pointer"
          >
            Identify a Specimen
          </button>
        </div>
      </section>

      {/* Services grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((s) => (
          <article
            key={s.to}
            onClick={() => navigate(s.to)}
            className="group cursor-pointer border border-secondary/20 p-8 flex flex-col gap-4 bg-surface hover:bg-surface-container transition-colors rounded-sm"
          >
            <span className="material-symbols-outlined text-[36px] text-primary">
              {s.icon}
            </span>
            <h2 className="font-headline-lg text-[24px] text-primary group-hover:text-surface-tint transition-colors">
              {s.title}
            </h2>
            <p className="font-body-sm text-on-surface-variant italic leading-relaxed">
              {s.desc}
            </p>
            <div className="mt-auto pt-4 border-t border-secondary/20 flex justify-between items-center">
              <span className="font-label-md text-secondary uppercase tracking-widest text-[11px]">
                Enter
              </span>
              <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">
                arrow_forward
              </span>
            </div>
          </article>
        ))}
      </section>
    </Layout>
  );
}
