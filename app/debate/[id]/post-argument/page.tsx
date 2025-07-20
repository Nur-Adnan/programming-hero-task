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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FullFeaturedHeader } from "@/components/full-featured-header"
import { postArgumentSchema, type PostArgumentForm } from "@/lib/schemas"
import { useDebateStore } from "@/lib/store"
import { Clock, MessageSquare, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { getDebateDetails, checkUserParticipation, postArgument as postArgumentAction } from "@/app/actions"
import { Debate } from "@/lib/types"

import { use } from "react"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function PostArgumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: debateId } = use(params)

  const { data: clientSession, status } = useSession()
  const router = useRouter()
  const { checkContentModeration, isReplyTimerExpired } = useDebateStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debate, setDebate] = useState<Debate | null>(null)
  const [userParticipation, setUserParticipation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostArgumentForm>({
    resolver: zodResolver(postArgumentSchema),
  })

  const content = watch("content")

  useEffect(() => {
    const fetchDebateData = async () => {
      try {
        // Fetch debate details
        const { debate: fetchedDebate, error: debateError } = await getDebateDetails(debateId)
        if (debateError) {
          console.error("Error fetching debate:", debateError)
          toast.error("Failed to load debate")
          return
        }
        setDebate(fetchedDebate)

        // Check user participation
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

    if (debateId && clientSession?.user?.id) {
      fetchDebateData()
    }
  }, [debateId, clientSession?.user?.id])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  const onSubmit = async (data: PostArgumentForm) => {
    if (!clientSession?.user || !debate || !userParticipation) return

    // Check content moderation
    const toxicWords = checkContentModeration(data.content)
    if (toxicWords.length > 0) {
      toast.error(`Inappropriate language detected: ${toxicWords.join(", ")}. Please use respectful language to maintain a healthy debate environment.`)
      return
    }

    // Check if reply timer has expired
    if (isReplyTimerExpired(clientSession.user.id, debateId)) {
      toast.error("Your reply timer has expired. You can no longer post arguments in this debate.")
      router.push(`/debate/${debateId}/live`)
      return
    }

    setIsSubmitting(true)

    try {
      const result = await postArgumentAction(debateId, clientSession.user.id, userParticipation.side, data.content)
      
      if (result.success) {
        toast.success("Argument posted successfully!")
        router.push(`/debate/${debateId}/live`)
      } else {
        toast.error(result.error || "Failed to post argument. Please try again.")
      }
    } catch (error) {
      console.error("Error posting argument:", error)
      toast.error("Failed to post argument. Please try again.")
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

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!clientSession) {
    return null
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <FullFeaturedHeader />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Debate Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The debate you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!userParticipation) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <FullFeaturedHeader />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Participating</h1>
            <p className="text-muted-foreground mb-6">
              You need to join this debate before you can post arguments.
            </p>
            <Link href={`/debate/${debateId}`}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">Join Debate</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (debate.status === "ended") {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <FullFeaturedHeader />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Debate Has Ended</h1>
            <p className="text-muted-foreground mb-6">
              This debate has concluded. You can no longer post arguments.
            </p>
            <Link href={`/debate/${debateId}/results`}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">View Results</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FullFeaturedHeader />

      <div className="flex flex-1 justify-center px-4 py-5 lg:px-40">
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
            className="flex flex-wrap gap-2 p-4 mb-4"
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
            <span className="text-base font-medium leading-normal text-foreground">Post Argument</span>
          </motion.nav>

          {/* Debate Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-xl font-bold mb-2 text-foreground">{debate.title}</h1>
                    <p className="text-muted-foreground">{debate.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-secondary text-foreground">
                      {debate.category}
                    </Badge>
                    {debate.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="border-border text-muted-foreground">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeRemaining(debate.endsAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {userParticipation.side === "support" ? "Support" : "Oppose"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reply Timer Warning */}
          {isReplyTimerExpired(clientSession.user.id, debateId) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <h3 className="font-semibold text-destructive mb-1">Reply Timer Expired</h3>
                      <p className="text-sm text-muted-foreground">
                        Your reply timer has expired. You can no longer post arguments in this debate.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Post Argument Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageSquare className="h-5 w-5" />
                  Post Your Argument
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Label htmlFor="content" className="text-base font-medium text-foreground mb-2 block">
                      Your Argument
                    </Label>
                    <Textarea
                      id="content"
                      placeholder="Write your argument here..."
                      className="min-h-[200px] bg-input border-border text-foreground placeholder:text-muted-foreground"
                      {...register("content")}
                    />
                    {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
                    <p className="text-xs text-muted-foreground mt-2">
                      {content?.length || 0}/1000 characters
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting || isReplyTimerExpired(clientSession.user.id, debateId)}
                      className="bg-primary hover:bg-primary/80 text-primary-foreground"
                    >
                      {isSubmitting ? "Posting..." : "Post Argument"}
                    </Button>
                    <Link href={`/debate/${debateId}/live`}>
                      <Button
                        type="button"
                        variant="secondary"
                        className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
