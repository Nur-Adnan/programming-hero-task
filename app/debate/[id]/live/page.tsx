"use client"

import { AvatarFallback } from "@/components/ui/avatar"

import { AvatarImage } from "@/components/ui/avatar"

import { Avatar } from "@/components/ui/avatar"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Clock, ThumbsUp, ThumbsDown, Edit, Trash2, Share2, Loader2, Sparkles, Flame, Target, ArrowRight, TrendingUp, MessageSquare, AlertCircle, CheckCircle, Zap, Shield, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { useDebateStore } from "@/lib/store"
import { formatDistanceToNowStrict, isPast, addMinutes, differenceInSeconds } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import LoadingSpinner from "@/components/ui/loading-spinner"
import {
  postArgument,
  joinDebate,
  deleteArgument,
  updateArgument,
  getDebateDetails,
  getDebateArgumentsWithUserVotes,
  getDebateParticipants,
  checkUserParticipation,
  calculateAndDeclareWinner,
  generateDebateSummary,
} from "@/app/actions"
import { type Argument, type Debate, type DebateParticipant, DebateSide, type User } from "@/lib/types"
import { useSession } from "next-auth/react"
import { ArgumentVoteButton } from "@/components/argument-vote-button"
import { use } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"


const argumentFormSchema = z.object({
  content: z.string().min(10, "Argument must be at least 10 characters"),
})

type ArgumentFormValues = z.infer<typeof argumentFormSchema>

export default function LiveDebatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: debateId } = use(params)
  
  // Debug logging to check if debateId is properly extracted
  console.log("LiveDebatePage - debateId:", debateId)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const currentUser = session?.user as User | undefined

  const [debate, setDebate] = useState<Debate | null>(null)
  const [participants, setParticipants] = useState<DebateParticipant[]>([])
  const [supportArguments, setSupportArguments] = useState<Argument[]>([])
  const [opposeArguments, setOpposeArguments] = useState<Argument[]>([])
  const [userSide, setUserSide] = useState<DebateSide | null>(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [isDebateEnded, setIsDebateEnded] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isPostingArgument, setIsPostingArgument] = useState(false)
  const [editingArgumentId, setEditingArgumentId] = useState<string | null>(null)
  const [editingArgumentContent, setEditingArgumentContent] = useState<string>("")
  const [editWindowCountdown, setEditWindowCountdown] = useState<{ [key: string]: number }>({})
  const [isContentModerationModalOpen, setIsContentModerationModalOpen] = useState(false)
  const [toxicWords, setToxicWords] = useState<string[]>([])

  const replyTimers = useDebateStore((state) => state.replyTimers)
  const startReplyTimer = useDebateStore((state) => state.startReplyTimer)
  const getReplyTimer = useDebateStore((state) => state.getReplyTimer)
  const markFirstArgumentPosted = useDebateStore((state) => state.markFirstArgumentPosted)
  const checkContentModeration = useDebateStore((state) => state.checkContentModeration)

  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [canPostArguments, setCanPostArguments] = useState(true)

  const [isPending, startTransition] = useTransition()

  const argumentForm = useForm<ArgumentFormValues>({
    resolver: zodResolver(argumentFormSchema),
    defaultValues: {
      content: "",
    },
  })

  const fetchDebateData = async () => {
    setIsFetching(true)
    try {
      const { debate: fetchedDebate, error: debateError } = await getDebateDetails(debateId)
      if (debateError) throw new Error(debateError)
      setDebate(fetchedDebate)
      setIsDebateEnded(isPast(new Date(fetchedDebate!.endsAt)))

      const { participants: fetchedParticipants, error: participantsError } = await getDebateParticipants(debateId)
      if (participantsError) throw new Error(participantsError)
      setParticipants(fetchedParticipants)

      const { arguments: fetchedArguments, error: argumentsError } = await getDebateArgumentsWithUserVotes(debateId, currentUser?.id)
      if (argumentsError) throw new Error(argumentsError)

      setSupportArguments(
        fetchedArguments.filter((arg) => arg.side === DebateSide.Support).sort((a, b) => b.voteCount - a.voteCount),
      )
      setOpposeArguments(
        fetchedArguments.filter((arg) => arg.side === DebateSide.Oppose).sort((a, b) => b.voteCount - a.voteCount),
      )

      if (currentUser?.id) {
        const { participant, error: checkError } = await checkUserParticipation(debateId, currentUser.id)
        if (checkError) throw new Error(checkError)

        if (participant) {
          setHasJoined(true)
          setUserSide(participant.side)

          // Initialize or update reply timer state
          const timerState = getReplyTimer(currentUser.id, debateId)
          if (!timerState) {
            startReplyTimer(currentUser.id, debateId, participant.side)
          } else if (timerState.hasPostedFirstArgument !== participant.hasPostedFirstArgument) {
            // Update client store if server state differs (e.g., after a refresh)
            if (participant.hasPostedFirstArgument) {
              markFirstArgumentPosted(currentUser.id, debateId)
            }
          }
        } else {
          setHasJoined(false)
          setUserSide(null)
        }
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
      console.error("Error fetching debate data:", err)
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (debateId) {
      fetchDebateData()
    }
  }, [debateId, currentUser?.id]) // Refetch if debateId or currentUser changes

  const handleDebateEnd = async () => {
    setIsDebateEnded(true)
    
    // Automatically calculate and declare winner
    try {
      const winnerResult = await calculateAndDeclareWinner(debateId)
      if (winnerResult.success) {
        toast({
          title: "Debate Ended!",
          description: `The debate has concluded. ${winnerResult.winner === "tie" ? "It's a tie!" : `${winnerResult.winner === "support" ? "Support" : "Oppose"} side wins with ${winnerResult.winner === "support" ? winnerResult.supportVotes : winnerResult.opposeVotes} votes!`}`,
          variant: "default",
        })
        
        // Generate AI summary after declaring winner
        try {
          await generateDebateSummary(debateId)
        } catch (error) {
          console.error("Error generating summary:", error)
        }
      } else {
        toast({
          title: "Debate Ended!",
          description: "This debate has concluded. Check the results page.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error calculating winner:", error)
      toast({
        title: "Debate Ended!",
        description: "This debate has concluded. Check the results page.",
        variant: "default",
      })
    }
    
    router.push(`/debate/${debateId}/results`)
  }

  useEffect(() => {
    if (!debate || isDebateEnded) return

    const interval = setInterval(() => {
      const now = new Date()
      const endsAt = new Date(debate.endsAt)
      const secondsLeft = differenceInSeconds(endsAt, now)

      if (secondsLeft <= 0) {
        clearInterval(interval)
        handleDebateEnd()
      } else {
        setTimeLeft(secondsLeft)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [debate, isDebateEnded, debateId])

  useEffect(() => {
    const timerState = getReplyTimer(currentUser?.id || "", debateId)
    if (timerState && !timerState.hasPostedFirstArgument) {
      const interval = setInterval(() => {
        const now = new Date()
        const timeDiff = now.getTime() - timerState.joinedAt.getTime()
        const fiveMinutesInMs = 5 * 60 * 1000
        const secondsLeft = Math.max(0, Math.floor((fiveMinutesInMs - timeDiff) / 1000))
        
        if (secondsLeft <= 0) {
          setCanPostArguments(false)
          clearInterval(interval)
          toast({
            title: "Reply Timer Expired",
            description: "You missed the 5-minute window to post your first argument. You can no longer participate in this debate.",
            variant: "destructive",
          })
        }
      }, 1000)
      return () => clearInterval(interval)
    } else if (timerState?.hasPostedFirstArgument) {
      setCanPostArguments(true) // If already posted first argument, can post additional arguments
    }
  }, [replyTimers, debateId, getReplyTimer, toast, currentUser?.id])

  // Update edit window countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown: { [key: string]: number } = {}
      
      // Update countdown for all arguments
      ;[...supportArguments, ...opposeArguments].forEach(argument => {
        const isWithinEditWindow = !isPast(addMinutes(new Date(argument.createdAt), 5))
        if (isWithinEditWindow && currentUser?.username === argument.username) {
          const timeRemaining = Math.max(0, differenceInSeconds(addMinutes(new Date(argument.createdAt), 5), new Date()))
          newCountdown[argument.id] = timeRemaining
        }
      })
      
      setEditWindowCountdown(newCountdown)
    }, 1000)

    return () => clearInterval(interval)
  }, [supportArguments, opposeArguments, currentUser?.username])

  const handleJoinDebate = async (side: DebateSide) => {
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join the debate.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }
    setIsJoining(true)
    try {
      // Debug logging
      console.log("Joining debate with:", { debateId, userId: currentUser.id, side })
      
      // Validate debateId before calling
      if (!debateId || debateId === "undefined") {
        toast({
          title: "Error",
          description: "Invalid debate ID. Please refresh the page.",
          variant: "destructive",
        })
        return
      }
      
      const result = await joinDebate(debateId, currentUser.id, side)
      if (result.success) {
        setHasJoined(true)
        setUserSide(side)
        startReplyTimer(currentUser.id, debateId, side) // Start reply timer
        toast({
          title: "Joined Debate!",
          description: `You have joined the ${side} side.`,
          variant: "default",
        })
        startTransition(() => {
          fetchDebateData() // Re-fetch data to update participants list
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to join debate.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Join debate error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handlePostArgument = async (values: ArgumentFormValues) => {
    if (!currentUser || !debate) return

    // Additional validation
    if (!userSide) {
      toast({
        title: "Error",
        description: "You must join a side before posting arguments.",
        variant: "destructive",
      })
      return
    }

    if (isDebateEnded) {
      toast({
        title: "Debate Ended",
        description: "This debate has ended. You can no longer post arguments.",
        variant: "destructive",
      })
      return
    }

    // Check reply timer - if user hasn't posted first argument and timer expired, they can't post
    const timerState = getReplyTimer(currentUser.id, debateId)
    if (timerState && !timerState.hasPostedFirstArgument) {
      const now = new Date()
      const timeDiff = now.getTime() - timerState.joinedAt.getTime()
      const fiveMinutesInMs = 5 * 60 * 1000
      
      if (timeDiff > fiveMinutesInMs) {
        toast({
          title: "Reply Timer Expired",
          description: "You missed the 5-minute window to post your first argument. You can no longer participate in this debate.",
          variant: "destructive",
        })
        return
      }
    }

    // Check content moderation for toxic words
    const toxicWords = checkContentModeration(values.content)
    if (toxicWords.length > 0) {
      setToxicWords(toxicWords)
      setIsContentModerationModalOpen(true)
      return
    }

    setIsPostingArgument(true)
    try {
      const result = await postArgument(debateId, currentUser.id, userSide!, values.content)
      if (result.success) {
        argumentForm.reset()
        markFirstArgumentPosted(currentUser.id, debateId) // Mark first argument as posted
        toast({
          title: "Argument Posted!",
          description: "Your argument has been posted successfully. You can edit it within the next 5 minutes.",
          variant: "default",
        })
        startTransition(() => {
          fetchDebateData() // Re-fetch data to update arguments list
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post argument.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Post argument error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPostingArgument(false)
    }
  }

  const handleEditArgument = async (argument: Argument) => {
    setEditingArgumentId(argument.id)
    setEditingArgumentContent(argument.content)
  }

  const handleSaveEdit = async () => {
    if (!editingArgumentId || !editingArgumentContent.trim()) return

    // Validate content length
    if (editingArgumentContent.trim().length < 10) {
      toast({
        title: "Invalid Argument",
        description: "Argument must be at least 10 characters long.",
        variant: "destructive",
      })
      return
    }

    // Check content moderation for toxic words
    const toxicWords = checkContentModeration(editingArgumentContent)
    if (toxicWords.length > 0) {
      setToxicWords(toxicWords)
      setIsContentModerationModalOpen(true)
      return
    }

    setIsPostingArgument(true)
    try {
      const result = await updateArgument(editingArgumentId, editingArgumentContent)
      if (result.success) {
        setEditingArgumentId(null)
        setEditingArgumentContent("")
        toast({
          title: "Argument Updated!",
          description: "Your argument has been updated successfully.",
          variant: "default",
        })
        startTransition(() => {
          fetchDebateData() // Re-fetch data to update arguments list
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update argument.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update argument error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPostingArgument(false)
    }
  }

  const handleDeleteArgument = async (argumentId: string) => {
    if (!confirm("Are you sure you want to delete this argument? This action cannot be undone.")) return

    setIsPostingArgument(true)
    try {
      const result = await deleteArgument(argumentId)
      if (result.success) {
        toast({
          title: "Argument Deleted!",
          description: "Your argument has been deleted successfully.",
          variant: "default",
        })
        startTransition(() => {
          fetchDebateData() // Re-fetch data to update arguments list
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete argument.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Delete argument error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPostingArgument(false)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00:00:00"
    
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    const remainingSeconds = seconds % 60
    
    if (days > 0) {
      return `${days.toString().padStart(2, "0")}:${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    } else if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    } else {
      return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
    }
  }

  const totalSupportVotes = supportArguments.reduce((sum, arg) => sum + arg.voteCount, 0)
  const totalOpposeVotes = opposeArguments.reduce((sum, arg) => sum + arg.voteCount, 0)
  const totalVotes = totalSupportVotes + totalOpposeVotes

  const supportPercentage = totalVotes === 0 ? 50 : (totalSupportVotes / totalVotes) * 100
  const opposePercentage = totalVotes === 0 ? 50 : (totalOpposeVotes / totalVotes) * 100

  const renderArgument = (argument: Argument) => {
    const isOwnArgument = currentUser?.username === argument.username
    const isWithinEditWindow = !isPast(addMinutes(new Date(argument.createdAt), 5))
    const canEditDelete = isOwnArgument && isWithinEditWindow
    const isEditing = editingArgumentId === argument.id

    // Use real-time countdown if available, otherwise calculate
    const timeRemaining = editWindowCountdown[argument.id] !== undefined 
      ? editWindowCountdown[argument.id]
      : isWithinEditWindow 
        ? Math.max(0, differenceInSeconds(addMinutes(new Date(argument.createdAt), 5), new Date()))
        : 0

    // Format time with custom formatting
    const formatTimeAgo = (date: Date) => {
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds} sec ago`
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} min ago`
      } else {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
      }
    }

    return (
      <motion.div
        key={argument.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.95 }}
        transition={{ 
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={`group relative overflow-hidden rounded-xl border-0 shadow-lg transition-all duration-300 ${
          argument.side === DebateSide.Support 
            ? "bg-gradient-to-br from-green-50/90 via-emerald-50/80 to-green-100/70 dark:from-green-950/90 dark:via-emerald-950/80 dark:to-green-900/70 border-l-4 border-l-green-500" 
            : "bg-gradient-to-br from-red-50/90 via-pink-50/80 to-red-100/70 dark:from-red-950/90 dark:via-pink-950/80 dark:to-red-900/70 border-l-4 border-l-red-500"
        } backdrop-blur-sm`}
      >
        <div className="relative p-6">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Enhanced Avatar */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Avatar className="h-12 w-12 ring-2 ring-white/20 shadow-lg">
                  <AvatarImage
                    src={argument.username ? `https://api.dicebear.com/9.x/lorelei/svg?seed=${argument.username}` : ""}
                    alt={argument.username}
                  />
                  <AvatarFallback className={`text-sm font-semibold ${
                    argument.side === DebateSide.Support 
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white" 
                      : "bg-gradient-to-br from-red-500 to-pink-600 text-white"
                  }`}>
                    {argument.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              {/* Author Info */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-lg">{argument.username}</span>
                  {isOwnArgument && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
                    >
                      You
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatTimeAgo(new Date(argument.createdAt))}</span>
                </div>
              </div>
            </div>
            
            {/* Vote Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ArgumentVoteButton
                argumentId={argument.id}
                upvotes={argument.upvotes || 0}
                downvotes={argument.downvotes || 0}
                userVote={argument.userVote || null}
                onVoteChange={fetchDebateData}
                debateEnded={isDebateEnded}
              />
            </motion.div>
          </div>
          
          {/* Content Section */}
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-background/80 dark:bg-background/20 border border-border/50 rounded-lg backdrop-blur-sm"
            >
              <Textarea
                value={editingArgumentContent}
                onChange={(e) => setEditingArgumentContent(e.target.value)}
                className="w-full mb-4 bg-background/90 dark:bg-background/30 text-foreground border-border/50 focus:border-primary/50 transition-all duration-300 resize-none text-base leading-relaxed"
                placeholder="Edit your argument..."
                rows={4}
              />
              
              {/* Content Moderation Indicator for Edit */}
              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Edited content is automatically checked for inappropriate language</span>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingArgumentId(null)}
                  disabled={isPostingArgument}
                  className="hover:bg-muted/50 transition-all duration-200"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveEdit} 
                  disabled={isPostingArgument}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isPostingArgument ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Edit className="mr-2 h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-foreground leading-relaxed text-base font-medium"
            >
              {argument.content}
            </motion.p>
          )}

          {/* Edit/Delete Actions - Bottom Right */}
          {isOwnArgument && (
            <div className="flex items-center justify-end gap-2 mt-4">
              {isWithinEditWindow ? (
                <>
                  {/* Countdown Timer */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>{formatTime(timeRemaining)} left</span>
                  </motion.div>
                  
                  {/* Edit Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditArgument(argument)}
                      disabled={isPostingArgument}
                      className="h-9 w-9 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-all duration-200 shadow-sm"
                      title="Edit argument"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  
                  {/* Delete Button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteArgument(argument.id)}
                      disabled={isPostingArgument}
                      className="h-9 w-9 rounded-full bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-all duration-200 shadow-sm"
                      title="Delete argument"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-3 py-1.5 text-sm font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-800"
                >
                  Edit window expired
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Check if debateId is valid
  if (!debateId || debateId === "undefined") {
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
            <h1 className="text-3xl font-bold mb-4 text-foreground">Invalid Debate</h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              The debate ID is invalid. Please check the URL and try again.
            </p>
            <Button 
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isFetching || !debate) {
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
            <p className="mt-4 text-lg text-muted-foreground">Loading debate...</p>
          </motion.div>
        </div>
      </div>
    )
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
          {/* Enhanced Debate Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group">
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <CardHeader className="relative z-10">
                {debate?.image && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6"
                  >
                    <Image
                      src={debate.image}
                      alt="Debate Banner"
                      width={1200}
                      height={300}
                      className="w-full h-48 object-cover rounded-lg shadow-lg"
                    />
                  </motion.div>
                )}
                
                <div className="p-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex items-center justify-between mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 border-blue-500/30">
                        {debate?.category}
                      </Badge>
                      <Badge 
                        variant={debate?.status === "live" ? "default" : "secondary"} 
                        className={`${
                          debate?.status === "live" 
                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border-green-500/30 animate-pulse" 
                            : "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-600 border-gray-500/30"
                        }`}
                      >
                        {debate?.status === "live" && <Flame className="h-3 w-3 mr-1" />}
                        {debate?.status}
                      </Badge>
                      {debate?.status === "live" && (
                        <div className="flex items-center gap-1 text-green-500 text-xs">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          LIVE
                        </div>
                      )}
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const publicUrl = `${window.location.origin}/debate/${debateId}/public`
                          if (navigator.share) {
                            navigator
                              .share({
                                title: debate?.title,
                                text: debate?.description,
                                url: publicUrl,
                              })
                              .catch((error) => console.error("Error sharing:", error))
                          } else {
                            navigator.clipboard.writeText(publicUrl)
                            toast({
                              title: "Link Copied!",
                              description: "Public debate URL copied to clipboard.",
                              variant: "default",
                            })
                          }
                        }}
                        className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30 text-blue-600 hover:from-blue-500/20 hover:to-purple-500/20"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Debate
                      </Button>
                    </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <CardTitle className="text-3xl font-bold mb-3 text-foreground bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                      {debate?.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4 text-lg leading-relaxed">
                      {debate?.description}
                    </CardDescription>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {debate?.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      >
                        <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 hover:bg-primary/20">
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-center justify-between text-sm text-muted-foreground"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span>{participants.length} Participants</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-500" />
                        <span>
                          {isDebateEnded
                            ? "Ended"
                            : timeLeft !== null
                              ? `Ends in ${formatTime(timeLeft)}`
                              : "Calculating..."}
                        </span>
                      </div>
                    </div>
                    
                    {isDebateEnded && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3"
                      >
                        <Badge variant="destructive" className="text-lg px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20">
                          Debate Ended
                        </Badge>
                        <Button
                          onClick={() => router.push(`/debate/${debateId}/results`)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <Target className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>

          {/* Prominent Countdown Timer */}
          {!isDebateEnded && timeLeft !== null && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
                <CardContent className="p-8 relative z-10">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="flex justify-center mb-8"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 rounded-full flex items-center justify-center shadow-lg">
                        <Clock className="h-10 w-10 text-orange-600 dark:text-orange-400" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold text-foreground mb-8 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Debate Countdown
                    </h3>
                    
                    {/* Countdown Display */}
                    <div className="mb-8">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        {timeLeft >= 24 * 60 * 60 && (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-xl p-4 shadow-lg backdrop-blur-sm"
                          >
                            <span className="text-6xl font-bold text-orange-600 dark:text-orange-400 font-mono tracking-wider drop-shadow-lg">
                              {Math.floor(timeLeft / (24 * 60 * 60)).toString().padStart(2, "0")}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-semibold">Days</span>
                          </motion.div>
                        )}
                        
                        {timeLeft >= 24 * 60 * 60 && (
                          <span className="text-5xl font-bold text-orange-600 dark:text-orange-400 font-mono drop-shadow-lg">:</span>
                        )}
                        
                        {timeLeft >= 60 * 60 && (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 1, repeat: Infinity, delay: 0.1 }}
                            className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-xl p-4 shadow-lg backdrop-blur-sm"
                          >
                            <span className="text-6xl font-bold text-orange-600 dark:text-orange-400 font-mono tracking-wider drop-shadow-lg">
                              {Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60)).toString().padStart(2, "0")}
                            </span>
                            <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-semibold">Hours</span>
                          </motion.div>
                        )}
                        
                        {timeLeft >= 60 * 60 && (
                          <span className="text-5xl font-bold text-orange-600 dark:text-orange-400 font-mono drop-shadow-lg">:</span>
                        )}
                        
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                          className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-xl p-4 shadow-lg backdrop-blur-sm"
                        >
                          <span className="text-6xl font-bold text-orange-600 dark:text-orange-400 font-mono tracking-wider drop-shadow-lg">
                            {Math.floor((timeLeft % (60 * 60)) / 60).toString().padStart(2, "0")}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-semibold">Minutes</span>
                        </motion.div>
                        
                        <span className="text-5xl font-bold text-orange-600 dark:text-orange-400 font-mono drop-shadow-lg">:</span>
                        
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                          className="flex flex-col items-center bg-white/10 dark:bg-white/5 rounded-xl p-4 shadow-lg backdrop-blur-sm"
                        >
                          <span className="text-6xl font-bold text-orange-600 dark:text-orange-400 font-mono tracking-wider drop-shadow-lg">
                            {(timeLeft % 60).toString().padStart(2, "0")}
                          </span>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground mt-2 font-semibold">Seconds</span>
                        </motion.div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mb-6">
                      <span className="text-xl text-muted-foreground font-medium bg-white/10 dark:bg-white/5 px-6 py-2 rounded-full backdrop-blur-sm">
                        remaining
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {timeLeft < 300 ? "Less than 5 minutes left!" : "Join the discussion before time runs out!"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!hasJoined && !isDebateEnded && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <CardContent className="p-8 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground">Join the Debate</h2>
                        <p className="text-muted-foreground">Choose your side and start contributing</p>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                      Choose a side to post your arguments and influence the outcome. 
                      <span className="text-primary font-medium"> Your voice matters in this discussion.</span>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleJoinDebate(DebateSide.Support)}
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <ThumbsUp className="mr-2 h-5 w-5" />
                          )}
                          Join Support Side
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                          onClick={() => handleJoinDebate(DebateSide.Oppose)}
                          disabled={isJoining}
                        >
                          {isJoining ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <ThumbsDown className="mr-2 h-5 w-5" />
                          )}
                          Join Oppose Side
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {hasJoined && !isDebateEnded && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl overflow-hidden relative group">
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <CardContent className="p-8 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        userSide === DebateSide.Support 
                          ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                          : "bg-gradient-to-br from-red-500 to-pink-500"
                      }`}>
                        {userSide === DebateSide.Support ? (
                          <ThumbsUp className="h-6 w-6 text-white" />
                        ) : (
                          <ThumbsDown className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">
                          Your Side:{" "}
                          <span className={`${
                            userSide === DebateSide.Support 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {userSide}
                          </span>
                        </h2>
                        <p className="text-muted-foreground">Post your argument to contribute to your side.</p>
                      </div>
                    </div>
                    
                    {getReplyTimer(currentUser?.id || "", debateId) && !getReplyTimer(currentUser?.id || "", debateId)?.hasPostedFirstArgument && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <p className="font-semibold text-yellow-700 dark:text-yellow-300">Reply Timer</p>
                        </div>
                        <p className="text-yellow-700 dark:text-yellow-300">
                          You must post your first argument within{" "}
                          <span className="font-bold">
                            {formatTime(
                              Math.max(
                                0,
                                (() => {
                                  const timerState = getReplyTimer(currentUser?.id || "", debateId)
                                  if (!timerState) return 0
                                  const now = new Date()
                                  const timeDiff = now.getTime() - timerState.joinedAt.getTime()
                                  const fiveMinutesInMs = 5 * 60 * 1000
                                  return Math.floor((fiveMinutesInMs - timeDiff) / 1000)
                                })()
                              ),
                            )}
                          </span>{" "}
                          to remain active in this debate.
                        </p>
                        {(() => {
                          const timerState = getReplyTimer(currentUser?.id || "", debateId)
                          if (timerState && !timerState.hasPostedFirstArgument) {
                            const now = new Date()
                            const timeDiff = now.getTime() - timerState.joinedAt.getTime()
                            const fiveMinutesInMs = 5 * 60 * 1000
                            if (timeDiff > fiveMinutesInMs) {
                              return (
                                <motion.p 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="text-red-600 dark:text-red-400 font-bold mt-2"
                                >
                                  ⚠️ Time expired! You can no longer post arguments in this debate.
                                </motion.p>
                              )
                            }
                          }
                          return null
                        })()}
                      </motion.div>
                    )}
                    
                    <form onSubmit={argumentForm.handleSubmit(handlePostArgument)} className="space-y-4">
                      <div>
                        <Textarea
                          placeholder="Type your argument here.."
                          {...argumentForm.register("content")}
                          className="min-h-[140px] bg-background/80 dark:bg-background/20 border-2 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none text-lg leading-relaxed rounded-xl backdrop-blur-sm"
                          disabled={isPostingArgument || isDebateEnded || (() => {
                            const timerState = getReplyTimer(currentUser?.id || "", debateId)
                            if (timerState && !timerState.hasPostedFirstArgument) {
                              const now = new Date()
                              const timeDiff = now.getTime() - timerState.joinedAt.getTime()
                              const fiveMinutesInMs = 5 * 60 * 1000
                              return timeDiff > fiveMinutesInMs
                            }
                            return false
                          })()}
                        />
                        {argumentForm.formState.errors.content && (
                          <p className="text-red-500 text-sm mt-1">
                            {argumentForm.formState.errors.content.message}
                          </p>
                        )}
                        
                        {/* Content Moderation Indicator */}
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                          className="flex items-center gap-2 mt-2 text-xs text-muted-foreground"
                        >
                          <Shield className="h-3 w-3" />
                          <span>Content is automatically checked for inappropriate language</span>
                        </motion.div>
                        
                        {/* Content Moderation Status */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                          className="flex items-center gap-2 mt-2"
                        >
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                            <Shield className="h-3 w-3" />
                            <span>Content Moderation Active</span>
                          </div>
                        </motion.div>
                      </div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="flex justify-end"
                      >
                        <Button
                          type="submit"
                          disabled={isPostingArgument || isDebateEnded || (() => {
                            const timerState = getReplyTimer(currentUser?.id || "", debateId)
                            if (timerState && !timerState.hasPostedFirstArgument) {
                              const now = new Date()
                              const timeDiff = now.getTime() - timerState.joinedAt.getTime()
                              const fiveMinutesInMs = 5 * 60 * 1000
                              return timeDiff > fiveMinutesInMs
                            }
                            return false
                          })()}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          {isPostingArgument ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            </motion.div>
                          ) : (
                            <MessageSquare className="mr-2 h-5 w-5" />
                          )}
                          {isPostingArgument ? "Posting..." : "Post Argument"}
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl h-full flex flex-col overflow-hidden relative">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg p-6 relative z-10 hover:from-green-700 hover:to-emerald-700 transition-all duration-300">
                  <CardTitle className="text-2xl font-bold flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <ThumbsUp className="h-6 w-6" />
                      </motion.div>
                      <span>Support Side</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="h-5 w-5" />
                      </motion.div>
                      <span className="text-lg font-semibold">{totalSupportVotes} Votes</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                  <div className="mb-6 hover:bg-green-50/30 dark:hover:bg-green-950/20 rounded-lg p-3 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Vote Distribution</span>
                      <span className="text-sm font-bold text-green-600">{supportPercentage.toFixed(1)}%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${supportPercentage}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-3 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {supportPercentage.toFixed(1)}% of total votes
                    </p>
                  </div>
                  <div className="space-y-4 flex-1">
                    <AnimatePresence mode="popLayout">
                      {supportArguments.length > 0 ? (
                        supportArguments.map((argument, index) => (
                          <motion.div
                            key={argument.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-green-50/50 dark:bg-green-950/30 border border-green-200/50 dark:border-green-800/50 rounded-xl p-4 hover:shadow-lg hover:bg-green-100/70 dark:hover:bg-green-900/50 hover:border-green-300/70 dark:hover:border-green-700/70 hover:scale-[1.02] transition-all duration-300"
                          >
                            {renderArgument(argument)}
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-12 hover:bg-green-50/30 dark:hover:bg-green-950/20 rounded-lg transition-all duration-300"
                        >
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <MessageSquare className="h-16 w-16 text-green-500/50 mx-auto mb-4" />
                          </motion.div>
                          <p className="text-muted-foreground text-lg font-medium">No arguments yet for the Support side.</p>
                          <p className="text-sm text-muted-foreground mt-2">Be the first to contribute!</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-border/50 shadow-2xl h-full flex flex-col overflow-hidden relative">
                <CardHeader className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-t-lg p-6 relative z-10 hover:from-red-700 hover:to-pink-700 transition-all duration-300">
                  <CardTitle className="text-2xl font-bold flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <ThumbsDown className="h-6 w-6" />
                      </motion.div>
                      <span>Oppose Side</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <TrendingUp className="h-5 w-5" />
                      </motion.div>
                      <span className="text-lg font-semibold">{totalOpposeVotes} Votes</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex-1 flex flex-col relative z-10">
                  <div className="mb-6 hover:bg-red-50/30 dark:hover:bg-red-950/20 rounded-lg p-3 transition-all duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Vote Distribution</span>
                      <span className="text-sm font-bold text-red-600">{opposePercentage.toFixed(1)}%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${opposePercentage}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-3 bg-red-200 dark:bg-red-800 rounded-full overflow-hidden"
                    >
                      <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                    </motion.div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {opposePercentage.toFixed(1)}% of total votes
                    </p>
                  </div>
                  <div className="space-y-4 flex-1">
                    <AnimatePresence mode="popLayout">
                      {opposeArguments.length > 0 ? (
                        opposeArguments.map((argument, index) => (
                          <motion.div
                            key={argument.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-red-50/50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-800/50 rounded-xl p-4 hover:shadow-lg hover:bg-red-100/70 dark:hover:bg-red-900/50 hover:border-red-300/70 dark:hover:border-red-700/70 hover:scale-[1.02] transition-all duration-300"
                          >
                            {renderArgument(argument)}
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-12 hover:bg-red-50/30 dark:hover:bg-red-950/20 rounded-lg transition-all duration-300"
                        >
                          <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <MessageSquare className="h-16 w-16 text-red-500/50 mx-auto mb-4" />
                          </motion.div>
                          <p className="text-muted-foreground text-lg font-medium">No arguments yet for the Oppose side.</p>
                          <p className="text-sm text-muted-foreground mt-2">Be the first to contribute!</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <Dialog open={isContentModerationModalOpen} onOpenChange={setIsContentModerationModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background border-red-200 dark:border-red-800">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-red-600 dark:text-red-400">
              Inappropriate Language Detected
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground mt-2">
              Your argument contains inappropriate language. Please use respectful language to maintain a healthy debate environment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Detected Inappropriate Words:
              </h3>
              <div className="flex flex-wrap gap-2">
                {toxicWords.map((word, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Tip:</strong> Please revise your content to remove inappropriate language and ensure your argument is respectful and constructive.
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsContentModerationModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => setIsContentModerationModalOpen(false)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              I Understand
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
