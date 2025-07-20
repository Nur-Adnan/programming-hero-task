import { Schema, models, model, type Document } from "mongoose";
import {
  type User,
  type Debate,
  type DebateParticipant,
  type Argument,
  type ArgumentVote,
  DebateCategory,
  DebateDuration,
  DebateSide,
} from "./types";

// Extend Document to include our custom types
export interface IUserDocument extends User, Document {}
export interface IDebateDocument extends Debate, Document {}
export interface IDebateParticipantDocument
  extends DebateParticipant,
    Document {}
export interface IArgumentDocument extends Argument, Document {}
export interface IArgumentVoteDocument extends ArgumentVote, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    totalVotesReceived: { type: Number, default: 0 },
    debatesParticipated: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DebateSchema = new Schema<IDebateDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  category: {
    type: String,
    enum: Object.values(DebateCategory),
    required: true,
  },
  image: { type: String },
  duration: {
    type: String,
    enum: Object.values(DebateDuration),
    required: true,
  },
  creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  creatorUsername: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ["live", "ended"], default: "live" },
  winner: { type: String, enum: [...Object.values(DebateSide), "tie"] },
  summary: { type: String },
  supportVotes: { type: Number, default: 0 },
  opposeVotes: { type: Number, default: 0 },
});

const DebateParticipantSchema = new Schema<IDebateParticipantDocument>(
  {
    debateId: { type: Schema.Types.ObjectId, ref: "Debate", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    side: { type: String, enum: Object.values(DebateSide), required: true },
    joinedAt: { type: Date, default: Date.now },
    hasPostedFirstArgument: { type: Boolean, default: false },
  },
  { unique: ["debateId", "userId"] }
); // Ensure a user can only join a debate once

const ArgumentSchema = new Schema<IArgumentDocument>({
  debateId: { type: Schema.Types.ObjectId, ref: "Debate", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  side: { type: String, enum: Object.values(DebateSide), required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  voteCount: { type: Number, default: 0 },
});

const ArgumentVoteSchema = new Schema<IArgumentVoteDocument>(
  {
    argumentId: {
      type: Schema.Types.ObjectId,
      ref: "Argument",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { unique: ["argumentId", "userId"] }
); // Ensure a user can only vote on an argument once

const UserModel = models.User || model<IUserDocument>("User", UserSchema);
const DebateModel =
  models.Debate || model<IDebateDocument>("Debate", DebateSchema);
const DebateParticipantModel =
  models.DebateParticipant ||
  model<IDebateParticipantDocument>(
    "DebateParticipant",
    DebateParticipantSchema
  );
const ArgumentModel =
  models.Argument || model<IArgumentDocument>("Argument", ArgumentSchema);
const ArgumentVoteModel =
  models.ArgumentVote ||
  model<IArgumentVoteDocument>("ArgumentVote", ArgumentVoteSchema);

export default {
  UserModel,
  DebateModel,
  DebateParticipantModel,
  ArgumentModel,
  ArgumentVoteModel,
};
