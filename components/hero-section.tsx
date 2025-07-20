"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background text-foreground">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                <Zap className="mr-2 h-4 w-4" />
                Join the Conversation
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              >
                Community Debate Arena
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-[600px] text-muted-foreground md:text-xl"
              >
                Engage in meaningful discussions, take a stance, and vote on compelling arguments. 
                Join our community of thoughtful debaters and make your voice heard.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-2 min-[400px]:flex-row"
            >
              <Link href="/explore">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Explore Debates
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/create-debate">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                  Create Debate
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-lg">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Live Debates</h3>
                  <p className="text-muted-foreground text-sm">
                    Join active discussions happening right now. Take a stance and contribute your perspective.
                  </p>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-primary">24</div>
                      <div className="text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">156</div>
                      <div className="text-muted-foreground">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-primary">89</div>
                      <div className="text-muted-foreground">Arguments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
