import type { Metadata } from "next";
import { Poppins, Inter, Source_Serif_4 } from "next/font/google";
import { siteConfig } from "@/lib/config/site.config";
import "./globals.css";
import Navbar from "@/components/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  style: ["italic"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.name,
    template: `%s — ${siteConfig.name}`,
  },

  description: siteConfig.description,

  keywords: [...siteConfig.keywords],

  icons: {
    icon: "/logo.png",
  },

  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${poppins.variable} ${inter.variable} ${sourceSerif.variable}`}
    >
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}