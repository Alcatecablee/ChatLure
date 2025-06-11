import { Button } from "@/components/ui/button";
import { shareToSocial } from "@/lib/utils";
import { FaInstagram, FaTiktok, FaTwitter, FaFacebook } from "react-icons/fa";

interface SocialShareProps {
  story?: { title: string; description: string };
  onShare?: () => void;
  compact?: boolean;
}

export default function SocialShare({ story, onShare, compact = false }: SocialShareProps) {
  const defaultStory = {
    title: "ChatLure - Addictive Chat Stories",
    description: "Dive into the world of secret chats and viral drama!"
  };

  const handleShare = (platform: string) => {
    shareToSocial(platform, story || defaultStory);
    if (onShare) {
      onShare();
    }
  };

  const buttonSize = compact ? "sm" : "default";
  const iconSize = compact ? "text-sm" : "text-lg";

  return (
    <div className={`flex ${compact ? 'space-x-3' : 'space-x-4 justify-center'}`}>
      <Button
        variant="ghost"
        size={buttonSize}
        className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl transition-colors text-white"
        onClick={() => handleShare('instagram')}
      >
        <FaInstagram className={iconSize} />
      </Button>
      <Button
        variant="ghost"
        size={buttonSize}
        className="p-3 bg-black hover:bg-gray-800 rounded-xl transition-colors text-white"
        onClick={() => handleShare('tiktok')}
      >
        <FaTiktok className={iconSize} />
      </Button>
      <Button
        variant="ghost"
        size={buttonSize}
        className="p-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors text-white"
        onClick={() => handleShare('twitter')}
      >
        <FaTwitter className={iconSize} />
      </Button>
      {!compact && (
        <Button
          variant="ghost"
          size={buttonSize}
          className="p-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-white"
          onClick={() => handleShare('facebook')}
        >
          <FaFacebook className={iconSize} />
        </Button>
      )}
    </div>
  );
}
