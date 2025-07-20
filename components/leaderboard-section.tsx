"use client"

import { motion } from "framer-motion"
import { Trophy, MessageSquare, Crown, Star, TrendingUp, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getLeaderboardData } from "@/app/actions"

interface LeaderboardUser {
  userId: string
  username: string
  totalVotes: number
  debatesParticipated: number
  avatar?: string
}

export function LeaderboardSection() {
  const [topDebaters, setTopDebaters] = useState<LeaderboardUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true)
      const result = await getLeaderboardData("all-time")
      if (result.success) {
        // Sort by total votes and then by debates participated
        const sortedData = result.data
          .sort((a, b) => {
            if (b.totalVotes !== a.totalVotes) {
              return b.totalVotes - a.totalVotes
            }
            return b.debatesParticipated - a.debatesParticipated
          })
          .slice(0, 5) // Show top 5
        setTopDebaters(sortedData)
      }
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaderboardData()
  }, [])

  // Refresh data every 10 seconds to get updated usernames
  useEffect(() => {
    const interval = setInterval(() => {
      fetchLeaderboardData()
    }, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              rotate: -360,
              scale: [1.2, 1, 1.2],
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-3 mb-6"
            >
              <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Top Debaters
              </h2>
              <Star className="h-8 w-8 text-yellow-400 animate-pulse" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover the most influential voices in our community. These debaters have earned the highest votes and participated in the most engaging discussions.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="animate-pulse"
              >
                <Card className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 border border-slate-300/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm relative overflow-visible">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4 pt-8">
                    <div className="absolute -left-6 -top-6 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30 flex items-center justify-center text-2xl font-bold text-white z-10">{index + 1}</div>
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="h-6 bg-slate-300 dark:bg-gray-600 rounded w-24"></div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="h-4 bg-slate-300 dark:bg-gray-600 rounded w-32"></div>
                    <div className="h-4 bg-slate-300 dark:bg-gray-600 rounded w-40"></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (topDebaters.length === 0) {
    return (
          <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Crown className="h-8 w-8 text-yellow-500 dark:text-yellow-400 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Top Debaters
            </h2>
            <Star className="h-8 w-8 text-yellow-500 dark:text-yellow-400 animate-pulse" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            No leaderboard data available yet. Start participating in debates to see the top debaters!
            </motion.p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            scale: [1.2, 1, 1.2],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <Crown className="h-8 w-8 text-yellow-500 dark:text-yellow-400 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
              Top Debaters
            </h2>
            <Star className="h-8 w-8 text-yellow-500 dark:text-yellow-400 animate-pulse" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Discover the most influential voices in our community. These debaters have earned the highest votes and participated in the most engaging discussions.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {topDebaters.map((debater, index) => (
            <motion.div
              key={debater.userId}
              initial={{ opacity: 0, y: 60, scale: 0.9, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <Card className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 border border-slate-300/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm hover:shadow-blue-500/20 hover:border-blue-500/50 transition-all duration-500 relative overflow-visible">
                <CardHeader className="flex flex-row items-center gap-4 pb-4 pt-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className={`absolute -left-6 -top-6 w-16 h-16 rounded-full bg-gradient-to-br ${
                      index === 0 ? 'from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30' : 
                      index === 1 ? 'from-gray-300 to-gray-400 shadow-lg shadow-gray-400/30' : 
                      index === 2 ? 'from-amber-600 to-yellow-500 shadow-lg shadow-amber-500/30' : 
                      'from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30'
                    } flex items-center justify-center text-2xl font-bold text-white z-10`}
                  >
                    {index + 1}
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Avatar className="h-12 w-12 ring-2 ring-blue-500/30">
                      <AvatarImage 
                        src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${debater.username}`} 
                        alt={debater.username} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg">
                        {debater.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  >
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{debater.username}</CardTitle>
                  </motion.div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.6 }}
                    className="flex items-center gap-3 text-slate-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors duration-300"
                  >
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="font-medium">{debater.totalVotes} Total Votes</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
                    className="flex items-center gap-3 text-slate-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
                  >
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span className="font-medium">{debater.debatesParticipated} Debates Participated</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mt-16 flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={fetchLeaderboardData}
              disabled={isLoading}
              size="lg" 
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-6 py-3 text-lg font-semibold shadow-xl transition-all duration-300"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Refreshing..." : "Refresh"}
            </Button>
          </motion.div>
          <Link href="/leaderboard">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                View Full Leaderboard
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
