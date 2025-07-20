"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Header } from "@/components/header"
import { joinDebateSchema, type JoinDebateForm } from "@/lib/schemas"
import { useDebateStore } from "@/lib/store"
import { Clock, Users, MessageSquare, ThumbsUp, ThumbsDown, Sparkles, Flame, Target, ArrowRight, TrendingUp, AlertCircle, CheckCircle, Loader2, Share2 } from "lucide-react"
import { toast } from "sonner"
import type { User, Debate, DebateSide } from "@/lib/types"
import { getDebateDetails, joinDebate as joinDebateAction, checkUserParticipation } from "@/app/actions"

import { use } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function DebatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: debateId } = use(params)

  const { data: clientSession, status } = useSession()
  const router = useRouter()
  const { setCurrentUser, getReplyTimer, startReplyTimer } = useDebateStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replyTimerCountdown, setReplyTimerCountdown] = useState<number | null>(null)
  const [debate, setDebate] = useState<Debate | null>(null)
  const [userParticipation, setUserParticipation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const replyTimer = clientSession?.user ? getReplyTimer(clientSession.user.id, debateId) : null

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<JoinDebateForm>({
    resolver: zodResolver(joinDebateSchema),
  })

  const selectedSide = watch("side")

  useEffect(() => {
    const fetchDebateData = async () => {
      try {
        const { debate: fetchedDebate, error: debateError } = await getDebateDetails(debateId)
        if (debateError) {
          console.error("Error fetching debate:", debateError)
          toast.error("Failed to load debate")
          return
        }
        setDebate(fetchedDebate)

        if (clientSession?.user?.id) {
          const { participant, error: participationError } = await checkUserParticipation(debateId, clientSession.user.id)
          if (!participationError) {
            setUserParticipation(participant)
          }
        }
      } catch (error) {
        console.error("Error fetching debate data:", error)
        toast.error("Failed to load debate data")
      } finally {
        setIsLoading(false)
      }
    }

    if (debateId) {
      fetchDebateData()
    }
  }, [debateId, clientSession?.user?.id])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (clientSession?.user) {
      setCurrentUser({
        id: clientSession.user.id || "1",
        username: clientSession.user.username || "User",
        email: clientSession.user.email || "",
        totalVotesReceived: 0,
        debatesParticipated: 0,
      })
    }
  }, [clientSession, status, router, setCurrentUser])

  useEffect(() => {
    if (replyTimer && !replyTimer.hasPostedFirstArgument) {
      const interval = setInterval(() => {
        const now = new Date()
        const timeElapsed = now.getTime() - replyTimer.joinedAt.getTime()
        const remaining = Math.max(0, 5 * 60 * 1000 - timeElapsed)
        setReplyTimerCountdown(remaining)

        if (remaining === 0) {
          clearInterval(interval)
          toast.error("Reply time expired! You must post your first argument within 5 minutes of joining.")
        }
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setReplyTimerCountdown(null)
    }
  }, [replyTimer])

  const onSubmit = async (data: JoinDebateForm) => {
    if (!clientSession?.user || !debate) return

    if (userParticipation) {
      toast.error("You have already joined this debate.")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await joinDebateAction(debateId, clientSession.user.id, data.side)
      
      if (result.success) {
        // Start the reply timer when successfully joining
        startReplyTimer(clientSession.user.id, debateId, data.side)
        toast.success(`Successfully joined the debate as ${data.side}!`)
        router.push(`/debate/${debateId}/live`)
      } else {
        toast.error(result.error || "Failed to join debate. Please try again.")
      }
    } catch (error) {
      console.error("Error joining debate:", error)
      toast.error("Failed to join debate. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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

  const formatCountdown = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Check if debate has actually ended based on time
  const isDebateActuallyEnded = (debate: any) => {
    const now = new Date()
    const endsAt = new Date(debate.endsAt)
    return endsAt.getTime() <= now.getTime()
  }

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/debate/${debateId}/public`
    if (navigator.share) {
      try {
        await navigator.share({
          title: debate?.title || "ArenaX Debate",
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

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!clientSession) {
    return null
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
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
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

  if (debate.status === "ended" || isDebateActuallyEnded(debate)) {
    return (
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gray-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-slate-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-zinc-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>

        <Header />
        <div className="flex flex-1 justify-center items-center px-4 py-5 lg:px-40 relative z-10 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md"
          >
            <div className="rounded-full bg-gradient-to-br from-gray-500/10 to-slate-500/10 p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Clock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-foreground">Debate Has Ended</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              This debate has concluded. You can view the results and see how the discussion unfolded.
            </p>
            <div className="space-y-4">
              <Link href={`/debate/${debateId}/results`}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Sparkles className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full border-border/50 hover:border-primary/50">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </motion.div>
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
          className="flex w-full max-w-[800px] flex-col"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 p-4 mb-6"
          >
            <Link
              href="/"
              className="text-base font-medium leading-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-base font-medium leading-normal text-muted-foreground">/</span>
            <Link
              href="/explore"
              className="text-base font-medium leading-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Explore
            </Link>
            <span className="text-base font-medium leading-normal text-muted-foreground">/</span>
            <span className="text-base font-medium leading-normal text-foreground">{debate.title}</span>
          </motion.nav>

          {/* Debate Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              
              <CardContent className="p-8 relative z-10">
                <div className="space-y-6">
                  {/* Header with Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {debate.status === "live" && (
                          <div className="flex items-center gap-1 text-green-500 text-xs">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            LIVE
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge 
                      variant={debate.status === "live" ? "default" : "secondary"} 
                      className={`text-xs font-medium ${
                        debate.status === "live" 
                          ? "bg-green-500/10 text-green-600 border-green-500/20 animate-pulse" 
                          : "bg-gray-500/10 text-gray-600 border-gray-500/20"
                      }`}
                    >
                      {debate.status === "live" && <Flame className="h-3 w-3 mr-1" />}
                      {debate.status}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-bold mb-4 text-foreground leading-tight">{debate.title}</h1>
                      <p className="text-muted-foreground leading-relaxed text-lg">{debate.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-medium">
                      {debate.category}
                    </Badge>
                    {debate.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="border-border/50 hover:border-primary/50 transition-colors duration-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{formatTimeRemaining(debate.endsAt)}</div>
                        <div className="text-xs text-muted-foreground">Time Remaining</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{debate.supportVotes + debate.opposeVotes}</div>
                        <div className="text-xs text-muted-foreground">Participants</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full flex items-center justify-center">
                        <ThumbsUp className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{debate.supportVotes}</div>
                        <div className="text-xs text-muted-foreground">Support</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full flex items-center justify-center">
                        <ThumbsDown className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{debate.opposeVotes}</div>
                        <div className="text-xs text-muted-foreground">Oppose</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Join Debate Form */}
          {!userParticipation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">Join This Debate</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div>
                      <Label className="text-base font-semibold text-foreground mb-4 block">Choose Your Side</Label>
                      <RadioGroup
                        value={selectedSide}
                        onValueChange={(value) => setValue("side", value as "support" | "oppose")}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <motion.div 
                          className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RadioGroupItem value="support" id="support" />
                          <Label htmlFor="support" className="text-foreground cursor-pointer flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <ThumbsUp className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold">Support</div>
                                <div className="text-sm text-muted-foreground">Argue in favor</div>
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                        <motion.div 
                          className="flex items-center space-x-3 p-4 rounded-lg border border-border/50 hover:border-red-500/50 transition-all duration-300 cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <RadioGroupItem value="oppose" id="oppose" />
                          <Label htmlFor="oppose" className="text-foreground cursor-pointer flex-1">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                                <ThumbsDown className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold">Oppose</div>
                                <div className="text-sm text-muted-foreground">Argue against</div>
                              </div>
                            </div>
                          </Label>
                        </motion.div>
                      </RadioGroup>
                      {errors.side && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive mt-2"
                        >
                          {errors.side.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="argument" className="text-base font-semibold text-foreground mb-3 block">
                        Your Initial Argument
                      </Label>
                      <Textarea
                        id="argument"
                        placeholder="State your position and provide your initial argument..."
                        className="min-h-[140px] bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 resize-none text-lg"
                        {...register("argument")}
                      />
                      {errors.argument && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive mt-2"
                        >
                          {errors.argument.message}
                        </motion.p>
                      )}
                    </div>

                    {replyTimerCountdown !== null && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-6"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                            Reply Timer Active
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                          You have <span className="font-mono font-bold text-lg">{formatCountdown(replyTimerCountdown)}</span> to post your first argument.
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-400">
                          If you don't post within this time, you'll only be able to view the debate.
                        </p>
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className={debate.status === "live" && !isDebateActuallyEnded(debate) ? "flex-1 h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300" : "w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Joining...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5" />
                            Join Debate
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        )}
                      </Button>
                      {debate.status === "live" && !isDebateActuallyEnded(debate) && (
                        <Link href={`/debate/${debateId}/live`}>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-12 border-border/50 hover:border-primary/50 transition-all duration-300"
                          >
                            <TrendingUp className="h-5 w-5 mr-2" />
                            View Live
                          </Button>
                        </Link>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Already Participating */}
          {userParticipation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-card/50 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                
                <CardContent className="p-8 relative z-10">
                  <div className="text-center space-y-6">
                    <div className="rounded-full bg-gradient-to-br from-green-500/10 to-blue-500/10 p-6 w-20 h-20 mx-auto flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Already Participating</h3>
                    <p className="text-muted-foreground text-lg">
                      You have already joined this debate on the{" "}
                      <span className={`font-semibold ${userParticipation.side === "support" ? "text-green-500" : "text-red-500"}`}>
                        {userParticipation.side}
                      </span>{" "}
                      side.
                    </p>
                    {debate.status === "live" && !isDebateActuallyEnded(debate) ? (
                      <Link href={`/debate/${debateId}/live`}>
                        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-6">
                          <Sparkles className="h-5 w-5 mr-2" />
                          Go to Live Debate
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/debate/${debateId}/results`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mt-6">
                          <Target className="h-5 w-5 mr-2" />
                          View Results
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
