import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBreed } from "../../api/breed.api";
import { BreedProfileHero } from "../../components/breed/BreedProfileHero";
import { BreedProfileStats } from "../../components/breed/BreedProfileStats";
import { BreedProfileOrigins } from "../../components/breed/BreedProfileOrigins";
import { BreedProfileTaxonomy } from "../../components/breed/BreedProfileTaxonomy";
import { BreedProfileCareHealth } from "../../components/breed/BreedProfileCareHealth";
import { BreedProfileGallery } from "../../components/breed/BreedProfileGallery";

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
        const data = await getBreed(breedId);
        if (data) {
          setBreed(data);
        }
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
        Loading breed profile…
      </div>
    );
  if (!breed)
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-surface font-headline-lg text-error">
        Breed not found
      </div>
    );

  // Tách mảng hình ảnh để đan xen và lấy Caption tương ứng
  const visualAssets = breed.visualArchives || [];
  const heroImage = visualAssets[0]?.url || breed.thumbnail || "https://placehold.co/1200x800/f7dcc0/cb6a4b?text=No+Image";
  const vintageImg1 = visualAssets[1];
  const vintageImg2 = visualAssets[2];
  const vintageImg3 = visualAssets[3];
  const remainingImages = visualAssets.slice(4);

  return (
    <>
      {/* 1. HERO SECTION */}
      <BreedProfileHero breed={breed} heroImage={heroImage} />

      <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-24">
        {/* Navigation Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center self-start gap-2 font-label-md uppercase tracking-[0.2em] text-secondary/60 hover:text-primary transition-all bg-transparent border-none cursor-pointer -mb-8 shadow-none"
        >
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          {isFromIdentify ? "Back to results" : "Back to Encyclopedia"}
        </button>

        {/* 2. PHYSICAL STATS */}
        <BreedProfileStats breed={breed} />

        {/* 3. ARCHIVAL ORIGINS */}
        <BreedProfileOrigins
          breed={breed}
          vintageImg1={vintageImg1}
          vintageImg2={vintageImg2}
          vintageImg3={vintageImg3}
        />

        {/* 4. TAXONOMY & ANALYTICS */}
        <BreedProfileTaxonomy breed={breed} />

        {/* 5. CARE & HEALTH */}
        <BreedProfileCareHealth breed={breed} />

        {/* 6. FULL VISUAL ARCHIVES GALLERY */}
        <BreedProfileGallery remainingImages={remainingImages} />
      </div>
    </>
  );
}
