"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { declareDebateWinner } from "@/app/actions"
import type { Debate } from "@/lib/types"
import { useEffect } from "react"

const formSchema = z.object({
  winnerSide: z.enum(["support", "oppose", "tie"], {
    required_error: "Please select a winning side or declare a tie.",
  }),
})

type DeclareWinnerFormValues = z.infer<typeof formSchema>

export default function DeclareWinnerPage({ params }: { params: { id: string } }) {
  const debateId = params.id
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [debate, setDebate] = useState<Debate | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const form = useForm<DeclareWinnerFormValues>({
    resolver: zodResolver(formSchema),
  })

  useEffect(() => {
    const fetchDebate = async () => {
      try {
        const response = await fetch(`/api/debates/${debateId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch debate details")
        }
        const data = await response.json()
        setDebate(data)
      } catch (err: any) {
        setFetchError(err.message)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      }
    }
    fetchDebate()
  }, [debateId, toast])

  const onSubmit = async (values: DeclareWinnerFormValues) => {
    setIsLoading(true)
    try {
      const result = await declareDebateWinner(debateId, values.winnerSide)
      if (result.success) {
        toast({
          title: "Success!",
          description: "Debate winner declared successfully.",
          variant: "default",
        })
        router.push(`/debate/${debateId}/results`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to declare winner.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Declare winner error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (fetchError) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AuthenticatedHeader />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <p className="text-center text-destructive">{fetchError}</p>
        </main>
      </div>
    )
  }

  if (!debate) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <AuthenticatedHeader />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <p className="text-center text-muted-foreground">Loading debate details...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AuthenticatedHeader />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <Card className="w-full bg-card text-card-foreground shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Declare Winner for &quot;{debate.title}&quot;</CardTitle>
              <CardDescription className="text-muted-foreground">
                Select the winning side or declare a tie for this debate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <div className="grid gap-2">
                  <Label className="text-base">Winning Side</Label>
                  <RadioGroup
                    onValueChange={form.setValue("winnerSide")}
                    defaultValue={form.getValues("winnerSide")}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="support" id="support" />
                      <Label htmlFor="support">Support Side Wins</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="oppose" id="oppose" />
                      <Label htmlFor="oppose">Oppose Side Wins</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tie" id="tie" />
                      <Label htmlFor="tie">Declare a Tie</Label>
                    </div>
                  </RadioGroup>
                  {form.formState.errors.winnerSide && (
                    <p className="text-sm text-destructive">{form.formState.errors.winnerSide.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Declaring..." : "Declare Winner"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
