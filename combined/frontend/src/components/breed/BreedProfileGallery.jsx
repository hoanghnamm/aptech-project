import React from "react";

export function BreedProfileGallery({ remainingImages }) {
  if (!remainingImages || remainingImages.length === 0) return null;

  return (
    <section className="flex flex-col gap-12 md:gap-16 border-t border-secondary/10 pt-20 md:pt-24 pb-16">
      <div className="text-center space-y-4">
        <h2 className="font-headline-lg text-[36px] md:text-[44px] text-[#4E3629]">
          Archival Compendium
        </h2>
        <div className="w-24 h-1 bg-[#8C6D53] mx-auto rounded-full"></div>
        <p className="font-serif italic text-on-surface-variant text-[16px] md:text-[18px]">
          A curated collection of historical records
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
        {remainingImages.map((img, idx) => {
          // Define a varied layout pattern based on index for a premium asymmetric look
          let colSpan = "md:col-span-4";
          let heightClass = "h-[300px] md:h-[400px]";
          
          const isLast = idx === remainingImages.length - 1;
          const isOddCount = remainingImages.length % 2 !== 0;

          if (isLast && isOddCount && idx > 0) {
            colSpan = "md:col-span-12";
            heightClass = "h-[400px] md:h-[600px]";
          } else if (idx % 6 === 0) { colSpan = "md:col-span-7"; heightClass = "h-[400px] md:h-[550px]"; }
          else if (idx % 6 === 1) { colSpan = "md:col-span-5"; heightClass = "h-[350px] md:h-[480px]"; }
          else if (idx % 6 === 2) { colSpan = "md:col-span-4"; heightClass = "h-[300px] md:h-[400px]"; }
          else if (idx % 6 === 3) { colSpan = "md:col-span-8"; heightClass = "h-[400px] md:h-[500px]"; }
          else if (idx % 6 === 4) { colSpan = "md:col-span-6"; heightClass = "h-[350px] md:h-[450px]"; }
          else if (idx % 6 === 5) { colSpan = "md:col-span-6"; heightClass = "h-[350px] md:h-[450px]"; }

          return (
            <div key={idx} className={`relative group ${colSpan} ${heightClass} flex flex-col`}>
              <div className="relative p-2.5 md:p-3.5 bg-[#F5EFE3] border-[6px] md:border-[12px] border-[#4E3629] rounded-[4px] shadow-[0_12px_30px_rgba(40,25,10,0.3)] h-full w-full transition-all duration-700 hover:shadow-[0_20px_50px_rgba(40,25,10,0.5)] md:hover:-translate-y-2 group-hover:border-[#3A261C] flex flex-col">
                <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px] z-10" />
                
                <div className="relative w-full h-full overflow-hidden rounded-[2px]">
                  <img
                    src={img.url}
                    alt={img.caption || "Archival documentation"}
                    className="w-full h-full object-cover filter grayscale-[20%] sepia-[15%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#2A1C14]/90 via-[#2A1C14]/60 to-transparent p-6 pt-16 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
                      <p className="font-serif italic text-[14px] md:text-[16px] text-[#F5EFE3] leading-relaxed drop-shadow-md text-center">
                        {img.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
