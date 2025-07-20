"use client";

import { create } from "zustand";
import { User, DebateSide } from "@/lib/types";

interface ReplyTimer {
  userId: string;
  debateId: string;
  joinedAt: Date;
  side: DebateSide;
  hasPostedFirstArgument: boolean;
}

interface DebateFilters {
  search: string;
  category: string;
  tags: string[];
  sortBy: "newest" | "oldest" | "most-voted" | "ending-soon";
  status: "all" | "live" | "ended";
}

// Toxic words for content moderation
const bannedWords = [
  "stupid",
  "idiot",
  "dumb",
  "moron",
  "fool",
  "ignorant",
  "hate",
  "racist",
  "sexist",
  "homophobic",
  "transphobic",
  "bigot",
  "nazi",
  "fascist",
  "terrorist",
  "kill",
  "murder",
  "suicide",
  "death",
  "die",
  "dead",
  "hell",
  "damn",
  "shit",
  "fuck",
  "bitch",
  "ass",
  "piss",
  "crap",
  "bastard",
  "whore",
  "slut",
  "cunt",
  "dick",
  "cock",
  "pussy",
];

const containsToxicWords = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  return bannedWords.filter((word) => lowerText.includes(word));
};

interface DebateStore {
  currentUser: User | null;
  userParticipations: Record<string, DebateSide>;
  userVotes: Record<string, "upvote" | "downvote">;
  replyTimers: ReplyTimer[];
  searchFilters: DebateFilters;

  // Actions
  setCurrentUser: (user: User | null) => void;

  // Auto-moderation
  checkContentModeration: (content: string) => string[];

  // Reply timer management
  startReplyTimer: (userId: string, debateId: string, side: DebateSide) => void;
  markFirstArgumentPosted: (userId: string, debateId: string) => void;
  getReplyTimer: (userId: string, debateId: string) => ReplyTimer | null;
  isReplyTimerExpired: (userId: string, debateId: string) => boolean;

  // Search and filters
  updateSearchFilters: (filters: Partial<DebateFilters>) => void;
}

export const useDebateStore = create<DebateStore>((set, get) => ({
  currentUser: null,
  userParticipations: {},
  userVotes: {},
  replyTimers: [],
  searchFilters: {
    search: "",
    category: "",
    tags: [],
    sortBy: "newest",
    status: "all",
  },

  setCurrentUser: (user) => set({ currentUser: user }),

  checkContentModeration: (content: string) => {
    return containsToxicWords(content);
  },

  startReplyTimer: (userId: string, debateId: string, side: DebateSide) => {
    const state = get();
    const existingTimer = state.replyTimers.find(
      (timer) => timer.userId === userId && timer.debateId === debateId
    );

    if (!existingTimer) {
      set((state) => ({
        replyTimers: [
          ...state.replyTimers,
          {
            userId,
            debateId,
            side,
            joinedAt: new Date(),
            hasPostedFirstArgument: false,
          },
        ],
      }));
    }
  },

  markFirstArgumentPosted: (userId: string, debateId: string) => {
    set((state) => ({
      replyTimers: state.replyTimers.map((timer) =>
        timer.userId === userId && timer.debateId === debateId
          ? { ...timer, hasPostedFirstArgument: true }
          : timer
      ),
    }));
  },

  getReplyTimer: (userId: string, debateId: string) => {
    const state = get();
    return (
      state.replyTimers.find(
        (timer) => timer.userId === userId && timer.debateId === debateId
      ) || null
    );
  },

  isReplyTimerExpired: (userId: string, debateId: string) => {
    const timer = get().getReplyTimer(userId, debateId);
    if (!timer) return false;

    const now = new Date();
    const timeDiff = now.getTime() - timer.joinedAt.getTime();
    const fiveMinutesInMs = 5 * 60 * 1000;

    return timeDiff > fiveMinutesInMs && !timer.hasPostedFirstArgument;
  },

  updateSearchFilters: (filters) => {
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters },
    }));
  },
}));
