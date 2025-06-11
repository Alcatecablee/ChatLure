import { useState, useEffect } from "react";
import { Flame, Share2, Trophy, Users, Timer, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import SocialShare from "./social-share";

interface Challenge {
  id: number;
  title: string;
  description: string;
  target: number;
  current: number;
  timeLeft: string;
  reward: string;
  participants: number;
  trending: boolean;
}

const currentChallenges: Challenge[] = [
  {
    id: 1,
    title: "Share the Drama Challenge",
    description: "Help us reach 10K shares this week and unlock exclusive behind-the-scenes content!",
    target: 10000,
    current: 7832,
    timeLeft: "2 days",
    reward: "Exclusive Stories + Premium Features",
    participants: 2341,
    trending: true
  },
  {
    id: 2,
    title: "Heartbreak Stories Marathon",
    description: "Read 5 heartbreak stories and share your favorite plot twist!",
    target: 5,
    current: 2,
    timeLeft: "5 days",
    reward: "Special Heartbreak Badge",
    participants: 892,
    trending: false
  }
];

export default function ViralChallenge() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  const handleJoinChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowChallengeModal(true);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-8 w-8 text-yellow-400 mr-3" />
            <h3 className="text-3xl font-bold text-white">Viral Challenges</h3>
            <Flame className="h-8 w-8 text-red-400 ml-3" />
          </div>
          <p className="text-gray-300 text-lg">Join thousands in epic storytelling challenges and unlock exclusive rewards!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {currentChallenges.map((challenge) => (
            <Card key={challenge.id} className="bg-[var(--card-bg)] border-gray-700 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-bold text-lg">{challenge.title}</h4>
                    {challenge.trending && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <Flame className="h-3 w-3 mr-1" />
                        TRENDING
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Timer className="h-4 w-4 mr-1" />
                    {challenge.timeLeft}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-medium">
                      {challenge.current.toLocaleString()} / {challenge.target.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(challenge.current / challenge.target) * 100} 
                    className="h-2 bg-gray-700"
                  />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Users className="h-4 w-4 mr-1" />
                    {challenge.participants.toLocaleString()} joined
                  </div>
                  <div className="text-yellow-400 text-sm font-medium">
                    🏆 {challenge.reward}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-xl transition-all transform hover:scale-105"
                  onClick={() => handleJoinChallenge(challenge)}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Join Challenge
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Challenge Modal */}
        {showChallengeModal && selectedChallenge && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <Card className="bg-[var(--card-bg)] max-w-md w-full">
              <CardHeader>
                <h4 className="text-white font-bold text-xl text-center">
                  Challenge Accepted! 🎉
                </h4>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-300 mb-6">
                  You've joined "{selectedChallenge.title}"! Share this challenge with friends to boost your progress.
                </p>
                
                <div className="mb-6">
                  <SocialShare 
                    story={{
                      title: `I just joined the ${selectedChallenge.title}!`,
                      description: "Join me in this epic ChatLure challenge and let's unlock exclusive rewards together!"
                    }}
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowChallengeModal(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    className="flex-1 bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]"
                    onClick={() => setShowChallengeModal(false)}
                  >
                    Start Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}