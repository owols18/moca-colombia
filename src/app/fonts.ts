import localFont from "next/font/local";

export const comfortaa = localFont({
  src: "./fonts/Comfortaa-Variable.ttf",
  display: "swap",
  variable: "--font-comfortaa",
  weight: "300 700",
  fallback: ["Trebuchet MS", "Arial", "sans-serif"],
});

export const manrope = localFont({
  src: "./fonts/Manrope-Variable.ttf",
  display: "swap",
  variable: "--font-manrope",
  weight: "200 800",
  fallback: ["Arial", "sans-serif"],
});
