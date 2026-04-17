import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Student Management System",
  description: "Modern Institutional Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} font-sans antialiased bg-gray-50/30 selection:bg-blue-100 selection:text-blue-900`}>
      <body className="min-h-screen flex flex-col text-gray-900 bg-gradient-to-br from-blue-50/20 via-white to-sky-50/20">
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
