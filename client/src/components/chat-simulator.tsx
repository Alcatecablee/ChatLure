import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Share2, Heart, Eye, Clock, Play, Pause, Zap, Volume2, VolumeX, Lock, Unlock, MessageCircle, Battery, BatteryLow, Wifi, Signal, ChevronLeft, ChevronRight, Smartphone, Monitor, Tablet } from "lucide-react";
import { cn } from "@/lib/utils";
import TypingIndicator from "./typing-indicator";
import SocialShare from "./social-share";
import ViralShareModal from "./viral-share-modal";
import { motion, AnimatePresence } from "framer-motion";

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
  category: string;
  imageUrl: string;
  views: number;
  shares: number;
  likes: number;
  isHot: boolean;
  isNew: boolean;
  isViral: boolean;
  difficulty: string;
  duration: number;
  hasAudio: boolean;
  hasImages: boolean;
  cliffhangerLevel: number;
}

interface ChatSimulatorProps {
  storyId?: number;
}

type DeviceFormat = 'iphone' | 'android' | 'tablet' | 'desktop';

const deviceConfigs = {
  iphone: {
    name: 'iPhone',
    icon: Smartphone,
    containerClass: 'max-w-sm',
    phoneClass: 'rounded-[2.5rem] w-80',
    screenClass: 'rounded-[2rem]',
    chatHeight: 'h-[500px]',
    description: 'Compact mobile view'
  },
  android: {
    name: 'Android',
    icon: Smartphone,
    containerClass: 'max-w-sm',
    phoneClass: 'rounded-[1.5rem] w-80',
    screenClass: 'rounded-[1rem]',
    chatHeight: 'h-[500px]',
    description: 'Android phone style'
  },
  tablet: {
    name: 'Tablet',
    icon: Tablet,
    containerClass: 'max-w-md',
    phoneClass: 'rounded-[2rem] w-96',
    screenClass: 'rounded-[1.5rem]',
    chatHeight: 'h-[700px]',
    description: 'Larger tablet view - recommended'
  },
  desktop: {
    name: 'Desktop',
    icon: Monitor,
    containerClass: 'max-w-lg',
    phoneClass: 'rounded-[1rem] w-[500px]',
    screenClass: 'rounded-[0.5rem]',
    chatHeight: 'h-[600px]',
    description: 'Full desktop experience'
  }
};

export default function ChatSimulator({ storyId = 1 }: ChatSimulatorProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [peepPower, setPeepPower] = useState(75); // PeepPower battery level (0-100)
  const [isDead, setIsDead] = useState(false); // Phone "dead" state
  const [isCharging, setIsCharging] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showCliffhanger, setShowCliffhanger] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deviceFormat, setDeviceFormat] = useState<DeviceFormat>('tablet'); // Default to tablet for better width
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const deviceSelectorRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: [`/api/messages/${storyId}`],
  });

  const { data: story } = useQuery<StoryData>({
    queryKey: [`/api/stories/${storyId}`],
  });

  const currentDevice = deviceConfigs[deviceFormat];

  const cycleDeviceFormat = (direction: 'prev' | 'next') => {
    const formats: DeviceFormat[] = ['iphone', 'android', 'tablet', 'desktop'];
    const currentIndex = formats.indexOf(deviceFormat);
    let newIndex: number;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % formats.length;
    } else {
      newIndex = (currentIndex - 1 + formats.length) % formats.length;
    }
    
    console.log(`Switching from ${deviceFormat} to ${formats[newIndex]}`);
    
    // Add animation class temporarily
    const container = document.querySelector('.device-container');
    if (container) {
      container.classList.add('device-format-changing');
      setTimeout(() => {
        container.classList.remove('device-format-changing');
      }, 300);
    }
    
    setDeviceFormat(formats[newIndex]);
  };

  // Handle clicking outside device selector to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deviceSelectorRef.current && !deviceSelectorRef.current.contains(event.target as Node)) {
        setShowDeviceSelector(false);
      }
    };

    if (showDeviceSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDeviceSelector]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDeviceSelector(false);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        cycleDeviceFormat('prev');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        cycleDeviceFormat('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deviceFormat]);

  // Enhanced chat progression with PeepPower battery drain
  useEffect(() => {
    if (!isPlaying || currentIndex >= messages.length || isDead) {
      if (currentIndex >= messages.length && messages.length > 0) {
        setShowCliffhanger(true);
        setIsLocked(true);
      }
      return;
    }

    const currentMessage = messages[currentIndex];
    const baseTypingDelay = currentMessage.isIncoming ? Math.random() * 3000 + 1500 : 500;
    const messageDelay = currentMessage.content.length * 80 + Math.random() * 1000 + 800;

    const timer = setTimeout(() => {
      // Drain PeepPower for each message (2-5% per message)
      const drain = Math.floor(Math.random() * 4) + 2;
      setPeepPower(prev => {
        const newPower = Math.max(0, prev - drain);
        if (newPower <= 0) {
          setIsDead(true);
          setIsPlaying(false);
        }
        return newPower;
      });

      if (currentMessage.isIncoming) {
        setIsTyping(true);
        
        if (soundEnabled) {
          // Sound would be implemented here
        }
        
        setTimeout(() => {
          setVisibleMessages(prev => [...prev, currentMessage]);
          setCurrentIndex(prev => prev + 1);
          setIsTyping(false);
          setProgress((currentIndex + 1) / messages.length * 100);
          
          if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
          }
        }, messageDelay);
      } else {
        setVisibleMessages(prev => [...prev, currentMessage]);
        setCurrentIndex(prev => prev + 1);
        setProgress((currentIndex + 1) / messages.length * 100);
      }
    }, baseTypingDelay);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, messages, soundEnabled, isDead]);

  const startChat = () => {
    if (isDead && peepPower <= 0) {
      return; // Can't start if battery is dead
    }
    setIsPlaying(true);
    setVisibleMessages([]);
    setCurrentIndex(0);
    setProgress(0);
    setIsLocked(false);
    setShowCliffhanger(false);
    setIsDead(false);
  };

  const pauseChat = () => {
    setIsPlaying(false);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleUnlock = () => {
    setShowShareModal(true);
  };

  const handleRecharge = (amount: number) => {
    setIsCharging(true);
    setTimeout(() => {
      setPeepPower(prev => Math.min(100, prev + amount));
      setIsDead(false);
      setIsCharging(false);
    }, 2000); // 2 second charging animation
  };

  const getBatteryIcon = () => {
    if (isCharging) return <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />;
    if (peepPower > 50) return <Battery className="h-4 w-4 text-green-400" />;
    if (peepPower > 20) return <Battery className="h-4 w-4 text-yellow-400" />;
    return <BatteryLow className="h-4 w-4 text-red-400" />;
  };

  const getBatteryColor = () => {
    if (peepPower > 50) return "bg-green-400";
    if (peepPower > 20) return "bg-yellow-400";
    return "bg-red-400";
  };

  const handleLike = async () => {
    try {
      await fetch(`/api/stories/${storyId}/like`, { method: "POST" });
    } catch (error) {
      console.error("Failed to like story:", error);
    }
  };

  if (!story || messages.length === 0) {
    return (
      <div className="relative">
        {/* Device Format Selector */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative" ref={deviceSelectorRef}>
            <Button
              onClick={() => setShowDeviceSelector(!showDeviceSelector)}
              variant="ghost"
              size="sm"
              className="device-selector-trigger"
            >
              <currentDevice.icon className="h-4 w-4 mr-2 text-white" />
              <span className="text-white">{currentDevice.name}</span>
            </Button>
            
            {showDeviceSelector && (
              <div className="device-selector rounded-lg p-2 space-y-1">
                {Object.entries(deviceConfigs).map(([key, config]) => (
                  <Button
                    key={key}
                    onClick={() => {
                      setDeviceFormat(key as DeviceFormat);
                      setShowDeviceSelector(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-white hover:bg-white/20",
                      deviceFormat === key && "bg-white/30"
                    )}
                  >
                    <config.icon className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{config.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <Card 
          className={`${currentDevice.containerClass} mx-auto device-container device-${deviceFormat}`}
          style={{
            maxWidth: deviceFormat === 'tablet' ? '1280px' : undefined,
            width: deviceFormat === 'tablet' ? '100%' : undefined
          }}
        >
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading chat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dead battery screen overlay
  if (isDead) {
    return (
      <div className="relative">
        {/* Navigation Arrows */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
          <Button
            onClick={() => cycleDeviceFormat('prev')}
            variant="ghost"
            size="lg"
            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
            style={{ width: '50px', height: '50px' }}
            title="Previous device format"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
          <Button
            onClick={() => cycleDeviceFormat('next')}
            variant="ghost"
            size="lg"
            className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
            style={{ width: '50px', height: '50px' }}
            title="Next device format"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Device Format Selector */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="relative" ref={deviceSelectorRef}>
            <Button
              onClick={() => setShowDeviceSelector(!showDeviceSelector)}
              variant="ghost"
              size="sm"
              className="device-selector-trigger"
            >
              <currentDevice.icon className="h-4 w-4 mr-2 text-white" />
              <span className="text-white">{currentDevice.name}</span>
            </Button>
            
            {showDeviceSelector && (
              <div className="device-selector rounded-lg p-2 space-y-1">
                {Object.entries(deviceConfigs).map(([key, config]) => (
                  <Button
                    key={key}
                    onClick={() => {
                      setDeviceFormat(key as DeviceFormat);
                      setShowDeviceSelector(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start text-white hover:bg-white/20",
                      deviceFormat === key && "bg-white/30"
                    )}
                  >
                    <config.icon className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-medium">{config.name}</div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={`${currentDevice.containerClass} mx-auto device-container device-${deviceFormat}`}>
          {/* Phone Frame */}
          <div className={`phone-frame-responsive bg-black ${currentDevice.phoneClass} shadow-2xl device-phone`}>
            <div className={`bg-gray-900 ${currentDevice.screenClass} overflow-hidden flex-1`}>
              {/* Phone Status Bar */}
              <div className="flex items-center justify-between px-6 py-3 bg-black text-white text-sm">
                <div className="flex items-center space-x-1">
                  <Signal className="h-4 w-4" />
                  <Wifi className="h-4 w-4" />
                </div>
                <div className="font-medium">3:06</div>
                <div className="flex items-center space-x-1">
                  {getBatteryIcon()}
                  <span className="text-sm text-red-400">0%</span>
                </div>
              </div>

              {/* Dead Screen Content */}
              <div className={`flex-1 bg-black flex flex-col items-center justify-center text-center px-6 overflow-y-auto`}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="text-6xl mb-4">🔋</div>
                  <h2 className="text-white text-xl font-bold">PeepPower Drained!</h2>
                  <p className="text-gray-400 text-sm">
                    Your battery died while peeking into "{story.title}"
                  </p>
                  <p className="text-gray-500 text-xs">
                    Recharge to keep stalking... I mean, reading.
                  </p>

                  {/* Recharge Options */}
                  <div className="space-y-3 mt-8">
                    <Button 
                      onClick={() => handleRecharge(100)}
                      className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white"
                      disabled={isCharging}
                    >
                      {isCharging ? <Zap className="h-4 w-4 animate-spin mr-2" /> : <Zap className="h-4 w-4 mr-2" />}
                      Full Recharge (Free Trial)
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => handleRecharge(25)}
                        variant="outline"
                        className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black"
                        disabled={isCharging}
                      >
                        Quick Boost
                        <br />
                        <span className="text-xs">25% Power</span>
                      </Button>
                      
                      <Button 
                        onClick={() => handleRecharge(50)}
                        variant="outline" 
                        className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-black"
                        disabled={isCharging}
                      >
                        Power Saver
                        <br />
                        <span className="text-xs">50% Power</span>
                      </Button>
                    </div>

                    <div className="pt-4 space-y-2">
                      <p className="text-gray-500 text-xs">Free recharge options:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRecharge(20)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          📱 Share Story
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRecharge(15)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          👥 Invite Friend
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => cycleDeviceFormat('prev')}
          variant="ghost"
          size="lg"
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
          style={{ width: '50px', height: '50px' }}
          title="Previous device format"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          onClick={() => cycleDeviceFormat('next')}
          variant="ghost"
          size="lg"
          className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 shadow-2xl backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110"
          style={{ width: '50px', height: '50px' }}
          title="Next device format"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Device Format Selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="relative" ref={deviceSelectorRef}>
          <Button
            onClick={() => setShowDeviceSelector(!showDeviceSelector)}
            variant="ghost"
            size="sm"
            className="device-selector-trigger"
          >
            <currentDevice.icon className="h-4 w-4 mr-2 text-white" />
            <span className="text-white">{currentDevice.name}</span>
          </Button>
          
          {showDeviceSelector && (
            <div className="device-selector rounded-lg p-2 space-y-1">
              {Object.entries(deviceConfigs).map(([key, config]) => (
                <Button
                  key={key}
                  onClick={() => {
                    setDeviceFormat(key as DeviceFormat);
                    setShowDeviceSelector(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-white hover:bg-white/20",
                    deviceFormat === key && "bg-white/30"
                  )}
                >
                  <config.icon className="h-4 w-4 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{config.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div 
        className={`${currentDevice.containerClass} mx-auto device-container device-${deviceFormat}`}
        style={{
          maxWidth: deviceFormat === 'tablet' ? '1280px' : undefined,
          minWidth: deviceFormat === 'tablet' ? '1280px' : undefined,
          width: deviceFormat === 'tablet' ? '1280px' : undefined
        }}
      >
        {/* Phone Frame */}
        <div 
          className={`phone-frame-responsive bg-black ${currentDevice.phoneClass} shadow-2xl device-phone`}
          style={{
            maxWidth: deviceFormat === 'tablet' ? '1200px' : undefined,
            width: deviceFormat === 'tablet' ? '100%' : undefined
          }}
        >
          <div className={`bg-gray-900 ${currentDevice.screenClass} overflow-hidden flex-1`}>
            {/* Phone Status Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-black text-white text-sm">
              <div className="flex items-center space-x-1">
                <Signal className="h-4 w-4" />
                <Wifi className="h-4 w-4" />
              </div>
              <div className="font-medium">3:06</div>
              <div className="flex items-center space-x-1">
                {getBatteryIcon()}
                <span className={`text-sm ${peepPower > 20 ? 'text-green-400' : 'text-red-400'}`}>
                  {peepPower}%
                </span>
              </div>
            </div>

            {/* PeepPower Bar */}
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">PeepPower™</span>
                <span className="text-sm text-gray-500">{peepPower}%</span>
              </div>
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2">
                <motion.div 
                  className={`h-2 rounded-full ${getBatteryColor()}`}
                  style={{ width: `${peepPower}%` }}
                  animate={{ width: `${peepPower}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              {peepPower <= 20 && (
                <p className="text-xs text-red-500 mt-1 animate-pulse">
                  ⚠️ Low PeepPower - Recharge soon!
                </p>
              )}
            </div>

            {/* WhatsApp Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[var(--whatsapp)] text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {story.title.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{story.title}</h3>
                  <p className="text-xs text-green-200 flex items-center">
                    <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-white bg-opacity-20 text-white">
                  <Eye className="w-3 h-3 mr-1" />
                  {story.views}
                </Badge>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className={`p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800`} ref={chatRef}>
              <div className="space-y-3">
                <AnimatePresence>
                  {visibleMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={cn(
                        "flex",
                        message.isIncoming ? "justify-start" : "justify-end"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-xs px-4 py-2 rounded-2xl text-sm shadow-lg transform transition-all hover:scale-105",
                          message.isIncoming
                            ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                            : "bg-blue-500 text-white rounded-br-sm"
                        )}
                      >
                        <p className="break-words leading-relaxed">{message.content}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs opacity-70">{message.timestamp}</span>
                          {!message.isIncoming && (
                            <span className="text-xs">
                              {message.hasReadReceipt ? "✓✓" : "✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <TypingIndicator isVisible={isTyping} />
                
                {showCliffhanger && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-200 dark:border-red-800 rounded-lg text-center"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <Lock className="w-6 h-6 text-red-500 mr-2" />
                      <h3 className="font-bold text-red-700 dark:text-red-400">
                        Cliffhanger Alert!
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      This conversation is getting <span className="font-semibold text-red-600">spicy</span>! 
                      Share to unlock the juicy ending...
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      {[...Array(story.cliffhangerLevel)].map((_, i) => (
                        <Zap key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                      <span className="text-sm font-medium">Level {story.cliffhangerLevel}</span>
                    </div>
                    <Button 
                      onClick={handleUnlock}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Unlock Ending Now
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Chat Controls */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={isPlaying ? pauseChat : startChat}
                    disabled={isDead && peepPower <= 0}
                    className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)] text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    variant="outline"
                    size="sm"
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={handleLike} variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    {story.likes}
                  </Button>
                  <Button onClick={handleShare} variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    {story.shares}
                  </Button>
                </div>
              </div>

              <Progress value={progress} className="w-full h-2" />
              <p className="text-xs text-center text-gray-500 mt-2">
                {Math.round(progress)}% watched
              </p>
            </div>
          </div>
        </div>
      </div>

      <ViralShareModal 
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        story={story as any}
        showUnlockMessage={isLocked && showCliffhanger}
        onUnlock={() => {
          setIsLocked(false);
          setShowCliffhanger(false);
        }}
      />
    </div>
  );
}