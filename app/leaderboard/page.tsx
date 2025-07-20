"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { getLeaderboardData } from "@/app/actions"
import { type User } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Trophy, Medal, Award, TrendingUp, Users, Target, Sparkles, Crown, Star, Zap } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

type TimeFilter = "weekly" | "monthly" | "all-time"

interface LeaderboardEntry {
  user: User
  totalVotes: number
  debateCount: number
  rank: number
}

export default function LeaderboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all-time")
  const [isLoading, setIsLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch leaderboard data effect
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const result = await getLeaderboardData(timeFilter)
        if (result.success) {
          // Transform the data to match our interface
          const transformedData = result.data.map((entry: any, index: number) => ({
            user: {
              id: entry.userId,
              username: entry.username,
              email: entry.email || "",
              totalVotesReceived: entry.totalVotes,
              debatesParticipated: entry.debatesParticipated || 0,
            } as User,
            totalVotes: entry.totalVotes,
            debateCount: entry.debatesParticipated || 0,
            rank: index + 1
          }))
          setLeaderboardData(transformedData)
        } else {
          console.error("Error fetching leaderboard data:", result.error)
          toast({
            title: "Error",
            description: "Failed to load leaderboard data.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load leaderboard data.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboardData()
  }, [timeFilter, toast])

  // Show loading while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't render if not authenticated
  if (status === "unauthenticated") {
    return null
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return <Trophy className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
      case 3:
        return "bg-gradient-to-r from-amber-500 to-amber-700 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto"
          >
            {/* Hero Section Skeleton */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-xl mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-lg mx-auto"></div>
            </div>

            {/* Filter Buttons Skeleton */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="w-24 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              ))}
            </div>

            {/* Leaderboard Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card border-border rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />

      <div className="flex flex-1 justify-center px-4 py-5 lg:px-40 relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-[1200px] flex-col"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
          <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
                <span className="text-sm font-medium text-yellow-500">LEADERBOARD</span>
              </motion.div>
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
            >
              Leaderboard
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Top debaters by total votes received. 
              <span className="text-primary font-medium"> Compete for the crown!</span>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-8 mt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{leaderboardData.length}</div>
                <div className="text-sm text-muted-foreground">Top Debaters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {leaderboardData.reduce((sum, entry) => sum + entry.totalVotes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-500">
                  {leaderboardData.reduce((sum, entry) => sum + entry.debateCount, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Debates</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Time Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex justify-center gap-4 mb-8"
          >
            {(["weekly", "monthly", "all-time"] as TimeFilter[]).map((filter) => (
              <motion.div
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={timeFilter === filter ? "default" : "outline"}
                  onClick={() => setTimeFilter(filter)}
                  className={`${
                    timeFilter === filter
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                      : "border-border/50 hover:border-yellow-500/50 transition-all duration-300"
                  }`}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Button>
              </motion.div>
            ))}
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            {leaderboardData.length > 0 ? (
              leaderboardData.map((entry, index) => (
                <motion.div
                  key={entry.user.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-yellow-500/30 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden relative">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    <CardContent className="p-6 relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Rank */}
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadge(entry.rank)}`}>
                              {getRankIcon(entry.rank)}
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-foreground">#{entry.rank}</div>
                              <div className="text-xs text-muted-foreground">Rank</div>
                            </div>
                          </div>

                          {/* User Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-foreground group-hover:text-yellow-500 transition-colors duration-300">
                                {entry.user.username || "Anonymous"}
                              </h3>
                              {entry.rank <= 3 && (
                                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                                  Top {entry.rank}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="font-medium">{entry.totalVotes} total votes</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-blue-500" />
                                <span className="font-medium">{entry.debateCount} debates</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-purple-500" />
                                <span className="font-medium">
                                  {entry.user.totalVotesReceived} participants
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Achievement Badges */}
                        <div className="flex items-center gap-2">
                          {entry.totalVotes >= 100 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.5 }}
                            >
                              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                                <Star className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            </motion.div>
                          )}
                          {entry.debateCount >= 10 && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.6 }}
                            >
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                <Zap className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
            </motion.div>
              ))
            ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-16"
            >
                <div className="rounded-full bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Trophy className="h-12 w-12 text-muted-foreground" />
              </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">No Leaderboard Data</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  No users have participated in debates yet. Be the first to make your mark!
                </p>
                <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Debating
                </Button>
            </motion.div>
          )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
