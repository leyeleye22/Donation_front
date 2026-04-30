import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entr'aide Humanitaire",
  description: "Migration front Next.js avec fausses données."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
