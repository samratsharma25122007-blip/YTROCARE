/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the whole site prerenders, so this deploys anywhere
  // (Netlify, GitHub Pages, any static host) with zero server runtime.
  output: "export",
  // Emit folder-style routes (book/index.html) so static hosts serve
  // /book without extra rewrite rules.
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
