"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { AuthenticatedHeader } from "@/components/authenticated-header"
import { updateUserProfile } from "@/app/actions"
import { useDebateStore } from "@/lib/store"
import { useEffect } from "react"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  currentPassword: z.string().optional().or(z.literal("")),
  newPassword: z.string().min(6, "New password must be at least 6 characters").optional().or(z.literal("")),
})

type SettingsFormValues = z.infer<typeof formSchema>

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const currentUser = useDebateStore((state) => state.currentUser)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      currentPassword: "",
      newPassword: "",
    },
  })

  useEffect(() => {
    if (currentUser) {
      form.reset({
        username: currentUser.username,
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
      })
    }
  }, [currentUser, form])

  const onSubmit = async (values: SettingsFormValues) => {
    setIsLoading(true)
    try {
      if (!currentUser?.id) {
        toast({
          title: "Error",
          description: "User not found. Please log in again.",
          variant: "destructive",
        })
        return
      }
      
      const result = await updateUserProfile(currentUser.id, values)
      if (result.success) {
        // Update the current user in the store with new data
        if (result.user) {
          useDebateStore.getState().setCurrentUser({
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            totalVotesReceived: result.user.totalVotesReceived,
            debatesParticipated: result.user.debatesParticipated,
          })
        }
        
        toast({
          title: "Success!",
          description: "Profile updated successfully.",
          variant: "default",
        })
        form.reset({
          username: result.user?.username || "",
          email: result.user?.email || "",
          currentPassword: "",
          newPassword: "",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Update profile error:", error)
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
    <div className="flex min-h-screen flex-col bg-background">
      <AuthenticatedHeader />
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mx-auto"
        >
          <Card className="w-full bg-card text-card-foreground shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your profile information and password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" placeholder="Your username" {...form.register("username")} />
                  {form.formState.errors.username && (
                    <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@example.com" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currentPassword">Current Password (for changes)</Label>
                  <Input id="currentPassword" type="password" {...form.register("currentPassword")} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" {...form.register("newPassword")} />
                  {form.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
