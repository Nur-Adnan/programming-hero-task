"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { 
  Clock, 
  Users, 
  Trophy, 
  BarChart3, 
  Share2, 
  TrendingUp, 
  MessageSquare, 
  Target,
  Award,
  Sparkles,
  Flame,
  Zap,
  ArrowRight,
  CheckCircle,
  XCircle,
  Minus
} from "lucide-react"
import { getDebateDetails, getDebateArguments, getDebateParticipants, generateDebateSummary } from "@/app/actions"
import { Debate, Argument, DebateParticipant, DebateSide } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { use } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: debateId } = use(params)
  const [debate, setDebate] = useState<Debate | null>(null)
  const [debateArguments, setDebateArguments] = useState<Argument[]>([])
  const [participants, setParticipants] = useState<DebateParticipant[]>([])
  const [debateSummary, setDebateSummary] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchDebateData = async () => {
      try {
        // Fetch debate details
        const { debate: fetchedDebate, error: debateError } = await getDebateDetails(debateId)
        if (debateError) {
          console.error("Error fetching debate:", debateError)
          toast({
            title: "Error",
            description: "Failed to load debate",
            variant: "destructive",
          })
          return
        }
        setDebate(fetchedDebate)

        // Fetch arguments
        const { arguments: fetchedArguments, error: argumentsError } = await getDebateArguments(debateId)
        if (!argumentsError) {
          setDebateArguments(fetchedArguments)
        }

        // Fetch participants
        const { participants: fetchedParticipants, error: participantsError } = await getDebateParticipants(debateId)
        if (!participantsError) {
          setParticipants(fetchedParticipants)
        }
        
        // Generate debate summary if debate is ended and no summary exists
        if (fetchedDebate && fetchedDebate.status === "ended" && !fetchedDebate.summary) {
          try {
            const summaryResult = await generateDebateSummary(debateId)
            if (summaryResult.success && summaryResult.summary) {
              setDebateSummary(summaryResult.summary)
            }
          } catch (error) {
            console.error("Error generating summary:", error)
          }
        } else if (fetchedDebate?.summary) {
          setDebateSummary(fetchedDebate.summary)
        }
      } catch (error) {
        console.error("Error fetching debate data:", error)
        toast({
          title: "Error",
          description: "Failed to load debate data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (debateId) {
      fetchDebateData()
    }
  }, [debateId, toast])

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/debate/${debateId}/public`
    if (navigator.share) {
      try {
        await navigator.share({
          title: debate?.title || "ArenaX Debate Results",
          text: `Check out the results of this debate on ArenaX: ${publicUrl}`,
          url: publicUrl,
        })
        toast({
          title: "Success",
          description: "Results shared successfully!",
          variant: "default",
        })
      } catch (error) {
        console.error("Error sharing:", error)
        toast({
          title: "Error",
          description: "Failed to share results.",
          variant: "destructive",
        })
      }
    } else {
      navigator.clipboard.writeText(publicUrl)
      toast({
        title: "Success",
        description: "Results URL copied to clipboard!",
        variant: "default",
      })
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
        <div className="flex flex-1 justify-center items-center px-4 py-5 lg:px-40 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <LoadingSpinner />
            <p className="mt-4 text-lg text-muted-foreground">Loading results...</p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <Header />
        <div className="flex flex-1 justify-center items-center px-4 py-5 lg:px-40 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <div className="rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <XCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Debate Not Found</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The debate you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white">
                <ArrowRight className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const supportArguments = debateArguments.filter((arg) => arg.side === DebateSide.Support)
  const opposeArguments = debateArguments.filter((arg) => arg.side === DebateSide.Oppose)
  const supportParticipants = participants.filter((p) => p.side === DebateSide.Support)
  const opposeParticipants = participants.filter((p) => p.side === DebateSide.Oppose)

  const totalVotes = debate.supportVotes + debate.opposeVotes
  const supportPercentage = totalVotes > 0 ? Math.round((debate.supportVotes / totalVotes) * 100) : 0
  const opposePercentage = totalVotes > 0 ? Math.round((debate.opposeVotes / totalVotes) * 100) : 0

  const getWinnerIcon = () => {
    if (debate.winner === "tie") return <Minus className="h-8 w-8 text-yellow-400" />
    if (debate.winner === "support") return <CheckCircle className="h-8 w-8 text-green-400" />
    return <XCircle className="h-8 w-8 text-red-400" />
  }

  const getWinnerColor = () => {
    if (debate.winner === "tie") return "from-yellow-500/20 to-amber-500/20 border-yellow-500/30"
    if (debate.winner === "support") return "from-green-500/20 to-emerald-500/20 border-green-500/30"
    return "from-red-500/20 to-pink-500/20 border-red-500/30"
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 p-4 mb-8"
          >
            <Link
              href="/"
              className="text-base font-medium leading-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-base font-medium leading-normal text-muted-foreground">/</span>
            <Link
              href={`/debate/${debateId}`}
              className="text-base font-medium leading-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              {debate.title}
            </Link>
            <span className="text-base font-medium leading-normal text-muted-foreground">/</span>
            <span className="text-base font-medium leading-normal text-foreground">Results</span>
          </motion.nav>

          {/* Winner Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className={`bg-gradient-to-r ${getWinnerColor()} backdrop-blur-xl border-0 shadow-2xl overflow-hidden relative group`}>
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <CardContent className="p-8 relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mb-6"
                  >
                    <div className="rounded-full bg-gradient-to-br from-yellow-500/20 to-amber-500/20 p-6 w-20 h-20 mx-auto flex items-center justify-center border border-yellow-500/30">
                      {getWinnerIcon()}
                    </div>
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-4xl font-bold text-foreground mb-4"
                  >
                    {debate.winner === "tie"
                      ? "It's a Tie!"
                      : `${debate.winner === "support" ? "Support" : "Opposition"} Wins!`}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="text-lg text-muted-foreground leading-relaxed"
                  >
                    {debate.winner === "tie"
                      ? "Both sides received equal votes in this debate."
                      : `The ${debate.winner === "support" ? "support" : "opposition"} side won with ${debate.winner === "support" ? debate.supportVotes : debate.opposeVotes} votes.`}
                  </motion.p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Generated Summary */}
          {debateSummary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl border-purple-500/30 shadow-2xl overflow-hidden relative group">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-6 w-6 text-purple-500" />
                    </motion.div>
                    AI Generated Debate Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="bg-background/50 rounded-lg p-6 border border-purple-500/20">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-medium">
                      {debateSummary}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Vote Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <BarChart3 className="h-6 w-6 text-blue-500" />
                  </motion.div>
                  Vote Results
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-6">
                  {/* Support Votes */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex items-center justify-between p-4 bg-green-50/50 dark:bg-green-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg" />
                      <span className="font-semibold text-foreground text-lg">Support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">{debate.supportVotes}</span>
                      <span className="text-sm text-muted-foreground font-medium">
                        ({supportPercentage}%)
                      </span>
                    </div>
                  </motion.div>

                  {/* Oppose Votes */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-950/30 rounded-xl border border-red-200/50 dark:border-red-800/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg" />
                      <span className="font-semibold text-foreground text-lg">Oppose</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">{debate.opposeVotes}</span>
                      <span className="text-sm text-muted-foreground font-medium">
                        ({opposePercentage}%)
                      </span>
                    </div>
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="w-full bg-muted rounded-full h-3 overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${supportPercentage}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg"
                    />
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <TrendingUp className="h-6 w-6 text-purple-500" />
                  </motion.div>
                  Debate Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
                  >
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{totalVotes}</div>
                    <div className="text-sm text-muted-foreground font-medium">Total Votes</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center p-4 bg-green-50/50 dark:bg-green-950/30 rounded-xl border border-green-200/50 dark:border-green-800/50"
                  >
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{debateArguments.length}</div>
                    <div className="text-sm text-muted-foreground font-medium">Arguments</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-center p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-xl border border-purple-200/50 dark:border-purple-800/50"
                  >
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{participants.length}</div>
                    <div className="text-sm text-muted-foreground font-medium">Participants</div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="text-center p-4 bg-orange-50/50 dark:bg-orange-950/30 rounded-xl border border-orange-200/50 dark:border-orange-800/50"
                  >
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {new Date(debate.endsAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-medium">Ended</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Arguments Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Support Arguments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group h-full">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg" />
                    </motion.div>
                    Support Arguments ({supportArguments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                  {supportArguments.length > 0 ? (
                    supportArguments.map((argument, index) => (
                      <motion.div
                        key={argument.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                        className="border-b border-border/50 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-green-200 dark:ring-green-800">
                            <AvatarImage 
                              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${argument.username}`} 
                              alt={argument.username} 
                            />
                            <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 font-semibold">
                              {argument.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">{argument.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(argument.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{argument.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>Votes: {argument.voteCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <MessageSquare className="h-12 w-12 text-green-500/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No support arguments.</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Oppose Arguments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group h-full">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold text-foreground">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg" />
                    </motion.div>
                    Oppose Arguments ({opposeArguments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
                  {opposeArguments.length > 0 ? (
                    opposeArguments.map((argument, index) => (
                      <motion.div
                        key={argument.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                        className="border-b border-border/50 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-red-200 dark:ring-red-800">
                            <AvatarImage 
                              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${argument.username}`} 
                              alt={argument.username} 
                            />
                            <AvatarFallback className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 font-semibold">
                              {argument.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">{argument.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(argument.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{argument.content}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span>Votes: {argument.voteCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-8"
                    >
                      <MessageSquare className="h-12 w-12 text-red-500/50 mx-auto mb-3" />
                      <p className="text-muted-foreground">No oppose arguments.</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={handleShare}
                className="text-muted-foreground hover:text-foreground border-border/50 hover:border-border transition-all duration-200"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/explore">
                <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Target className="h-4 w-4 mr-2" />
                  Explore More Debates
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
