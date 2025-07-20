"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PublicHeader } from "@/components/public-header";
import {
  Clock,
  Users,
  MessageSquare,
  Share2,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import {
  getDebateDetails,
  getDebateArguments,
  getDebateParticipants,
} from "@/app/actions";
import { Debate, Argument, DebateParticipant } from "@/lib/types";
import { toast } from "sonner";
import { use } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useDebateStore } from "@/lib/store";

export default function PublicDebatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: debateId } = use(params);
  const { checkContentModeration } = useDebateStore();
  const [debate, setDebate] = useState<Debate | null>(null);
  const [debateArguments, setDebateArguments] = useState<Argument[]>([]);
  const [participants, setParticipants] = useState<DebateParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDebateData = async () => {
      try {
        // Fetch debate details
        const { debate: fetchedDebate, error: debateError } =
          await getDebateDetails(debateId);
        if (debateError) {
          console.error("Error fetching debate:", debateError);
          toast.error("Failed to load debate");
          return;
        }
        setDebate(fetchedDebate);

        // Fetch arguments
        const { arguments: fetchedArguments, error: argumentsError } =
          await getDebateArguments(debateId);
        if (!argumentsError) {
          setDebateArguments(fetchedArguments);
        }

        // Fetch participants
        const { participants: fetchedParticipants, error: participantsError } =
          await getDebateParticipants(debateId);
        if (!participantsError) {
          setParticipants(fetchedParticipants);
        }
      } catch (error) {
        console.error("Error fetching debate data:", error);
        toast.error("Failed to load debate data");
      } finally {
        setIsLoading(false);
      }
    };

    if (debateId) {
      fetchDebateData();
    }
  }, [debateId]);

  const formatTimeRemaining = (endsAt: Date) => {
    const now = new Date();
    const diff = endsAt.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} remaining`;
    }

    return `${hours}h ${minutes}m remaining`;
  };

  const handleShare = async () => {
    const publicUrl = `${window.location.origin}/debate/${debateId}/public`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: debate?.title || "ArenaX Debate",
          text: `Check out this debate on ArenaX: ${publicUrl}`,
          url: publicUrl,
        });
        toast.success("Debate shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
        toast.error("Failed to share debate.");
      }
    } else {
      navigator.clipboard.writeText(publicUrl);
      toast.success("Public debate URL copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 text-foreground">
        <PublicHeader />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 text-foreground">
        <PublicHeader />
        <div className="flex flex-1 justify-center items-center px-4 py-5">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Debate Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The debate you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const supportArguments = debateArguments.filter(
    (arg) => arg.side === "support"
  );
  const opposeArguments = debateArguments.filter(
    (arg) => arg.side === "oppose"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 text-foreground">
      <PublicHeader />

      <div className="flex flex-1 justify-center px-4 py-5 lg:px-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex w-full max-w-[1200px] flex-col"
        >
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2 p-4 mb-4"
          >
            <Link
              href="/"
              className="text-base font-medium leading-normal text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-base font-medium leading-normal text-muted-foreground">
              /
            </span>
            <span className="text-base font-medium leading-normal text-foreground">
              {debate.title}
            </span>
          </motion.nav>

          {/* Debate Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 border-0 shadow-xl rounded-2xl">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-3xl font-extrabold mb-2 text-foreground animate-fade-in-up">
                        {debate.title}
                      </h1>
                      <p className="text-muted-foreground leading-relaxed animate-fade-in-up delay-100">
                        {debate.description}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-secondary text-foreground animate-fade-in-up delay-200"
                    >
                      {debate.category}
                    </Badge>
                    {debate.tags.map((tag: string) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-border text-muted-foreground animate-fade-in-up delay-300"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatTimeRemaining(debate.endsAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {debate.supportVotes + debate.opposeVotes} participants
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {debate.supportVotes} support
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-muted-foreground">
                        {debate.opposeVotes} oppose
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Arguments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Support Arguments */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg rounded-xl hover:scale-[1.02] transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Support Arguments ({supportArguments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportArguments.length > 0 ? (
                    supportArguments.map((argument, idx) => (
                      <motion.div
                        key={argument.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="border-b border-border pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${argument.username}`}
                              alt={argument.username}
                            />
                            <AvatarFallback className="bg-secondary text-foreground">
                              {argument.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">
                                {argument.username}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(argument.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-base text-foreground leading-relaxed animate-fade-in-up delay-200">
                              {argument.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No support arguments yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            {/* Oppose Arguments */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-gray-900/80 border-0 shadow-lg rounded-xl hover:scale-[1.02] transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <ThumbsDown className="h-5 w-5 text-red-500" />
                    Oppose Arguments ({opposeArguments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opposeArguments.length > 0 ? (
                    opposeArguments.map((argument, idx) => (
                      <motion.div
                        key={argument.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * idx }}
                        className="border-b border-border pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${argument.username}`}
                              alt={argument.username}
                            />
                            <AvatarFallback className="bg-secondary text-foreground">
                              {argument.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-foreground">
                                {argument.username}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(argument.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-base text-foreground leading-relaxed animate-fade-in-up delay-200">
                              {argument.content}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No oppose arguments yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  Want to participate?
                </h3>
                <p className="text-muted-foreground mb-4">
                  Join the debate and share your perspective on this important
                  topic.
                </p>
                <Link href={`/debate/${debateId}`}>
                  <Button className="bg-primary hover:bg-primary/80 text-primary-foreground">
                    Join Debate
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
