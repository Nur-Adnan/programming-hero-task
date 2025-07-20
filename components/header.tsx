"use client";

import Link from "next/link";
import {
  Zap,
  Plus,
  Search,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "next-auth/react";
import { useDebateStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const currentUser = useDebateStore((state) => state.currentUser);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, []); // Empty dependency array means this runs once on mount

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const navLinks = [
    { href: "/explore", label: "Explore", icon: Search },
    { href: "/create-debate", label: "Create", icon: Plus },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/tags", label: "Tags", icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 shadow-lg shadow-black/10 dark:bg-transparent dark:shadow-none">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 font-bold text-foreground dark:text-white"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <motion.span
            className="text-lg font-semibold text-foreground dark:text-white relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="relative z-10">ArenaX</span>
            <span className="absolute inset-0 text-lg font-semibold text-blue-400 blur-sm animate-pulse">
              ArenaX
            </span>
            <span
              className="absolute inset-0 text-lg font-semibold text-blue-300 blur-md animate-pulse"
              style={{ animationDelay: "0.5s" }}
            >
              ArenaX
            </span>
            <span
              className="absolute inset-0 text-lg font-semibold text-blue-200 blur-lg animate-pulse"
              style={{ animationDelay: "1s" }}
            >
              ArenaX
            </span>
          </motion.span>
        </Link>

        {/* Desktop Navigation - Only show if user is authenticated */}
        {currentUser && (
          <nav className="hidden md:flex items-center">
            <div className="flex items-center gap-1 rounded-full bg-muted/20 px-4 py-2 backdrop-blur-sm border-0 shadow-lg shadow-black/20 dark:bg-white/10 dark:border dark:border-white/20 dark:shadow-none">
              {navLinks.map((link, index) => (
                <div key={link.href} className="flex items-center">
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 rounded-md hover:scale-105 hover:shadow-lg dark:text-white/80 dark:hover:text-white"
                    prefetch={false}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                  {index < navLinks.length - 1 && (
                    <div className="mx-1 h-4 w-px bg-muted-foreground/20 dark:bg-white/30" />
                  )}
                </div>
              ))}
            </div>
          </nav>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Authenticated User Dropdown */}
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-lg animate-user-icon-glow group"
                >
                  <Avatar className="h-8 w-8 ring-0 group-hover:animate-user-icon-rotate">
                    <AvatarImage
                      src={
                        currentUser?.username
                          ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${currentUser.username}`
                          : ""
                      }
                      alt={currentUser?.username || "User"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-semibold">
                      {currentUser?.username
                        ? currentUser.username.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-card/95 backdrop-blur-xl border-0 text-card-foreground shadow-2xl shadow-black/30 dark:bg-black/80 dark:border dark:border-white/20 dark:text-white dark:shadow-black/50"
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-card-foreground dark:text-white">
                      {currentUser?.username || "Guest"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground dark:text-white/60">
                      {currentUser?.email || "N/A"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-muted-foreground/20 dark:bg-white/20" />
                <DropdownMenuItem asChild className="hover:bg-transparent">
                  <Link
                    href="/settings"
                    className="flex items-center cursor-pointer"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-muted-foreground/20 dark:bg-white/20" />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center cursor-pointer text-destructive focus:text-destructive hover:bg-transparent"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Unauthenticated User Buttons */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 dark:text-white/80 dark:hover:text-white"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-2 hover:scale-105 hover:animate-glow-pulse">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle - Only show if user is authenticated */}
          {currentUser && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden transition-all duration-300 hover:scale-110 hover:shadow-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle mobile menu</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation - Only show if user is authenticated */}
      {currentUser && (
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-0 bg-background/95 backdrop-blur-xl overflow-hidden shadow-lg shadow-black/20 dark:border dark:border-white/20 dark:bg-black/80 dark:shadow-black/50"
            >
              <div className="flex flex-col p-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:text-foreground transition-all duration-300 hover:scale-105 hover:shadow-lg dark:text-white"
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
      )}
    </header>
  );
}
