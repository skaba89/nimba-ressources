import type { Metadata } from "next";
import { Ubuntu, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "InvestFlow Africa — Pilotage Intelligent de Vos Investissements",
  description:
    "Plateforme SaaS de gestion d'investissements en Afrique. Centralisez vos données, analysez la rentabilité et présentez vos projets aux investisseurs.",
  keywords: [
    "investissement",
    "Afrique",
    "ROI",
    "gestion de projet",
    "dashboard",
    "finance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${ubuntu.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
