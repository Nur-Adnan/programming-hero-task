import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { KeyFeaturesSection } from "@/components/key-features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { LiveDebatesSection } from "@/components/live-debates-section"
import { LeaderboardSection } from "@/components/leaderboard-section"
import { WhyJoinSection } from "@/components/why-join-section"
import { FaqSection } from "@/components/faq-section"
import { CallToActionSection } from "@/components/call-to-action-section"
import { Footer } from "@/components/footer"

import { Zap, Shield, TrendingUp, Users, Star, Sparkles, MessageSquare, ThumbsUp, ThumbsDown, Award, Target, Users2, Flame, Wand2 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-deep-dark">
      {/* Dark Mode Background Elements */}
      <div className="dark:block hidden fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-indigo-950/20 to-purple-950/30"></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.08)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 animate-pulse" style={{ animationDuration: '8s' }}></div>
        
        {/* Floating Sparkles */}
        <div className="absolute top-20 left-20">
          <div className="text-blue-500 animate-bounce">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>
        
        <div className="absolute top-40 right-32">
          <div className="text-indigo-500 animate-pulse" style={{ animationDelay: '1s' }}>
            <Star className="h-4 w-4" />
          </div>
        </div>
        
        <div className="absolute bottom-40 left-1/3">
          <div className="text-purple-500 animate-pulse" style={{ animationDelay: '2s' }}>
            <Sparkles className="h-5 w-5" />
          </div>
        </div>
        
        {/* Animated Wavy Lines */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32">
          <div className="w-full h-full border border-blue-500/20 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>
        
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24">
          <div className="w-full h-full border border-indigo-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
        </div>
      </div>

      {/* Light Mode Background Elements */}
      <div className="light:block hidden fixed inset-0 overflow-hidden pointer-events-none">
        {/* Clean gradient background */}
        <div className="absolute inset-0 hero-gradient"></div>
        
        {/* Cloud texture overlay */}
        <div className="absolute inset-0 hero-cloud-texture"></div>
        
        {/* Texture dots pattern */}
        <div className="absolute inset-0 texture-dots opacity-100"></div>
        
        {/* Additional texture layer for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30"></div>
        
        {/* Subtle floating elements for light mode */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 bg-indigo-300 rounded-full opacity-55 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-purple-300 rounded-full opacity-45 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6 sm:space-y-8 animate-fade-in">
              {/* Tagline Badge */}
              <div className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
                  <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                  <span className="text-xs sm:text-sm font-medium text-gray-900">THE BEST DEBATE PLATFORM</span>
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-center lg:text-left">
                  <span className="text-gray-900 dark:text-white">The Future of</span>
                  <br />
                  <span className="text-gray-900 dark:text-white">Discussion Starts with</span>
                  <br />
                  <span className="text-blue-600 dark:text-blue-400">Community Debate Arena</span>
                  <span className="inline-flex items-center ml-1 sm:ml-2">
                    <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 animate-pulse" />
                  </span>
                </h1>
                
                {/* Animated Underline */}
                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-width-expand"></div>
              </div>
              
              {/* Description */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl text-center lg:text-left">
                Build a debate platform where users can create and join discussions by taking a stance—either Support or Oppose. Participants post arguments under their selected side, and others can vote on the most compelling responses.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/signup">
                    <Zap className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Get a Free Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-all duration-300">
                  <Link href="/explore">
                    <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Explore Debates
                  </Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="pt-8 sm:pt-12">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center lg:text-left mb-4 sm:mb-6">TRUSTED BY DEBATE ENTHUSIASTS AND TECH COMMUNITIES ALIKE</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 opacity-60">
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-semibold">Snowflake</div>
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-semibold">Cactus</div>
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-semibold">Vision</div>
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-semibold">Luminous</div>
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-semibold">ProNature</div>
                  <div className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 font-semibold">Recharge</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Debate Arena Visual */}
            <div className="relative mt-8 lg:mt-0">
              {/* Main Debate Arena Card */}
              <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl animate-float">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-6 sm:w-12 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="text-white font-semibold text-sm sm:text-lg">Live Debate</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80 text-xs sm:text-sm">LIVE</span>
                  </div>
                </div>
                
                {/* Debate Topic */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-white font-semibold text-sm sm:text-lg mb-1 sm:mb-2">Should AI be regulated?</h3>
                  <p className="text-white/70 text-xs sm:text-sm">Technology • 2.3k participants</p>
                </div>
                
                {/* Support vs Oppose Section */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {/* Support Side */}
                  <div className="bg-green-600/30 rounded-lg p-2 sm:p-4 border border-green-500/40">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                      <span className="text-green-400 font-semibold text-xs sm:text-sm">SUPPORT</span>
                    </div>
                    <div className="text-white text-xs sm:text-sm mb-1 sm:mb-2">AI regulation is necessary for safety</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">1.2k votes</span>
                      <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-green-600/40 rounded-full">
                        <div className="w-9 sm:w-12 h-1.5 sm:h-2 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Oppose Side */}
                  <div className="bg-red-600/30 rounded-lg p-2 sm:p-4 border border-red-500/40">
                    <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                      <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />
                      <span className="text-red-400 font-semibold text-xs sm:text-sm">OPPOSE</span>
                    </div>
                    <div className="text-white text-xs sm:text-sm mb-1 sm:mb-2">AI regulation stifles innovation</div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-xs">1.1k votes</span>
                      <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-red-600/40 rounded-full">
                        <div className="w-8 sm:w-10 h-1.5 sm:h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Top Debaters */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between text-white/80 text-xs sm:text-sm">
                    <span>Top Debaters</span>
                    <span>Score</span>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Award className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                        </div>
                        <span className="text-white text-xs sm:text-sm">@debater_pro</span>
                      </div>
                      <span className="text-white/60 text-xs sm:text-sm">2.4k</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-500 rounded-full flex items-center justify-center">
                          <Award className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                        </div>
                        <span className="text-white text-xs sm:text-sm">@logic_master</span>
                      </div>
                      <span className="text-white/60 text-xs sm:text-sm">1.8k</span>
                    </div>
                  </div>
                </div>
                
                {/* Animated Wavy Lines */}
                <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-12 h-12 sm:w-20 sm:h-20 border border-blue-400/30 rounded-full animate-pulse"></div>
                
                <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-10 h-10 sm:w-16 sm:h-16 border border-indigo-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              
              {/* Floating Debate Elements */}
              <div className="absolute -top-4 sm:-top-8 -right-4 sm:-right-8 w-8 h-8 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/30 to-indigo-500/30 rounded-full blur-sm animate-bounce"></div>
              
              <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-6 h-6 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '2s' }}></div>
              
              {/* Additional Debate Icons */}
              <div className="absolute top-1/2 -right-6 sm:-right-12">
                <div className="flex flex-col gap-2 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-600/30 rounded-full animate-pulse">
                    <Users2 className="h-3 w-3 sm:h-5 sm:w-5 text-blue-400" />
                  </div>
                  <div className="p-2 sm:p-3 bg-indigo-600/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}>
                    <Target className="h-3 w-3 sm:h-5 sm:w-5 text-indigo-400" />
                  </div>
                  <div className="p-2 sm:p-3 bg-purple-600/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}>
                    <MessageSquare className="h-3 w-3 sm:h-5 sm:w-5 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeyFeaturesSection />
      <HowItWorksSection />
      <LiveDebatesSection />
      <LeaderboardSection />
      <WhyJoinSection />
      <FaqSection />
      <CallToActionSection />
      <Footer />
    </div>
  )
}
