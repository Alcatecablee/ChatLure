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
          <div className="flex items-center justify-between px-6 py-3 bg-white text-black text-sm font-medium">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-black rounded-full"></div>
                <div className="w-1 h-3 bg-black rounded-full"></div>
                <div className="w-1 h-3 bg-black rounded-full"></div>
              </div>
              <Wifi className="h-4 w-4 ml-2" />
            </div>
            <div className="font-semibold">14:15</div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold">100%</span>
              <Battery className="h-4 w-4" />
            </div>
          </div>

          {/* WhatsApp Header */}
          <div className="bg-[#075e54] text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#075e54] text-lg font-bold">B</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Burbie</h3>
                <p className="text-xs text-green-200">Africa's AI Township Helper</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-white">
              <div className="text-xl">📞</div>
              <div className="text-xl">📹</div>
              <div className="text-xl">⋮</div>
            </div>
          </div>

          {/* Chat Area */}
          <div 
            ref={chatRef}
            className="flex-1 bg-[#e5ddd5] p-4 overflow-y-auto space-y-3"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d1c7b8' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
            }}
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
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm relative ${
                      message.isIncoming
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'bg-[#dcf8c6] text-gray-800'
                    }`}
                    style={{
                      borderRadius: message.isIncoming ? '7.5px 7.5px 7.5px 0px' : '7.5px 7.5px 0px 7.5px'
                    }}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <div className={`text-xs mt-1 flex items-center justify-end ${
                      message.isIncoming ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      <span>{message.timestamp}</span>
                      {!message.isIncoming && message.hasReadReceipt && (
                        <span className="ml-2 text-blue-500">✓✓</span>
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
                <div className="bg-white rounded-lg px-4 py-3 shadow-sm"
                     style={{ borderRadius: '7.5px 7.5px 7.5px 0px' }}>
                  <TypingIndicator isVisible={true} />
                </div>
              </motion.div>
            )}
          </div>

          {/* Message Input Area */}
          <div className="bg-[#f0f0f0] p-3 flex items-center space-x-3">
            <div className="flex-1 bg-white rounded-full px-4 py-2 flex items-center space-x-3">
              <span className="text-gray-500 text-lg">😊</span>
              <input 
                type="text" 
                placeholder="Type a message" 
                className="flex-1 bg-transparent outline-none text-gray-700"
                disabled
              />
              <span className="text-gray-500 text-lg">📎</span>
              <span className="text-gray-500 text-lg">📷</span>
            </div>
            <button className="bg-[#075e54] text-white rounded-full p-3">
              <span className="text-lg">🎤</span>
            </button>
          </div>

          {/* Controls */}
          <div className="bg-white border-t p-4 space-y-3">
            {/* Play/Pause Button */}
            <div className="flex justify-center">
              <Button
                onClick={isPlaying ? pauseChat : startChat}
                className={`rounded-full w-12 h-12 ${
                  isPlaying ? 'bg-red-500 hover:bg-red-600' : 'bg-[#075e54] hover:bg-[#064e44]'
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
                className="flex items-center space-x-1 text-[#075e54]"
              >
                <Heart className="w-4 h-4" />
                <span>{story.likes}</span>
              </Button>
              
              <Button
                onClick={handleShare}
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-1 text-[#075e54]"
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