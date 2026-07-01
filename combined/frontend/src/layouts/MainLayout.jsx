import React from 'react';
import DoctorMascot from '../components/common/DoctorMascot/DoctorMascot';

// Use Vite glob import to load all 30 frames from assets folder
// Scans both asset/assets and supports .png/.PNG extensions
const framesGlob = import.meta.glob(['../asset/*.{png,PNG}', '../assets/*.{png,PNG}'], { eager: true, import: 'default' });

// Convert glob object to array and sort numerically (1, 2, ..., 30)
const mascotFrames = Object.keys(framesGlob)
  .filter(key => key.toLowerCase().includes('mascot')) // Only include files containing 'mascot'
  .sort((a, b) => {
    // Extract number from filename only to avoid conflicting numbers in folder names
    const fileA = a.split('/').pop();
    const fileB = b.split('/').pop();
    const numA = parseInt(fileA.match(/\d+/)?.[0] || 0);
    const numB = parseInt(fileB.match(/\d+/)?.[0] || 0);
    return numA - numB;
  })
  .filter(key => {
    const num = parseInt(key.match(/\d+/)?.[0] || 0);
    return num >= 1 && num <= 30; // Limit to frames 1 through 30
  })
  .map((key) => framesGlob[key]);

// Debug log for console checks (F12)
console.log(">>> [DEBUG] Files Found by Vite:", Object.keys(framesGlob));
console.log(">>> [DEBUG] Mascot Frames Total:", mascotFrames.length);
if (mascotFrames.length === 0) console.error(">>> ERROR: No mascot frames found! Verify folder: src/asset/ or src/assets/");

export default function MainLayout({ children, onNavigate, currentPage }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#EFF8F7', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Navbar removed - Navigation integrated into Mascot floating menu */}
      <main style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '75rem', margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
          {children}
        </div>
        <DoctorMascot onNavigate={onNavigate} currentPage={currentPage} frames={mascotFrames} />
      </main>
      <footer style={{ minHeight: 'clamp(3rem, 2rem + 2vw, 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-2) var(--space-3)', borderTop: '3px dashed #2BA8A2', color: '#1E8C86', fontSize: 'var(--fs-400)', fontWeight: '500' }}>
        © 2026 PawIntel - Smart AI-Powered Dog Healthcare System.
      </footer>
    </div>
  );
}