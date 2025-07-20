"use client";

import Link from "next/link";
import { Zap, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { motion } from "framer-motion";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-foreground"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <motion.span
            className="text-lg font-semibold text-white relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            ArenaX
          </motion.span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/explore"
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-muted/30 rounded-md"
          >
            <Search className="h-4 w-4" />
            Explore
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
