<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  User, Crown, Calendar, TrendingUp, Share2, Heart, Eye, Trophy, Settings, 
  CreditCard, Star, Flame, Gift, Lock, Unlock, Battery, Zap, Clock, 
  Target, Award, BarChart3, Activity, Sparkles, MessageSquare, 
  RefreshCw, DollarSign, MapPin, PieChart, LineChart, Globe,
  ArrowUp, ArrowDown, ChevronRight, Bell, Bookmark, PlayCircle
=======
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  User, Crown, Calendar, TrendingUp, Share2, Heart, Eye, Trophy,
  Settings, CreditCard, Star, Flame, Gift, Lock, Unlock
>>>>>>> origin/main
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
<<<<<<< HEAD
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { formatNumber } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { 
  User as UserType, 
  UserAchievement, 
  SubscriptionPlan, 
  ReadingSession,
  JuiceTransaction,
  UserShare
} from "@shared/schema";

interface UserAnalytics {
  totalStoriesRead: number;
  totalStoriesShared: number;
  currentStreak: number;
  longestStreak: number;
  totalJuiceConsumed: number;
  currentJuiceLevel: number;
  maxJuiceLevel: number;
  unlockedAchievements: number;
  totalAchievements: number;
  readingSessionsThisMonth: number;
  averageReadingTime: number;
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  lastActiveAt: string;
  memberSince: string;
  sharesByPlatform: Record<string, number>;
}

export default function UserDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const [currentUserId] = useState(1); // TODO: Get from auth context
  const { toast } = useToast();

  // Fetch user data
  const { data: userProfile, isLoading: profileLoading } = useQuery<UserType>({ 
    queryKey: [`/api/user/profile/${currentUserId}`] 
  });
  
  const { data: userAnalytics, isLoading: analyticsLoading } = useQuery<UserAnalytics>({ 
    queryKey: [`/api/user/analytics/${currentUserId}`] 
  });
  
  const { data: readingHistory, isLoading: historyLoading } = useQuery<ReadingSession[]>({ 
    queryKey: [`/api/user/reading-history/${currentUserId}`] 
  });
  
  const { data: achievements, isLoading: achievementsLoading } = useQuery<UserAchievement[]>({ 
    queryKey: [`/api/user/achievements/${currentUserId}`] 
  });
  
  const { data: subscriptionInfo, isLoading: subscriptionLoading } = useQuery({ 
    queryKey: [`/api/user/subscription/${currentUserId}`] 
  });
  
  const { data: juiceTransactions } = useQuery<JuiceTransaction[]>({ 
    queryKey: [`/api/user/juice-transactions/${currentUserId}`] 
  });
  
  const { data: userShares } = useQuery<UserShare[]>({ 
    queryKey: [`/api/user/shares/${currentUserId}`] 
  });

  const { data: subscriptionPlans } = useQuery<SubscriptionPlan[]>({ 
    queryKey: ["/api/subscription-plans"] 
  });

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: (updates: Partial<UserType>) => 
      apiRequest(`/api/user/profile/${currentUserId}`, "PATCH", updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/profile/${currentUserId}`] });
      toast({ title: "Profile updated successfully!" });
      setEditingProfile(false);
    },
    onError: () => toast({ title: "Failed to update profile", variant: "destructive" })
  });

  const recordActivityMutation = useMutation({
    mutationFn: (activity: { type: string; storyId?: number; metadata?: any }) =>
      apiRequest("/api/user/activity", "POST", { userId: currentUserId, ...activity }),
  });

  if (profileLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark-bg)] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userProfile || !userAnalytics) {
    return (
      <div className="min-h-screen bg-[var(--dark-bg)] text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Failed to load user data</p>
        </div>
      </div>
    );
  }

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case "active":
        if (subscriptionInfo?.plan?.name?.toLowerCase().includes("pro")) {
          return <Badge className="bg-purple-500"><Crown className="h-3 w-3 mr-1" />PRO</Badge>;
        } else if (subscriptionInfo?.plan?.name?.toLowerCase().includes("premium")) {
          return <Badge className="bg-yellow-500 text-black"><Star className="h-3 w-3 mr-1" />PREMIUM</Badge>;
        }
        return <Badge className="bg-green-500">ACTIVE</Badge>;
      case "expired":
        return <Badge variant="destructive">EXPIRED</Badge>;
      case "cancelled":
        return <Badge variant="outline">CANCELLED</Badge>;
=======
import { formatNumber } from "@/lib/utils";
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
>>>>>>> origin/main
      default:
        return <Badge variant="outline">FREE</Badge>;
    }
  };

<<<<<<< HEAD
  const getJuicePercentage = () => {
    return (userAnalytics.currentJuiceLevel / userAnalytics.maxJuiceLevel) * 100;
  };

  const getRemainingStories = () => {
    if (userAnalytics.subscriptionStatus === "active") {
      return "Unlimited";
    }
    
    const dailyLimit = subscriptionInfo?.plan?.maxStoriesPerDay || 3;
    const todayReads = readingHistory?.filter(session => {
      const sessionDate = new Date(session.startedAt);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    }).length || 0;
    
    return Math.max(0, dailyLimit - todayReads);
  };

  const getStreakProgress = () => {
    const daysInWeek = 7;
    return (userAnalytics.currentStreak % daysInWeek) / daysInWeek * 100;
=======
  const getRemainingStories = () => {
    if (currentUser.subscriptionTier === "free") {
      return 3 - (currentUser.storiesRead % 3); // Stories left today
    }
    return "Unlimited";
>>>>>>> origin/main
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white p-6">
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 border-4 border-purple-500">
              <AvatarImage src={userProfile.profileImageUrl || ""} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                {userProfile.firstName?.[0] || "U"}{userProfile.lastName?.[0] || ""}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h1 className="text-3xl font-bold text-white">
                  {userProfile.firstName} {userProfile.lastName}
                </h1>
                {getSubscriptionBadge(userAnalytics.subscriptionStatus)}
              </div>
              <p className="text-gray-400 text-lg">@{userProfile.username}</p>
              <p className="text-gray-500 text-sm">
                Member since {new Date(userAnalytics.memberSince).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--card-bg)] border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue={userProfile.firstName || ""}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={userProfile.lastName || ""}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={userProfile.email || ""}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <Button 
                    onClick={() => updateProfileMutation.mutate({})}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            {userAnalytics.subscriptionStatus !== "active" && (
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
=======
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentUser.profileImageUrl || ""} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xl">
                {currentUser.firstName?.[0]}{currentUser.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-white">{currentUser.firstName} {currentUser.lastName}</h1>
                {getSubscriptionBadge(currentUser.subscriptionTier)}
              </div>
              <p className="text-gray-400">@{currentUser.username}</p>
              <p className="text-gray-400 text-sm">Member since {currentUser.createdAt?.toLocaleDateString()}</p>
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
>>>>>>> origin/main
              </Button>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Juice Level */}
          <Card className="bg-[var(--card-bg)] border-gray-700 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Battery className="h-5 w-5 text-green-400" />
                  <span className="text-sm font-medium text-gray-400">Juice Level</span>
                </div>
                <Badge className="bg-green-500/20 text-green-400">
                  {userAnalytics.currentJuiceLevel.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={getJuicePercentage()} className="h-3 mb-2" />
              <p className="text-xs text-gray-500">
                {userAnalytics.currentJuiceLevel.toFixed(1)} / {userAnalytics.maxJuiceLevel} units
              </p>
            </CardContent>
          </Card>

          {/* Reading Streak */}
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <p className="text-3xl font-bold text-white">{userAnalytics.currentStreak}</p>
              <p className="text-gray-400 text-sm">Day Streak</p>
              <p className="text-xs text-gray-500 mt-1">
                Best: {userAnalytics.longestStreak} days
              </p>
            </CardContent>
          </Card>

          {/* Stories Read */}
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white">{formatNumber(userAnalytics.totalStoriesRead)}</p>
              <p className="text-gray-400 text-sm">Stories Read</p>
              <p className="text-xs text-gray-500 mt-1">
                {userAnalytics.readingSessionsThisMonth} this month
              </p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold text-white">{userAnalytics.unlockedAchievements}</p>
              <p className="text-gray-400 text-sm">Achievements</p>
              <p className="text-xs text-gray-500 mt-1">
                {userAnalytics.totalAchievements - userAnalytics.unlockedAchievements} remaining
              </p>
=======
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <p className="text-2xl font-bold text-white">{currentUser.currentStreak}</p>
              <p className="text-gray-400 text-sm">Day Streak</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-2xl font-bold text-white">{currentUser.storiesRead}</p>
              <p className="text-gray-400 text-sm">Stories Read</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Share2 className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-white">{currentUser.storiesShared}</p>
              <p className="text-gray-400 text-sm">Stories Shared</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <p className="text-2xl font-bold text-white">{mockAchievements.filter(a => a.unlocked).length}</p>
              <p className="text-gray-400 text-sm">Achievements</p>
>>>>>>> origin/main
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-[var(--card-bg)] border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reading-history">Reading History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
<<<<<<< HEAD
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
=======
>>>>>>> origin/main
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
<<<<<<< HEAD
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Progress */}
              <Card className="bg-[var(--card-bg)] border-gray-700 lg:col-span-2">
=======
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Progress */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
>>>>>>> origin/main
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Today's Progress
                  </CardTitle>
                </CardHeader>
<<<<<<< HEAD
                <CardContent className="space-y-6">
                  {/* Daily Stories Limit */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Stories Remaining</span>
                      <span className="text-white font-bold">{getRemainingStories()}</span>
                    </div>
                    {userAnalytics.subscriptionStatus !== "active" && (
                      <Progress 
                        value={getRemainingStories() === 0 ? 100 : 
                          (3 - Number(getRemainingStories())) / 3 * 100} 
                        className="h-2"
                      />
                    )}
                  </div>

                  {/* Juice Consumption Today */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Juice Consumed Today</span>
                      <span className="text-white font-bold">
                        {juiceTransactions?.filter(t => 
                          new Date(t.createdAt).toDateString() === new Date().toDateString()
                        ).reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0).toFixed(1)} units
                      </span>
                    </div>
                  </div>

                  {/* Reading Time */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Average Reading Time</span>
                      <span className="text-white font-bold">
                        {userAnalytics.averageReadingTime.toFixed(1)} min
                      </span>
                    </div>
                  </div>

                  {/* Streak Visualization */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Weekly Streak Progress</span>
                      <span className="text-white font-bold">{userAnalytics.currentStreak % 7}/7</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`flex-1 h-3 rounded ${
                            i < (userAnalytics.currentStreak % 7) ? 'bg-orange-500' : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Daily Limit Warning */}
                  {userAnalytics.subscriptionStatus !== "active" && getRemainingStories() === 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Lock className="h-4 w-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">Daily Limit Reached</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-3">
                        You've reached your daily limit. Share stories to unlock more or upgrade your plan!
                      </p>
                      <div className="flex space-x-2">
=======
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Stories Remaining</span>
                        <span className="text-white font-medium">{getRemainingStories()}</span>
                      </div>
                      {currentUser.subscriptionTier === "free" && (
                        <Progress value={((3 - getRemainingStories()) / 3) * 100} className="h-2" />
                      )}
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Reading Streak</span>
                        <span className="text-white font-medium">{currentUser.currentStreak} days</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(7)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-6 h-6 rounded ${
                              i < currentUser.currentStreak % 7 ? 'bg-orange-500' : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {currentUser.subscriptionTier === "free" && getRemainingStories() === 0 && (
                      <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Lock className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">Daily Limit Reached</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">
                          You've read your daily limit of 3 stories. Share 2 stories to unlock 3 more!
                        </p>
>>>>>>> origin/main
                        <Button size="sm" className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]">
                          <Share2 className="h-3 w-3 mr-1" />
                          Share to Unlock
                        </Button>
<<<<<<< HEAD
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Crown className="h-3 w-3 mr-1" />
                          Upgrade Plan
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Continue Reading
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600">
                    <Bookmark className="h-4 w-4 mr-2" />
                    View Bookmarks
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button variant="outline" className="w-full border-gray-600">
                    <Gift className="h-4 w-4 mr-2" />
                    Claim Rewards
                  </Button>
=======
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Achievements */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAchievements.filter(a => a.unlocked).slice(-3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-900/20 border border-green-600 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <p className="text-white font-medium">{achievement.title}</p>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
>>>>>>> origin/main
                </CardContent>
              </Card>
            </div>

<<<<<<< HEAD
            {/* Recent Activity */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {readingHistory?.slice(0, 5).map((session, index) => (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <div>
                          <p className="text-white font-medium">
                            Read: {(session as any).story?.title || "Unknown Story"}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(session.startedAt).toLocaleDateString()} • 
                            {session.messagesRead} messages • 
                            {session.juiceConsumed} juice
                          </p>
                        </div>
                      </div>
                      {session.completed && (
                        <Badge className="bg-green-500/20 text-green-400">Completed</Badge>
                      )}
                    </div>
                  ))}
=======
            {/* Subscription Status */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Subscription Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getSubscriptionBadge(currentUser.subscriptionTier)}
                    <div>
                      <p className="text-white font-medium">
                        {currentUser.subscriptionTier === "free" ? "Free Plan" :
                         currentUser.subscriptionTier === "premium" ? "Premium Plan" : "Pro Plan"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {currentUser.subscriptionTier === "free" 
                          ? "3 stories per day • Basic features"
                          : `Unlimited stories • Expires ${currentUser.subscriptionExpiresAt?.toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                  {currentUser.subscriptionTier !== "pro" && (
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                      Upgrade Plan
                    </Button>
                  )}
>>>>>>> origin/main
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reading History Tab */}
          <TabsContent value="reading-history" className="space-y-6">
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
<<<<<<< HEAD
                <CardTitle className="text-white flex items-center justify-between">
                  <span className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Reading History
                  </span>
                  <Badge className="bg-blue-500/20 text-blue-400">
                    {readingHistory?.length || 0} Sessions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historyLoading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-gray-400">Loading reading history...</p>
                    </div>
                  ) : readingHistory?.length === 0 ? (
                    <div className="text-center py-8">
                      <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No reading history yet</p>
                      <p className="text-gray-500 text-sm">Start reading stories to see them here!</p>
                    </div>
                  ) : (
                    readingHistory?.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {(session as any).story?.title || "Unknown Story"}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span>{new Date(session.startedAt).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{session.messagesRead} messages</span>
                              <span>•</span>
                              <span>{parseFloat(session.juiceConsumed.toString()).toFixed(1)} juice</span>
                              {session.endedAt && (
                                <>
                                  <span>•</span>
                                  <span>
                                    {Math.round((new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000 / 60)} min
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {session.completed && (
                            <Badge className="bg-green-500/20 text-green-400">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                          {session.sharedForContinuation && (
                            <Badge className="bg-blue-500/20 text-blue-400">
                              <Share2 className="h-3 w-3 mr-1" />
                              Shared
                            </Badge>
                          )}
                          <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievementsLoading ? (
                <div className="col-span-2 text-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-400">Loading achievements...</p>
                </div>
              ) : achievements?.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No achievements yet</p>
                  <p className="text-gray-500 text-sm">Keep reading to unlock achievements!</p>
                </div>
              ) : (
                achievements?.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`border-gray-700 ${
                      achievement.unlockedAt 
                        ? 'bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-600' 
                        : 'bg-[var(--card-bg)]'
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`text-4xl ${achievement.unlockedAt ? '' : 'grayscale opacity-50'}`}>
                          {achievement.iconUrl ? (
                            <img src={achievement.iconUrl} alt={achievement.name} className="w-12 h-12" />
                          ) : (
                            <Award className="w-12 h-12 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-lg ${achievement.unlockedAt ? 'text-white' : 'text-gray-400'}`}>
                            {achievement.name}
                          </p>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                          
                          {achievement.unlockedAt ? (
                            <div className="mt-2">
                              <Badge className="bg-green-500 text-white">
                                <Trophy className="h-3 w-3 mr-1" />
                                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </Badge>
                            </div>
                          ) : achievement.progress && achievement.target && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Progress</span>
                                <span>{formatNumber(achievement.progress)} / {formatNumber(achievement.target)}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.target) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                        </div>
                        {achievement.unlockedAt && (
                          <div className="text-green-400">
                            <Sparkles className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Usage Statistics */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Usage Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{formatNumber(userAnalytics.totalStoriesRead)}</p>
                      <p className="text-gray-400 text-sm">Total Stories</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{formatNumber(userAnalytics.totalStoriesShared)}</p>
                      <p className="text-gray-400 text-sm">Total Shares</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{userAnalytics.totalJuiceConsumed.toFixed(1)}</p>
                      <p className="text-gray-400 text-sm">Juice Consumed</p>
                    </div>
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-2xl font-bold text-white">{userAnalytics.averageReadingTime.toFixed(1)}</p>
                      <p className="text-gray-400 text-sm">Avg. Time (min)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Share Distribution */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Share Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(userAnalytics.sharesByPlatform).map(([platform, count]) => (
                      <div key={platform} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-white capitalize">{platform}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400">{count}</span>
                          <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full"
                              style={{ 
                                width: `${(count / userAnalytics.totalStoriesShared) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Juice Transactions */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Recent Juice Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {juiceTransactions?.slice(0, 10).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          parseFloat(transaction.amount.toString()) > 0 ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium capitalize">{transaction.type.replace('_', ' ')}</p>
                          <p className="text-gray-400 text-sm">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${
                          parseFloat(transaction.amount.toString()) > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {parseFloat(transaction.amount.toString()) > 0 ? '+' : ''}
                          {parseFloat(transaction.amount.toString()).toFixed(1)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Balance: {parseFloat(transaction.balanceAfter.toString()).toFixed(1)}
                        </p>
=======
                <CardTitle className="text-white">Reading History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock reading history */}
                  {[
                    { title: "The Affair Exposed", category: "Heartbreak", readAt: "2 hours ago", liked: true },
                    { title: "Secret Crush Revealed", category: "Romance", readAt: "1 day ago", liked: false },
                    { title: "Best Friend Betrayal", category: "Friendship", readAt: "2 days ago", liked: true },
                    { title: "College Drama Unfolds", category: "Drama", readAt: "3 days ago", liked: false },
                  ].map((story, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg"></div>
                        <div>
                          <p className="text-white font-medium">{story.title}</p>
                          <div className="flex items-center space-x-3 text-sm text-gray-400">
                            <span>{story.category}</span>
                            <span>•</span>
                            <span>{story.readAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className={`h-4 w-4 ${story.liked ? 'text-red-400 fill-current' : 'text-gray-400'}`} />
                        <Button size="sm" variant="ghost" className="text-blue-400">
                          Read Again
                        </Button>
>>>>>>> origin/main
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

<<<<<<< HEAD
          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            {/* Current Subscription */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Current Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getSubscriptionBadge(userAnalytics.subscriptionStatus)}
                    <div>
                      <p className="text-white font-medium text-lg">
                        {subscriptionInfo?.plan?.name || "Free Plan"}
                      </p>
                      <p className="text-gray-400">
                        {subscriptionInfo?.isActive && subscriptionInfo?.expiresAt 
                          ? `Expires ${new Date(subscriptionInfo.expiresAt).toLocaleDateString()}`
                          : userAnalytics.subscriptionStatus === "active" 
                            ? "Active subscription"
                            : "Basic features included"
                        }
                      </p>
                    </div>
                  </div>
                  {userAnalytics.subscriptionStatus !== "active" && (
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Available Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionPlans?.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`border-gray-700 ${
                    subscriptionInfo?.plan?.id === plan.id 
                      ? 'border-purple-500 bg-purple-900/10' 
                      : 'bg-[var(--card-bg)]'
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      {plan.name.toLowerCase().includes("pro") && <Crown className="h-4 w-4 mr-2" />}
                      {plan.name.toLowerCase().includes("premium") && <Star className="h-4 w-4 mr-2" />}
                      {plan.name}
                    </CardTitle>
                    <div className="text-3xl font-bold text-white">
                      ${(plan.price / 100).toFixed(2)}
                      <span className="text-sm text-gray-400">/{plan.interval}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-300 mb-4">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-green-400 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {subscriptionInfo?.plan?.id === plan.id ? (
                      <Badge className="w-full bg-purple-500 text-center">Current Plan</Badge>
                    ) : (
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        {userAnalytics.subscriptionStatus === "none" ? "Subscribe" : "Switch Plan"}
                      </Button>
                    )}
=======
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAchievements.map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`border-gray-700 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-600' 
                      : 'bg-[var(--card-bg)]'
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.title}
                        </p>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                        
                        {!achievement.unlocked && achievement.progress && achievement.target && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress</span>
                              <span>{formatNumber(achievement.progress)} / {formatNumber(achievement.target)}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.target) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <div className="text-green-400">
                          <Trophy className="h-5 w-5" />
                        </div>
                      )}
                    </div>
>>>>>>> origin/main
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
<<<<<<< HEAD
=======

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <Card className={`border-gray-700 ${currentUser.subscriptionTier === 'free' ? 'border-blue-500 bg-blue-900/10' : 'bg-[var(--card-bg)]'}`}>
                <CardHeader>
                  <CardTitle className="text-white">Free</CardTitle>
                  <div className="text-2xl font-bold text-white">$0<span className="text-sm text-gray-400">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• 3 stories per day</li>
                    <li>• Basic categories</li>
                    <li>• Limited sharing</li>
                    <li>• Community features</li>
                  </ul>
                  {currentUser.subscriptionTier === 'free' ? (
                    <Badge className="w-full mt-4 bg-blue-500">Current Plan</Badge>
                  ) : (
                    <Button variant="outline" className="w-full mt-4">Downgrade</Button>
                  )}
                </CardContent>
              </Card>

              {/* Premium Plan */}
              <Card className={`border-gray-700 ${currentUser.subscriptionTier === 'premium' ? 'border-yellow-500 bg-yellow-900/10' : 'bg-[var(--card-bg)]'}`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Premium
                  </CardTitle>
                  <div className="text-2xl font-bold text-white">$9.99<span className="text-sm text-gray-400">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Unlimited stories</li>
                    <li>• All categories</li>
                    <li>• Priority support</li>
                    <li>• No advertisements</li>
                    <li>• Exclusive content</li>
                  </ul>
                  {currentUser.subscriptionTier === 'premium' ? (
                    <Badge className="w-full mt-4 bg-yellow-500 text-black">Current Plan</Badge>
                  ) : (
                    <Button className="w-full mt-4 bg-yellow-500 text-black hover:bg-yellow-600">
                      {currentUser.subscriptionTier === 'free' ? 'Upgrade' : 'Switch Plan'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className={`border-gray-700 ${currentUser.subscriptionTier === 'pro' ? 'border-purple-500 bg-purple-900/10' : 'bg-[var(--card-bg)]'}`}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crown className="h-4 w-4 mr-2" />
                    Pro
                  </CardTitle>
                  <div className="text-2xl font-bold text-white">$19.99<span className="text-sm text-gray-400">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>• Everything in Premium</li>
                    <li>• Early access to stories</li>
                    <li>• VIP challenges</li>
                    <li>• Custom avatars</li>
                    <li>• Analytics dashboard</li>
                    <li>• Creator tools</li>
                  </ul>
                  {currentUser.subscriptionTier === 'pro' ? (
                    <Badge className="w-full mt-4 bg-purple-500">Current Plan</Badge>
                  ) : (
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600">
                      Upgrade to Pro
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
>>>>>>> origin/main
        </Tabs>
      </div>
    </div>
  );
}