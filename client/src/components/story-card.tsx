import { Eye, Share2, Bookmark, Heart, Clock, Headphones, Image, Zap } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber, getStoryBadge, getCategoryGradient } from "@/lib/utils";
import type { Story } from "@shared/schema";

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const badge = getStoryBadge(story);

  return (
    <Link href={`/chat/${story.id}`}>
      <Card className="group bg-[#161b22] border border-[#21262d] rounded-lg overflow-hidden hover:border-[#30363d] transition-all duration-200 cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img 
            src={story.imageUrl} 
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 mb-2">
              {badge && (
                <Badge className={`${badge.className} text-xs font-medium px-2 py-1`}>
                  {badge.text}
                </Badge>
              )}
              <Badge 
                className="bg-[#21262d] text-[#7d8590] border-[#30363d] text-xs px-2 py-1"
              >
                {story.category}
              </Badge>
            </div>
            <h4 className="text-white font-semibold text-sm mb-1">{story.title}</h4>
            <p className="text-[#8b949e] text-xs line-clamp-2">{story.description}</p>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4 text-[#7d8590]" />
                <span className="text-[#7d8590] text-sm">{formatNumber(story.views)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-[#f85149]" />
                <span className="text-[#7d8590] text-sm">{formatNumber(story.likes)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Share2 className="h-4 w-4 text-[#7d8590]" />
                <span className="text-[#7d8590] text-sm">{formatNumber(story.shares)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex items-center space-x-1 text-[#7d8590]">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{story.duration}m read</span>
            </div>
            <div className="flex items-center space-x-1">
              {story.cliffhangerLevel >= 4 && (
                <div className="relative group">
                  <Zap className="h-3 w-3 text-[#ffd33d]" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-[#21262d] text-[#f0f6fc] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    High intensity cliffhanger!
                  </div>
                </div>
              )}
              {story.hasAudio && (
                <div className="relative group">
                  <Headphones className="h-3 w-3 text-[#0969da]" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-[#21262d] text-[#f0f6fc] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Includes voice messages
                  </div>
                </div>
              )}
              {story.hasImages && (
                <div className="relative group">
                  <Image className="h-3 w-3 text-green-400" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Includes images
                  </div>
                </div>
              )}
            </div>
            <Badge variant="outline" className={`text-xs ${
              story.difficulty === 'easy' ? 'border-green-400 text-green-400' :
              story.difficulty === 'medium' ? 'border-yellow-400 text-yellow-400' :
              'border-red-400 text-red-400'
            }`}>
              {story.difficulty.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-[var(--whatsapp)] text-sm font-medium">Continue Reading...</span>
            <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:text-[var(--dramatic)] transition-colors">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
