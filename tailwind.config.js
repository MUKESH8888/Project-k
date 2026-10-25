/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── RS Brothers Inspired Clean White Palette ──────────────────
        "background":                  "#ffffff",
        "surface":                     "#ffffff",
        "surface-bright":              "#ffffff",
        "surface-container-lowest":    "#ffffff",
        "surface-container-low":       "#f8f9fa",
        "surface-container":           "#f3f3f3",
        "surface-container-high":      "#ebebeb",
        "surface-container-highest":   "#e0e0e0",
        "surface-dim":                 "#d2d5d9",
        "surface-variant":             "#f0f0f0",
        "surface-tint":                "#1a1b18",

        "on-background":               "#212326",
        "on-surface":                  "#212326",
        "on-surface-variant":          "#6b7280",
        "outline":                     "#d2d5d9",
        "outline-variant":             "#e8e8e8",

        // Primary & Luxury Heritage Palette
        "primary":                     "#1a1b18",
        "primary-container":           "#2d2e2b",
        "primary-fixed":               "#f3f3f3",
        "primary-fixed-dim":           "#d2d5d9",
        "on-primary":                  "#ffffff",
        "on-primary-container":        "#e8e8e8",
        "on-primary-fixed":            "#1a1b18",
        "on-primary-fixed-variant":    "#444444",
        "inverse-primary":             "#aaaaaa",

        // Regal Bridal Maroon & Burgundy
        "burgundy":                    "#7A1426",
        "burgundy-deep":               "#5E0D1B",
        "burgundy-light":              "#9C2236",
        "burgundy-rich":               "#8E1624",

        // Temple & Zari Gold
        "gold":                        "#C5A04B",
        "gold-light":                  "#DFC587",
        "gold-dark":                   "#9A7828",
        "gold-bright":                 "#E5B842",

        // Silk Cream & Ivory
        "cream":                       "#FFFBF7",
        "cream-warm":                  "#FAF3EA",
        "cream-soft":                  "#FFF8F6",
        "charcoal":                    "#181716",
        "border":                      "#EAE5DC",

        // Inverse surface (dark headers / banners)
        "inverse-surface":             "#1a1b18",
        "inverse-on-surface":          "#f5f5f5",

        // Secondary — warm gold (Indian heritage accent)
        "secondary":                   "#7a5c00",
        "secondary-container":         "#fff8dc",
        "secondary-fixed":             "#f5c518",
        "secondary-fixed-dim":         "#d4a800",
        "on-secondary":                "#ffffff",
        "on-secondary-container":      "#4a3800",
        "on-secondary-fixed":          "#1a1500",
        "on-secondary-fixed-variant":  "#5a4200",

        // Tertiary — heritage green
        "tertiary":                    "#1c4532",
        "tertiary-container":          "#1c4532",
        "tertiary-fixed":              "#d4edda",
        "tertiary-fixed-dim":          "#a8d5b5",
        "on-tertiary":                 "#ffffff",
        "on-tertiary-container":       "#d4edda",
        "on-tertiary-fixed":           "#0a2016",
        "on-tertiary-fixed-variant":   "#1c4532",

        // Error / Sale
        "error":                       "#d72c0d",
        "error-container":             "#fff0ed",
        "on-error":                    "#ffffff",
        "on-error-container":          "#b91c0a",
      },

      borderRadius: {
        // RS Brothers: card-radius = 10px, button-radius = 0px (square)
        "DEFAULT": "0px",
        "sm":      "4px",
        "lg":      "6px",
        "xl":      "10px",
        "2xl":     "16px",
        "3xl":     "24px",
        "full":    "9999px",
      },

      spacing: {
        "space-xl":      "2.5rem",
        "space-md":      "1rem",
        "space-xs":      "0.25rem",
        "gutter-mobile": "0.75rem",
        "space-lg":      "1.5rem",
        "margin-mobile": "1rem",
        "margin":        "3rem",
        "gutter":        "1.5rem",
        "space-sm":      "0.5rem",
      },

      // ── Poppins across every token (RS Brothers primary font) ──────
      fontFamily: {
        "heading":           ["'Playfair Display'", "Georgia", "serif"],
        "serif":             ["'Playfair Display'", "Georgia", "serif"],
        "display":           ["'Playfair Display'", "Georgia", "serif"],
        "sans":              ["Poppins", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        "display-lg-mobile": ["Poppins", "sans-serif"],
        "display-md-mobile": ["Poppins", "sans-serif"],
        "display-lg":        ["Poppins", "sans-serif"],
        "display-md":        ["Poppins", "sans-serif"],
        "headline-lg":       ["Poppins", "sans-serif"],
        "headline-md":       ["Poppins", "sans-serif"],
        "headline-sm":       ["Poppins", "sans-serif"],
        "title-lg":          ["Poppins", "sans-serif"],
        "title-md":          ["Poppins", "sans-serif"],
        "body-lg":           ["Poppins", "sans-serif"],
        "body-md":           ["Poppins", "sans-serif"],
        "body-sm":           ["Poppins", "sans-serif"],
        "label-lg":          ["Poppins", "sans-serif"],
        "label-md":          ["Poppins", "sans-serif"],
        "label-sm":          ["Poppins", "sans-serif"],
      },

      fontSize: {
        "display-lg":        ["3.5rem",    { lineHeight: "4.25rem",  letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-lg-mobile": ["2.25rem",   { lineHeight: "2.75rem",  letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-md":        ["2.75rem",   { lineHeight: "3.25rem",  letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-md-mobile": ["1.875rem",  { lineHeight: "2.375rem", fontWeight: "600" }],
        "headline-lg":       ["2rem",      { lineHeight: "2.5rem",   fontWeight: "600" }],
        "headline-md":       ["1.5rem",    { lineHeight: "2rem",     fontWeight: "600" }],
        "headline-sm":       ["1.25rem",   { lineHeight: "1.75rem",  fontWeight: "600" }],
        "title-lg":          ["1.125rem",  { lineHeight: "1.625rem", fontWeight: "600" }],
        "title-md":          ["1rem",      { lineHeight: "1.5rem",   fontWeight: "600" }],
        "body-lg":           ["1.125rem",  { lineHeight: "1.75rem",  fontWeight: "400" }],
        "body-md":           ["0.9375rem", { lineHeight: "1.5rem",   fontWeight: "400" }],
        "body-sm":           ["0.8125rem", { lineHeight: "1.25rem",  fontWeight: "400" }],
        "label-lg":          ["0.875rem",  { lineHeight: "1.25rem",  letterSpacing: "0.06em", fontWeight: "500" }],
        "label-md":          ["0.75rem",   { lineHeight: "1rem",     letterSpacing: "0.08em", fontWeight: "500" }],
        "label-sm":          ["0.6875rem", { lineHeight: "0.875rem", letterSpacing: "0.05em", fontWeight: "500" }],
      },
    },
  },
  plugins: [],
};
