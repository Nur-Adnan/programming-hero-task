import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    username: string
    image?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      username: string
      image?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    username: string
    image?: string
  }
} 