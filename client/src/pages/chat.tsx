import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { ArrowLeft, Smartphone, Eye, Share2, Heart, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import PhoneModal from "@/components/phone-modal";
import SocialShare from "@/components/social-share";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatNumber } from "@/lib/utils";
import type { Story } from "@shared/schema";

export default function Chat() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  const { data: story, isLoading: storyLoading } = useQuery<Story>({
    queryKey: [`/api/stories/${id}`],
  });

  const recordViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/stories/${id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${id}`] });
    },
  });

  const recordLikeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/stories/${id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${id}`] });
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    },
  });

  useEffect(() => {
    if (story) {
      recordViewMutation.mutate();
    }
  }, [story]);

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      recordLikeMutation.mutate();
    }
  };

  if (storyLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Story not found</h2>
            <Button onClick={() => setLocation("/")} className="btn-primary">
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Story Header */}
      <section className="py-12 px-4 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Stories
            </Button>
          </div>

          <div className="text-center space-y-6">
            <div className="space-y-4">
              <Badge 
                variant="secondary" 
                className="bg-destructive/20 text-destructive border-destructive/30"
              >
                {story.category}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {story.title}
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {story.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>{formatNumber(story.views)} views</span>
              </div>
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>{formatNumber(story.shares)} shares</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>{formatNumber(story.likes)} likes</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <PhoneModal 
                storyId={story.id} 
                triggerText="👀 Start Reading"
                trigger={
                  <Button 
                    size="lg" 
                    className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <Smartphone className="mr-2 h-5 w-5" />
                    👀 Start Reading
                  </Button>
                }
              />
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLike}
                  className={`relative ${isLiked ? 'text-red-500 border-red-500' : ''}`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Liked!' : 'Like'}
                  {showHeartAnimation && (
                    <div className="absolute -top-2 -right-2 animate-bounce">
                      ❤️
                    </div>
                  )}
                </Button>
                
                <SocialShare 
                  story={story}
                  trigger={
                    <Button variant="outline" size="lg">
                      <Share2 className="w-5 h-5 mr-2" />
                      Share
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Preview */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border shadow-xl">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="mx-auto w-32 h-32 bg-surface rounded-2xl flex items-center justify-center border border-border shadow-lg">
                  <Smartphone className="w-16 h-16 text-primary" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Ready to Peek?</h3>
                  <p className="text-muted-foreground mb-6">
                    Click above to dive into this addictive conversation. Warning: You might not be able to stop reading!
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Instant Access</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="w-4 h-4 text-green-500" />
                      <span>Auto-Play Messages</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}