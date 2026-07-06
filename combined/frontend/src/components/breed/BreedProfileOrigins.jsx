import React from "react";

const VintageImage = ({ img, alt, rotateClass }) => {
  if (!img) return null;
  return (
    <div className={`relative p-3 md:p-4 bg-[#F5EFE3] border-[8px] md:border-[14px] border-[#4E3629] rounded-[4px] shadow-[0_16px_40px_rgba(40,25,10,0.3)] w-full flex flex-col transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_24px_50px_rgba(40,25,10,0.4)] ${rotateClass} hover:rotate-0 z-10 group`}>
      <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px] z-20" />
      <div className="relative overflow-hidden w-full rounded-sm">
        <img
          alt={alt}
          className="w-full h-auto max-h-[500px] object-cover filter brightness-[.9] contrast-[1.05] sepia-[.15] group-hover:brightness-100 group-hover:sepia-0 transition-all duration-700 group-hover:scale-105"
          src={img.url}
          loading="lazy"
        />
      </div>
      {img.caption && (
        <div className="mt-4 pt-3 border-t border-[#e3d7bf]/80 text-center relative z-20">
          <p className="font-serif italic text-[13px] md:text-[15px] text-[#4E3629] leading-relaxed font-medium">
            {img.caption}
          </p>
        </div>
      )}
    </div>
  );
};

export function BreedProfileOrigins({ breed, vintageImg1, vintageImg2, vintageImg3 }) {
  const facts = breed.breedSpecificFacts || [];
  
  return (
    <section className="py-24 border-y border-secondary/10 flex flex-col gap-12 md:gap-20">
      
      <div className="text-center space-y-4 md:mb-4">
        <h2 className="font-headline-lg text-[36px] md:text-[44px] text-[#4E3629]">
          Archival Origins
        </h2>
        <div className="w-24 h-1 bg-[#8C6D53] mx-auto rounded-full"></div>
        <p className="font-serif italic text-on-surface-variant text-[16px] md:text-[18px]">
          The historical footprint of the breed
        </p>
      </div>

      {/* Block 1: Intro & Img 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col gap-8 order-2 lg:order-1">
          <p className="font-body-md text-on-surface-variant leading-relaxed text-[17px] md:text-[20px] first-letter:text-6xl first-letter:font-headline-lg first-letter:text-[#4E3629] first-letter:float-left first-letter:mr-4 first-letter:mt-2">
            {breed.historySnippet}
          </p>
          {facts.length > 0 && (
            <div className="relative pl-6 md:pl-8 py-4 my-2 md:my-4">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8C6D53] to-transparent rounded-full"></div>
               <blockquote className="font-serif italic text-on-surface-variant text-[20px] md:text-[26px] opacity-95 leading-relaxed">
                 "{facts[0]}"
               </blockquote>
            </div>
          )}
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center px-4 md:px-0">
          <VintageImage img={vintageImg1} alt="Vintage record 1" rotateClass="md:rotate-2" />
        </div>
      </div>

      {/* Block 2: Img 2 & Facts */}
      {(vintageImg2 || facts.length > 1) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center md:mt-8">
          <div className="lg:col-span-5 flex justify-center px-4 md:px-0">
             <VintageImage img={vintageImg2} alt="Vintage record 2" rotateClass="md:-rotate-2" />
          </div>
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10">
            {facts.length > 1 && (
              <div className="relative pr-6 md:pr-8 py-4 text-right">
                 <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8C6D53] to-transparent rounded-full"></div>
                 <blockquote className="font-serif italic text-on-surface-variant text-[20px] md:text-[26px] opacity-95 leading-relaxed">
                   "{facts[1]}"
                 </blockquote>
              </div>
            )}
            {facts.length > 2 && (
              <div className="relative pl-6 md:pl-8 py-4 text-left">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8C6D53] to-transparent rounded-full"></div>
                 <blockquote className="font-serif italic text-on-surface-variant text-[20px] md:text-[26px] opacity-95 leading-relaxed">
                   "{facts[2]}"
                 </blockquote>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Block 3: Facts & Img 3 */}
      {(vintageImg3 || facts.length > 3) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center md:mt-8">
          <div className="lg:col-span-7 flex flex-col gap-8 md:gap-10 order-2 lg:order-1">
             {facts.slice(3).map((fact, idx) => (
               <div key={idx} className="relative pl-6 md:pl-8 py-4">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8C6D53] to-transparent rounded-full"></div>
                 <blockquote className="font-serif italic text-on-surface-variant text-[20px] md:text-[26px] opacity-95 leading-relaxed">
                   "{fact}"
                 </blockquote>
               </div>
             ))}
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center px-4 md:px-0">
             <VintageImage img={vintageImg3} alt="Vintage record 3" rotateClass="md:rotate-1" />
          </div>
        </div>
      )}

    </section>
  );
}
