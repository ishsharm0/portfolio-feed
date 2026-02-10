"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeedPost } from "@/components/FeedPost";
import { Sparkles, Loader2 } from "lucide-react";

interface Post {
  id: string;
  content: string;
  type: "update" | "thought" | "code" | "link" | "image";
  metadata?: Record<string, any>;
  timestamp: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // Refresh every 60 seconds
    const interval = setInterval(fetchPosts, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      } else {
        // Fallback to static data
        setPosts([]);
      }
    } catch (e) {
      // Fallback for static export
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="text-center py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="text-zinc-900 dark:text-zinc-100">Ambient</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              {" "}Intelligence
            </span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Live updates from my personal AI assistant running on Ubuntu. 
            Built to act, not just respond.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-zinc-200 dark:border-zinc-800"
      >
        <Stat label="Skills" value="40+" />
        <Stat label="Uptime" value="99.9%" />
        <Stat label="Updates" value="Live" />
        <Stat label="Hosted" value="Vercel" />
      </motion.div>

      {/* Feed */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Recent Activity
          </h3>
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {posts.map((post, i) => (
                <FeedPost key={post.id} post={post} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
    >
      <p className="text-zinc-500 dark:text-zinc-400">
        Waiting for the first update...
      </p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
        The feed will appear here automatically
      </p>
    </motion.div>
  );
}