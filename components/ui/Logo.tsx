"use client";

interface LogoProps {
  dark?: boolean;
  className?: string;
}

/** RO Care India wordmark with a minimal droplet glyph. */
export default function Logo({ dark = false, className = "" }: LogoProps) {
  const fg = dark ? "#FFFFFF" : "#071320";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <path
          d="M12 2.5C12 2.5 4.5 10.2 4.5 15.2C4.5 19.3 7.9 22 12 22C16.1 22 19.5 19.3 19.5 15.2C19.5 10.2 12 2.5 12 2.5Z"
          fill="url(#dropGrad)"
        />
        <path
          d="M9.2 15.8C9.2 17.4 10.5 18.7 12.1 18.7"
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="dropGrad" x1="12" y1="2.5" x2="12" y2="22">
            <stop stopColor="#5FD3FF" />
            <stop offset="1" stopColor="#005CFF" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="text-[17px] font-semibold tracking-tight"
        style={{ color: fg }}
      >
        RO Care <span style={{ color: "#005CFF" }}>India</span>
      </span>
    </span>
  );
}
