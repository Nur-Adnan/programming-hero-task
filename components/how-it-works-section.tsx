"use client"

import { Card, CardContent } from "@/components/ui/card"
import { 
  MessageSquare,
  Users,
  ThumbsUp,
  ThumbsDown,
  Target,
  Award,
  Clock,
  TrendingUp,
  Vote,
  Edit,
  Timer,
  Star
} from "lucide-react"

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-blue-50 dark:from-[#080917] dark:to-[#0f0f23]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            How ArenaX Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow these simple steps to start your debate journey and engage with the community. 
            Join the battle of opinions and make your voice heard!
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Step 1: Create a Debate */}
          <Card className="bg-gradient-to-br from-blue-100/80 to-indigo-100/80 dark:from-blue-900/50 dark:to-indigo-900/50 border-0 rounded-xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer group animate-fade-in">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center -ml-10 -mt-10 relative z-10 shadow-2xl border-2 border-blue-400/30 group-hover:scale-110 group-hover:animate-glow-pulse transition-all duration-500">
                  <span className="text-white font-black text-4xl tracking-wider group-hover:animate-shimmer">1</span>
                </div>
                <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Illustration */}
              <div className="mb-4 p-4 bg-blue-100/50 dark:bg-blue-800/20 rounded-lg flex-1 border-0 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-700 dark:text-blue-200 font-medium">Create Debate</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-300/50 dark:bg-blue-700/50 rounded w-3/4"></div>
                    <div className="h-2 bg-blue-300/50 dark:bg-blue-700/50 rounded w-1/2"></div>
                    <div className="h-2 bg-blue-300/50 dark:bg-blue-700/50 rounded w-2/3"></div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-200/50 dark:bg-blue-600/30 text-blue-700 dark:text-blue-200 text-xs rounded">Tech</span>
                    <span className="px-2 py-1 bg-blue-200/50 dark:bg-blue-600/30 text-blue-700 dark:text-blue-200 text-xs rounded">Ethics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs text-blue-600 dark:text-blue-300">24 hours</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Create a Debate</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                Start a new discussion with title, description, tags, and duration. Choose from 1 hour to 24 hours.
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Join a Side */}
          <Card className="bg-gradient-to-br from-green-100/80 to-emerald-100/80 dark:from-green-900/50 dark:to-emerald-900/50 border-0 rounded-xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-500 cursor-pointer group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 h-full flex flex-col">
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center -ml-10 -mt-10 relative z-10 shadow-2xl border-2 border-green-400/30 group-hover:scale-110 group-hover:animate-glow-pulse transition-all duration-500">
                  <span className="text-white font-black text-4xl tracking-wider group-hover:animate-shimmer">2</span>
                </div>
                <Users className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Illustration */}
              <div className="mb-4 p-4 bg-green-100/50 dark:bg-green-800/20 rounded-lg flex-1 border-0 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-3">
                  {/* Support Side */}
                  <div className="bg-green-200/50 dark:bg-green-600/30 rounded-lg p-3 border border-green-300/40 dark:border-green-500/40">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">SUPPORT</span>
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-200">Take a stance in favor</div>
                  </div>
                  
                  {/* Oppose Side */}
                  <div className="bg-red-200/50 dark:bg-red-600/30 rounded-lg p-3 border border-red-300/40 dark:border-red-500/40">
                    <div className="flex items-center gap-2 mb-2">
                      <ThumbsDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                      <span className="text-xs text-red-700 dark:text-red-300 font-medium">OPPOSE</span>
                    </div>
                    <div className="text-xs text-red-600 dark:text-red-200">Take a stance against</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-xs text-slate-500 dark:text-gray-400">Choose your side wisely!</span>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Join a Side</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                Choose to either Support or Oppose the debate topic. You can only join one side per debate.
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Post Arguments */}
          <Card className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 dark:from-purple-900/50 dark:to-pink-900/50 border-0 rounded-xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 cursor-pointer group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 h-full flex flex-col">
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center -ml-10 -mt-10 relative z-10 shadow-2xl border-2 border-purple-400/30 group-hover:scale-110 group-hover:animate-glow-pulse transition-all duration-500">
                  <span className="text-white font-black text-4xl tracking-wider group-hover:animate-shimmer">3</span>
                </div>
                <Edit className="h-6 w-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Illustration */}
              <div className="mb-4 p-4 bg-purple-100/50 dark:bg-purple-800/20 rounded-lg flex-1 border-0 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">U</span>
                    </div>
                    <span className="text-xs text-purple-700 dark:text-purple-200">@user123</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400">2m ago</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-purple-300/50 dark:bg-purple-700/50 rounded w-full"></div>
                    <div className="h-2 bg-purple-300/50 dark:bg-purple-700/50 rounded w-3/4"></div>
                    <div className="h-2 bg-purple-300/50 dark:bg-purple-700/50 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Vote className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs text-purple-600 dark:text-purple-300">12 votes</span>
                    </div>
                                         <div className="flex gap-1">
                       <Edit className="h-3 w-3 text-slate-500 dark:text-gray-400" />
                     </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Post Arguments</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                Share your compelling arguments with the community. Edit within 5 minutes of posting.
              </p>
            </CardContent>
          </Card>

          {/* Step 4: Vote & Track */}
          <Card className="bg-gradient-to-br from-orange-100/80 to-red-100/80 dark:from-orange-900/50 dark:to-red-900/50 border-0 rounded-xl hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 cursor-pointer group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 h-full flex flex-col">
              {/* Step Number */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center -ml-10 -mt-10 relative z-10 shadow-2xl border-2 border-orange-400/30 group-hover:scale-110 group-hover:animate-glow-pulse transition-all duration-500">
                  <span className="text-white font-black text-4xl tracking-wider group-hover:animate-shimmer">4</span>
                </div>
                <Award className="h-6 w-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              
              {/* Illustration */}
              <div className="mb-4 p-4 bg-orange-100/50 dark:bg-orange-800/20 rounded-lg flex-1 border-0 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700 dark:text-orange-200 font-medium">Leaderboard</span>
                    <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 text-white" />
                        </div>
                        <span className="text-xs text-orange-700 dark:text-orange-200">@debater_pro</span>
                      </div>
                      <span className="text-xs text-orange-600 dark:text-orange-300">2.4k votes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 text-white" />
                        </div>
                        <span className="text-xs text-orange-700 dark:text-orange-200">@logic_master</span>
                      </div>
                      <span className="text-xs text-orange-600 dark:text-orange-300">1.8k votes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                    <span className="text-xs text-orange-600 dark:text-orange-300">Time remaining</span>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Vote & Track</h3>
              <p className="text-sm text-slate-600 dark:text-gray-300">
                Vote on arguments and track your score on the leaderboard. Watch the countdown timer!
              </p>
            </CardContent>
          </Card>
        </div>


      </div>
    </section>
  )
}
