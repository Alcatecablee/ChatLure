import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
<<<<<<< HEAD
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
=======
import { ArrowLeft, Video, Phone, MoreVertical, Smile, Mic, CheckCheck, Heart, Clock, Headphones, Image as ImageIcon, Zap, Eye, Battery, Wifi, Signal, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SocialShare from "@/components/social-share";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatNumber } from "@/lib/utils";
import type { Story, Message } from "@shared/schema";
>>>>>>> origin/main

export default function Chat() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
<<<<<<< HEAD
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
=======
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [juiceLevel, setJuiceLevel] = useState(100);
  const [showJuiceModal, setShowJuiceModal] = useState(false);
  const [phoneOff, setPhoneOff] = useState(false);
>>>>>>> origin/main

  const { data: story, isLoading: storyLoading } = useQuery<Story>({
    queryKey: [`/api/stories/${id}`],
  });

<<<<<<< HEAD
=======
  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/messages/${id}`],
  });

>>>>>>> origin/main
  const recordViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/stories/${id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${id}`] });
    },
  });

<<<<<<< HEAD
=======
  const recordShareMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/stories/${id}/share`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stories/${id}`] });
    },
  });

>>>>>>> origin/main
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

<<<<<<< HEAD
=======
  useEffect(() => {
    if (!messages || messages.length === 0) return;

    const timer = setInterval(() => {
      if (currentMessageIndex < messages.length - 1) {
        // Decrease juice with each message
        setJuiceLevel(prev => {
          const newLevel = Math.max(0, prev - 0.25);
          if (newLevel <= 20 && !showJuiceModal) {
            setShowJuiceModal(true);
          }
          if (newLevel === 0) {
            setPhoneOff(true);
          }
          return newLevel;
        });

        if (juiceLevel > 0) {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setCurrentMessageIndex(prev => prev + 1);
          }, 2000);
        }
      } else {
        // Show share modal after all messages are shown
        setTimeout(() => {
          setShowShareModal(true);
        }, 1000);
      }
    }, 3000);

    return () => clearInterval(timer);
  }, [messages, currentMessageIndex, juiceLevel]);

  const handleShare = () => {
    recordShareMutation.mutate();
    setShowShareModal(false);
    // Recharge juice after sharing
    setJuiceLevel(prev => Math.min(100, prev + 30));
    setPhoneOff(false);
    setShowJuiceModal(false);
  };

>>>>>>> origin/main
  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      recordLikeMutation.mutate();
    }
  };

<<<<<<< HEAD
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
=======
  const handleRecharge = () => {
    setJuiceLevel(100);
    setPhoneOff(false);
    setShowJuiceModal(false);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (storyLoading || messagesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="phone-frame">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
>>>>>>> origin/main
          </div>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
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
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Stories
            </Button>
          </div>
          
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{story.title}</h1>
              <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                {story.description}
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2">
                <Eye className="h-4 w-4 mr-2" />
                {formatNumber(story.views)} views
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Share2 className="h-4 w-4 mr-2" />
                {formatNumber(story.shares)} shares
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                {formatNumber(story.likes)} likes
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Experience Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 border border-border shadow-2xl">
            <div className="text-center space-y-6">
              <div className="mx-auto w-32 h-32 bg-surface rounded-2xl flex items-center justify-center border border-border shadow-lg">
                <Smartphone className="w-16 h-16 text-primary" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {story.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  Experience this conversation like you're secretly watching over their shoulder...
                </p>
                
                <PhoneModal 
                  storyId={parseInt(id || "1")} 
                  triggerText="👀 Start Watching"
                  trigger={
                    <Button 
                      size="lg" 
                      className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      👀 Start Watching
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
          
          {/* Story Stats & Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-enhanced bg-surface border border-border">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Immersive Experience</h4>
                <p className="text-muted-foreground text-sm">Watch messages unfold in real-time with authentic delays</p>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced bg-surface border border-border">
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Interactive Drama</h4>
                <p className="text-muted-foreground text-sm">Share to unlock plot twists and surprise endings</p>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced bg-surface border border-border">
              <CardContent className="p-6 text-center">
                <div className="relative">
                  <Heart 
                    className={`w-8 h-8 mx-auto mb-3 cursor-pointer transition-all duration-200 ${
                      isLiked ? 'text-red-500 fill-current scale-110' : 'text-primary hover:text-red-500'
                    }`}
                    onClick={handleLike}
                  />
                  {showHeartAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Heart className="w-12 h-12 text-red-500 fill-current animate-ping" />
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-foreground mb-2">Show Love</h4>
                <p className="text-muted-foreground text-sm">
                  {isLiked ? "Thanks for the love! ❤️" : "Tap the heart if you love this story"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Social Share */}
          <div className="mt-8 text-center">
            <h4 className="text-lg font-semibold text-foreground mb-4">Share the Drama</h4>
            <SocialShare />
          </div>
        </div>
      </section>
=======
  if (!story || !messages) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="phone-frame">
          <div className="flex items-center justify-center h-full text-center text-white">
            <div>
              <h2 className="text-xl font-bold mb-4">Story not found</h2>
              <Button onClick={() => setLocation("/")} className="bg-white text-black">
                Go Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const visibleMessages = messages.slice(0, currentMessageIndex + 1);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div className="phone-frame">
        {phoneOff ? (
          // Phone Off State
          <div className="h-full bg-black flex items-center justify-center text-center text-white">
            <div className="space-y-4">
              <Battery className="h-16 w-16 mx-auto text-red-500" />
              <h3 className="text-xl font-bold">Battery dead</h3>
              <p className="text-gray-400">Recharge to keep peeking 👀</p>
              <Button 
                onClick={handleRecharge}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                ⚡ Plug in to recharge
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Status Bar */}
            <div className="status-bar">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium">{getCurrentTime()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <div className="flex items-center space-x-1">
                  <Battery className={`h-3 w-3 ${juiceLevel <= 20 ? 'text-red-500' : juiceLevel <= 50 ? 'text-yellow-500' : 'text-green-500'}`} />
                  <span className="text-xs">{juiceLevel}%</span>
                </div>
              </div>
            </div>

            {/* Chat Header - Burble Style */}
            <div className="chat-header">
              <div className="flex items-center space-x-3 px-4 py-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white p-0"
                  onClick={() => setLocation("/")}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">💬</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">Burble</h4>
                  <p className="text-white/80 text-xs">Africa's AI Township Helper</p>
                </div>
              </div>
            </div>

            {/* Juice Level Bar */}
            <div className="px-4 py-2 bg-gray-900">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">PeepPower™</span>
                <span className={`font-medium ${juiceLevel <= 20 ? 'text-red-400' : juiceLevel <= 50 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {juiceLevel}% Juice
                </span>
              </div>
              <Progress 
                value={juiceLevel} 
                className="h-1 mt-1"
                style={{
                  background: '#1f2937'
                }}
              />
            </div>

            {/* Chat Messages */}
            <div className="chat-area">
              <div className="chat-background h-full p-4 space-y-3 overflow-y-auto">
                {visibleMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`${
                      message.isIncoming 
                        ? 'bg-white text-gray-800' 
                        : 'bg-green-500 text-white'
                    } px-3 py-2 rounded-lg max-w-xs shadow-sm`}>
                      <p className="text-sm">{message.content}</p>
                      <div className={`flex items-center ${
                        message.isIncoming ? '' : 'justify-end'
                      } space-x-1 mt-1`}>
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {!message.isIncoming && message.hasReadReceipt && (
                          <CheckCheck className="h-3 w-3 text-blue-200" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Area */}
            <div className="whatsapp-input">
              <Button variant="ghost" size="sm" className="p-0 text-gray-600">
                <Smile className="h-5 w-5" />
              </Button>
              <Input 
                placeholder="Type a message" 
                className="flex-1 bg-white rounded-full px-4 py-2 text-sm border-0"
                disabled
              />
              <Button variant="ghost" size="sm" className="p-0 text-green-600">
                <Mic className="h-5 w-5" />
              </Button>
            </div>

            {/* Low Juice Modal */}
            {showJuiceModal && !phoneOff && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-20">
                <Card className="bg-gray-900 max-w-xs mx-4 border-yellow-500">
                  <CardContent className="p-6 text-center">
                    <Battery className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                    <h4 className="text-white font-bold text-lg mb-2">Low Juice!</h4>
                    <p className="text-gray-300 text-sm mb-4">Your PeepPower™ is running low. Recharge to keep peeking!</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share & Get 30% Juice
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-yellow-500 text-yellow-500"
                        onClick={handleRecharge}
                      >
                        ⚡ Buy Juice Pack
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm z-20">
                <Card className="bg-gray-900 max-w-xs mx-4">
                  <CardContent className="p-6 text-center">
                    <h4 className="text-white font-bold text-lg mb-2">🔥 Plot Twist Ahead!</h4>
                    <p className="text-gray-300 text-sm mb-4">Share to unlock the shocking continuation...</p>
                    <SocialShare onShare={handleShare} />
                    <Button 
                      className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
                      onClick={handleShare}
                    >
                      Share & Continue
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>


>>>>>>> origin/main
    </div>
  );
}