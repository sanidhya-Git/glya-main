import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GLYA — Fine Jewellery",
  description: "Certified diamonds and 22K gold, priced transparently against the live bullion rate.",
};

// Warm up the connection to the admin API — every page fetches catalog data from it on mount.
const ADMIN_ORIGIN = (() => {
  const base = process.env.NEXT_PUBLIC_GLYA_API_BASE ?? process.env.NEXT_PUBLIC_ADMIN_API;
  try { return base ? new URL(base).origin : null; } catch { return null; }
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body style={{ fontFamily: "var(--font-jost), system-ui, sans-serif", background: "var(--paper)", color: "var(--ink)" }}>
        {ADMIN_ORIGIN && <link rel="preconnect" href={ADMIN_ORIGIN} crossOrigin="anonymous" />}
        {children}
      </body>
    </html>
  );
}
