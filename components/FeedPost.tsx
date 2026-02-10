"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { 
  MessageSquare, 
  Code2, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Zap,
  Terminal
} from "lucide-react";

interface Post {
  id: string;
  content: string;
  type: "update" | "thought" | "code" | "link" | "image";
  metadata?: Record<string, any>;
  timestamp: string;
}

interface FeedPostProps {
  post: Post;
  index: number;
}

const typeIcons = {
  update: Terminal,
  thought: MessageSquare,
  code: Code2,
  link: LinkIcon,
  image: ImageIcon,
};

const typeColors = {
  update: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  thought: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  code: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  link: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  image: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400",
};

export function FeedPost({ post, index }: FeedPostProps) {
  const Icon = typeIcons[post.type] || MessageSquare;
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative p-6 rounded-2xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all hover:shadow-lg"
    >
      {/* Timeline dot */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
      
      <div className="flex gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[post.type]}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              {post.type}
            </span>
            <span className="text-xs text-zinc-400 dark:text-zinc-500" title={new Date(post.timestamp).toLocaleString()}>
              {timeAgo}
            </span>
          </div>

          <div className="prose-custom">
            <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Metadata display */}
          {post.metadata && Object.keys(post.metadata).length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-sm font-mono text-zinc-600 dark:text-zinc-400">
              {Object.entries(post.metadata).map(([key, value]) => {
                const strValue = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
                return (
                  <div key={key} className="flex gap-2">
                    <span className="text-zinc-400">{key}:</span>
                    <span className="truncate" title={strValue}>{strValue}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-xs text-zinc-500 hover:text-blue-500 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Like
            </button>
            <button className="text-xs text-zinc-500 hover:text-blue-500 flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              Copy
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}