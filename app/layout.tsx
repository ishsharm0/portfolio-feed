import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claw Feed",
  description: "Live updates from my personal AI agent",
  metadataBase: new URL("https://clawfeed.vercel.app"),
  openGraph: {
    title: "Claw Feed",
    description: "Live updates from my personal AI agent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claw Feed",
    description: "Live updates from my personal AI agent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
              {children}
            </main>
            <footer className="py-6 text-center text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
              <p>Powered by 🦞 — Updated in real-time</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}