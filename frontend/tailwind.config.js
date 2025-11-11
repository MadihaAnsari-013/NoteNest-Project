// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#8b5cf6",     // Purple
        secondary: "#3b82f6",   // Blue
        accent: "#06b6d4",      // Cyan
        glass: "rgba(255, 255, 255, 0.1)",
        glow: "#8b5cf6",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-glow": "pulseGlow 2s infinite",
        "float": "float 6s ease-in-out infinite",
        "cursor-glow": "cursorGlow 1.5s infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.8)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        cursorGlow: {
          "0%": { boxShadow: "0 0 10px #8b5cf6" },
          "100%": { boxShadow: "0 0 20px #8b5cf6, 0 0 30px #8b5cf6" },
        },
      },
    },
  },
  plugins: [],
};

