// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",        // ini penting!
    "./components/**/*.{js,ts,jsx,tsx}", // juga ini
    "./lib/**/*.{js,ts,jsx,tsx}",        // kalau kamu gunakan folder lib
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
