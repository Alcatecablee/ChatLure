import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Share2, Heart, Flame, Lock, Zap, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn, formatNumber } from "@/lib/utils";
import type { Story } from "@shared/schema";

interface StoryTeaserProps {
  story: Story;
  size?: "small" | "medium" | "large";
  showPreview?: boolean;
}

export default function StoryTeaser({ story, size = "medium", showPreview = false }: StoryTeaserProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    try {
      await fetch(`/api/stories/${story.id}/like`, { method: "POST" });
    } catch (error) {
      console.error("Failed to like story:", error);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Open share modal or trigger share
  };

  const sizeClasses = {
    small: "h-32",
    medium: "h-48",
    large: "h-64"
  };

  const cardClasses = cn(
    "group cursor-pointer transition-all duration-300 overflow-hidden",
    "hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20",
    "bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:border-purple-500/50"
  );

  return (
    <Link href={`/chat/${story.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={cardClasses}
      >
        <Card className="h-full bg-transparent border-0">
          {/* Header Image */}
          <div className={cn("relative overflow-hidden", sizeClasses[size])}>
            <div 
              className="absolute inset-0 bg-gradient-to-br opacity-80 group-hover:opacity-90 transition-opacity"
              style={{
                backgroundImage: `linear-gradient(135deg, 
                  ${story.category === 'Heartbreak' ? '#dc2626, #7c2d12' : 
                    story.category === 'Scandal' ? '#9333ea, #db2777' : 
                    story.category === 'Humor' ? '#059669, #0891b2' : 
                    story.category === 'Mystery' ? '#1e40af, #581c87' : 
                    '#6b7280, #374151'})`
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {story.isViral && (
                <Badge className="bg-red-500/90 text-white text-xs px-2 py-1">
                  <Flame className="w-3 h-3 mr-1" />
                  VIRAL
                </Badge>
              )}
              {story.isNew && (
                <Badge className="bg-green-500/90 text-white text-xs px-2 py-1">
                  NEW
                </Badge>
              )}
              {story.isHot && (
                <Badge className="bg-orange-500/90 text-white text-xs px-2 py-1">
                  🔥 HOT
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="absolute top-3 right-3 flex items-center space-x-2">
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                <Eye className="w-3 h-3 text-white mr-1" />
                <span className="text-xs text-white">{formatNumber(story.views)}</span>
              </div>
            </div>

            {/* Cliffhanger Level */}
            <div className="absolute bottom-3 left-3">
              <div className="bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center">
                <Zap className="w-3 h-3 text-white mr-1" />
                <span className="text-xs text-white font-semibold">
                  Cliffhanger Level: {story.cliffhangerLevel}/10
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="absolute bottom-3 right-3">
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                <Clock className="w-3 h-3 text-white mr-1" />
                <span className="text-xs text-white">{story.duration}min</span>
              </div>
            </div>

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center"
            >
              <Button 
                size="sm" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Watching
              </Button>
            </motion.div>
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-white text-lg mb-1 line-clamp-1">
                  {story.title}
                </h4>
                <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                  {story.description}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                    {story.category}
                  </span>
                  {story.hasAudio && (
                    <span className="ml-2 bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                      🎵 Audio
                    </span>
                  )}
                  {story.hasImages && (
                    <span className="ml-2 bg-green-500/20 text-green-300 px-2 py-1 rounded-full">
                      📸 Images
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-4 text-gray-400">
                <button
                  onClick={handleLike}
                  className={cn(
                    "flex items-center space-x-1 hover:text-red-400 transition-colors",
                    liked && "text-red-400"
                  )}
                >
                  <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                  <span className="text-sm">{formatNumber(story.likes)}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{formatNumber(story.shares)}</span>
                </button>
              </div>

              <div className="flex items-center">
                {story.cliffhangerLevel >= 8 && (
                  <Lock className="w-4 h-4 text-yellow-500 mr-2" />
                )}
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30"
                >
                  {story.difficulty}
                </Badge>
              </div>
            </div>

            {/* Preview teaser for viral content */}
            {showPreview && story.isViral && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-lg"
              >
                <p className="text-xs text-red-300 font-medium">
                  💥 "Wait, WHAT?! I can't believe she said that..." - Share to see the explosive response!
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}