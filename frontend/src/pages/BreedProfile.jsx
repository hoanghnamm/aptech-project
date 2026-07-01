import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Footer } from "@/components/footer";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/v1";

const metricDefinitions = {
  trainability: {
    label: "Trainability",
    desc: "Capacity to absorb and execute curatorial instructions.",
    scale: "1: Stubborn instinct — 5: Highly compliant",
  },
  energyLevel: {
    label: "Energy Level",
    desc: "Daily kinetic output and physical stamina requirements.",
    scale: "1: Sedentary nature — 5: Relentless endurance",
  },
  apartmentFriendly: {
    label: "Apartment Friendly",
    desc: "Suitability for confined living spaces and restricted boundaries.",
    scale: "1: Requires acreage — 5: Thrives in compact quarters",
  },
  kidFriendly: {
    label: "Kid Friendly",
    desc: "Patience and gentleness when interacting with human children.",
    scale: "1: Easily overwhelmed — 5: Highly nurturing",
  },
  aloneTolerance: {
    label: "Alone Tolerance",
    desc: "Psychological resilience when left in complete solitude.",
    scale: "1: Severe separation anxiety — 5: Highly independent",
  },
  petFriendly: {
    label: "Pet Friendly",
    desc: "Sociability and pack-tolerance towards other biological specimens.",
    scale: "1: Highly territorial — 5: Universally amicable",
  },
};

const lifestyleDefinitions = {
  size: {
    label: "Morphological Size",
    desc: "General body mass and structural scale at full maturity.",
  },
  sheddingLevel: {
    label: "Shedding Level",
    desc: "Frequency and volume of fur renewal and follicle shedding.",
  },
  spaceRequirement: {
    label: "Space Requirement",
    desc: "Minimum spatial volume needed for psychological well-being.",
  },
  barkingLevel: {
    label: "Vocalization",
    desc: "Tendency for audible communication and territorial barking.",
  },
  weatherTolerance: {
    label: "Climate Adaptability",
    desc: "Biological resilience against extreme temperature fluctuations.",
  },
  vulnerabilityToDisease: {
    label: "Pathological Vulnerability",
    desc: "Overall genetic resistance to common canine ailments.",
  },
};

export function BreedProfile() {
  const { breedId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFromIdentify = location.state?.from === "identify";

  useEffect(() => {
    const fetchBreed = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/encyclopedia/breeds/${breedId}`,
        );
        setBreed(response.data.data);
      } catch (err) {
        console.error("Archive Retrieval Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBreed();
  }, [breedId]);

  if (loading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-surface font-body-md text-secondary italic">
        Consulting biological archives...
      </div>
    );
  if (!breed)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-surface font-headline-lg text-error">
        Record Not Found
      </div>
    );

  const calculateProgress = (val) => `${((val || 0) / 5) * 100}%`;

  // Tách mảng hình ảnh để đan xen và lấy Caption tương ứng
  const visualAssets = breed.visualArchives || [];
  const heroImage = visualAssets[0]?.url || breed.thumbnail;
  const vintageImg1 = visualAssets[1];
  const vintageImg2 = visualAssets[2];
  const vintageImg3 = visualAssets[3];
  const remainingImages = visualAssets.slice(4);

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased">
      <header className="bg-surface border-b border-secondary/10 sticky top-0 z-50">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-5 max-w-[1280px] mx-auto w-full">
          <div
            className="font-headline-lg text-primary tracking-tighter cursor-pointer"
            onClick={() => navigate("/")}
          >
            Canis Archive
          </div>
          <nav className="hidden md:flex gap-10 items-center">
            <span
              onClick={() => navigate("/")}
              className="text-primary font-bold border-b-2 border-primary pb-1 cursor-pointer"
            >
              Encyclopedia
            </span>
            <span
              onClick={() => navigate("/identify")}
              className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              Identify
            </span>
          </nav>
        </div>
      </header>

      {/* 1. HERO SECTION */}
      <section className="w-full relative h-[65vh] overflow-hidden group border-b border-secondary/20 shadow-none">
        <img
          alt={breed.name}
          className="w-full h-full object-cover object-[center_30%] group-hover:scale-105 transition-transform duration-[20s] ease-out"
          src={heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-90 pointer-events-none"></div>
      </section>

      <section className="flex flex-col gap-6 items-center text-center -mt-16 relative z-10 px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto">
        <div className="inline-flex items-center px-5 py-1.5 bg-[#e3a392] text-white rounded-sm font-label-md uppercase tracking-[0.15em] text-[11px] shadow-none border border-transparent">
          {breed.origin || "Unknown Origin"}
        </div>
        <h1 className="font-headline-xl text-[72px] leading-none text-on-surface tracking-tight mt-2">
          {breed.name}
        </h1>
        <p className="max-w-4xl text-on-surface-variant font-body-md text-[20px] leading-[1.8] text-center italic opacity-90 mt-4">
          {breed.description}
        </p>

        {breed.coreTraits && (
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {breed.coreTraits.map((trait, idx) => (
              <span
                key={idx}
                className="px-5 py-2 border border-primary/20 text-primary font-label-md uppercase tracking-widest text-[10px] rounded-full bg-primary/5 shadow-none"
              >
                {trait}
              </span>
            ))}
          </div>
        )}
      </section>

      <main className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-24">
        {/* Navigation Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center self-start gap-2 font-label-md uppercase tracking-[0.2em] text-secondary/60 hover:text-primary transition-all bg-transparent border-none cursor-pointer -mb-8 shadow-none"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          {isFromIdentify ? "Return to Identification" : "Return to Archive"}
        </button>

        {/* 2. PHYSICAL STATS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Weight Range",
              val: breed.physicalStats?.weight,
              unit: "kg",
            },
            {
              label: "Height Average",
              val: breed.physicalStats?.height,
              unit: "cm",
            },
            {
              label: "Life Expectancy",
              val: breed.physicalStats?.lifespan,
              unit: "yrs",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-surface-container-low border border-secondary/10 rounded p-10 flex flex-col items-center justify-center text-center gap-3 shadow-none"
            >
              <span className="font-label-md text-secondary/60 uppercase tracking-[0.2em] text-[11px]">
                {stat.label}
              </span>
              <span className="font-headline-lg text-[40px] text-primary-container lining-nums">
                {stat.val?.split(" ")[0]}{" "}
                <span className="text-body-sm font-normal text-on-surface-variant/50">
                  {stat.unit}
                </span>
              </span>
            </div>
          ))}
        </section>

        {/* 3. ARCHIVAL ORIGINS - BỐ CỤC SO LE KÈM CAPTION */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-16 border-y border-secondary/10 py-20">
          {/* Cột Trái: Ảnh 1 và 3 */}
          <div className="md:col-span-5 flex flex-col gap-12">
            {vintageImg1 && (
              <div className="w-full p-2 bg-surface-container-lowest border border-secondary/10 rounded-lg shadow-none">
                <img
                  alt="Vintage record 1"
                  className="w-full aspect-[4/3] object-cover grayscale sepia-[.3] brightness-[.9] rounded"
                  src={vintageImg1.url}
                />
                {vintageImg1.caption && (
                  <p className="mt-4 mb-2 px-4 text-center font-label-md text-[11px] uppercase tracking-widest text-secondary/80 leading-relaxed">
                    {vintageImg1.caption}
                  </p>
                )}
              </div>
            )}

            {vintageImg3 && (
              <div className="w-full p-2 bg-surface-container-lowest border border-secondary/10 rounded-lg mt-8 shadow-none">
                <img
                  alt="Vintage record 3"
                  className="w-full aspect-square object-cover grayscale sepia-[.3] brightness-[.9] rounded"
                  src={vintageImg3.url}
                />
                {vintageImg3.caption && (
                  <p className="mt-4 mb-2 px-4 text-center font-label-md text-[11px] uppercase tracking-widest text-secondary/80 leading-relaxed">
                    {vintageImg3.caption}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cột Phải: Chữ và Ảnh 2 đan xen */}
          <div className="md:col-span-7 flex flex-col gap-10 text-left">
            <h2 className="font-headline-lg text-[40px] text-on-surface mb-2">
              Archival Origins
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed text-[18px]">
              {breed.historySnippet}
            </p>

            {breed.breedSpecificFacts?.map((fact, idx) => (
              <React.Fragment key={idx}>
                <blockquote className="italic border-l-3 border-tertiary pl-8 py-2 text-on-surface-variant font-body-md text-[20px] opacity-90 leading-relaxed">
                  "{fact}"
                </blockquote>

                {/* Chèn Ảnh thứ 2 vào ngay sau Fact số 2 (idx === 1) kèm Caption */}
                {idx === 1 && vintageImg2 && (
                  <div className="w-full my-6 p-2 bg-surface-container-lowest border border-secondary/10 rounded-lg shadow-none">
                    <img
                      alt="Vintage record 2"
                      className="w-full aspect-[16/9] object-cover grayscale sepia-[.3] brightness-[.9] rounded"
                      src={vintageImg2.url}
                    />
                    {vintageImg2.caption && (
                      <p className="mt-4 mb-2 px-4 text-center font-label-md text-[11px] uppercase tracking-widest text-secondary/80 leading-relaxed">
                        {vintageImg2.caption}
                      </p>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* 4. TAXONOMY & ANALYTICS - TYPOGRAPHY LỚN HƠN */}
        <section className="flex flex-col gap-12">
          <h2 className="font-headline-lg text-center text-[36px] text-on-surface">
            Biological & Behavioral Taxonomy
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Qualitative Sidebar */}
            <div className="bg-surface-container-low border border-secondary/10 rounded p-12 flex flex-col gap-10 shadow-none">
              <h3 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/10 pb-5 text-[14px]">
                Lifestyle Classification
              </h3>
              <div className="grid grid-cols-2 gap-x-10 gap-y-10">
                {Object.entries(breed.lifestyleFilters || {}).map(
                  ([key, value]) => {
                    const def = lifestyleDefinitions[key] || { label: key };
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-3 group relative"
                      >
                        {/* Cỡ chữ Label tăng lên 12px */}
                        <span className="font-label-md text-secondary/70 uppercase tracking-widest text-[12px] cursor-help border-b border-dashed border-secondary/30 w-fit pb-0.5">
                          {def.label}
                        </span>
                        {/* Cỡ chữ Value tăng lên 20px */}
                        <span className="font-body-md text-on-surface text-[20px] font-medium">
                          {value}
                        </span>

                        {/* Tooltip to hơn */}
                        <div className="absolute z-30 bottom-full left-0 mb-3 w-64 bg-secondary text-surface-container-lowest rounded p-4 text-[14px] leading-relaxed hidden group-hover:block transition-all shadow-xl">
                          {def.desc}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Quantitative Analytics */}
            <div className="bg-surface-container border border-secondary/10 rounded p-12 flex flex-col gap-10 shadow-none">
              <h3 className="font-label-md text-secondary uppercase tracking-[0.2em] border-b border-secondary/10 pb-5 text-[14px]">
                Analytical Metrics
              </h3>
              <div className="flex flex-col gap-8">
                {Object.entries(breed.comparisonMetrics || {}).map(
                  ([key, value]) => {
                    const def = metricDefinitions[key] || { label: key };
                    return (
                      <div
                        key={key}
                        className="flex flex-col gap-3 group relative"
                      >
                        <div className="flex justify-between items-end">
                          {/* Cỡ chữ Label tăng lên 13px */}
                          <span className="font-label-md text-on-surface uppercase tracking-widest text-[13px] cursor-help border-b border-dashed border-secondary/30 pb-0.5">
                            {def.label}
                          </span>
                          <span className="font-label-md text-primary font-bold lining-nums text-[16px]">
                            {value} / 5
                          </span>
                        </div>
                        <div className="w-full bg-secondary/10 h-2 rounded-full overflow-hidden shadow-none">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: calculateProgress(value) }}
                          ></div>
                        </div>

                        {/* Tooltip to hơn */}
                        <div className="absolute z-30 bottom-full left-0 mb-3 w-72 bg-primary text-surface-container-lowest rounded p-5 text-[15px] leading-relaxed hidden group-hover:block shadow-xl">
                          <p className="mb-2 font-medium">{def.desc}</p>
                          <p className="opacity-70 italic text-[12px]">
                            {def.scale}
                          </p>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. CARE & HEALTH */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-8">
            <h3 className="font-headline-lg text-[32px]">Care Advice</h3>
            <div className="bg-surface-container border border-secondary/10 rounded p-8 flex flex-col gap-8 shadow-none">
              {breed.careAdvice?.map((advice, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-5 pb-6 border-b border-secondary/10 last:border-0 last:pb-0"
                >
                  <span className="material-symbols-outlined text-primary mt-1">
                    menu_book
                  </span>
                  <p className="font-body-md text-on-surface-variant leading-relaxed text-[16px]">
                    {advice}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h3 className="font-headline-lg text-[32px]">Health Risks</h3>
            <div className="bg-[#E3A392]/5 border border-tertiary/20 rounded p-8 flex flex-col gap-6 shadow-none">
              <p className="font-body-md text-on-surface-variant leading-relaxed opacity-80 italic">
                Historical records indicate potential pathological
                vulnerabilities.
              </p>
              <ul className="flex flex-col gap-5">
                {breed.healthRisks?.map((health, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <span className="w-2 h-2 rounded-full bg-tertiary group-hover:scale-125 transition-transform"></span>
                    <span className="font-body-md text-on-surface text-[17px]">
                      {health}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 6. FULL VISUAL ARCHIVES GALLERY (Magazine Style) */}
        {remainingImages && remainingImages.length > 0 && (
          <section className="flex flex-col gap-12 border-t border-secondary/10 pt-20">
            <h2 className="font-headline-lg text-center text-[36px]">
              Archival Compendium
            </h2>
            <div
              className={`grid gap-10 w-full ${
                remainingImages.length === 1
                  ? "grid-cols-1 max-w-3xl mx-auto"
                  : remainingImages.length === 2
                    ? "grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto"
                    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
              }`}
            >
              {remainingImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-4 group cursor-pointer"
                >
                  <div className="w-full aspect-[4/5] rounded-lg bg-surface-container overflow-hidden border border-secondary/10 shadow-none">
                    {/* Ảnh full màu cho gallery dưới cùng */}
                    <img
                      src={img.url}
                      alt={img.caption || "Archival documentation"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                    />
                  </div>
                  {img.caption && (
                    <div className="flex gap-3 px-2">
                      <span className="font-headline-lg text-[24px] text-tertiary/30 leading-none pt-1">
                        {(idx + 1).toString().padStart(2, "0")}
                      </span>
                      <p className="font-body-md text-[15px] text-on-surface-variant/80 leading-relaxed group-hover:text-primary transition-colors">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer></Footer>
    </div>
  );
}
