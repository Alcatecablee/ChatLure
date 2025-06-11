import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, CheckCircle, Flame, Unlock, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { shareToSocial } from "@/lib/utils";
interface Story {
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

interface ViralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  story?: Story;
  onUnlock?: () => void;
  showUnlockMessage?: boolean;
}

export default function ViralShareModal({ 
  isOpen, 
  onClose, 
  story, 
  onUnlock,
  showUnlockMessage = false 
}: ViralShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const shareUrl = `https://chatlure.app/chat/${story?.id}`;
  const shareText = story ? 
    `🔥 OMG you NEED to see this chat conversation! ${story.title} - I'm literally obsessed! #ChatLure #Drama` :
    "🔥 Check out this addictive chat story on ChatLure!";

  const platforms = [
    {
      id: "twitter",
      name: "Twitter",
      color: "bg-blue-500 hover:bg-blue-600",
      icon: "🐦",
      viralText: "🔥 This chat is UNHINGED! You won't believe what happens next..."
    },
    {
      id: "instagram",
      name: "Instagram Stories",
      color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      icon: "📸",
      viralText: "💥 SCREAMING! This conversation has me SHOOK..."
    },
    {
      id: "tiktok",
      name: "TikTok",
      color: "bg-black hover:bg-gray-800",
      icon: "🎵",
      viralText: "😱 POV: You're secretly reading someone's private messages..."
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      color: "bg-green-500 hover:bg-green-600",
      icon: "💬",
      viralText: "👀 Send this to your group chat - they'll thank you later!"
    },
    {
      id: "snapchat",
      name: "Snapchat",
      color: "bg-yellow-400 hover:bg-yellow-500",
      icon: "👻",
      viralText: "🤯 This story is giving me LIFE! Watch it before it's gone..."
    }
  ];

  const handleShare = (platform: string) => {
    setSelectedPlatform(platform);
    const platformData = platforms.find(p => p.id === platform);
    const customText = platformData?.viralText || shareText;
    
    shareToSocial(platform, { 
      title: story?.title || "ChatLure Story", 
      description: customText 
    });

    // Simulate unlock after sharing
    setTimeout(() => {
      if (onUnlock) {
        onUnlock();
      }
      onClose();
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-purple-500/30 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {showUnlockMessage ? "🔓 Unlock the Ending!" : "Share & Go Viral!"}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {showUnlockMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-lg text-center"
            >
              <Flame className="w-8 h-8 mx-auto mb-2 text-red-400" />
              <p className="text-red-300 font-medium mb-2">
                This story is getting INTENSE! Share to unlock the shocking conclusion...
              </p>
              <Badge className="bg-red-500/20 text-red-300 border border-red-500/30">
                🔥 Cliffhanger Level: {story?.cliffhangerLevel}/10
              </Badge>
            </motion.div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Share2 className="w-5 h-5 mr-2 text-purple-400" />
              Choose Your Platform
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <motion.button
                  key={platform.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShare(platform.id)}
                  className={cn(
                    "p-4 rounded-lg text-white font-medium transition-all flex flex-col items-center space-y-2 border",
                    platform.color,
                    selectedPlatform === platform.id ? "ring-2 ring-white" : "border-transparent"
                  )}
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <span className="text-sm">{platform.name}</span>
                  {selectedPlatform === platform.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center text-xs"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Shared!
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium mb-3 text-gray-300">Or copy the link</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300">
                {shareUrl}
              </div>
              <Button
                onClick={handleCopyLink}
                size="sm"
                variant={copiedLink ? "default" : "secondary"}
                className={cn(
                  "shrink-0",
                  copiedLink && "bg-green-600 hover:bg-green-700"
                )}
              >
                {copiedLink ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="font-medium text-purple-300 mb-2 flex items-center">
              <Flame className="w-4 h-4 mr-2" />
              Viral Share Tip
            </h4>
            <p className="text-sm text-gray-300">
              Add your own reaction or opinion to make it more engaging! 
              Stories with personal commentary get 3x more engagement.
            </p>
          </div>

          {showUnlockMessage && (
            <Button
              onClick={() => {
                if (onUnlock) onUnlock();
                onClose();
              }}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Skip & Unlock Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}