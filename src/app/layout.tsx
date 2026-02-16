import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sailboat Bend Survival",
  description: "Survive one day as a Fort Lauderdale tech bro. A roguelike browser game.",
  openGraph: {
    title: "Sailboat Bend Survival",
    description: "Survive one day as a Fort Lauderdale tech bro 🏄‍♂️",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
