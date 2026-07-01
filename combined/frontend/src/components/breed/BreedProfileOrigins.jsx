import React from "react";

export function BreedProfileOrigins({ breed, vintageImg1, vintageImg2, vintageImg3 }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-16 border-y border-secondary/10 py-20">
      {/* Cột Trái: Ảnh 1 và 3 */}
      <div className="md:col-span-5 flex flex-col gap-12 text-left">
        {vintageImg1 && (
          <div className="relative p-3.5 bg-[#F5EFE3] border-[10px] md:border-[14px] border-[#4E3629] rounded-[4px] shadow-[0_16px_36px_rgba(40,25,10,0.3)] w-full flex flex-col">
            <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px]" />
            <img
              alt="Vintage record 1"
              className="w-full h-auto max-h-[400px] object-contain brightness-[.9] rounded-sm"
              src={vintageImg1.url}
              loading="lazy"
            />
            {vintageImg1.caption && (
              <div className="mt-4 pt-3 border-t border-[#e3d7bf]/60 text-center">
                <p className="font-serif italic text-[12px] md:text-[13px] text-[#5C3A21]/85 leading-relaxed">
                  {vintageImg1.caption}
                </p>
              </div>
            )}
          </div>
        )}

        {vintageImg3 && (
          <div className="relative p-3.5 bg-[#F5EFE3] border-[10px] md:border-[14px] border-[#4E3629] rounded-[4px] shadow-[0_16px_36px_rgba(40,25,10,0.3)] w-full flex flex-col mt-8">
            <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px]" />
            <img
              alt="Vintage record 3"
              className="w-full h-auto max-h-[400px] object-contain brightness-[.9] rounded-sm"
              src={vintageImg3.url}
              loading="lazy"
            />
            {vintageImg3.caption && (
              <div className="mt-4 pt-3 border-t border-[#e3d7bf]/60 text-center">
                <p className="font-serif italic text-[12px] md:text-[13px] text-[#5C3A21]/85 leading-relaxed">
                  {vintageImg3.caption}
                </p>
              </div>
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
              <div className="w-full my-6">
                <div className="relative p-3.5 bg-[#F5EFE3] border-[10px] md:border-[14px] border-[#4E3629] rounded-[4px] shadow-[0_16px_36px_rgba(40,25,10,0.3)] flex flex-col">
                  <div className="absolute inset-0.5 border border-[#e3d7bf] pointer-events-none rounded-[2px]" />
                  <img
                    alt="Vintage record 2"
                    className="w-full h-auto max-h-[450px] object-contain brightness-[.9] rounded-sm"
                    src={vintageImg2.url}
                    loading="lazy"
                  />
                  {vintageImg2.caption && (
                    <div className="mt-4 pt-3 border-t border-[#e3d7bf]/60 text-center">
                      <p className="font-serif italic text-[12px] md:text-[13px] text-[#5C3A21]/85 leading-relaxed">
                        {vintageImg2.caption}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
