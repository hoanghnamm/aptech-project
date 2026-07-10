/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-surface-variant": "#42493e",
        "secondary-container": "#e9e2d0",
        "surface-container": "#f4eedb",
        "on-tertiary-fixed-variant": "#683a2e",
        "error-container": "#ffdad6",
        "inverse-on-surface": "#f0f1ea",
        "secondary": "#625e50",
        "surface-variant": "#e2e3dc",
        "error": "#ba1a1a",
        "surface-container-low": "#f3f4ed",
        "inverse-surface": "#2e312c",
        "on-primary-fixed-variant": "#24501f",
        "terracotta-accent": "#e3a392",
        "on-error-container": "#93000a",
        "on-secondary-container": "#686456",
        "surface-tint": "#3b6934",
        "on-secondary": "#ffffff",
        "surface-dim": "#d9dbd3",
        "secondary-fixed": "#e9e2d0",
        "primary-fixed": "#bcf0ae",
        "on-surface": "#191c18",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#a1d494",
        "primary-fixed-dim": "#a1d494",
        "on-error": "#ffffff",
        "on-tertiary": "#ffffff",
        "surface-container-highest": "#e2e3dc",
        "primary": "#002b02",
        "on-primary-container": "#7eaf73",
        "outline-variant": "#c2c9bb",
        "tertiary": "#3e180e",
        "primary-container": "#154212",
        "border-taupe": "rgba(98, 94, 80, 0.2)",
        "on-secondary-fixed": "#1e1c11",
        "on-tertiary-container": "#d19483",
        "tertiary-fixed-dim": "#f9b7a5",
        "on-primary": "#ffffff",
        "secondary-fixed-dim": "#ccc6b5",
        "on-tertiary-fixed": "#341107",
        "surface": "#f9faf2",
        "on-primary-fixed": "#002201",
        "ink-text": "#1e1c10",
        "paper-base": "#fff9eb",
        "surface-bright": "#f9faf2",
        "on-secondary-fixed-variant": "#4a473a",
        "on-background": "#191c18",
        "tertiary-fixed": "#ffdbd1",
        "surface-container-high": "#e7e9e1",
        "outline": "#72796e",
        "background": "#f9faf2",
        "tertiary-container": "#582d21"
      },
      borderRadius: {
        "none": "0px",
        "sm": "0px",
        "DEFAULT": "2px",
        "md": "2px",
        "lg": "2px",
        "xl": "4px",
        "2xl": "4px",
        "3xl": "4px",
        "full": "9999px"
      },
      spacing: {
        "margin-desktop": "64px",
        "base": "8px",
        "container-max": "1024px",
        "gutter": "24px",
        "margin-mobile": "16px"
      },
      fontFamily: {
        "headline-lg-mobile": ["Playfair Display", "serif"],
        "body-md": ["Hanken Grotesk", "sans-serif"],
        "headline-xl": ["Playfair Display", "serif"],
        "headline-lg": ["Playfair Display", "serif"],
        "label-md": ["Hanken Grotesk", "sans-serif"],
        "body-sm": ["Hanken Grotesk", "sans-serif"]
      },
      fontSize: {
        "headline-lg-mobile": [
          "28px",
          {
            "lineHeight": "36px",
            "letterSpacing": "-0.01em",
            "fontWeight": "600"
          }
        ],
        "body-md": [
          "16px",
          {
            "lineHeight": "26px",
            "fontWeight": "400"
          }
        ],
        "headline-xl": [
          "56px",
          {
            "lineHeight": "64px",
            "letterSpacing": "-0.02em",
            "fontWeight": "700"
          }
        ],
        "headline-lg": [
          "32px",
          {
            "lineHeight": "40px",
            "letterSpacing": "-0.01em",
            "fontWeight": "600"
          }
        ],
        "label-md": [
          "12px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.05em",
            "fontWeight": "600"
          }
        ],
        "body-sm": [
          "14px",
          {
            "lineHeight": "22px",
            "fontWeight": "400"
          }
        ]
      }
    },
  },
  plugins: [],
};