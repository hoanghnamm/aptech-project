import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api/v1";

export function Footer() {
  const [fact, setFact] = useState("");

  useEffect(() => {
    const fetchRandomFact = async () => {
      try {
        // Gọi API lấy 1 fact ngẫu nhiên (Bạn nhớ điều chỉnh đúng Endpoint của mình nhé)
        const response = await axios.get(`${API_BASE}/facts/random`);

        if (response.data?.success && response.data?.data) {
          setFact(response.data.data.content);
        }
      } catch (error) {
        console.error("Lỗi lấy Archival Fact:", error);
        // Fallback tĩnh: Nếu API lỗi, vẫn hiện một câu hay ho để không bị trống giao diện
        setFact(
          "The canine olfactory system possesses up to 300 million receptors, allowing detection of odorant concentrations as remarkably low as one part per trillion.",
        );
      }
    };

    fetchRandomFact();
  }, []);

  return (
    <footer className="w-full rounded-none border-t border-secondary/20 bg-surface-container-high py-12 mt-auto shadow-none">
      <div className="w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex flex-col gap-10">
        {/* Khối Archival Fact Mới */}
        {fact && (
          <div className="flex flex-col items-center text-center gap-3 pb-8 border-b border-secondary/10 max-w-4xl mx-auto w-full">
            <span className="font-label-md text-secondary/60 uppercase tracking-[0.2em] text-[10px] font-bold">
              Archival Fact
            </span>
            <p className="font-body-md text-on-surface-variant italic leading-relaxed text-[16px] opacity-90">
              "{fact}"
            </p>
          </div>
        )}

        {/* Các Link Footer Tiêu Chuẩn */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-headline-md text-secondary">Canis Archive</div>
          <div className="flex flex-wrap justify-center gap-6">
            <span className="text-secondary hover:text-primary transition-colors font-body-sm cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
              Scientific References
            </span>
            <span className="text-secondary hover:text-primary transition-colors font-body-sm cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
              Ethical Research
            </span>
            <span className="text-secondary hover:text-primary transition-colors font-body-sm cursor-pointer border-b border-transparent hover:border-primary pb-0.5">
              Privacy Policy
            </span>
          </div>
          <div className="text-secondary font-body-sm text-center md:text-right opacity-80">
            © 2026 Canis Archive. A Scholarly Digital Arboretum.
          </div>
        </div>
      </div>
    </footer>
  );
}
