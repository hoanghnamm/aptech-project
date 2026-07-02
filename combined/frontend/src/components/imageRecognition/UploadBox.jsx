import React from "react";

export function UploadBox() {
  return (
    <div className="flex flex-col items-center gap-4 text-secondary/50 group-hover:text-primary transition-colors text-center">
      <span className="material-symbols-outlined text-[60px] font-light">
        add_a_photo
      </span>
      <div>
        <p className="font-label-md uppercase tracking-[0.2em] font-bold mb-2">
          Drag & Drop Image
        </p>
        <p className="font-body-md italic opacity-80">
          or click to browse your photos
        </p>
      </div>
    </div>
  );
}
