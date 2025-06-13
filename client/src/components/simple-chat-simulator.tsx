import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Share2, Play, Pause, Battery, Wifi, Signal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "./typing-indicator";

interface Message {
  id: number;
  storyId: number;
  content: string;
  isIncoming: boolean;
  timestamp: string;
  hasReadReceipt: boolean;
  order: number;
}

interface StoryData {
  id: number;
  title: string;
  description: string;
  views: number;
  shares: number;
  likes: number;
}

interface SimpleChatSimulatorProps {
  storyId?: number;
}

export default function SimpleChatSimulator({ storyId = 1 }: SimpleChatSimulatorProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [peepPower, setPeepPower] = useState(82); // Battery level
  const chatRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: [`/api/messages/${storyId}`],
  });

  const { data: story } = useQuery<StoryData>({
    queryKey: [`/api/stories/${storyId}`],
  });

  // Chat progression
  useEffect(() => {
    if (!isPlaying || currentIndex >= messages.length) {
      return;
    }

    const currentMessage = messages[currentIndex];
    const baseDelay = currentMessage.isIncoming ? 2000 : 800;
    const typingDelay = currentMessage.content.length * 50;

    const timer = setTimeout(() => {
      if (currentMessage.isIncoming) {
        setIsTyping(true);
        
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentIndex(prev => prev + 1);
          setIsTyping(false);
          setProgress((currentIndex + 1) / messages.length * 100);
          
          // Scroll to bottom
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, typingDelay);
      } else {
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
        setProgress((currentIndex + 1) / messages.length * 100);
      }
    }, baseDelay);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, messages]);

  const startChat = () => {
    setIsPlaying(true);
    setVisibleMessages([]);
    setCurrentIndex(0);
    setProgress(0);
  };

  const pauseChat = () => {
    setIsPlaying(false);
  };

  const handleLike = async () => {
    try {
      await fetch(`/api/stories/${storyId}/like`, { method: "POST" });
    } catch (error) {
      console.error("Failed to like story:", error);
    }
  };

  const handleShare = async () => {
    try {
      await fetch(`/api/stories/${storyId}/share`, { method: "POST" });
    } catch (error) {
      console.error("Failed to share story:", error);
    }
  };

  if (!story || messages.length === 0) {
    return (
      <Card className="max-w-sm mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Phone Frame */}
      <div className="bg-gray-900 rounded-[3rem] p-2 shadow-2xl w-full">
        <div className="bg-white rounded-[2.5rem] overflow-hidden h-[700px] flex flex-col relative">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white text-black text-sm font-medium border-b border-gray-100">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-black rounded-full"></div>
                <div className="w-1 h-3 bg-black rounded-full"></div>
                <div className="w-1 h-3 bg-black rounded-full"></div>
              </div>
              <Wifi className="h-4 w-4 ml-2" />
            </div>
            <div className="font-semibold">9:41</div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold">{peepPower}%</span>
              <Battery className="h-4 w-4" />
            </div>
          </div>

          {/* PeepPower Bar */}
          <div className="px-4 py-2 bg-gray-50 border-b">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>PeepPower™</span>
              <span>{peepPower}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${peepPower}%` }}
              ></div>
            </div>
          </div>

          {/* Chat Header */}
          <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{story.title}</h3>
              <p className="text-sm opacity-90">👆 Online</p>
            </div>
            <div className="text-right text-sm">
              <div>📞 📹</div>
            </div>
          </div>

          {/* Chat Area */}
          <div 
            ref={chatRef}
            className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-3"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f3f4f6" fill-opacity="0.1"%3E%3Cpath d="M0 0h20v20H0z"/%3E%3C/g%3E%3C/svg%3E")' }}
          >
            <AnimatePresence>
              {visibleMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                      message.isIncoming
                        ? 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                        : 'bg-blue-500 text-white rounded-br-sm'
                    }`}
                  >
                    <p>{message.content}</p>
                    <div className={`text-xs mt-1 ${
                      message.isIncoming ? 'text-gray-500' : 'text-blue-100'
                    }`}>
                      {message.timestamp}
                      {!message.isIncoming && message.hasReadReceipt && (
                        <span className="ml-2">✓✓</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <TypingIndicator isVisible={true} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-white border-t p-4 space-y-3">
            {/* Play/Pause Button */}
            <div className="flex justify-center">
              <Button
                onClick={isPlaying ? pauseChat : startChat}
                className={`rounded-full w-12 h-12 ${
                  isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={progress} className="w-full h-1" />
              <div className="text-center text-xs text-gray-500">
                {Math.round(progress)}% watched
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handleLike}
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 text-green-600"
              >
                <Heart className="w-4 h-4" />
                <span>{story.likes}</span>
              </Button>
              
              <Button
                onClick={handleShare}
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-1 text-blue-600"
              >
                <Share2 className="w-4 h-4" />
                <span>{story.shares}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}