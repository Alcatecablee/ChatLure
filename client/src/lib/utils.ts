import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | undefined): string {
  if (!num || typeof num !== 'number') {
    return '0';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function getStoryBadge(story: { isHot: boolean; isNew: boolean; isViral: boolean }) {
  if (story.isHot) return { text: "🔥 HOT", className: "bg-red-500" };
  if (story.isViral) return { text: "📱 VIRAL", className: "bg-yellow-500 text-black" };
  if (story.isNew) return { text: "💬 NEW", className: "bg-green-500" };
  return null;
}

export function getCategoryGradient(categoryName: string): string {
  const gradients: Record<string, string> = {
    'Heartbreak': 'from-red-500/20 to-red-900/40',
    'Drama': 'from-orange-500/20 to-orange-900/40',
    'Comedy': 'from-purple-500/20 to-purple-900/40',
    'Romance': 'from-pink-500/20 to-pink-900/40',
    'Friendship': 'from-green-500/20 to-green-900/40',
    'Family': 'from-blue-500/20 to-blue-900/40',
  };
  return gradients[categoryName] || 'from-gray-500/20 to-gray-900/40';
}

export function shareToSocial(platform: string, story: { title: string; description: string }) {
  const text = `${story.title} - ${story.description}`;
  const url = window.location.href;
  
  const shareUrls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    instagram: '#', // Instagram doesn't support direct URL sharing
    tiktok: '#', // TikTok doesn't support direct URL sharing
  };
  
  if (shareUrls[platform] && shareUrls[platform] !== '#') {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}
