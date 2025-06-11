import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  isVisible: boolean;
  className?: string;
}

export default function TypingIndicator({ isVisible, className }: TypingIndicatorProps) {
  const [dots, setDots] = useState(1);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className={cn("flex items-center space-x-1 p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl max-w-20", className)}>
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={cn(
              "w-2 h-2 bg-gray-400 rounded-full transition-opacity duration-300",
              dots >= dot ? "opacity-100" : "opacity-30"
            )}
          />
        ))}
      </div>
    </div>
  );
}