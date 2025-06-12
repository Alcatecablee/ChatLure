import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  User, Crown, Calendar, TrendingUp, Share2, Heart, Eye, Trophy,
  Settings, CreditCard, Star, Flame, Gift, Lock, Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatNumber } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Story, User as UserType, UserAchievement, SubscriptionPlan } from "@shared/schema";

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock current user data - in real app, this would come from auth context
  const currentUser: UserType = {
    id: 1,
    username: "sarah_stories",
    email: "sarah@example.com",
    password: "",
    firstName: "Sarah",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=150",
    isAdmin: false,
    subscriptionTier: "premium",
    subscriptionExpiresAt: new Date("2024-12-31"),
    storiesRead: 156,
    storiesShared: 23,
    currentStreak: 12,
    longestStreak: 28,
    lastActiveAt: new Date(),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date(),
  };

  const { data: readingHistory } = useQuery<Story[]>({ queryKey: ["/api/user/reading-history"] });
  const { data: achievements } = useQuery<UserAchievement[]>({ queryKey: ["/api/user/achievements"] });
  const { data: subscriptionPlans } = useQuery<SubscriptionPlan[]>({ queryKey: ["/api/subscription-plans"] });

  const upgradeToProMutation = useMutation({
    mutationFn: () => fetch("/api/user/upgrade-subscription", { method: "POST" }),
  });

  const mockAchievements = [
    { id: "story_voyeur", title: "Story Voyeur", description: "Read your first story", unlocked: true, icon: "👁️" },
    { id: "getting_hooked", title: "Getting Hooked", description: "3-day reading streak", unlocked: true, icon: "🔥" },
    { id: "drama_addict", title: "Drama Addict", description: "7-day reading streak", unlocked: true, icon: "📅" },
    { id: "social_spreader", title: "Social Spreader", description: "Share 10 stories", unlocked: true, icon: "🎯" },
    { id: "streak_master", title: "Streak Master", description: "15-day reading streak", unlocked: false, progress: 12, target: 15, icon: "⚡" },
    { id: "viral_creator", title: "Viral Creator", description: "Get 100K total views on shared stories", unlocked: false, progress: 67000, target: 100000, icon: "🚀" },
  ];

  const getSubscriptionBadge = (tier: string) => {
    switch (tier) {
      case "pro":
        return <Badge className="bg-purple-500"><Crown className="h-3 w-3 mr-1" />PRO</Badge>;
      case "premium":
        return <Badge className="bg-yellow-500 text-black"><Star className="h-3 w-3 mr-1" />PREMIUM</Badge>;
      default:
        return <Badge variant="outline">FREE</Badge>;
    }
  };

  const getRemainingStories = () => {
    if (currentUser.subscriptionTier === "free") {
      return 3 - (currentUser.storiesRead % 3); // Stories left today
    }
    return "Unlimited";
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
      <Header />
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentUser.profileImageUrl || ""} />
              <AvatarFallback className="bg-gradient-to-r from-[#0969da] to-[#6f42c1] text-white text-xl">
                {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-[#f0f6fc]">{currentUser.firstName} {currentUser.lastName}</h1>
                {getSubscriptionBadge(currentUser.subscriptionTier)}
              </div>
              <p className="text-[#7d8590]">@{currentUser.username}</p>
              <p className="text-[#7d8590] text-sm">Member since {currentUser.createdAt?.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="border-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            {currentUser.subscriptionTier !== "pro" && (
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => upgradeToProMutation.mutate()}
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Stories Read</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(currentUser.storiesRead)}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Streak</p>
                  <p className="text-2xl font-bold text-orange-500">{currentUser.currentStreak} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Stories Shared</p>
                  <p className="text-2xl font-bold text-green-500">{formatNumber(currentUser.storiesShared)}</p>
                </div>
                <Share2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Remaining Today</p>
                  <p className="text-2xl font-bold text-purple-500">{getRemainingStories()}</p>
                </div>
                <Gift className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-[var(--card-bg)] border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="history">Reading History</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Streak Progress */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Flame className="h-5 w-5 mr-2 text-orange-500" />
                    Reading Streak
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-500 mb-2">{currentUser.currentStreak}</div>
                      <p className="text-gray-400">Days in a row</p>
                    </div>
                    <Progress value={(currentUser.currentStreak / currentUser.longestStreak) * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Current: {currentUser.currentStreak}</span>
                      <span>Best: {currentUser.longestStreak}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Continue Reading
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share a Story
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy className="h-4 w-4 mr-2" />
                    View Achievements
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockAchievements.map((achievement) => (
                <Card key={achievement.id} className={`bg-[var(--card-bg)] border-gray-700 ${achievement.unlocked ? 'ring-2 ring-yellow-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-500">{achievement.description}</p>
                        {!achievement.unlocked && achievement.progress !== undefined && (
                          <div className="mt-2">
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="h-1"
                            />
                            <div className="text-xs text-gray-500 mt-1">
                              {achievement.progress}/{achievement.target}
                            </div>
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Reading History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No reading history available</p>
                  <p className="text-sm">Start reading stories to see your history here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Crown className="h-5 w-5 mr-2 text-yellow-500" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Plan</span>
                    {getSubscriptionBadge(currentUser.subscriptionTier)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Expires</span>
                    <span className="text-white">
                      {currentUser.subscriptionExpiresAt?.toLocaleDateString() || "Never"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Stories Remaining</span>
                    <span className="text-green-400 font-semibold">{getRemainingStories()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">$0</div>
                      <div className="text-gray-400">per month</div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• 3 stories per day</li>
                      <li>• Basic features</li>
                      <li>• Community access</li>
                    </ul>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      disabled={currentUser.subscriptionTier === "free"}
                    >
                      Current Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700 ring-2 ring-purple-500">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Premium
                    <Badge className="bg-purple-500">Popular</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">$9.99</div>
                      <div className="text-gray-400">per month</div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Unlimited stories</li>
                      <li>• Premium features</li>
                      <li>• Priority support</li>
                      <li>• Exclusive content</li>
                    </ul>
                    <Button 
                      className="w-full"
                      disabled={currentUser.subscriptionTier === "premium"}
                    >
                      {currentUser.subscriptionTier === "premium" ? "Current Plan" : "Upgrade"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">$19.99</div>
                      <div className="text-gray-400">per month</div>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Everything in Premium</li>
                      <li>• Early access</li>
                      <li>• Custom features</li>
                      <li>• Analytics dashboard</li>
                    </ul>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={currentUser.subscriptionTier === "pro"}
                    >
                      {currentUser.subscriptionTier === "pro" ? "Current Plan" : "Upgrade"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
}