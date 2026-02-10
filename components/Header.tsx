"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Activity, Rss } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="sticky top-0 z-50 glass border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 py-4 max-w-4xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <span className="text-2xl" role="img" aria-label="lobster">
              🦞
            </span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full live-indicator" />
          </motion.div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight group-hover:text-blue-500 transition-colors">
              Claw Feed
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Live from the shell
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/api/feed"
            className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-blue-500 transition-colors"
            title="RSS Feed"
          >
            <Rss className="w-4 h-4" />
            <span className="hidden sm:inline">RSS</span>
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}