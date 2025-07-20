"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthHeader } from "@/components/auth-header"
import { useToast } from "@/hooks/use-toast"
import { registerUser } from "@/app/actions"
import { ArrowRight, Eye, EyeOff, Zap } from "lucide-react"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignUpFormValues = z.infer<typeof formSchema>

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true)
    try {
      const result = await registerUser(values)
      if (result.success) {
        toast({
          title: "Success!",
          description: "Account created successfully. Please log in.",
          variant: "default",
        })
        router.push("/login")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create account.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Sign up error:", error)
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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-deep-dark overflow-hidden">
      {/* Dark Mode Background Elements */}
      <div className="dark:block hidden absolute inset-0">
        {/* Animated Texture Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)] animate-pulse" style={{ animationDuration: '4s' }}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.06)_1px,transparent_1px)] bg-[size:80px_80px] opacity-15 animate-pulse" style={{ animationDuration: '6s' }}></div>
        
        {/* Animated Scattered Dots */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-500 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-indigo-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-purple-500 rounded-full opacity-35 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-blue-500 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-3/4 left-1/2 w-1 h-1 bg-indigo-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '4s' }}></div>
          <div className="absolute top-1/5 right-1/5 w-1 h-1 bg-purple-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '5s' }}></div>
          <div className="absolute top-4/5 left-1/5 w-1 h-1 bg-blue-500 rounded-full opacity-35 animate-pulse" style={{ animationDelay: '6s' }}></div>
          <div className="absolute top-1/6 right-1/2 w-1 h-1 bg-indigo-500 rounded-full opacity-25 animate-pulse" style={{ animationDelay: '7s' }}></div>
          <div className="absolute top-5/6 left-2/3 w-1 h-1 bg-purple-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '8s' }}></div>
        </div>
      </div>

      {/* Light Mode Background Elements */}
      <div className="light:block hidden absolute inset-0">
        {/* Clean gradient background */}
        <div className="absolute inset-0 hero-gradient"></div>
        
        {/* Cloud texture overlay */}
        <div className="absolute inset-0 hero-cloud-texture"></div>
        
        {/* Texture dots pattern */}
        <div className="absolute inset-0 texture-dots opacity-60"></div>
        
        {/* Subtle floating elements for light mode */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-300 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-indigo-200 rounded-full opacity-35 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <AuthHeader />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl px-8 py-8"
      >
        <Card className="w-full bg-deep-dark-card backdrop-blur-xl border-border/30 text-card-foreground shadow-2xl">
          <CardContent className="p-10">
            {/* ArenaX Logo */}
            <div className="flex flex-col items-center mb-10">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <motion.span 
                  className="text-2xl font-semibold text-gray-900 dark:text-white relative"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <span className="relative z-10">ArenaX</span>
                  <span className="absolute inset-0 text-2xl font-semibold text-blue-400 blur-sm animate-pulse">
                    ArenaX
                  </span>
                  <span className="absolute inset-0 text-2xl font-semibold text-indigo-400 blur-md animate-pulse" style={{ animationDelay: '0.5s' }}>
                    ArenaX
                  </span>
                  <span className="absolute inset-0 text-2xl font-semibold text-purple-400 blur-lg animate-pulse" style={{ animationDelay: '1s' }}>
                    ArenaX
                  </span>
                </motion.span>
              </div>
              <h1 className="text-2xl font-bold text-center mt-4 mb-2 text-gray-900 dark:text-white">Join ArenaX</h1>
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm">Create your account to start debating.</p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter Your Username" 
                  {...form.register("username")}
                  className="bg-deep-dark-muted border-border/30 focus:border-blue-500 h-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter Your Email Address" 
                  {...form.register("email")}
                  className="bg-deep-dark-muted border-border/30 focus:border-blue-500 h-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    {...form.register("password")}
                    className="bg-deep-dark-muted border-border/30 focus:border-blue-500 pr-10 h-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg px-4 py-3 flex items-center justify-between shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                disabled={isLoading}
              >
                <span>{isLoading ? "Signing Up..." : "Sign Up"}</span>
                <div className="bg-white rounded px-2 py-1">
                  <ArrowRight className="h-3 w-3 text-gray-700" />
                </div>
              </Button>
            </form>

            <div className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">
              Already Have an Account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
