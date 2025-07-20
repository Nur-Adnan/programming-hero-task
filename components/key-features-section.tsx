"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare,
  Users,
  TrendingUp,
  Target,
  CheckCircle,
  Calendar,
  MapPin,
  ArrowLeft,
  ArrowRight,
  FileText,
  Building,
  Smile,
  Zap,
  Shield,
  Award,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Search,
  Share2,
  Filter,
  BarChart3,
  Flag,
  Edit,
  Trash2,
  Timer,
  Star
} from "lucide-react"

export function KeyFeaturesSection() {
  return (
    <section className="py-20 bg-white dark:bg-background">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Main Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Community Debate Arena —{" "}
            <span className="text-purple-600 dark:text-purple-400">Battle of Opinions</span>
          </h2>
          
          {/* Description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Build a debate platform where users can create and join discussions by taking a stance—either Support or Oppose. Participants post arguments under their selected side, and others can vote on the most compelling responses.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Feature - Debate Creation */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Debate Creation -
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Create debates with title, description, tags, category, banner image, and duration selector (1-24 hours).
                </p>
              </div>
            </div>
          </div>

          {/* Middle Feature - Join & Vote (Highlighted Card) */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                    <ThumbsUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Join & Vote System -
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Join debates by selecting Support or Oppose. Post arguments and vote on others' responses with one vote per argument.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Feature - Auto-Moderation */}
          <div className="animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            <div className="flex flex-col items-center text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              
              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Auto-Moderation -
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Toxic content detection with banned words filtering. Prevents submission and shows warnings for inappropriate content.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Countdown Timer */}
          <div className="animate-slide-in-left" style={{ animationDelay: '0.8s' }}>
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                      <Timer className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">Countdown Timer</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Auto-close debates</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Each debate has a countdown timer. When time expires, posting and voting are disabled.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scoreboard */}
          <div className="animate-slide-in-right" style={{ animationDelay: '1.0s' }}>
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">Scoreboard</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Leaderboard</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Public leaderboard showing top debaters with total votes and participation stats.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Filter */}
          <div className="animate-slide-in-left" style={{ animationDelay: '1.2s' }}>
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                      <Search className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">Search Debates</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Filter & Sort</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Filter debates by title, tag, or category. Sort by most voted, newest, or ending soon.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Public Sharing */}
          <div className="animate-slide-in-right" style={{ animationDelay: '1.4s' }}>
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center">
                      <Share2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 dark:text-white">Public Sharing</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Share URLs</div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share debates via public URLs. Mobile-optimized UI for all screen sizes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Debate Example Card */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="animate-slide-in-left" style={{ animationDelay: '1.6s' }}>
            <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {/* Header - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Live Debate Example</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">LIVE</span>
                  </div>
                </div>
                
                {/* Voting Options - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {/* Support Option */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <ThumbsUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Support</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-900 dark:text-white">1.2k votes</span>
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  {/* Oppose Option */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <ThumbsDown className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Oppose</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-900 dark:text-white">1.1k votes</span>
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                    </div>
                  </div>

                  {/* Time Remaining */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Time Remaining</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-900 dark:text-white">2h 15m</span>
                      <Timer className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Participants</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-gray-900 dark:text-white">2.3k users</span>
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Responsive */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Browse Debates
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm">
                    Create Debate
                    <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
