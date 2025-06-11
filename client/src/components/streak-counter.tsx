import { useState, useEffect } from "react";
import { Flame, Calendar, Target, Star, Award, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const achievements: Achievement[] = [
  {
    id: "first_story",
    title: "Story Voyeur",
    description: "Read your first story",
    icon: <Star className="h-4 w-4" />,
    unlocked: true
  },
  {
    id: "streak_3",
    title: "Getting Hooked",
    description: "3-day reading streak",
    icon: <Flame className="h-4 w-4" />,
    unlocked: true
  },
  {
    id: "streak_7",
    title: "Drama Addict",
    description: "7-day reading streak",
    icon: <Calendar className="h-4 w-4" />,
    unlocked: false,
    progress: 5,
    target: 7
  },
  {
    id: "shares_10",
    title: "Social Spreader",
    description: "Share 10 stories",
    icon: <Target className="h-4 w-4" />,
    unlocked: false,
    progress: 7,
    target: 10
  },
  {
    id: "viral_master",
    title: "Viral Master",
    description: "Complete 5 viral challenges",
    icon: <Award className="h-4 w-4" />,
    unlocked: false,
    progress: 2,
    target: 5
  }
];

export default function StreakCounter() {
  const [currentStreak, setCurrentStreak] = useState(5);
  const [totalStories, setTotalStories] = useState(23);
  const [showAchievements, setShowAchievements] = useState(false);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Card className="bg-[var(--card-bg)]/95 backdrop-blur-sm border-gray-700 hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="p-4" onClick={() => setShowAchievements(!showAchievements)}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1">
                {currentStreak}
              </Badge>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{currentStreak} Day Streak</p>
              <p className="text-gray-400 text-xs">{totalStories} stories read</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAchievements && (
        <div className="absolute bottom-full left-0 mb-2 w-80">
          <Card className="bg-[var(--card-bg)] border-gray-700 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold">Achievements</h4>
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  {unlockedCount}/{totalCount}
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mt-1">Keep reading to unlock more badges!</p>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-700">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`p-4 flex items-center space-x-3 ${
                    achievement.unlocked ? 'bg-green-900/20' : 'opacity-75'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-400'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${
                      achievement.unlocked ? 'text-white' : 'text-gray-400'
                    }`}>
                      {achievement.title}
                    </p>
                    <p className="text-gray-500 text-xs">{achievement.description}</p>
                    {!achievement.unlocked && achievement.progress && achievement.target && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.target) * 100} 
                          className="h-1"
                        />
                      </div>
                    )}
                  </div>
                  {achievement.unlocked && (
                    <Zap className="h-4 w-4 text-yellow-400" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}