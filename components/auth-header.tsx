"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function AuthHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-foreground">
          <Zap className="h-6 w-6" />
          ArenaX
        </Link>

        <div className="flex items-center gap-4 md:gap-8 lg:flex-1 lg:justify-end">
          <nav className="hidden items-center gap-6 md:flex lg:gap-9">
            <ThemeToggle />
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium hover:text-primary transition-colors">
              Explore
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="secondary" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
