"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/data";
import { scrollTo } from "@/components/layout/SmoothScroll";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide when scrolling down past a threshold, show when scrolling up.
      if (y > lastY.current && y > 140) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The hero background is black, so the navbar sits on a dark surface in
  // every state — keep the light text treatment throughout.
  const onDark = true;

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMenuOpen(false);
      scrollTo(href, -80);
    }
  };

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden && !menuOpen ? "-120%" : "0%" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`transition-colors duration-500 ${
          scrolled || menuOpen
            ? "border-b border-white/10 bg-brand-ink/60 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/#home"
            onClick={handleNav("#home")}
            aria-label="RO Care India home"
          >
            <Logo dark={onDark} />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={`/${link.href}`}
                onClick={handleNav(link.href)}
                className={`group relative text-sm font-medium transition-colors duration-300 ${
                  onDark
                    ? "text-white/70 hover:text-white"
                    : "text-brand-ink/70 hover:text-brand-ink"
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-cyan-glow transition-all duration-300 ease-out-expo group-hover:w-full" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <Button href="/book" size="md">
                Book Service
              </Button>
            </div>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
                onDark ? "border-white/15 text-white" : "border-brand-ink/15 text-brand-ink"
              }`}
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1.5">
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  className={`block h-px w-5 ${onDark ? "bg-white" : "bg-brand-ink"}`}
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  className={`block h-px w-5 ${onDark ? "bg-white" : "bg-brand-ink"}`}
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  className={`block h-px w-5 ${onDark ? "bg-white" : "bg-brand-ink"}`}
                />
              </div>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-white/10 bg-brand-ink/90 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={`/${link.href}`}
                    onClick={handleNav(link.href)}
                    className="block py-3 text-2xl font-medium tracking-tight text-white/80 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4">
                <Button href="/book" size="lg" className="w-full">
                  Book Service
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
