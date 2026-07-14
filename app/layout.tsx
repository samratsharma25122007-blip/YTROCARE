import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
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
