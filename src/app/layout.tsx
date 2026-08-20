import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Aleph Jobs — Where great work finds great people",
  description:
    "A trusted marketplace connecting clients with verified professionals. Post a job, get matched, get it done.",
  icons: {
    icon: "/alephlogo.jpg",
    apple: "/alephlogo.jpg",
    shortcut: "/alephlogo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", fraunces.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <main className="">
          {children}
          <Toaster position="top-center" richColors />
        </main>
      </body>
    </html>
  );
}
