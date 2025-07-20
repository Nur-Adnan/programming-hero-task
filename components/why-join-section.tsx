"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Feature {
  id: number
  title: string
  description: string
  icon: string
}

const features: Feature[] = [
  {
    id: 1,
    title: "Community-Driven",
    description: "Connect with like-minded individuals who share your passion for meaningful discussions.",
    icon: "👥"
  },
  {
    id: 2,
    title: "Competitive Spirit",
    description: "Participate in debates, earn recognition, and climb the leaderboard.",
    icon: "🏆"
  },
  {
    id: 3,
    title: "Safe Environment",
    description: "Moderated discussions ensure respectful and constructive conversations.",
    icon: "🛡️"
  },
  {
    id: 4,
    title: "Real-Time Engagement",
    description: "Experience live debates with instant feedback and dynamic interactions.",
    icon: "⚡"
  },
  {
    id: 5,
    title: "Personal Growth",
    description: "Develop critical thinking skills and expand your knowledge base.",
    icon: "🌱"
  },
  {
    id: 6,
    title: "Quality Content",
    description: "Access well-structured debates on diverse and relevant topics.",
    icon: "✨"
  }
]

export function WhyJoinSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const goToNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % features.length)
  }

  const goToPrevious = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Features
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white leading-tight"
            >
              Why Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ArenaX?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              More than just a platform, ArenaX is a community dedicated to fostering intellectual growth and
              meaningful discourse. Join thousands of users who are already part of this vibrant ecosystem.
            </motion.p>

            {/* Navigation Arrows */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex gap-4 mt-8"
            >
              <Button
                onClick={goToPrevious}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={goToNext}
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - Features Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Background Cards */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4 opacity-20">
                {features.slice(0, 3).map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 rounded-full"
                  />
                ))}
              </div>
            </div>

            {/* Main Feature Card */}
            <div className="relative z-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Card className="bg-white dark:bg-slate-800 shadow-xl border-0 overflow-hidden">
                    <CardContent className="p-8">
                      {/* Feature Icon */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-6"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-3xl">
                          {features[currentIndex].icon}
                        </div>
                      </motion.div>

                      {/* Feature Content */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-8"
                      >
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                          {features[currentIndex].title}
                        </h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                          {features[currentIndex].description}
                        </p>
                      </motion.div>

                      {/* Learn More Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer group"
                      >
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex justify-center gap-2 mt-8"
            >
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 scale-125"
                      : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                  }`}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Join Our Community Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Join Our Community
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
