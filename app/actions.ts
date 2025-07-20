"use server"

import { connectToDatabase } from "@/lib/mongodb"
import models from "@/lib/models"
import mongoose from "mongoose"

// Utility function to validate ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id)
}

// User profile functions
export async function getUserProfile(userId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate ObjectId
    if (!isValidObjectId(userId)) {
      return { user: null, error: "Invalid user ID" }
    }
    
    // Find user by ID
    const user = await models.UserModel.findById(userId).select('-password')
    
    if (!user) {
      return { user: null, error: "User not found" }
    }
    
    // Return user data without password
    const userResponse = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      totalVotesReceived: user.totalVotesReceived,
      debatesParticipated: user.debatesParticipated,
    }
    
    return { user: userResponse, error: null }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return { user: null, error: "Failed to fetch user profile" }
  }
}

export async function updateUserProfile(userId: string, updates: {
  username?: string
  email?: string
  currentPassword?: string
  newPassword?: string
}) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Import bcrypt for password hashing
    const bcrypt = await import("bcryptjs")
    
    // Validate ObjectId
    if (!isValidObjectId(userId)) {
      return { success: false, user: null, error: "Invalid user ID" }
    }
    
    // Find the user
    const user = await models.UserModel.findById(userId)
    
    if (!user) {
      return { success: false, user: null, error: "User not found" }
    }
    
    // Update fields
    const updateData: any = {}
    
    if (updates.username) {
      // Check if username is already taken
      const existingUser = await models.UserModel.findOne({ username: updates.username, _id: { $ne: userId } })
      if (existingUser) {
        return { success: false, user: null, error: "Username already taken" }
      }
      updateData.username = updates.username
    }
    
    if (updates.email) {
      // Check if email is already taken
      const existingUser = await models.UserModel.findOne({ email: updates.email, _id: { $ne: userId } })
      if (existingUser) {
        return { success: false, user: null, error: "Email already taken" }
      }
      updateData.email = updates.email
    }
    
    if (updates.newPassword && updates.currentPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(updates.currentPassword, user.password)
      if (!isPasswordValid) {
        return { success: false, user: null, error: "Current password is incorrect" }
      }
      
      // Hash new password
      updateData.password = await bcrypt.hash(updates.newPassword, 12)
    }
    
    // Update user
    const updatedUser = await models.UserModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password')
    
    if (!updatedUser) {
      return { success: false, user: null, error: "Failed to update user" }
    }
    
    // Return updated user data
    const userResponse = {
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      totalVotesReceived: updatedUser.totalVotesReceived,
      debatesParticipated: updatedUser.debatesParticipated,
    }
    
    return { success: true, user: userResponse, error: null }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, user: null, error: "Failed to update user profile" }
  }
}

// User registration function
export async function registerUser(userData: {
  username: string
  email: string
  password: string
}) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Import bcrypt for password hashing
    const bcrypt = await import("bcryptjs")
    
    // Check if user already exists
    const existingUser = await models.UserModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    })
    
    if (existingUser) {
      if (existingUser.email === userData.email) {
        return { success: false, user: null, error: "Email already registered" }
      }
      if (existingUser.username === userData.username) {
        return { success: false, user: null, error: "Username already taken" }
      }
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 12)
    
    // Create new user
    const newUser = new models.UserModel({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      totalVotesReceived: 0,
      debatesParticipated: 0,
    })
    
    // Save to database
    const savedUser = await newUser.save()
    
    // Return success without password
    const userResponse = {
      id: savedUser._id.toString(),
      username: savedUser.username,
      email: savedUser.email,
      totalVotesReceived: savedUser.totalVotesReceived,
      debatesParticipated: savedUser.debatesParticipated,
    }
    
    return { success: true, user: userResponse, error: null }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, user: null, error: "Failed to register user" }
  }
}

// Debate functions
export async function createDebate(debateData: {
  title: string
  description: string
  category: string
  tags: string[]
  duration: number
  creatorId: string
  creatorUsername: string
}) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate required fields
    if (!debateData.creatorId || !debateData.creatorUsername) {
      return { success: false, debate: null, error: "Creator information is required" }
    }
    
    // Validate ObjectId format for creatorId
    if (!isValidObjectId(debateData.creatorId)) {
      return { success: false, debate: null, error: "Invalid creator ID format" }
    }
    
    if (!debateData.duration || debateData.duration <= 0) {
      return { success: false, debate: null, error: "Valid duration is required" }
    }
    
    // Calculate end time based on duration (duration is in hours)
    const now = new Date()
    const endsAt = new Date(now.getTime() + debateData.duration * 60 * 60 * 1000)
    
    // Debug logging
    console.log("Creating debate with:", {
      title: debateData.title,
      duration: debateData.duration,
      creatorId: debateData.creatorId,
      creatorUsername: debateData.creatorUsername,
      endsAt: endsAt.toISOString()
    })
    
    // Convert duration number to enum string
    let durationString: string
    switch (debateData.duration) {
      case 1:
        durationString = "1 Hour"
        break
      case 12:
        durationString = "12 Hours"
        break
      case 24:
        durationString = "24 Hours"
        break
      case 72:
        durationString = "3 Days"
        break
      case 168:
        durationString = "7 Days"
        break
      default:
        durationString = "24 Hours" // Default fallback
    }
    
    // Create new debate
    const newDebate = new models.DebateModel({
      title: debateData.title,
      description: debateData.description,
      category: debateData.category,
      tags: debateData.tags,
      duration: durationString,
      creatorId: debateData.creatorId,
      creatorUsername: debateData.creatorUsername,
      createdAt: now,
      endsAt,
      status: "live",
      supportVotes: 0,
      opposeVotes: 0,
    })
    
    // Save to database
    const savedDebate = await newDebate.save()
    
    // Return debate data
    const debateResponse = {
      id: savedDebate._id.toString(),
      title: savedDebate.title,
      description: savedDebate.description,
      category: savedDebate.category,
      tags: savedDebate.tags,
              duration: savedDebate.duration,
      creatorId: savedDebate.creatorId.toString(),
      creatorUsername: savedDebate.creatorUsername,
      createdAt: savedDebate.createdAt,
      endsAt: savedDebate.endsAt,
      status: savedDebate.status,
      supportVotes: savedDebate.supportVotes,
      opposeVotes: savedDebate.opposeVotes,
    }
    
    return { success: true, debate: debateResponse, error: null }
  } catch (error) {
    console.error("Error creating debate:", error)
    return { success: false, debate: null, error: "Failed to create debate" }
  }
}

export async function declareDebateWinner(debateId: string, winner: "support" | "oppose" | "tie") {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { success: false, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { success: false, error: "Invalid debate ID format" }
    }
    
    // Update debate with winner and status
    const updatedDebate = await models.DebateModel.findByIdAndUpdate(
      debateId,
      {
        winner,
        status: "ended",
      },
      { new: true }
    )
    
    if (!updatedDebate) {
      return { success: false, error: "Debate not found" }
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error("Error declaring debate winner:", error)
    return { success: false, error: "Failed to declare debate winner" }
  }
}

export async function calculateAndDeclareWinner(debateId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { success: false, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { success: false, error: "Invalid debate ID format" }
    }
    
    // Get all arguments for this debate
    const debateArguments = await models.ArgumentModel.find({ debateId })
    
    // Calculate total votes for each side
    let supportVotes = 0
    let opposeVotes = 0
    
    for (const argument of debateArguments) {
      const upvotes = await models.ArgumentVoteModel.countDocuments({
        argumentId: argument._id,
        voteType: "upvote"
      })
      
      const downvotes = await models.ArgumentVoteModel.countDocuments({
        argumentId: argument._id,
        voteType: "downvote"
      })
      
      const netVotes = upvotes - downvotes
      
      if (argument.side === "support") {
        supportVotes += netVotes
      } else if (argument.side === "oppose") {
        opposeVotes += netVotes
      }
    }
    
    // Determine winner
    let winner: "support" | "oppose" | "tie"
    if (supportVotes > opposeVotes) {
      winner = "support"
    } else if (opposeVotes > supportVotes) {
      winner = "oppose"
    } else {
      winner = "tie"
    }
    
    // Declare the winner
    const result = await declareDebateWinner(debateId, winner)
    
    if (result.success) {
      return { 
        success: true, 
        winner, 
        supportVotes, 
        opposeVotes, 
        error: null 
      }
    } else {
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error("Error calculating and declaring winner:", error)
    return { success: false, error: "Failed to calculate and declare winner" }
  }
}

// Live debate functions
export async function getDebateDetails(debateId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { debate: null, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { debate: null, error: "Invalid debate ID format" }
    }
    
    // Find debate by ID
    const debate = await models.DebateModel.findById(debateId)
    
    if (!debate) {
      return { debate: null, error: "Debate not found" }
    }
    
    // Get participant counts
    const supportCount = await models.DebateParticipantModel.countDocuments({
      debateId: debate._id,
      side: "support"
    })
    
    const opposeCount = await models.DebateParticipantModel.countDocuments({
      debateId: debate._id,
      side: "oppose"
    })
    
    // Return debate data
    const debateResponse = {
      id: debate._id.toString(),
      title: debate.title,
      description: debate.description,
      category: debate.category,
      tags: debate.tags,
      duration: debate.duration,
      creatorId: debate.creatorId.toString(),
      creatorUsername: debate.creatorUsername,
      createdAt: debate.createdAt,
      endsAt: debate.endsAt,
      status: debate.status,
      winner: debate.winner,
      summary: debate.summary,
      supportVotes: supportCount,
      opposeVotes: opposeCount,
    }
    
    return { debate: debateResponse, error: null }
  } catch (error) {
    console.error("Error fetching debate details:", error)
    return { debate: null, error: "Failed to fetch debate details" }
  }
}

export async function getDebateParticipants(debateId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { participants: [], error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { participants: [], error: "Invalid debate ID format" }
    }
    
    // Find all participants for this debate
    const participants = await models.DebateParticipantModel.find({ debateId })
      .populate('userId', 'username email')
      .sort({ joinedAt: 1 })
    
    // Transform to expected format
    const participantsResponse = participants.map(participant => ({
      id: participant._id.toString(),
      userId: participant.userId.toString(),
      debateId: participant.debateId.toString(),
      username: participant.username,
      side: participant.side,
      joinedAt: participant.joinedAt,
      hasPostedFirstArgument: participant.hasPostedFirstArgument,
    }))
    
    return { participants: participantsResponse, error: null }
  } catch (error) {
    console.error("Error fetching debate participants:", error)
    return { participants: [], error: "Failed to fetch debate participants" }
  }
}

export async function getDebateArguments(debateId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { arguments: [], error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { arguments: [], error: "Invalid debate ID format" }
    }
    
    // Find all arguments for this debate
    const debateArguments = await models.ArgumentModel.find({ debateId })
      .populate('userId', 'username')
      .sort({ createdAt: 1 })
    
    // Get vote counts for each argument and current usernames
    const argumentsWithVotes = await Promise.all(
      debateArguments.map(async (argument) => {
        const upvotes = await models.ArgumentVoteModel.countDocuments({
          argumentId: argument._id,
          voteType: "upvote"
        })
        
        const downvotes = await models.ArgumentVoteModel.countDocuments({
          argumentId: argument._id,
          voteType: "downvote"
        })
        
        // Get current username from User collection
        const user = await models.UserModel.findById(argument.userId).select('username')
        const currentUsername = user?.username || argument.username || 'Unknown User'
        
        return {
          id: argument._id.toString(),
          content: argument.content,
          userId: argument.userId.toString(),
          username: currentUsername,
          debateId: argument.debateId.toString(),
          side: argument.side,
          createdAt: argument.createdAt,
          updatedAt: argument.updatedAt || argument.createdAt,
          upvotes,
          downvotes,
          totalVotes: upvotes + downvotes,
          voteCount: upvotes - downvotes,
          userVotes: [], // This would need to be populated based on current user
        }
      })
    )
    
    return { arguments: argumentsWithVotes, error: null }
  } catch (error) {
    console.error("Error fetching debate arguments:", error)
    return { arguments: [], error: "Failed to fetch debate arguments" }
  }
}

export async function checkUserParticipation(debateId: string, userId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { participant: null, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format for debateId
    if (!isValidObjectId(debateId)) {
      return { participant: null, error: "Invalid debate ID format" }
    }
    
    // Validate userId
    if (!userId || userId === "undefined" || userId === "null") {
      return { participant: null, error: "Invalid user ID" }
    }
    
    // Validate ObjectId format for userId
    if (!isValidObjectId(userId)) {
      return { participant: null, error: "Invalid user ID format" }
    }
    
    // Find participant for this user and debate
    const participant = await models.DebateParticipantModel.findOne({
      debateId,
      userId
    })
    
    if (!participant) {
      return { participant: null, error: null }
    }
    
    // Return participant data
    const participantResponse = {
      id: participant._id.toString(),
      userId: participant.userId.toString(),
      debateId: participant.debateId.toString(),
      username: participant.username,
      side: participant.side,
      joinedAt: participant.joinedAt,
      hasPostedFirstArgument: participant.hasPostedFirstArgument,
    }
    
    return { participant: participantResponse, error: null }
  } catch (error) {
    console.error("Error checking user participation:", error)
    return { participant: null, error: "Failed to check user participation" }
  }
}

export async function joinDebate(debateId: string, userId: string, side: "support" | "oppose") {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { success: false, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format for debateId
    if (!isValidObjectId(debateId)) {
      return { success: false, error: "Invalid debate ID format" }
    }
    
    // Validate userId
    if (!userId || userId === "undefined" || userId === "null") {
      return { success: false, error: "Invalid user ID" }
    }
    
    // Validate ObjectId format for userId
    if (!isValidObjectId(userId)) {
      return { success: false, error: "Invalid user ID format" }
    }
    
    // Get user info
    const user = await models.UserModel.findById(userId)
    if (!user) {
      return { success: false, error: "User not found" }
    }
    
    // Check if user already joined this debate
    const existingParticipant = await models.DebateParticipantModel.findOne({
      debateId,
      userId
    })
    
    if (existingParticipant) {
      return { success: false, error: "User already joined this debate" }
    }
    
    // Create new participant
    const newParticipant = new models.DebateParticipantModel({
      debateId,
      userId,
      username: user.username,
      side,
      joinedAt: new Date(),
      hasPostedFirstArgument: false,
    })
    
    // Save to database
    await newParticipant.save()
    
    // Update user's debates participated count
    await models.UserModel.findByIdAndUpdate(userId, {
      $inc: { debatesParticipated: 1 }
    })
    
    return { success: true, error: null }
  } catch (error) {
    console.error("Error joining debate:", error)
    return { success: false, error: "Failed to join debate" }
  }
}

export async function postArgument(debateId: string, userId: string, side: "support" | "oppose", content: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { success: false, argument: null, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format for debateId
    if (!isValidObjectId(debateId)) {
      return { success: false, argument: null, error: "Invalid debate ID format" }
    }
    
    // Validate userId
    if (!userId || userId === "undefined" || userId === "null") {
      return { success: false, argument: null, error: "Invalid user ID" }
    }
    
    // Validate ObjectId format for userId
    if (!isValidObjectId(userId)) {
      return { success: false, argument: null, error: "Invalid user ID format" }
    }
    
    // Server-side content moderation
    const bannedWords = [
      "stupid", "idiot", "dumb", "moron", "fool", "ignorant", "hate", "racist", "sexist",
      "homophobic", "transphobic", "bigot", "nazi", "fascist", "terrorist", "kill", "murder",
      "suicide", "death", "die", "dead", "hell", "damn", "shit", "fuck", "bitch", "ass",
      "piss", "crap", "bastard", "whore", "slut", "cunt", "dick", "cock", "pussy"
    ]
    
    const lowerContent = content.toLowerCase()
    const detectedToxicWords = bannedWords.filter(word => lowerContent.includes(word))
    
    if (detectedToxicWords.length > 0) {
      return { 
        success: false, 
        argument: null, 
        error: `Inappropriate language detected: ${detectedToxicWords.join(", ")}. Please use respectful language to maintain a healthy debate environment.` 
      }
    }
    
    // Get user info
    const user = await models.UserModel.findById(userId)
    if (!user) {
      return { success: false, argument: null, error: "User not found" }
    }
    
    // Check if user is a participant
    const participant = await models.DebateParticipantModel.findOne({
      debateId,
      userId
    })
    
    if (!participant) {
      return { success: false, argument: null, error: "You must join the debate before posting arguments" }
    }

    // Check reply timer - if user hasn't posted first argument and more than 5 minutes have passed
    if (!participant.hasPostedFirstArgument) {
      const now = new Date()
      const timeDiff = now.getTime() - participant.joinedAt.getTime()
      const fiveMinutesInMs = 5 * 60 * 1000
      
      if (timeDiff > fiveMinutesInMs) {
        return { 
          success: false, 
          argument: null, 
          error: "Reply timer expired. You must post your first argument within 5 minutes of joining the debate." 
        }
      }
    }
    
    // Create new argument
    const newArgument = new models.ArgumentModel({
      debateId,
      userId,
      username: user.username,
      side,
      content,
      createdAt: new Date(),
      voteCount: 0,
    })
    
    // Save to database
    const savedArgument = await newArgument.save()
    
    // Mark first argument as posted if this is the user's first argument
    if (!participant.hasPostedFirstArgument) {
      await models.DebateParticipantModel.findByIdAndUpdate(participant._id, {
        hasPostedFirstArgument: true
      })
    }
    
    // Return argument data
    const argumentResponse = {
      id: savedArgument._id.toString(),
      content: savedArgument.content,
      userId: savedArgument.userId.toString(),
      username: savedArgument.username,
      debateId: savedArgument.debateId.toString(),
      side: savedArgument.side,
      createdAt: savedArgument.createdAt,
      updatedAt: savedArgument.updatedAt || savedArgument.createdAt,
      upvotes: 0,
      downvotes: 0,
      totalVotes: 0,
      voteCount: 0,
      userVotes: [],
    }
    
    return { success: true, argument: argumentResponse, error: null }
  } catch (error) {
    console.error("Error posting argument:", error)
    return { success: false, argument: null, error: "Failed to post argument" }
  }
}

export async function deleteArgument(argumentId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate argumentId
    if (!argumentId || argumentId === "undefined" || argumentId === "null") {
      return { success: false, error: "Invalid argument ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(argumentId)) {
      return { success: false, error: "Invalid argument ID format" }
    }
    
    // Find and delete the argument
    const deletedArgument = await models.ArgumentModel.findByIdAndDelete(argumentId)
    
    if (!deletedArgument) {
      return { success: false, error: "Argument not found" }
    }
    
    // Also delete all votes for this argument
    await models.ArgumentVoteModel.deleteMany({ argumentId })
    
    return { success: true, error: null }
  } catch (error) {
    console.error("Error deleting argument:", error)
    return { success: false, error: "Failed to delete argument" }
  }
}

export async function updateArgument(argumentId: string, content: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate argumentId
    if (!argumentId || argumentId === "undefined" || argumentId === "null") {
      return { success: false, error: "Invalid argument ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(argumentId)) {
      return { success: false, error: "Invalid argument ID format" }
    }
    
    // Server-side content moderation
    const bannedWords = [
      "stupid", "idiot", "dumb", "moron", "fool", "ignorant", "hate", "racist", "sexist",
      "homophobic", "transphobic", "bigot", "nazi", "fascist", "terrorist", "kill", "murder",
      "suicide", "death", "die", "dead", "hell", "damn", "shit", "fuck", "bitch", "ass",
      "piss", "crap", "bastard", "whore", "slut", "cunt", "dick", "cock", "pussy"
    ]
    
    const lowerContent = content.toLowerCase()
    const detectedToxicWords = bannedWords.filter(word => lowerContent.includes(word))
    
    if (detectedToxicWords.length > 0) {
      return { 
        success: false, 
        error: `Inappropriate language detected: ${detectedToxicWords.join(", ")}. Please use respectful language to maintain a healthy debate environment.` 
      }
    }
    
    // Find the argument
    const argument = await models.ArgumentModel.findById(argumentId)
    if (!argument) {
      return { success: false, error: "Argument not found" }
    }
    
    // Get current username from User collection
    const user = await models.UserModel.findById(argument.userId).select('username')
    const currentUsername = user?.username || argument.username || 'Unknown User'
    
    // Update the argument with current username
    const updatedArgument = await models.ArgumentModel.findByIdAndUpdate(
      argumentId,
      {
        content,
        username: currentUsername,
        updatedAt: new Date(),
      },
      { new: true }
    )
    
    if (!updatedArgument) {
      return { success: false, error: "Argument not found" }
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error("Error updating argument:", error)
    return { success: false, error: "Failed to update argument" }
  }
}

// Voting functions
export async function voteOnArgument(argumentId: string, userId: string, voteType: "upvote" | "downvote") {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate argumentId
    if (!argumentId || argumentId === "undefined" || argumentId === "null") {
      return { success: false, error: "Invalid argument ID" }
    }
    
    // Validate ObjectId format for argumentId
    if (!isValidObjectId(argumentId)) {
      return { success: false, error: "Invalid argument ID format" }
    }
    
    // Validate userId
    if (!userId || userId === "undefined" || userId === "null") {
      return { success: false, error: "Invalid user ID" }
    }
    
    // Validate ObjectId format for userId
    if (!isValidObjectId(userId)) {
      return { success: false, error: "Invalid user ID format" }
    }
    
    // Check if user already voted on this argument
    const existingVote = await models.ArgumentVoteModel.findOne({
      argumentId,
      userId
    })
    
    if (existingVote) {
      // Remove existing vote if same type, or update if different
      if (existingVote.voteType === voteType) {
        await models.ArgumentVoteModel.findByIdAndDelete(existingVote._id)
      } else {
        await models.ArgumentVoteModel.findByIdAndUpdate(existingVote._id, {
          voteType,
          createdAt: new Date()
        })
      }
    } else {
      // Create new vote
      const newVote = new models.ArgumentVoteModel({
        argumentId,
        userId,
        voteType,
        createdAt: new Date()
      })
      await newVote.save()
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error("Error voting on argument:", error)
    return { success: false, error: "Failed to vote on argument" }
  }
}

export async function getUserVote(argumentId: string, userId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate argumentId
    if (!argumentId || argumentId === "undefined" || argumentId === "null") {
      return null
    }
    
    // Validate ObjectId format for argumentId
    if (!isValidObjectId(argumentId)) {
      return null
    }
    
    // Validate userId
    if (!userId || userId === "undefined" || userId === "null") {
      return null
    }
    
    // Validate ObjectId format for userId
    if (!isValidObjectId(userId)) {
      return null
    }
    
    // Find user's vote on this argument
    const vote = await models.ArgumentVoteModel.findOne({
      argumentId,
      userId
    })
    
    return vote ? vote.voteType : null
  } catch (error) {
    console.error("Error getting user vote:", error)
    return null
  }
}

export async function getDebateArgumentsWithUserVotes(debateId: string, userId?: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { arguments: [], error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { arguments: [], error: "Invalid debate ID format" }
    }
    
    // Find all arguments for this debate
    const debateArguments = await models.ArgumentModel.find({ debateId })
      .populate('userId', 'username')
      .sort({ createdAt: 1 })
    
    // Get vote counts and user votes for each argument
    const argumentsWithVotes = await Promise.all(
      debateArguments.map(async (argument) => {
        const upvotes = await models.ArgumentVoteModel.countDocuments({
          argumentId: argument._id,
          voteType: "upvote"
        })
        
        const downvotes = await models.ArgumentVoteModel.countDocuments({
          argumentId: argument._id,
          voteType: "downvote"
        })
        
        // Get current username from User collection
        const user = await models.UserModel.findById(argument.userId).select('username')
        const currentUsername = user?.username || argument.username || 'Unknown User'
        
        // Get user's vote if userId is provided
        let userVote = null
        if (userId && isValidObjectId(userId)) {
          const vote = await models.ArgumentVoteModel.findOne({
            argumentId: argument._id,
            userId
          })
          userVote = vote ? vote.voteType : null
        }
        
        return {
          id: argument._id.toString(),
          content: argument.content,
          userId: argument.userId.toString(),
          username: currentUsername,
          debateId: argument.debateId.toString(),
          side: argument.side,
          createdAt: argument.createdAt,
          updatedAt: argument.updatedAt || argument.createdAt,
          upvotes,
          downvotes,
          totalVotes: upvotes + downvotes,
          voteCount: upvotes - downvotes,
          userVote,
        }
      })
    )
    
    return { arguments: argumentsWithVotes, error: null }
  } catch (error) {
    console.error("Error fetching debate arguments with user votes:", error)
    return { arguments: [], error: "Failed to fetch debate arguments" }
  }
}

// Tags function
export async function getPopularTags() {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Get tags from debates and count their usage
    const tagCounts = await models.DebateModel.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
    
    const tags = tagCounts.map(tag => ({
      name: tag._id,
      count: tag.count
    }))
    
    return { tags, error: null }
  } catch (error) {
    console.error("Error fetching popular tags:", error)
    return { tags: [], error: "Failed to fetch popular tags" }
  }
}

// Get all debates function
export async function getAllDebates() {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Find all debates
    const debates = await models.DebateModel.find({})
      .sort({ createdAt: -1 }) // Most recent first
    
    // Transform to expected format
    const debatesResponse = debates.map(debate => ({
      id: debate._id.toString(),
      title: debate.title,
      description: debate.description,
      tags: debate.tags,
      category: debate.category,
      image: debate.image,
      duration: debate.duration,
      creatorId: debate.creatorId.toString(),
      creatorUsername: debate.creatorUsername,
      createdAt: debate.createdAt,
      endsAt: debate.endsAt,
      status: debate.status,
      winner: debate.winner,
      summary: debate.summary,
      supportVotes: debate.supportVotes,
      opposeVotes: debate.opposeVotes,
    }))
    
    return { success: true, debates: debatesResponse, error: null }
  } catch (error) {
    console.error("Error fetching all debates:", error)
    return { success: false, debates: [], error: "Failed to fetch debates" }
  }
}

// Get live debates function
export async function getLiveDebates() {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Find all live debates that haven't ended
    const debates = await models.DebateModel.find({ 
      status: "live",
      endsAt: { $gt: new Date() } // Only debates that haven't ended
    })
    .sort({ createdAt: -1 }) // Most recent first
    .limit(10)
    
    // Transform to expected format
    const debatesResponse = debates.map(debate => ({
      id: debate._id.toString(),
      title: debate.title,
      description: debate.description,
      tags: debate.tags,
      category: debate.category,
      image: debate.image,
      duration: debate.duration,
      creatorId: debate.creatorId.toString(),
      creatorUsername: debate.creatorUsername,
      createdAt: debate.createdAt,
      endsAt: debate.endsAt,
      status: debate.status,
      winner: debate.winner,
      summary: debate.summary,
      supportVotes: debate.supportVotes,
      opposeVotes: debate.opposeVotes,
    }))
    
    return { success: true, debates: debatesResponse, error: null }
  } catch (error) {
    console.error("Error fetching live debates:", error)
    return { success: false, debates: [], error: "Failed to fetch live debates" }
  }
}

// Update ended debates function
export async function updateEndedDebates() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/update-ended-debates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to update ended debates')
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error updating ended debates:", error)
    return { success: false, error: "Failed to update ended debates" }
  }
}

// Leaderboard function
export async function getLeaderboardData(timeFilter: "weekly" | "monthly" | "all-time" = "all-time") {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Calculate date range based on time filter
    const now = new Date()
    let startDate = new Date(0) // Default to beginning of time
    
    if (timeFilter === "weekly") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (timeFilter === "monthly") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    // Aggregate user statistics from arguments and votes
    const userStats = await models.ArgumentModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: "argumentvotes",
          localField: "_id",
          foreignField: "argumentId",
          as: "votes"
        }
      },
      {
        $group: {
          _id: "$userId",
          totalVotes: { $sum: { $size: "$votes" } },
          argumentsCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalVotes: -1 }
      },
      {
        $limit: 50
      }
    ])
    
    // Get debate participation counts
    const participationStats = await models.DebateParticipantModel.aggregate([
      {
        $match: {
          joinedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$userId",
          debatesParticipated: { $sum: 1 }
        }
      }
    ])
    
    // Get current usernames from User collection
    const userIds = userStats.map(stat => stat._id)
    const users = await models.UserModel.find({ _id: { $in: userIds } }).select('username')
    const userMap = new Map(users.map(user => [user._id.toString(), user.username]))
    
    // Merge the statistics
    const participationMap = new Map(
      participationStats.map(stat => [stat._id.toString(), stat.debatesParticipated])
    )
    
    const leaderboardData = userStats.map(stat => ({
      userId: stat._id.toString(),
      username: userMap.get(stat._id.toString()) || "Unknown User",
      totalVotes: stat.totalVotes,
      debatesParticipated: participationMap.get(stat._id.toString()) || 0,
      avatar: undefined // Will be populated from user profile if needed
    }))
    
    return { success: true, data: leaderboardData, error: null }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error)
    return { success: false, data: [], error: "Failed to fetch leaderboard data" }
  }
} 

export async function canUserPostArgument(debateId: string, userId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { success: false, canPost: false, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format for debateId
    if (!isValidObjectId(debateId)) {
      return { success: false, canPost: false, error: "Invalid debate ID format" }
    }
    
    // Validate userId
    if (!userId || userId === "undefined" || userId === "null") {
      return { success: false, canPost: false, error: "Invalid user ID" }
    }
    
    // Validate ObjectId format for userId
    if (!isValidObjectId(userId)) {
      return { success: false, canPost: false, error: "Invalid user ID format" }
    }
    
    // Check if user is a participant
    const participant = await models.DebateParticipantModel.findOne({
      debateId,
      userId
    })
    
    if (!participant) {
      return { success: false, canPost: false, error: "User is not a participant in this debate" }
    }

    // If user has already posted their first argument, they can continue posting
    if (participant.hasPostedFirstArgument) {
      return { success: true, canPost: true, error: null }
    }

    // Check reply timer - if user hasn't posted first argument and more than 5 minutes have passed
    const now = new Date()
    const timeDiff = now.getTime() - participant.joinedAt.getTime()
    const fiveMinutesInMs = 5 * 60 * 1000
    
    if (timeDiff > fiveMinutesInMs) {
      return { 
        success: true, 
        canPost: false, 
        error: "Reply timer expired. You must post your first argument within 5 minutes of joining the debate." 
      }
    }

    return { success: true, canPost: true, error: null }
  } catch (error) {
    console.error("Error checking if user can post argument:", error)
    return { success: false, canPost: false, error: "Failed to check user posting status" }
  }
} 

// Generate AI summary for ended debate
export async function generateDebateSummary(debateId: string) {
  try {
    // Connect to database
    await connectToDatabase()
    
    // Validate debateId
    if (!debateId || debateId === "undefined" || debateId === "null") {
      return { success: false, summary: null, error: "Invalid debate ID" }
    }
    
    // Validate ObjectId format
    if (!isValidObjectId(debateId)) {
      return { success: false, summary: null, error: "Invalid debate ID format" }
    }
    
    // Get debate details
    const debate = await models.DebateModel.findById(debateId)
    if (!debate) {
      return { success: false, summary: null, error: "Debate not found" }
    }
    
    // Get all arguments for this debate
    const debateArguments = await models.ArgumentModel.find({ debateId })
      .populate('userId', 'username')
      .sort({ createdAt: 1 })
    
    if (debateArguments.length === 0) {
      return { success: false, summary: null, error: "No arguments found for this debate" }
    }
    
    // Get vote counts for each argument
    const argumentsWithVotes = await Promise.all(
      debateArguments.map(async (argument) => {
        const upvotes = await models.ArgumentVoteModel.countDocuments({
          argumentId: argument._id,
          voteType: "upvote"
        })
        
        const downvotes = await models.ArgumentVoteModel.countDocuments({
          argumentId: argument._id,
          voteType: "downvote"
        })
        
        return {
          content: argument.content,
          side: argument.side,
          username: argument.username,
          voteCount: upvotes - downvotes,
          createdAt: argument.createdAt
        }
      })
    )
    
    // Separate arguments by side
    const supportArguments = argumentsWithVotes.filter(arg => arg.side === "support")
    const opposeArguments = argumentsWithVotes.filter(arg => arg.side === "oppose")
    
    // Get top arguments by votes
    const topSupportArguments = supportArguments
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 3)
    
    const topOpposeArguments = opposeArguments
      .sort((a, b) => b.voteCount - a.voteCount)
      .slice(0, 3)
    
    // Generate summary based on debate outcome and key arguments
    let summary = `Debate Summary: "${debate.title}"\n\n`
    
    // Add outcome
    if (debate.winner === "tie") {
      summary += `🏆 Final Outcome: The debate ended in a tie, with both sides presenting equally compelling arguments.\n\n`
    } else if (debate.winner === "support") {
      summary += `🏆 Final Outcome: The support side emerged victorious with ${debate.supportVotes} votes to ${debate.opposeVotes} votes.\n\n`
    } else {
      summary += `🏆 Final Outcome: The opposition side emerged victorious with ${debate.opposeVotes} votes to ${debate.supportVotes} votes.\n\n`
    }
    
    // Add key arguments summary
    summary += `📊 Key Arguments Summary:\n\n`
    
    if (topSupportArguments.length > 0) {
      summary += `✅ Support Side Highlights:\n`
      topSupportArguments.forEach((arg, index) => {
        summary += `• ${arg.content.substring(0, 100)}${arg.content.length > 100 ? '...' : ''} (${arg.voteCount} votes)\n`
      })
      summary += `\n`
    }
    
    if (topOpposeArguments.length > 0) {
      summary += `❌ Opposition Side Highlights:\n`
      topOpposeArguments.forEach((arg, index) => {
        summary += `• ${arg.content.substring(0, 100)}${arg.content.length > 100 ? '...' : ''} (${arg.voteCount} votes)\n`
      })
      summary += `\n`
    }
    
    // Add participation stats
    const totalArguments = debateArguments.length
    const totalVotes = argumentsWithVotes.reduce((sum, arg) => sum + Math.abs(arg.voteCount), 0)
    
    summary += `📈 Participation Statistics:\n`
    summary += `• Total Arguments: ${totalArguments}\n`
    summary += `• Support Arguments: ${supportArguments.length}\n`
    summary += `• Opposition Arguments: ${opposeArguments.length}\n`
    summary += `• Total Vote Activity: ${totalVotes}\n\n`
    
    // Add conclusion
    if (debate.winner === "tie") {
      summary += `🤝 Conclusion: This debate demonstrated the complexity of the issue, with both sides presenting strong, well-reasoned arguments that resonated equally with participants. The tie outcome suggests that this topic requires further discussion and consideration from multiple perspectives.`
    } else {
      const winningSide = debate.winner === "support" ? "support" : "opposition"
      summary += `🎯 Conclusion: The ${winningSide} side's arguments proved more compelling to the majority of participants, securing victory through stronger reasoning and more persuasive evidence. This outcome reflects the community's assessment of the most convincing arguments presented during the debate.`
    }
    
    // Update the debate with the generated summary
    await models.DebateModel.findByIdAndUpdate(debateId, { summary })
    
    return { success: true, summary, error: null }
  } catch (error) {
    console.error("Error generating debate summary:", error)
    return { success: false, summary: null, error: "Failed to generate debate summary" }
  }
} 