import { z } from "zod"
import { DebateCategory, DebateDuration } from "./types"

export const createDebateSchema = z.object({
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

export const postArgumentSchema = z.object({
  content: z.string().min(10, "Argument must be at least 10 characters"),
})

export const updateArgumentSchema = z.object({
  argumentId: z.string(),
  content: z.string().min(10, "Argument must be at least 10 characters"),
})

export const declareWinnerSchema = z.object({
  winnerSide: z.enum(["support", "oppose", "tie"], {
    required_error: "Please select a winning side or declare a tie.",
  }),
})

export const updateUserProfileSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters").optional().or(z.literal("")),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    currentPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().min(6, "New password must be at least 6 characters").optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false // New password provided, but current password is missing
      }
      return true
    },
    {
      message: "Current password is required to change password.",
      path: ["currentPassword"],
    },
  )

export const registerUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const searchDebatesSchema = z.object({
  query: z.string().optional(),
  category: z.nativeEnum(DebateCategory).optional(),
  tag: z.string().optional(),
  status: z.enum(["live", "ended", "all"]).optional(),
  sortBy: z.enum(["newest", "oldest", "most_voted", "ending_soon"]).optional(),
})

export const joinDebateSchema = z.object({
  side: z.enum(["support", "oppose"], {
    required_error: "Please select a side to join.",
  }),
  argument: z.string().min(10, "Initial argument must be at least 10 characters"),
})

export type JoinDebateForm = z.infer<typeof joinDebateSchema>
