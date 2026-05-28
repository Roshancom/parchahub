module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      colors: {
        brand: {
          blue: "#2563EB",
          blueDark: "#1D4ED8",
          surface: "#FFFFFF",
          border: "#F3F4F6",
          footer: "#1F2937",
        },
        neutral: {
          100: "#F9FAFB",
          200: "#F3F4F6",
          500: "#6B7280",
          700: "#374151",
          900: "#111827",
        },
        success: {
          100: "#DCFCE7",
          700: "#15803D",
        },
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        "4xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 24, 39, 0.08)",
        lift: "0 14px 40px rgba(37, 99, 235, 0.16)",
      },
    },
  },
  plugins: [],
};
