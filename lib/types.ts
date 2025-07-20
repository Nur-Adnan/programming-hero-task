export enum DebateCategory {
  Politics = "Politics",
  Technology = "Technology",
  Science = "Science",
  Ethics = "Ethics",
  Society = "Society",
  Culture = "Culture",
  Sports = "Sports",
  Economy = "Economy",
  Education = "Education",
  Health = "Health",
  Environment = "Environment",
  Philosophy = "Philosophy",
  Other = "Other",
}

export enum DebateDuration {
  OneHour = "1 Hour",
  TwelveHours = "12 Hours",
  TwentyFourHours = "24 Hours",
  ThreeDays = "3 Days",
  SevenDays = "7 Days",
}

export enum DebateSide {
  Support = "support",
  Oppose = "oppose",
}

export interface User {
  id: string;
  username: string;
  email: string;
  image?: string;
  totalVotesReceived: number;
  debatesParticipated: number;
}

export interface Debate {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: DebateCategory;
  image?: string;
  duration: DebateDuration;
  creatorId: string;
  creatorUsername: string;
  createdAt: Date;
  endsAt: Date;
  status: "live" | "ended";
  winner?: DebateSide | "tie";
  summary?: string;
  supportVotes: number;
  opposeVotes: number;
}

export interface DebateParticipant {
  id: string;
  debateId: string;
  userId: string;
  username: string;
  side: DebateSide;
  joinedAt: Date;
  hasPostedFirstArgument: boolean;
}

export interface Argument {
  id: string;
  debateId: string;
  userId: string;
  username: string;
  side: DebateSide;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  voteCount: number;
  upvotes?: number;
  downvotes?: number;
  totalVotes?: number;
  userVote?: "upvote" | "downvote" | null;
}

export interface ArgumentVote {
  id: string;
  argumentId: string;
  userId: string;
  createdAt: Date;
}

export interface SearchFilters {
  query?: string;
  category?: DebateCategory;
  tag?: string;
  status: "live" | "ended" | "all";
  sortBy: "newest" | "oldest" | "most_voted" | "ending_soon";
}

export interface ReplyTimerState {
  [debateId: string]: {
    endTime: number; // Unix timestamp
    hasPostedFirstArgument: boolean;
  };
}
