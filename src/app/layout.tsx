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
  title: "Nimba Ressources Company SA-CV — Investissement & Développement en Guinée",
  description:
    "Nimba Ressources Company SA-CV est une société d'investissement guinéenne spécialisée dans le développement de projets, le financement structuré et l'ingénierie financière pour le développement durable de la Guinée.",
  keywords: [
    "investissement",
    "Guinée",
    "Conakry",
    "Nimba Ressources",
    "financement structuré",
    "développement durable",
    "mines",
    "énergie",
    "agro-industrie",
    "NRC SA-CV",
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
