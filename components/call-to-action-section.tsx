"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MessageSquarePlus, ArrowRight, Sparkles, Users, Zap, Target } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CallToActionSection() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Base Background with Smooth Transition to Footer */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-blue-50 via-indigo-50 to-background dark:from-black dark:via-slate-900 dark:via-blue-950 dark:via-indigo-950"></div>
      
      {/* Gradient Overlay for Better Blending */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/50 dark:via-transparent dark:to-purple-950/50"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-50/30 via-transparent to-slate-50/30 dark:from-indigo-950/30 dark:via-transparent dark:to-slate-900/30"></div>
      
      {/* Bottom Transition Layer - Smooth Blend to Footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:40px_40px] opacity-25"></div>
      
      {/* Radial Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"></div>
      
      {/* Additional Texture Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15)_0%,transparent_40%),radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.15)_0%,transparent_40%)] opacity-30"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.3, 1, 1.3],
          }}
          transition={{ 
            duration: 35, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            y: [0, -40, 0],
            x: [0, 30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl"
        />
        
        {/* Additional Glowing Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/3 w-24 h-24 bg-blue-400/30 rounded-full blur-xl"
        />
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-purple-400/30 rounded-full blur-xl"
        />
        
        {/* Floating Icons */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4"
        >
          <div className="w-16 h-16 bg-blue-500/15 dark:bg-blue-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-1/4 right-1/3"
        >
          <div className="w-12 h-12 bg-purple-500/15 dark:bg-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Target className="h-6 w-6 text-purple-600 dark:text-purple-300" />
          </div>
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/3"
        >
          <div className="w-14 h-14 bg-indigo-500/15 dark:bg-indigo-500/30 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Zap className="h-7 w-7 text-indigo-600 dark:text-indigo-300" />
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Sparkles Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight"
            >
              Ready to Join the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Debate?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
            >
              Sign up today and start sharing your insights, challenging perspectives, and engaging in meaningful
              discussions.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <Link href="/signup">
                    <MessageSquarePlus className="h-5 w-5 mr-2" />
                    Sign Up Now
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild
                  variant="outline"
                  size="lg" 
                  className="border-slate-300 dark:border-white/30 text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300"
                >
                  <Link href="/explore">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    Explore Debates
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="pt-12"
            >
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">JOINED BY THOUSANDS OF DEBATE ENTHUSIASTS</p>
              <div className="flex items-center justify-center gap-8 opacity-60">
                <div className="text-slate-500 dark:text-slate-400 font-semibold">Students</div>
                <div className="text-slate-500 dark:text-slate-400 font-semibold">Professionals</div>
                <div className="text-slate-500 dark:text-slate-400 font-semibold">Educators</div>
                <div className="text-slate-500 dark:text-slate-400 font-semibold">Researchers</div>
                <div className="text-slate-500 dark:text-slate-400 font-semibold">Analysts</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
