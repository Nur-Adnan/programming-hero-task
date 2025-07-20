"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, SlidersHorizontal } from "lucide-react"

const categories = [
  "all",
  "Politics",
  "Technology",
  "Science",
  "Environment",
  "Education",
  "Health",
  "Economy",
  "Philosophy",
  "Sports",
  "Culture",
  "Other",
]

const availableTags = [
  "work",
  "technology",
  "productivity",
  "remote",
  "collaboration",
  "politics",
  "environment",
  "healthcare",
  "education",
  "economics",
  "science",
  "philosophy",
  "culture",
  "sports",
  "entertainment",
]

interface DebateSearchProps {
  onFiltersChange?: (filters: any) => void
  showAdvanced?: boolean
}

export function DebateSearch({ onFiltersChange, showAdvanced = true }: DebateSearchProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [searchFilters, setSearchFilters] = useState({
    search: "",
    category: "all",
    tags: [] as string[],
    sortBy: "newest" as "newest" | "oldest" | "most-voted" | "ending-soon",
    status: "all" as "all" | "live" | "ended"
  })

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      const newFilters = { ...searchFilters, search: searchInput }
      setSearchFilters(newFilters)
      onFiltersChange?.(newFilters)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchInput, onFiltersChange])

  const handleCategoryChange = (category: string) => {
    const newFilters = { ...searchFilters, category }
    setSearchFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleSortChange = (sortBy: "newest" | "oldest" | "most-voted" | "ending-soon") => {
    const newFilters = { ...searchFilters, sortBy }
    setSearchFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const handleStatusChange = (status: "all" | "live" | "ended") => {
    const newFilters = { ...searchFilters, status }
    setSearchFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const addTag = (tag: string) => {
    if (!searchFilters.tags.includes(tag)) {
      const newFilters = { ...searchFilters, tags: [...searchFilters.tags, tag] }
      setSearchFilters(newFilters)
      onFiltersChange?.(newFilters)
    }
  }

  const removeTag = (tag: string) => {
    const newFilters = { ...searchFilters, tags: searchFilters.tags.filter((t) => t !== tag) }
    setSearchFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearAllFilters = () => {
    setSearchInput("")
    const newFilters = {
      search: "",
      category: "all" as const,
      tags: [] as string[],
      sortBy: "newest" as const,
      status: "all" as const,
    }
    setSearchFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const hasActiveFilters =
    searchFilters.search ||
    searchFilters.category !== "all" ||
    searchFilters.tags.length > 0 ||
    searchFilters.status !== "all" ||
    searchFilters.sortBy !== "newest"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search debates by title, description, or tags..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 h-12 bg-input border-none text-foreground placeholder:text-muted-foreground focus:ring-0"
          />
        </div>
        {showAdvanced && (
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="h-12 px-4 bg-secondary hover:bg-secondary/80"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                {
                  [
                    searchFilters.search,
                    searchFilters.category !== "all" ? 1 : 0,
                    searchFilters.tags.length,
                    searchFilters.status !== "all" ? 1 : 0,
                  ].filter(Boolean).length
                }
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                {/* Category and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                    <Select value={searchFilters.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="bg-input border-none text-foreground focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary border-border text-foreground">
                        {categories.map((category) => (
                          <SelectItem key={category} value={category} className="text-foreground hover:bg-secondary/80">
                            {category === "all"
                              ? "All Categories"
                              : category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                    <Select value={searchFilters.status} onValueChange={handleStatusChange}>
                      <SelectTrigger className="bg-input border-none text-foreground focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary border-border text-foreground">
                        <SelectItem value="all" className="text-foreground hover:bg-secondary/80">
                          All Debates
                        </SelectItem>
                        <SelectItem value="live" className="text-foreground hover:bg-secondary/80">
                          Live
                        </SelectItem>
                        <SelectItem value="ended" className="text-foreground hover:bg-secondary/80">
                          Ended
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Sort By</label>
                    <Select value={searchFilters.sortBy} onValueChange={handleSortChange}>
                      <SelectTrigger className="bg-input border-none text-foreground focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-secondary border-border text-foreground">
                        <SelectItem value="newest" className="text-foreground hover:bg-secondary/80">
                          Newest
                        </SelectItem>
                        <SelectItem value="oldest" className="text-foreground hover:bg-secondary/80">
                          Oldest
                        </SelectItem>
                        <SelectItem value="most-voted" className="text-foreground hover:bg-secondary/80">
                          Most Voted
                        </SelectItem>
                        <SelectItem value="ending-soon" className="text-foreground hover:bg-secondary/80">
                          Ending Soon
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tags</label>
                  <div className="space-y-3">
                    {searchFilters.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {searchFilters.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="bg-primary text-primary-foreground hover:bg-primary/80 cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag}
                            <X className="ml-1 h-3 w-3" />
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {availableTags
                        .filter((tag) => !searchFilters.tags.includes(tag))
                        .slice(0, 12)
                        .map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-border text-muted-foreground hover:bg-secondary/80 cursor-pointer"
                            onClick={() => addTag(tag)}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={clearAllFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
