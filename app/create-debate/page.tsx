"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/header"
import { createDebate } from "@/app/actions"
import { DebateCategory, DebateDuration } from "@/lib/types"
import { useSession } from "next-auth/react"
import type { User } from "@/lib/types"
import { Sparkles, MessageSquare, Target, Clock, Tag, Image, Zap, Flame, TrendingUp } from "lucide-react"
import LoadingSpinner from "@/components/ui/loading-spinner"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.string().optional(),
  category: z.nativeEnum(DebateCategory, {
    required_error: "Please select a category.",
  }),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  duration: z.nativeEnum(DebateDuration, {
    required_error: "Please select a debate duration.",
  }),
})

type CreateDebateFormValues = z.infer<typeof formSchema>

export default function CreateDebatePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const currentUser = session?.user as User | undefined
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form hook at the top level - before any conditional returns
  const form = useForm<CreateDebateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      tags: "",
      category: DebateCategory.Politics, // Default value
      image: "",
      duration: DebateDuration.OneHour, // Default value
    },
  })

  // Redirect if not authenticated
  if (status === "loading") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)]">
            <LoadingSpinner />
          </div>
        </main>
      </div>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const onSubmit = async (values: CreateDebateFormValues) => {
    setIsLoading(true)
    try {
      // Parse tags from comma-separated string
      const tags = values.tags ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      
      // Convert duration enum to number (hours)
      const durationHours = values.duration === DebateDuration.OneHour ? 1 :
                           values.duration === DebateDuration.TwelveHours ? 12 :
                           values.duration === DebateDuration.TwentyFourHours ? 24 :
                           values.duration === DebateDuration.ThreeDays ? 72 :
                           values.duration === DebateDuration.SevenDays ? 168 : 24

      const result = await createDebate({
        title: values.title,
        description: values.description,
        category: values.category,
        tags,
        duration: durationHours,
        creatorId: currentUser!.id,
        creatorUsername: currentUser!.username || "Anonymous",
      })
      
      if (result.success && result.debate) {
        toast({
          title: "Success!",
          description: "Debate created successfully.",
          variant: "default",
        })
        router.push(`/debate/${result.debate.id}/live`)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create debate.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Create debate error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl mx-auto"
        >
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center gap-2"
              >
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                <span className="text-sm font-medium text-orange-500">CREATE DEBATE</span>
              </motion.div>
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
            >
              Create New Debate
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Set up your debate topic and invite others to join. 
              <span className="text-primary font-medium"> Start meaningful discussions.</span>
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="w-full bg-card/50 backdrop-blur-xl border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden relative">
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              
              <CardHeader className="text-center relative z-10">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="inline-flex items-center gap-2 mb-4"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold">Create Your Debate</CardTitle>
                <CardDescription className="text-muted-foreground text-base">
                  Fill in the details below to create an engaging debate topic.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 relative z-10">
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
                  {/* Title Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      Debate Title
                    </Label>
                    <Input 
                      id="title" 
                      type="text" 
                      placeholder="Should AI be regulated?" 
                      {...form.register("title")}
                      className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 text-lg"
                    />
                    {form.formState.errors.title && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {form.formState.errors.title.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Description Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="description" className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a brief overview of the debate topic and its key aspects."
                      {...form.register("description")}
                      className="min-h-[120px] bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300 resize-none"
                    />
                    {form.formState.errors.description && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {form.formState.errors.description.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Tags Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="tags" className="text-base font-semibold flex items-center gap-2">
                      <Tag className="h-4 w-4 text-green-500" />
                      Tags (comma-separated)
                    </Label>
                    <Input 
                      id="tags" 
                      type="text" 
                      placeholder="e.g., tech, ethics, society" 
                      {...form.register("tags")}
                      className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                    />
                    {form.formState.errors.tags && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {form.formState.errors.tags.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Category and Duration Row */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Category Section */}
                    <div className="space-y-3">
                      <Label htmlFor="category" className="text-base font-semibold flex items-center gap-2">
                        <Target className="h-4 w-4 text-orange-500" />
                        Category
                      </Label>
                      <Select
                        onValueChange={(value) => form.setValue("category", value as DebateCategory)}
                        defaultValue={form.getValues("category")}
                      >
                        <SelectTrigger id="category" className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                          {Object.values(DebateCategory).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.category && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive"
                        >
                          {form.formState.errors.category.message}
                        </motion.p>
                      )}
                    </div>

                    {/* Duration Section */}
                    <div className="space-y-3">
                      <Label htmlFor="duration" className="text-base font-semibold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-indigo-500" />
                        Duration
                      </Label>
                      <Select
                        onValueChange={(value) => form.setValue("duration", value as DebateDuration)}
                        defaultValue={form.getValues("duration")}
                      >
                        <SelectTrigger id="duration" className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="bg-card/95 backdrop-blur-xl border-border/50">
                          {Object.values(DebateDuration).map((duration) => (
                            <SelectItem key={duration} value={duration}>
                              {duration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.duration && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive"
                        >
                          {form.formState.errors.duration.message}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>

                  {/* Image URL Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="space-y-3"
                  >
                    <Label htmlFor="image" className="text-base font-semibold flex items-center gap-2">
                      <Image className="h-4 w-4 text-pink-500" />
                      Image/Banner URL (Optional)
                    </Label>
                    <Input
                      id="image"
                      type="url"
                      placeholder="https://example.com/banner.jpg"
                      {...form.register("image")}
                      className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all duration-300"
                    />
                    {form.formState.errors.image && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {form.formState.errors.image.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    className="pt-4"
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Creating Debate...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Create Debate
                          <motion.div
                            initial={{ x: 0 }}
                            whileHover={{ x: 4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Zap className="h-5 w-5" />
                          </motion.div>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
