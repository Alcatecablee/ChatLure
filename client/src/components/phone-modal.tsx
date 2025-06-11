import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Smartphone, Play } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import ChatSimulator from "./chat-simulator";

interface PhoneModalProps {
  storyId?: number;
  trigger?: React.ReactNode;
  triggerText?: string;
}

export default function PhoneModal({ 
  storyId = 1, 
  trigger, 
  triggerText = "Open Chat" 
}: PhoneModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultTrigger = (
    <Button 
      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
    >
      <Smartphone className="w-5 h-5 mr-2" />
      {triggerText}
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent 
        className="max-w-fit p-0 border-0 bg-transparent shadow-none"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <VisuallyHidden>
          <DialogTitle>Chat Story Viewer</DialogTitle>
          <DialogDescription>
            Interactive chat story experience - watch conversations unfold in real-time
          </DialogDescription>
        </VisuallyHidden>
        
        <div className="flex items-center justify-center min-h-[90vh] p-4">
          <div className="relative">
            {/* Glassy background effect */}
            <div 
              className="absolute inset-0 rounded-[3rem] -m-8"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(30px)',
                WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
              }}
            />
            
            {/* Phone component */}
            <div className="relative z-10 animate-in fade-in zoom-in duration-300">
              <ChatSimulator storyId={storyId} />
            </div>
            
            {/* Close instruction */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-white/70 text-sm">
                Click outside to close
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 