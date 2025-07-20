"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { getPopularTags } from "@/app/actions"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tag as TagIcon, TrendingUp, Sparkles, Flame, Target, Hash, Search, Filter, ArrowRight, Users, MessageSquare } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface TagData {
  name: string
  count: number
}

export default function TagsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [tags, setTags] = useState<TagData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"count" | "name">("count")

  // Redirect to login if not authenticated
  useEffect(() => {
    if (session?.user) {
      // User is authenticated, proceed with fetching tags
    } else {
      // User is not authenticated, redirect to login
      router.push("/login")
    }
  }, [session, router])

  // Fetch tags effect
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const result = await getPopularTags()
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
          return
        }

        // Transform the data to match our interface
        const transformedData = result.tags.map((tag: any) => ({
          name: tag.name || tag.tag || "Unknown",
          count: tag.count || 0,
        }))
        setTags(transformedData)
      } catch (error) {
        console.error("Error fetching tags:", error)
        toast({
          title: "Error",
          description: "Failed to fetch popular tags",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [toast])

  // Filter and sort tags
  const filteredAndSortedTags = tags
    .filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "count") {
        return b.count - a.count
      } else {
        return a.name.localeCompare(b.name)
      }
    })

  // Show loading while checking authentication
  if (session?.user === undefined) { // Check for undefined status
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <LoadingSpinner />
      </div>
    )
  }

  // Don't render if not authenticated
  if (session?.user === null) { // Check for null status
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Hero Section Skeleton */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
              </div>
              
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-xl mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse max-w-lg mx-auto"></div>
            </div>

            {/* Search and Filter Skeleton */}
            <div className="mb-8">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
              <div className="flex flex-wrap gap-3 justify-center">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Tags Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-card border-border rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-28"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
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
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <TagIcon className="h-8 w-8 text-white" />
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-5 w-5 text-green-500 animate-pulse" />
                <span className="text-sm font-medium text-green-500">POPULAR TAGS</span>
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
            >
              Popular Tags
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Explore debates by tag. 
              <span className="text-primary font-medium"> Discover trending topics and join the conversation!</span>
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center gap-8 mt-8"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{tags.length}</div>
                <div className="text-sm text-muted-foreground">Total Tags</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {tags.reduce((sum, tag) => sum + tag.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Debates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {tags.reduce((sum, tag) => sum + tag.count, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Usage</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/50 rounded-lg focus:border-primary/50 focus:outline-none transition-all duration-300 backdrop-blur-sm"
              />
            </div>

            {/* Sort Button */}
            <Button
              variant="outline"
              onClick={() => setSortBy(sortBy === "count" ? "name" : "count")}
              className="border-border/50 hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Sort by {sortBy === "count" ? "Popularity" : "Name"}
            </Button>
          </motion.div>

          {/* Tags Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedTags.length > 0 ? (
              filteredAndSortedTags.map((tagData, index) => (
                  <motion.div
                  key={tagData.name}
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
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50 hover:border-green-500/30 transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden relative h-full">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Animated Border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                    
                    <CardContent className="p-6 relative z-10 h-full flex flex-col">
                      {/* Tag Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Hash className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-green-500 transition-colors duration-300">
                              {tagData.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {tagData.count} debate{tagData.count !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {/* Popularity Badge */}
                        {tagData.count >= 5 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
                          >
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                      </Badge>
                          </motion.div>
                        )}
                      </div>

                      {/* Tag Stats */}
                      <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{tagData.count} debates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">
                            {tagData.count * 2} participants
                          </span>
                        </div>
                      </div>



                      {/* Action Button */}
                      <div className="mt-auto">
                        <Link href={`/explore?tag=${tagData.name}`}>
                          <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                            <Sparkles className="h-4 w-4 mr-2" />
                            Explore Debates
                            <motion.div
                              initial={{ x: 0 }}
                              whileHover={{ x: 4 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </motion.div>
                          </Button>
                    </Link>
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
                className="col-span-full text-center py-16"
              >
                <div className="rounded-full bg-gradient-to-br from-green-500/10 to-blue-500/10 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <TagIcon className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">No Tags Found</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {searchQuery ? `No tags match "${searchQuery}".` : "No tags available yet. Be the first to create a debate with tags!"}
                </p>
                {searchQuery && (
                  <Button 
                    onClick={() => setSearchQuery("")}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Clear Search
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
