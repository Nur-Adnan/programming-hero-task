"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, HelpCircle, Sparkles, MessageSquare, Users, Shield, Zap, Trophy, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface FAQ {
  id: number
  question: string
  answer: string
  icon: any
  category: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I join a debate?",
    answer: "Browse available debates on the Explore page, click on one that interests you, and select either 'Support' or 'Oppose' to join the discussion. You can also filter debates by category, popularity, or time remaining.",
    icon: MessageSquare,
    category: "Getting Started"
  },
  {
    id: 2,
    question: "Can I create my own debate?",
    answer: "Yes! Click 'Create Debate' to start a new discussion. Choose a compelling topic, set the duration, add relevant tags, and invite others to participate. Your debate will appear in the live debates section.",
    icon: Sparkles,
    category: "Creating Content"
  },
  {
    id: 3,
    question: "What is the reply timer?",
    answer: "After joining a debate, you have a limited time to post your first argument. This encourages active participation and keeps discussions dynamic. The timer varies based on debate duration and complexity.",
    icon: Zap,
    category: "Participation"
  },
  {
    id: 4,
    question: "How does voting work?",
    answer: "You can upvote or downvote arguments posted by other users. The most compelling arguments receive more votes and influence the debate outcome. Your voting history contributes to your reputation score.",
    icon: Trophy,
    category: "Voting System"
  },
  {
    id: 5,
    question: "Can I share debates with others?",
    answer: "Yes! Every debate has a public URL that you can share with anyone, even those not logged into ArenaX. Share on social media, email, or messaging platforms to bring more participants to the discussion.",
    icon: Users,
    category: "Sharing"
  },
  {
    id: 6,
    question: "How is content moderated?",
    answer: "We use automated filtering and human moderation to ensure respectful discussions. Toxic or inappropriate content is automatically flagged and removed. Our community guidelines promote constructive dialogue.",
    icon: Shield,
    category: "Safety"
  },
  {
    id: 7,
    question: "How do I climb the leaderboard?",
    answer: "Earn points by participating in debates, receiving upvotes on your arguments, and winning debates. The more compelling and well-reasoned your arguments, the higher you'll rank on the leaderboard.",
    icon: Star,
    category: "Competition"
  },
  {
    id: 8,
    question: "What makes a good debate topic?",
    answer: "Choose topics that are relevant, debatable, and interesting to a broad audience. Avoid overly personal or inflammatory subjects. Good topics have clear opposing viewpoints and room for nuanced discussion.",
    icon: HelpCircle,
    category: "Best Practices"
  }
]

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))]
  const filteredFaqs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Base Background with Proper Blending */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-slate-900 dark:via-blue-950 dark:to-indigo-950"></div>
      
      {/* Gradient Overlay for Better Blending */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/50 dark:via-transparent dark:to-purple-950/50"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-indigo-50/30 via-transparent to-slate-50/30 dark:from-indigo-950/30 dark:via-transparent dark:to-slate-900/30"></div>
      
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
          className="absolute top-20 left-20 w-40 h-40 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl"
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
          className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl"
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
          className="absolute top-1/3 right-1/4 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl"
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
          className="absolute top-1/4 left-1/3 w-24 h-24 bg-blue-400/15 dark:bg-blue-400/30 rounded-full blur-xl"
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
          className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-purple-400/15 dark:bg-purple-400/30 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >

          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Frequently Asked{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Questions
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Find answers to common questions about using ArenaX. Everything you need to know about participating in debates, creating content, and building your reputation.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
            >
              <Button
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Grid - Two Columns */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredFaqs.map((faq, index) => {
              const isLeftColumn = index % 2 === 0
              const gradientClass = isLeftColumn 
                ? "hover:from-blue-500 hover:to-cyan-500 group-hover:from-blue-500 group-hover:to-cyan-500" 
                : "hover:from-purple-500 hover:to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500"
              const iconGradientClass = isLeftColumn 
                ? "from-blue-500 to-cyan-500" 
                : "from-purple-500 to-pink-500"
              const textHoverClass = isLeftColumn 
                ? "group-hover:text-blue-600 dark:group-hover:text-blue-400" 
                : "group-hover:text-purple-600 dark:group-hover:text-purple-400"
              const chevronHoverClass = isLeftColumn 
                ? "group-hover:text-blue-500" 
                : "group-hover:text-purple-500"
              
              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9, rotateX: 15 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    rotateY: 2,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`bg-white/90 dark:bg-slate-800/10 backdrop-blur-xl border border-slate-200/50 dark:border-transparent shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group relative ${gradientClass}`}>
                    {/* Gradient Border */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${isLeftColumn ? 'from-blue-500/20 to-cyan-500/20' : 'from-purple-500/20 to-pink-500/20'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    <div className="absolute inset-[1px] rounded-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl"></div>
                    <CardContent className="p-0 relative z-10">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-100/50 dark:hover:bg-slate-700/20 transition-colors duration-300 rounded-lg"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                            className="flex-shrink-0"
                          >
                            <div className={`w-12 h-12 bg-gradient-to-br ${iconGradientClass} rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <faq.icon className="h-6 w-6" />
                            </div>
                          </motion.div>
                          
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold text-slate-900 dark:text-white mb-1 transition-colors duration-300 ${textHoverClass}`}>
                  {faq.question}
                            </h3>
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded-full">
                              {faq.category}
                            </span>
                          </div>
                        </div>
                        
                        <motion.div
                          animate={{ rotate: activeIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0 ml-4"
                        >
                          <ChevronDown className={`h-5 w-5 text-slate-500 dark:text-slate-400 transition-colors duration-300 ${chevronHoverClass}`} />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {activeIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6">
                              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
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
              <MessageSquare className="h-5 w-5 mr-2" />
              Still Have Questions?
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
