import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sailboat Bend Survival",
  description: "Survive the zombie apocalypse in Sailboat Bend, Fort Lauderdale",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden", background: "#000" }}>
        {children}
      </body>
    </html>
  );
}
