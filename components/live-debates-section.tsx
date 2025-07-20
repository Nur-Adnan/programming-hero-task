"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronDown, 
  Clock, 
  Users, 
  MessageSquare, 
  Flame, 
  TrendingUp, 
  Filter,
  Search,
  Zap,
  Eye,
  EyeOff,
  Play,
  Star,
  Timer,
  Award,
  Sparkles,
  ArrowRight,
  Calendar,
  Tag,
  Hash
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getLiveDebates } from "@/app/actions"
import { Debate } from "@/lib/types"

type FilterType = "all" | "technology" | "politics" | "science" | "ethics" | "ending-soon" | "trending"

export function LiveDebatesSection() {
  const [activeDebates, setActiveDebates] = useState<Debate[]>([])
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchLiveDebates = async () => {
      try {
        const result = await getLiveDebates()
        if (result.success) {
          setActiveDebates(result.debates)
          setFilteredDebates(result.debates)
        }
      } catch (error) {
        console.error("Error fetching live debates:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLiveDebates()
  }, [])

  useEffect(() => {
    let filtered = [...activeDebates]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(debate =>
        debate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        debate.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        debate.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "ending-soon") {
        const now = new Date()
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
        filtered = filtered.filter(debate => new Date(debate.endsAt) <= oneHourFromNow)
      } else if (activeFilter === "trending") {
        filtered = filtered.filter(debate => 
          (debate.supportVotes + debate.opposeVotes) > 50
        )
      } else {
        filtered = filtered.filter(debate => 
          debate.category.toLowerCase() === activeFilter
        )
      }
    }

    setFilteredDebates(filtered)
  }, [activeDebates, activeFilter, searchQuery])

  const formatTimeRemaining = (endsAt: Date) => {
    const now = new Date()
    const diff = endsAt.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 24) {
      const days = Math.floor(hours / 24)
      return `${days} day${days > 1 ? "s" : ""} remaining`
    }

    return `${hours}h ${minutes}m remaining`
  }

  const getTimeRemainingColor = (endsAt: Date) => {
    const now = new Date()
    const diff = endsAt.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (diff <= 0) return "text-red-600 dark:text-red-500"
    if (hours < 1) return "text-red-500 dark:text-red-400 animate-pulse"
    if (hours < 6) return "text-orange-500 dark:text-orange-400"
    return "text-green-600 dark:text-green-400"
  }

  // Check if debate has actually ended based on time
  const isDebateActuallyEnded = (debate: any) => {
    const now = new Date()
    const endsAt = new Date(debate.endsAt)
    return endsAt.getTime() <= now.getTime()
  }

  const filters = [
    { id: "all", label: "All Debates", icon: MessageSquare },
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "ending-soon", label: "Ending Soon", icon: Timer },
    { id: "technology", label: "Technology", icon: Zap },
    { id: "politics", label: "Politics", icon: Hash },
    { id: "science", label: "Science", icon: Star },
    { id: "ethics", label: "Ethics", icon: Award }
  ]

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50 dark:from-[#080917] dark:to-[#0f0f23]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex items-center justify-center gap-3 mb-6"
              >
                <Flame className="h-8 w-8 text-red-500 animate-pulse" />
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">Live Debates</h2>
                <Flame className="h-8 w-8 text-red-500 animate-pulse" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto"
              >
                Join the conversation and engage in real-time debates on a variety of topics.
              </motion.p>
            </div>

            {/* Loading Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-900/50 rounded-xl p-6 animate-pulse"
                >
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-700 rounded w-16"></div>
                      <div className="h-6 bg-gray-700 rounded w-20"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50 dark:from-[#080917] dark:to-[#0f0f23]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Flame className="h-8 w-8 text-red-500 animate-pulse" />
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white">Live Debates</h2>
              <Flame className="h-8 w-8 text-red-500 animate-pulse" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Join the conversation and engage in real-time debates on a variety of topics.
            </motion.p>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search debates by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 dark:bg-gray-900/50 border border-slate-300 dark:border-gray-700 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              {filters.map((filter) => {
                const Icon = filter.icon
                const isActive = activeFilter === filter.id
                return (
                  <motion.button
                    key={filter.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(filter.id as FilterType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-white/80 dark:bg-gray-900/50 text-slate-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800/50 border border-slate-300 dark:border-gray-700"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {filter.label}
                    {isActive && <Sparkles className="h-3 w-3 animate-pulse" />}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>

          {/* Debates Grid */}
          <AnimatePresence mode="wait">
            {filteredDebates.length > 0 ? (
              <motion.div
                key={`debates-${activeFilter}-${searchQuery}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                                 {filteredDebates.map((debate, index) => (
                   <motion.div
                     key={debate.id}
                     initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: -5 }}
                     animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                     transition={{ 
                       duration: 0.6, 
                       delay: index * 0.15,
                       ease: [0.25, 0.46, 0.45, 0.94]
                     }}
                     whileHover={{ 
                       y: -8, 
                       scale: 1.03,
                       rotateY: 2,
                       transition: { duration: 0.3, ease: "easeOut" }
                     }}
                     className="group relative bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl p-6 border border-slate-300/50 dark:border-gray-700/50 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm"
                   >
                    {/* Live Indicator */}
                    {debate.status === "live" && !isDebateActuallyEnded(debate) && (
                      <div className="absolute -top-3 -right-3 flex items-center gap-2 z-10">
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-red-400/50">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg border border-red-400/50">
                          LIVE
                        </div>
                      </div>
                    )}

                                         {/* Tags */}
                     <div className="flex flex-wrap gap-2 mb-4">
                       {debate.tags.slice(0, 3).map((tag, tagIndex) => (
                         <motion.div
                           key={tag}
                           initial={{ opacity: 0, scale: 0.8, x: -10 }}
                           animate={{ opacity: 1, scale: 1, x: 0 }}
                           transition={{ 
                             duration: 0.4, 
                             delay: (index * 0.15) + (tagIndex * 0.1) + 0.3,
                             ease: "easeOut"
                           }}
                         >
                           <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30 text-xs hover:scale-105 transition-transform duration-200">
                             {tag}
                           </Badge>
                         </motion.div>
                       ))}
                     </div>

                                         {/* Title */}
                     <motion.h3 
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ 
                         duration: 0.5, 
                         delay: (index * 0.15) + 0.4,
                         ease: "easeOut"
                       }}
                       className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300"
                     >
                       {debate.title}
                     </motion.h3>

                                         {/* Description */}
                     <motion.p 
                       initial={{ opacity: 0, y: 15 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ 
                         duration: 0.5, 
                         delay: (index * 0.15) + 0.5,
                         ease: "easeOut"
                       }}
                       className="text-sm text-slate-600 dark:text-gray-300 mb-4 line-clamp-3"
                     >
                       {debate.description}
                     </motion.p>

                                         {/* Stats */}
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ 
                         duration: 0.4, 
                         delay: (index * 0.15) + 0.6,
                         ease: "easeOut"
                       }}
                       className="flex items-center justify-between mb-4 text-xs text-slate-500 dark:text-gray-400"
                     >
                       <div className="flex items-center gap-1">
                         <Clock className="h-3 w-3" />
                         <span className={getTimeRemainingColor(debate.endsAt)}>
                           {formatTimeRemaining(debate.endsAt)}
                         </span>
                       </div>
                       <div className="flex items-center gap-1">
                         <Users className="h-3 w-3" />
                         <span>{debate.supportVotes + debate.opposeVotes} participants</span>
                       </div>
                     </motion.div>

                                         {/* Category */}
                     <motion.div 
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ 
                         duration: 0.4, 
                         delay: (index * 0.15) + 0.7,
                         ease: "easeOut"
                       }}
                       className="flex items-center gap-2 mb-4"
                     >
                       <Tag className="h-3 w-3 text-slate-500 dark:text-gray-400" />
                       <span className="text-xs text-slate-500 dark:text-gray-400">{debate.category}</span>
                     </motion.div>

                                         {/* Action Buttons */}
                     <motion.div 
                       initial={{ opacity: 0, y: 15 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ 
                         duration: 0.5, 
                         delay: (index * 0.15) + 0.8,
                         ease: "easeOut"
                       }}
                       className="flex gap-3 items-stretch w-full"
                     >
                       <Link href={`/debate/${debate.id}`} className={debate.status === "live" && !isDebateActuallyEnded(debate) ? "w-2/3" : "w-full"}>
                         <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           className="w-full h-[40px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-light transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center"
                         >
                           <Play className="h-4 w-4 mr-2" />
                           Join Debate
                         </motion.button>
                       </Link>
                       {debate.status === "live" && !isDebateActuallyEnded(debate) && (
                         <Link href={`/debate/${debate.id}/live`} className="w-1/3">
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             className="group relative flex items-center justify-center bg-gradient-to-br from-slate-200/80 to-slate-300/80 dark:from-gray-800/50 dark:to-gray-700/50 hover:from-slate-300/80 hover:to-slate-400/80 dark:hover:from-gray-700/50 dark:hover:to-gray-600/50 text-slate-600 hover:text-slate-800 dark:text-gray-300 dark:hover:text-white px-4 py-2 rounded-lg border border-slate-400 hover:border-slate-500 dark:border-gray-600 dark:hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 animate-eye-glow h-[40px] w-full"
                           >
                                                      <motion.div
                               whileHover={{ scale: 1.1 }}
                               whileTap={{ scale: 0.9 }}
                               className="relative w-4 h-4"
                             >
                               <Eye className="absolute inset-0 h-4 w-4 transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110" />
                             </motion.div>
                           </motion.button>
                         </Link>
                       )}
                     </motion.div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-full bg-slate-200/50 dark:bg-gray-800/50 p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                >
                  <MessageSquare className="h-10 w-10 text-slate-500 dark:text-gray-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white">No Debates Found</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {searchQuery || activeFilter !== "all" 
                    ? "Try adjusting your search or filters to find more debates."
                    : "There are no active debates at the moment. Be the first to start one!"
                  }
                </p>
                <Link href="/create-debate">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <Zap className="h-4 w-4 mr-2 inline" />
                    Create Debate
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* View All Button */}
          {filteredDebates.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mt-12"
            >
              <Link href="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border border-blue-500/50 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:border-blue-400"
                >
                  View All Debates
                  <ArrowRight className="h-4 w-4 ml-2 inline" />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
