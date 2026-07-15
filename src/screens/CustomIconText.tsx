import React, { useState } from "react";
import { 
  Flame, BookOpen, Target, Trophy, Lightbulb, CheckCircle2, Star, Rocket,
  Clock, Pencil, Heart, TrendingUp, ThumbsUp, Brain, Sparkles, Bell
} from "lucide-react";

// Safe emoji clearing regex targeting standard pictorial emojis
const EMOJI_REGEX = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu;

interface CustomIconTextProps {
  text: string;
  className?: string;
}

// Maps tags to icon filenames
const TAG_MAP: Record<string, string> = {
  STREAK: "icon-streak.png",
  BOOK: "icon-book.png",
  TARGET: "icon-target.png",
  TROPHY: "icon-trophy.png",
  IDEA: "icon-idea.png",
  CHECK: "icon-check.png",
  STAR: "icon-star.png",
  ROCKET: "icon-rocket.png",
  CLOCK: "icon-clock.png",
  PENCIL: "icon-pencil.png",
  HEART: "icon-heart.png",
  TRENDING: "icon-trending.png",
  THUMBSUP: "icon-thumbsup.png",
  BRAIN: "icon-brain.png",
  CELEBRATE: "icon-celebrate.png",
  ALARM: "icon-alarm.png"
};

// Maps tags to styled React fallbacks in case the physical png is not found/loaded or still pending server-side.
const renderFallbackIcon = (tag: string) => {
  const size = 16;
  const t = tag.toUpperCase();
  switch (t) {
    case "STREAK":
      return <Flame size={size} className="text-orange-500 fill-orange-500/20 inline-block animate-pulse align-text-bottom mr-1" />;
    case "BOOK":
      return <BookOpen size={size} className="text-blue-400 inline-block align-text-bottom mr-1" />;
    case "TARGET":
      return <Target size={size} className="text-red-400 inline-block align-text-bottom mr-1" />;
    case "TROPHY":
      return <Trophy size={size} className="text-amber-400 fill-amber-400/20 inline-block align-text-bottom mr-1" />;
    case "IDEA":
      return <Lightbulb size={size} className="text-yellow-400 fill-yellow-400/10 inline-block align-text-bottom mr-1" />;
    case "CHECK":
      return <CheckCircle2 size={size} className="text-emerald-400 inline-block align-text-bottom mr-1" />;
    case "STAR":
      return <Star size={size} className="text-yellow-350 fill-yellow-350/20 inline-block align-text-bottom mr-1" />;
    case "ROCKET":
      return <Rocket size={size} className="text-cyan-400 inline-block align-text-bottom mr-1 rotate-12" />;
    case "CLOCK":
      return <Clock size={size} className="text-purple-400 inline-block align-text-bottom mr-1" />;
    case "PENCIL":
      return <Pencil size={size} className="text-orange-400 inline-block align-text-bottom mr-1" />;
    case "HEART":
      return <Heart size={size} className="text-pink-500 fill-pink-500/10 inline-block align-text-bottom mr-1" />;
    case "TRENDING":
      return <TrendingUp size={size} className="text-emerald-400 inline-block align-text-bottom mr-1" />;
    case "THUMBSUP":
      return <ThumbsUp size={size} className="text-blue-500 inline-block align-text-bottom mr-1" />;
    case "BRAIN":
      return <Brain size={size} className="text-violet-400 inline-block align-text-bottom mr-1" />;
    case "CELEBRATE":
      return <Sparkles size={size} className="text-fuchsia-450 inline-block align-text-bottom mr-1 animate-bounce" />;
    case "ALARM":
      return <Bell size={size} className="text-amber-500 inline-block align-text-bottom mr-1" />;
    default:
      return null;
  }
};

export default function CustomIconText({ text, className = "" }: CustomIconTextProps) {
  if (!text) return null;

  // 1. Safety net: sanitize legacy emojis from AI output
  const cleanText = text.replace(EMOJI_REGEX, "");

  // 2. Identify bracket tags (case-insensitive for reliability)
  const regex = /(\[STREAK\]|\[BOOK\]|\[TARGET\]|\[TROPHY\]|\[IDEA\]|\[CHECK\]|\[STAR\]|\[ROCKET\]|\[CLOCK\]|\[PENCIL\]|\[HEART\]|\[TRENDING\]|\[THUMBSUP\]|\[BRAIN\]|\[CELEBRATE\]|\[ALARM\])/gi;
  const parts = cleanText.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const match = part.match(/^\[([A-Z]+)\]$/i);
        if (match) {
          const matchedTag = match[1].toUpperCase();
          const filename = TAG_MAP[matchedTag];
          if (filename) {
            return (
              <React.Fragment key={index}>
                <ImageWithFallback 
                  src={`/assets/icons/${filename}`} 
                  alt={matchedTag} 
                  fallback={renderFallbackIcon(matchedTag)} 
                />
              </React.Fragment>
            );
          }
        }
        return part;
      })}
    </span>
  );
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}

function ImageWithFallback({ src, alt, fallback }: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const isDataSaver = typeof localStorage !== "undefined" && localStorage.getItem("compass_data_saver") === "true";

  if (failed || isDataSaver) {
    return <span className="inline-flex items-center">{fallback}</span>;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="inline-block w-[18px] h-[18px] select-none align-text-bottom mx-0.5 object-contain"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)} 
    />
  );
}
