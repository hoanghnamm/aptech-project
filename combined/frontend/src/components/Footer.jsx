import React from 'react';
import { PawPrint } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-primary/10 mt-auto">
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 text-on-surface-variant font-body-sm">
          <PawPrint size={16} className="text-primary shrink-0" />
          <span>Made with warmth for dog lovers everywhere.</span>
        </div>
        <p className="text-on-surface-variant font-body-sm">
          © {new Date().getFullYear()} PawPal — your AI dog companion.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
