import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import models from "@/lib/models"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase()
    
    const now = new Date()
    
    // Find all debates that have ended but still have "live" status
    const endedDebates = await models.DebateModel.find({
      status: "live",
      endsAt: { $lte: now }
    })
    
    if (endedDebates.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No debates need to be updated",
        updatedCount: 0 
      })
    }
    
    // Update all ended debates to "ended" status
    const updateResult = await models.DebateModel.updateMany(
      {
        status: "live",
        endsAt: { $lte: now }
      },
      {
        $set: { status: "ended" }
      }
    )
    
    return NextResponse.json({ 
      success: true, 
      message: `Updated ${updateResult.modifiedCount} debates to ended status`,
      updatedCount: updateResult.modifiedCount
    })
    
  } catch (error) {
    console.error("Error updating ended debates:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update ended debates" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Connect to database
    await connectToDatabase()
    
    const now = new Date()
    
    // Find all debates that have ended but still have "live" status
    const endedDebates = await models.DebateModel.find({
      status: "live",
      endsAt: { $lte: now }
    }).select('_id title endsAt status')
    
    return NextResponse.json({ 
      success: true, 
      endedDebates: endedDebates.map((debate: any) => ({
        id: debate._id.toString(),
        title: debate.title,
        endsAt: debate.endsAt,
        status: debate.status
      })),
      count: endedDebates.length
    })
    
  } catch (error) {
    console.error("Error fetching ended debates:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch ended debates" },
      { status: 500 }
    )
  }
} 