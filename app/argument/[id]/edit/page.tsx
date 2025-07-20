"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useDebateStore } from "@/lib/store"
import { updateArgumentSchema } from "@/lib/schemas"
import { z } from "zod"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Edit, ArrowLeft } from "lucide-react"

type EditArgumentForm = z.infer<typeof updateArgumentSchema>

export default function EditArgumentPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { checkContentModeration } = useDebateStore()
  const [argument, setArgument] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<EditArgumentForm>({
    resolver: zodResolver(updateArgumentSchema),
    defaultValues: {
      content: argument?.content || "",
    },
  })

  useEffect(() => {
    // Simulate fetching argument data
    const fetchArgument = async () => {
      try {
        // Mock data for demonstration
        const mockArgument = {
          id: params.id,
          content: "This is a sample argument that can be edited.",
          authorId: session?.user?.id,
          debateId: "debate-123",
          createdAt: new Date(),
        }
        setArgument(mockArgument)
        setValue("content", mockArgument.content)
      } catch (error) {
        console.error("Error fetching argument:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchArgument()
    }
  }, [session, params.id, setValue])

  const canEditArgument = (argument: any) => {
    if (!argument || !session?.user) return false
    const now = new Date()
    const createdAt = new Date(argument.createdAt)
    const fiveMinutesInMs = 5 * 60 * 1000
    return now.getTime() - createdAt.getTime() < fiveMinutesInMs
  }

  const editArgument = (argumentId: string, content: string) => {
    // Mock function for demonstration
    console.log("Editing argument:", argumentId, content)
  }

  const onSubmit = async (data: EditArgumentForm) => {
    if (!session?.user || !argument) return

    if (!canEditArgument(argument)) {
      toast({
        title: "Edit time has expired (5 minutes)",
        description: "You can only edit your own arguments.",
        variant: "destructive",
      })
      return
    }

    if (argument.authorId !== session.user.id) {
      toast({
        title: "Access Denied",
        description: "You can only edit your own arguments.",
        variant: "destructive",
      })
      return
    }

    // Check for toxic content
    const toxicWords = checkContentModeration(data.content)
    if (toxicWords.length > 0) {
      toast({
        title: "Inappropriate language detected",
        description: `Inappropriate language detected: ${toxicWords.join(", ")}. Please use respectful language to maintain a healthy debate environment.`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      editArgument(params.id, data.content)
      toast({
        title: "Argument updated successfully!",
        description: "Argument updated successfully!",
      })
      router.push(`/debate/${argument.debateId}/live`)
    } catch (error) {
      toast({
        title: "Failed to update argument",
        description: "Failed to update argument. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!argument || !argument.debateId) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Argument Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The argument you're looking for doesn't exist or has been removed.
            </p>
            <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">Back to Home</Button>
          </div>
        </div>
      </div>
    )
  }

  if (argument.authorId !== session.user.id) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="rounded-full bg-destructive/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h1>
              <p className="text-muted-foreground mb-4">You can only edit your own arguments.</p>
            </div>
            <Link href={`/debate/${argument.debateId}/live`}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">Back to Debate</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!canEditArgument(argument)) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <div className="rounded-full bg-amber-500/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-amber-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">Edit Time Expired</h1>
              <p className="text-muted-foreground mb-4">
                Arguments can only be edited within 5 minutes of posting. This time limit has passed.
              </p>
            </div>
            <Link href={`/debate/${argument.debateId}/live`}>
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">Back to Debate</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

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
              href={`/debate/${argument.debateId}`}
              className="text-base font-medium leading-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              {argument.debateId}
            </Link>
            <span className="text-base font-medium leading-normal text-muted-foreground">/</span>
            <span className="text-base font-medium leading-normal text-foreground">Edit Argument</span>
          </motion.nav>

          {/* Time Warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400">Edit Time Remaining</h4>
                    <p className="text-xs text-amber-300/80">
                      You have {formatTimeRemaining(5 * 60 * 1000 - (new Date().getTime() - new Date(argument?.createdAt).getTime()))} left to edit this argument
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Argument Editor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MessageSquare className="h-5 w-5" />
                    Edit Your Argument
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    {...register("content")}
                    placeholder="Edit your argument..."
                    className="min-h-40 rounded-xl border-none bg-input text-foreground placeholder:text-muted-foreground focus:ring-0 resize-none"
                  />

                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {errors.content && <span className="text-destructive">{errors.content.message}</span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{argument?.content?.length || 0}/1000 characters</div>
                  </div>

                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-blue-500/20 p-1 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-blue-400 mb-1">Edit Guidelines</h4>
                        <ul className="text-xs text-blue-300/80 space-y-1">
                          <li>• You can only edit within 5 minutes of posting</li>
                          <li>• Maintain the core message of your original argument</li>
                          <li>• Fix typos, improve clarity, or add supporting details</li>
                          <li>• Edited arguments will show an "edited" indicator</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-between pt-4"
            >
              <Link href={`/debate/${argument.debateId}/live`}>
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  Cancel
                </Button>
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting || !argument?.content?.trim() || !canEditArgument(argument)}
                className="bg-primary hover:bg-primary/80 text-primary-foreground font-bold px-8 py-3"
              >
                                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Updating...
                    </div>
                ) : (
                  "Update Argument"
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
