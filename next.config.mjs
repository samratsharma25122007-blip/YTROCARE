// On GitHub Pages the site lives under /<repo-name>/ instead of the domain
// root; the Pages workflow sets this env var so links and assets resolve.
// Netlify and local dev leave it unset and serve from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export — the whole site prerenders, so this deploys anywhere
  // (Netlify, GitHub Pages, any static host) with zero server runtime.
  output: "export",
  basePath,
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
