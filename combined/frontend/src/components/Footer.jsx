import React, { useState, useEffect } from "react";

// Curated archival facts (served locally — no external dependency).
const FACTS = [
  "The canine olfactory system possesses up to 300 million receptors, allowing detection of odorant concentrations as remarkably low as one part per trillion.",
  "A dog's sense of hearing is roughly four times more sensitive than that of a human, perceiving frequencies up to 65,000 Hz.",
  "The Basenji is often described as the 'barkless dog', producing a distinctive yodel-like sound due to its unusually shaped larynx.",
  "Greyhounds can reach speeds of up to 72 km/h, making them the fastest of all domesticated canine breeds.",
  "Each dog's nose print is unique, composed of ridges and creases as individually distinctive as a human fingerprint.",
];

export function Footer() {
  const [fact, setFact] = useState("");

  useEffect(() => {
    setFact(FACTS[Math.floor(Math.random() * FACTS.length)]);
  }, []);

  return (
    <footer className="w-full rounded-none border-t border-secondary/20 bg-surface-container-high py-12 mt-auto shadow-none">
      <div className="w-full px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex flex-col gap-10">
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

export default Footer;
