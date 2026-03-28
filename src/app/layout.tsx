import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const syne = Syne({
  variable: "--font-heading-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KLIQZ - Performance Marketing Agency",
  description: "KLIQZ transforme votre trafic en revenus automatiques. Stratégies data-driven, media buying expert et ROI garanti pour votre croissance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${syne.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-[#F8FAFC] bg-black">
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
