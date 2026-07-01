import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getBreeds } from "../../api/breed.api";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar/Navbar";
import { BreedCard } from "../../components/breed/BreedCard";
import { BreedFilter } from "../../components/breed/BreedFilter";
import { BreedSearchHeader } from "../../components/breed/BreedSearchHeader";
import { BreedPagination } from "../../components/breed/BreedPagination";

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

        const data = await getBreeds(params);

        if (data && data.items) {
          setBreeds(data.items || []);
          setPagination({
            currentPage: data.page,
            totalPages: data.totalPages,
          });
        } else {
          setBreeds([]);
          setPagination(null);
        }
      } catch (err) {
        console.error("Lỗi tải danh sách hồ sơ:", err);
        setBreeds([]);
        setPagination(null);
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
      <Navbar />

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12">
        <section className="flex flex-col gap-8">
          <BreedSearchHeader
            searchValue={filters.search}
            onSearchChange={handleSearchChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mt-4 items-start">
            <BreedFilter
              filters={filters}
              isFiltered={isFiltered}
              onResetFilters={handleResetFilters}
              onSingleFilterChange={handleSingleFilterChange}
              onMultiFilterChange={handleMultiFilterChange}
            />

            <div className="md:col-span-9 flex flex-col gap-12">
              {loading ? (
                <div className="w-full py-24 flex justify-center items-center">
                  <div className="w-8 h-8 border-2 border-secondary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : breeds.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {breeds.map((breed) => (
                    <BreedCard
                      key={breed.breedId}
                      breed={breed}
                      onClick={() => navigate(`/breeds/${breed.breedId}`)}
                    />
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

              <BreedPagination
                currentPage={pagination?.currentPage || 1}
                totalPages={pagination?.totalPages || 1}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer></Footer>
    </div>
  );
}

export default BreedEncyclopedia;
