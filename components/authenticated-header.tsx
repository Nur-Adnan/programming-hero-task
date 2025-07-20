"use client"

import Link from "next/link"
import { Zap, Plus, Search, Trophy, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "./theme-toggle"
import { signOut } from "next-auth/react"
import { useDebateStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function AuthenticatedHeader() {
  const currentUser = useDebateStore((state) => state.currentUser)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, []) // Empty dependency array means this runs once on mount

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/create-debate", label: "Create", icon: Plus },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/tags", label: "Tags", icon: Zap },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-3 font-bold text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <motion.span 
            className="text-lg font-semibold text-white relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="relative z-10">ArenaX</span>
            <span className="absolute inset-0 text-lg font-semibold text-blue-400 blur-sm animate-pulse">
              ArenaX
            </span>
            <span className="absolute inset-0 text-lg font-semibold text-blue-300 blur-md animate-pulse" style={{ animationDelay: '0.5s' }}>
              ArenaX
            </span>
            <span className="absolute inset-0 text-lg font-semibold text-blue-200 blur-lg animate-pulse" style={{ animationDelay: '1s' }}>
              ArenaX
            </span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          <div className="flex items-center gap-1 rounded-full bg-muted/20 px-4 py-2 backdrop-blur-sm">
            <ThemeToggle />
            {navLinks.map((link, index) => (
              <div key={link.href} className="flex items-center">
                <Link
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-muted/30 rounded-md"
                  prefetch={false}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
                {index < navLinks.length - 1 && (
                  <div className="mx-1 h-4 w-px bg-border/50" />
                )}
              </div>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-3">
          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full bg-muted/20 hover:bg-muted/40 transition-all duration-200"
              >
                <Avatar className="h-8 w-8 ring-2 ring-muted/20">
                  <AvatarImage 
                  src={currentUser?.username ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${currentUser.username}` : ""} 
                  alt={currentUser?.username || "User"} 
                />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                    {currentUser?.username ? currentUser.username.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-border/50 text-card-foreground shadow-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{currentUser?.username || "Guest"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{currentUser?.email || "N/A"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden bg-muted/20 hover:bg-muted/40 transition-all duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-muted/30 rounded-lg transition-all duration-200"
                  prefetch={false}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
