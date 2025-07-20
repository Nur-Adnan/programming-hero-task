"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { DebateSearch } from "@/components/debate-search"
import { Clock, Users, MessageSquare, ThumbsUp, ThumbsDown, Share2, Search, Sparkles, TrendingUp, Flame } from "lucide-react"
import { toast } from "sonner"
import { getAllDebates, updateEndedDebates } from "@/app/actions"
import { Debate } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ExplorePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [debates, setDebates] = useState<Debate[]>([])
  const [filteredDebates, setFilteredDebates] = useState<Debate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    category: "",
    tags: [] as string[],
    sortBy: "newest" as "newest" | "oldest" | "most-voted" | "ending-soon",
    status: "all" as "all" | "live" | "ended"
  })

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch debates effect
  useEffect(() => {
    const fetchDebates = async () => {
      try {
        // First, update any ended debates
        await updateEndedDebates()
        
        const result = await getAllDebates()
        if (result.success) {
          setDebates(result.debates)
          setFilteredDebates(result.debates)
        }
      } catch (error) {
        console.error("Error fetching debates:", error)
        toast.error("Failed to load debates")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDebates()
  }, [])

  // Filter debates effect
  useEffect(() => {
    // Filter debates based on search criteria
    let filtered = [...debates]

    // Filter by search term
    if (searchFilters.search) {
      const searchTerm = searchFilters.search.toLowerCase()
      filtered = filtered.filter(debate =>
        debate.title.toLowerCase().includes(searchTerm) ||
        debate.description.toLowerCase().includes(searchTerm) ||
        debate.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Filter by category
    if (searchFilters.category && searchFilters.category !== "all") {
      filtered = filtered.filter(debate => debate.category === searchFilters.category)
    }

    // Filter by tags
    if (searchFilters.tags.length > 0) {
      filtered = filtered.filter(debate =>
        searchFilters.tags.some(tag => debate.tags.includes(tag))
      )
    }

    // Filter by status
    if (searchFilters.status !== "all") {
      filtered = filtered.filter(debate => debate.status === searchFilters.status)
    }

    // Sort debates
    switch (searchFilters.sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "most-voted":
        filtered.sort((a, b) => (b.supportVotes + b.opposeVotes) - (a.supportVotes + a.opposeVotes))
        break
      case "ending-soon":
        filtered.sort((a, b) => new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime())
        break
    }

    setFilteredDebates(filtered)
  }, [debates, searchFilters])

  const handleFiltersChange = (newFilters: any) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }))
  }

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

  // Check if debate has actually ended based on time
  const isDebateActuallyEnded = (debate: any) => {
    const now = new Date()
    const endsAt = new Date(debate.endsAt)
    return endsAt.getTime() <= now.getTime()
  }

  const handleShare = async (debateId: string) => {
    const publicUrl = `${window.location.origin}/debate/${debateId}/public`
    if (navigator.share) {
      try {
        await navigator.share({
          title: "ArenaX Debate",
          text: `Check out this debate on ArenaX: ${publicUrl}`,
          url: publicUrl,
        })
        toast.success("Debate shared successfully!")
      } catch (error) {
        console.error("Error sharing:", error)
        toast.error("Failed to share debate.")
      }
    } else {
      navigator.clipboard.writeText(publicUrl)
      toast.success("Public debate URL copied to clipboard!")
    }
  }

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex flex-1 justify-center px-4 py-5 lg:px-40">
          <div className="flex w-full max-w-[1200px] flex-col">
            {/* Hero Section Skeleton */}
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-2xl mx-auto"></div>
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-md mx-auto"></div>
              </div>
              
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-xl mx-auto mt-8"></div>
              
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                </div>
              </div>
            </div>

            {/* Search Section Skeleton */}
            <div className="mb-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            </div>

            {/* Debates Grid Skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card border-border rounded-lg p-8">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        </div>
                        
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
                        
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                          <div className="w-14 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
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
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="text-sm font-medium text-orange-500">LIVE DEBATES</span>
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
            >
              Explore Debates
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Discover and join active discussions, or browse through past debates. 
              <span className="text-primary font-medium"> Find your next intellectual challenge.</span>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-8 mt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{filteredDebates.length}</div>
                <div className="text-sm text-muted-foreground">Total Debates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{filteredDebates.filter(d => d.status === "live").length}</div>
                <div className="text-sm text-muted-foreground">Active Now</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {filteredDebates.reduce((sum, d) => sum + d.supportVotes + d.opposeVotes, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Votes</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-8"
          >
            <DebateSearch onFiltersChange={handleFiltersChange} />
            
            {/* Search Results Counter */}
            {filteredDebates.length !== debates.length && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="mt-4 text-sm text-muted-foreground"
              >
                Showing {filteredDebates.length} of {debates.length} debates
              </motion.div>
            )}
          </motion.div>

          {/* Debates Grid */}
          <div className="space-y-6">
            {filteredDebates.length > 0 ? (
              filteredDebates.map((debate, index) => (
                <motion.div
                  key={debate.id}
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
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden relative">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    <CardContent className="p-8 relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex-1">
                          {/* Header with Badges */}
                          <div className="flex items-center gap-3 mb-4">
                            <Badge variant="secondary" className="text-xs font-medium bg-blue-500/10 text-blue-600 border-blue-500/20">
                              {debate.category}
                            </Badge>
                            <Badge 
                              variant={debate.status === "live" && !isDebateActuallyEnded(debate) ? "default" : "secondary"} 
                              className={`text-xs font-medium ${
                                debate.status === "live" && !isDebateActuallyEnded(debate)
                                  ? "bg-green-500/10 text-green-600 border-green-500/20 animate-pulse" 
                                  : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                              }`}
                            >
                              {debate.status === "live" && !isDebateActuallyEnded(debate) && <Flame className="h-3 w-3 mr-1" />}
                              {isDebateActuallyEnded(debate) ? "ended" : debate.status}
                            </Badge>
                            {debate.status === "live" && !isDebateActuallyEnded(debate) && (
                              <div className="flex items-center gap-1 text-green-500 text-xs">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                LIVE
                              </div>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                            {debate.title}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                            {debate.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6">
                            {debate.tags.slice(0, 4).map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant="outline" 
                                className="text-xs bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-200"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {debate.tags.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{debate.tags.length - 4} more
                              </Badge>
                            )}
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="font-medium">{formatTimeRemaining(debate.endsAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-500" />
                              <span className="font-medium">{debate.supportVotes + debate.opposeVotes} participants</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-purple-500" />
                              <span className="font-medium">{debate.supportVotes + debate.opposeVotes} votes</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-border/50 md:border-l md:border-t-0 md:pl-6">
                          <Link href={`/debate/${debate.id}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                              {debate.status === "live" && !isDebateActuallyEnded(debate) ? "Join Debate" : "View Debate"}
                              <motion.div
                                initial={{ x: 0 }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Sparkles className="h-4 w-4 ml-2" />
                              </motion.div>
                            </Button>
                          </Link>
                          {debate.status === "live" && !isDebateActuallyEnded(debate) && (
                            <Link href={`/debate/${debate.id}/live`}>
                              <Button
                                variant="outline"
                                className="w-full border-border/50 hover:border-primary/50 transition-all duration-300"
                              >
                                View Live
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                            onClick={() => handleShare(debate.id)}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
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
                <div className="rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">No Debates Found</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  No debates match your current filters. Try adjusting your search criteria or create a new debate!
                </p>
                <Link href="/create-debate">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create New Debate
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
