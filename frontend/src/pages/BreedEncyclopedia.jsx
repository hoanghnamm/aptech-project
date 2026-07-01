import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Footer } from "@/components/footer";

const API_BASE = "http://localhost:5000/api/v1";

// ĐÃ BỎ: traits
const INITIAL_FILTERS = {
  page: 1,
  limit: 12, // Tăng limit lên 12 để chia hết cho 3 cột
  search: "",
  size: "",
  sheddingLevel: "",
  spaceRequirement: "",
  barkingLevel: "",
  weatherTolerance: "",
  vulnerabilityToDisease: "",
  energyLevel: [],
};

export function BreedEncyclopedia() {
  const [breeds, setBreeds] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const navigate = useNavigate();

  const isFiltered = Object.keys(INITIAL_FILTERS).some((key) => {
    if (key === "page" || key === "limit") return false;
    if (Array.isArray(filters[key])) return filters[key].length > 0;
    return filters[key] !== INITIAL_FILTERS[key];
  });

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      try {
        const params = { ...filters };

        if (filters.energyLevel.length > 0) {
          params.energyLevel = filters.energyLevel.join(",");
        } else {
          delete params.energyLevel;
        }

        const response = await axios.get(`${API_BASE}/encyclopedia/breeds`, {
          params,
        });

        if (response.data?.success && response.data?.data) {
          setBreeds(response.data.data.breeds || []);
          setPagination(response.data.data.pagination || null);
        } else {
          setBreeds([]);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách hồ sơ:", err);
        setBreeds([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchBreeds();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const handleSingleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: prev[filterKey] === value ? "" : value,
      page: 1,
    }));
  };

  const handleMultiFilterChange = (filterKey, value) => {
    setFilters((prev) => {
      const currentList = prev[filterKey];
      const isSelected = currentList.includes(value);
      return {
        ...prev,
        [filterKey]: isSelected
          ? currentList.filter((item) => item !== value)
          : [...currentList, value],
        page: 1,
      };
    });
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-tertiary selection:text-on-tertiary">
      <header className="bg-surface border-b border-secondary/20 sticky top-0 z-50">
        {/* MỞ RỘNG LAYOUT LÊN 1280px */}
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 max-w-[1280px] mx-auto w-full">
          <div
            className="font-headline-lg text-primary tracking-tight cursor-pointer"
            onClick={() => navigate("/")}
          >
            Canis Archive
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            <span
              onClick={() => navigate("/")}
              className="text-primary border-b-2 border-primary pb-1 font-bold cursor-pointer transition-colors"
            >
              Encyclopedia
            </span>
            <span
              onClick={() => navigate("/identify")}
              className="text-on-surface-variant hover:text-primary pb-1 border-b-2 border-transparent transition-colors cursor-pointer"
            >
              Identify
            </span>
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h1 className="font-headline-xl text-primary">
              The Breed Repository
            </h1>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              An archival collection of canine specimens, cataloged for
              scholarly review and biological study.
            </p>
            <div className="mt-8 relative max-w-md mx-auto">
              <input
                className="w-full bg-surface-container-high border-b border-secondary/30 focus:border-primary focus:ring-0 px-4 py-3 bg-transparent text-center font-body-md placeholder:text-on-surface-variant outline-none transition-colors rounded-t-sm shadow-none"
                placeholder="Search the archive..."
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
              />
              <span className="material-symbols-outlined absolute right-4 top-3 text-on-surface-variant">
                search
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mt-4 items-start">
            <aside className="md:col-span-3 flex flex-col gap-8 md:sticky md:top-24 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto pr-4 pb-8 custom-scrollbar">
              <div
                className={`flex justify-end -mb-4 transition-opacity duration-500 ease-in-out ${isFiltered ? "opacity-100" : "opacity-0 pointer-events-none"}`}
              >
                <button
                  onClick={handleResetFilters}
                  className="font-label-md uppercase tracking-[0.15em] text-[10px] text-on-surface-variant hover:text-primary transition-colors bg-transparent border-b border-transparent hover:border-primary pb-0.5 p-0 cursor-pointer shadow-none outline-none"
                >
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-label-md uppercase text-primary tracking-widest border-b border-primary/20 pb-2">
                  Kinetic Energy
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: "Low / Calm", val: "1,2" },
                    { label: "Moderate", val: "3" },
                    { label: "High / Athletic", val: "4,5" },
                  ].map((level) => (
                    <label
                      key={level.val}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={filters.energyLevel.includes(level.val)}
                        onChange={() =>
                          handleMultiFilterChange("energyLevel", level.val)
                        }
                        className="appearance-none w-4 h-4 cursor-pointer rounded-sm border border-primary/40 bg-surface relative flex items-center justify-center checked:border-primary after:content-[''] after:w-2 after:h-2 after:bg-primary after:rounded-xs after:scale-0 checked:after:scale-100 after:transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                      />
                      <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">
                        {level.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ĐÃ BỎ Core Temperament */}
              {/* ĐÃ BỎ Acreage khỏi Space Requirement */}

              {[
                {
                  key: "size",
                  title: "Morphology Size",
                  options: ["Small", "Medium", "Large"],
                },
                {
                  key: "sheddingLevel",
                  title: "Shedding Level",
                  options: ["Low", "Medium", "High"],
                },
                {
                  key: "spaceRequirement",
                  title: "Habitat Size",
                  options: ["Apartment", "Small Yard", "Large Yard"],
                },
                {
                  key: "barkingLevel",
                  title: "Vocalization",
                  options: ["Quiet", "Moderate", "Vocal"],
                },
                {
                  key: "weatherTolerance",
                  title: "Climate Adaptability",
                  options: ["Warm", "Cold", "Adaptable"],
                },
                {
                  key: "vulnerabilityToDisease",
                  title: "Pathological Resist.",
                  options: ["Hardy", "Moderate", "Fragile"],
                },
              ].map((filterBlock) => (
                <div key={filterBlock.key} className="flex flex-col gap-4">
                  <h3 className="font-label-md uppercase text-on-surface-variant tracking-widest border-b border-secondary/20 pb-2">
                    {filterBlock.title}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {filterBlock.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters[filterBlock.key] === opt}
                          onChange={() =>
                            handleSingleFilterChange(filterBlock.key, opt)
                          }
                          className="appearance-none w-4 h-4 cursor-pointer rounded-sm border border-primary/40 bg-surface relative flex items-center justify-center checked:border-primary after:content-[''] after:w-2 after:h-2 after:bg-primary after:rounded-xs after:scale-0 checked:after:scale-100 after:transition-transform focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
                        />
                        <span className="font-body-sm text-on-surface group-hover:text-primary transition-colors">
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Grid 3 CỘT (Vì Layout đã rộng ra) */}
            <div className="md:col-span-9 flex flex-col gap-12">
              {loading ? (
                <div className="w-full py-24 flex justify-center items-center">
                  <div className="w-8 h-8 border-2 border-secondary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : breeds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {breeds.map((breed) => (
                    <article
                      key={breed.breedId}
                      onClick={() => navigate(`/breeds/${breed.breedId}`)}
                      className="group cursor-pointer border border-secondary/20 p-4 flex flex-col gap-4 bg-surface hover:bg-surface-container transition-colors shadow-none"
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-high relative border border-secondary/10 shadow-none">
                        <img
                          alt={`${breed.name} profile`}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                          src={
                            breed.thumbnail ||
                            "https://placehold.co/600x450/efe8d5/154212?text=No+Image"
                          }
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span className="px-2.5 py-1 bg-[#e3a392]/25 text-[#1e1c10] font-label-md font-semibold text-[10px] uppercase tracking-wider rounded-sm backdrop-blur-md shadow-none">
                            {breed.lifestyleFilters?.size || "Canine"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="font-headline-lg-mobile md:font-headline-lg text-[22px] text-primary group-hover:text-surface-tint transition-colors">
                          {breed.name}
                        </h2>
                        <p className="font-body-sm text-on-surface-variant italic line-clamp-2">
                          {breed.description}
                        </p>
                      </div>
                      <div className="mt-auto border-t border-secondary/20 pt-3 flex justify-between items-center">
                        <span className="font-body-sm text-on-surface-variant uppercase tracking-widest text-[11px]">
                          View Record
                        </span>
                        <span className="material-symbols-outlined text-secondary/50 group-hover:text-primary transition-colors">
                          arrow_forward
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="w-full py-24 flex flex-col items-center justify-center text-center gap-4">
                  <span className="material-symbols-outlined text-4xl text-secondary/50">
                    find_in_page
                  </span>
                  <p className="font-body-md text-on-surface-variant italic">
                    No botanical or biological records found for this query.
                  </p>
                </div>
              )}

              {pagination && pagination.totalPages > 1 && !loading && (
                <div className="flex justify-between items-center border-t border-secondary/20 pt-6 mt-4">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="flex items-center gap-2 font-label-md uppercase tracking-widest text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0 shadow-none"
                  >
                    <span className="material-symbols-outlined text-sm">
                      arrow_back
                    </span>
                    Previous
                  </button>
                  <span className="font-body-sm text-on-surface-variant">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="flex items-center gap-2 font-label-md uppercase tracking-widest text-secondary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors bg-transparent border-0 shadow-none"
                  >
                    Next
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
}
