/* Minimal, uniform stroke icon set. 24x24, currentColor. */

type IconProps = { className?: string };

const s = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const Icons = {
  shield: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  bolt: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
    </svg>
  ),
  tag: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M3 12l9-9 9 9-9 9-9-9z" />
      <circle cx="9" cy="9" r="1.4" />
    </svg>
  ),
  home: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9h12v-9" />
    </svg>
  ),
  check: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  cog: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2v3m0 14v3M4.2 4.2l2.1 2.1m11.4 11.4l2.1 2.1M2 12h3m14 0h3M4.2 19.8l2.1-2.1m11.4-11.4l2.1-2.1" />
    </svg>
  ),
  heart: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M12 20s-7-4.4-7-9.5A3.9 3.9 0 0112 8a3.9 3.9 0 017-2.5C19 10.6 12 20 12 20z" />
    </svg>
  ),
  arrowRight: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  arrowDown: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </svg>
  ),
  star: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 21.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
    </svg>
  ),
  plus: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  phone: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <path d="M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </svg>
  ),
  mail: (p: IconProps) => (
    <svg viewBox="0 0 24 24" {...s} className={p.className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  whatsapp: (p: IconProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={p.className}>
      <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm0 2a8 8 0 11-4.2 14.8l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 0112 4zm-2.5 4c-.2 0-.5 0-.7.4-.3.4-1 1-1 2.3s1 2.6 1.2 2.8c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.7 3.4.7.5-.1 1.6-.7 1.9-1.3.2-.7.2-1.2.1-1.3l-.6-.3s-1.6-.8-1.8-.9c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.5-.6-2.4-1.5-.7-.6-1.1-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4.3-.5v-.4c0-.2-.6-1.6-.9-2.2-.2-.5-.4-.5-.6-.5h-.5z" />
    </svg>
  ),
};

export type IconName = keyof typeof Icons;
