import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const envVars = {
    MONGODB_URI: !!process.env.MONGODB_URI,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
  }

  const missingVars = Object.entries(envVars)
    .filter(([_, exists]) => !exists)
    .map(([name]) => name)

  if (missingVars.length > 0) {
    return NextResponse.json({
      success: false,
      message: "Missing required environment variables",
      missing: missingVars,
      instructions: `
        Please create a .env.local file in your project root with the following variables:
        
        MONGODB_URI=your_mongodb_connection_string
        NEXTAUTH_SECRET=your_random_secret_string
        NEXTAUTH_URL=http://localhost:3000
        
        Example MongoDB URI: mongodb://localhost:27017/debatehub
        Example NEXTAUTH_SECRET: your-super-secret-key-here
      `
    }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    message: "All required environment variables are set",
    envVars
  })
} 