import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Termômetro Anti-Commodity",
  description:
    "Diagnóstico rápido para consultores financeiros: descubra como o mercado percebe seu posicionamento, sua oferta e sua captação.",
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-dvh bg-brand-bg text-brand-ink">{children}</body>
    </html>
  );
}
