import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Elegant display serif for premium editorial headings.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RO Care India — Premium RO Water Purifier Servicing",
  description:
    "See what happens inside your RO if you don't service it. Certified engineers, same-day doorstep service, genuine parts. Book your RO Care India service today.",
  keywords: [
    "RO service",
    "water purifier servicing",
    "RO repair",
    "RO Care India",
    "doorstep RO service",
  ],
  openGraph: {
    title: "RO Care India — Premium RO Water Purifier Servicing",
    description:
      "The launch of healthier water. Cinematic, scroll-driven story of what happens inside your RO.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#071320",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="font-sans antialiased">
        {/* Goo filter for the gooey CTA buttons — referenced as url(#goo) */}
        <svg aria-hidden focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="goo" x="-50%" y="-200%" width="200%" height="500%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
        <SmoothScroll>
          <ScrollProgress />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
