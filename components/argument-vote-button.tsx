"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { useSession } from "next-auth/react"
import { voteOnArgument } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface ArgumentVoteButtonProps {
  argumentId: string
  upvotes: number
  downvotes: number
  userVote?: "upvote" | "downvote" | null
  onVoteChange?: () => void // Callback to refresh data after vote
  debateEnded?: boolean // New prop to disable voting when debate ends
}

export function ArgumentVoteButton({ argumentId, upvotes, downvotes, userVote, onVoteChange, debateEnded = false }: ArgumentVoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false)
  const { data: session } = useSession()
  const { toast } = useToast()
  const currentUser = session?.user

  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (debateEnded) {
      toast({
        title: "Debate Ended",
        description: "Voting is disabled. This debate has concluded.",
        variant: "destructive",
      })
      return
    }

    if (!currentUser?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote on arguments.",
        variant: "destructive",
      })
      return
    }

    setIsVoting(true)
    try {
      const result = await voteOnArgument(argumentId, currentUser.id, voteType)
      
      if (result.success) {
        // Call the callback to refresh the data
        onVoteChange?.()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to vote on argument.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error voting on argument:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while voting.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const currentUserVote = userVote
  const netVotes = upvotes - downvotes

  return (
    <div className="flex items-center gap-3">
      {/* Upvote Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
            debateEnded 
              ? "text-muted-foreground/50 cursor-not-allowed opacity-50" 
              : currentUserVote === "upvote" 
                ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 shadow-lg" 
                : "text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
          }`}
          onClick={() => handleVote("upvote")}
          disabled={isVoting || debateEnded}
          title={debateEnded ? "Voting disabled - debate ended" : "Upvote this argument"}
        >
          <motion.div
            animate={currentUserVote === "upvote" ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsUp className="h-4 w-4" />
          </motion.div>
          <span className="text-sm font-semibold">{upvotes}</span>
        </Button>
      </motion.div>

      {/* Downvote Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ${
            debateEnded 
              ? "text-muted-foreground/50 cursor-not-allowed opacity-50" 
              : currentUserVote === "downvote" 
                ? "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400 shadow-lg" 
                : "text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          }`}
          onClick={() => handleVote("downvote")}
          disabled={isVoting || debateEnded}
          title={debateEnded ? "Voting disabled - debate ended" : "Downvote this argument"}
        >
          <motion.div
            animate={currentUserVote === "downvote" ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <ThumbsDown className="h-4 w-4" />
          </motion.div>
          <span className="text-sm font-semibold">{downvotes}</span>
        </Button>
      </motion.div>

      {/* Net Vote Display */}
      <AnimatePresence>
        {netVotes !== 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`flex items-center justify-center px-3 py-1.5 rounded-full text-sm font-bold shadow-sm ${
              netVotes > 0 
                ? "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
                : "text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            <motion.span
              animate={netVotes > 0 ? { y: [0, -2, 0] } : { y: [0, 2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {netVotes > 0 ? '+' : ''}{netVotes}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Indicator */}
      <AnimatePresence>
        {isVoting && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex items-center justify-center w-6 h-6"
          >
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 