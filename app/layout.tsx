import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Métricas SaaS",
  description: "Plataforma de métricas para SaaS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
