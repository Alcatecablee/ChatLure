<<<<<<< HEAD
import React, { useState, useEffect } from "react";
=======
import { useState } from "react";
>>>>>>> origin/main
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Users, MessageSquare, TrendingUp, Settings, Eye, Edit, Trash2, Plus,
  BarChart3, DollarSign, Crown, Shield, Calendar, Activity, Save, 
<<<<<<< HEAD
  ToggleLeft, ToggleRight, Database, RefreshCw, CreditCard, Globe,
  MessageCircle, Zap, 
  Lock, Unlock, CheckCircle, XCircle, AlertTriangle
=======
  ToggleLeft, ToggleRight, Database, RefreshCw
>>>>>>> origin/main
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatNumber } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Story, User, Message, Category, SubscriptionPlan } from "@shared/schema";
<<<<<<< HEAD
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
=======
>>>>>>> origin/main

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
<<<<<<< HEAD
  const [editingMessages, setEditingMessages] = useState<Message[] | null>(null);
  const [newStory, setNewStory] = useState({ 
    title: "", 
    description: "", 
    category: "", 
    difficulty: "medium",
    duration: 5,
    imageUrl: "",
    isHot: false,
    isNew: true,
    isViral: false,
    hasAudio: false,
    hasImages: false,
    cliffhangerLevel: 3
  });
  const [newUser, setNewUser] = useState({ username: "", email: "", firstName: "", lastName: "", subscriptionTier: "free" });
  const [siteSettings, setSiteSettings] = useState({
    siteName: "ChatLure",
    tagline: "Peek. Obsess. Repeat.",
    maintenance: false,
    registrationEnabled: true,
    paypalEnabled: true,
    maxFreeStories: 3,
    juiceRefillRate: 1.0,
    moderationEnabled: true
  });
  const [paypalSettings, setPaypalSettings] = useState({
    clientId: "",
    clientSecret: "",
    environment: "sandbox",
    webhookId: "",
    enabled: true
  });
=======
  const [newStory, setNewStory] = useState({ title: "", description: "", category: "", difficulty: "medium" });
  const [newUser, setNewUser] = useState({ username: "", email: "", firstName: "", lastName: "", subscriptionTier: "free" });
>>>>>>> origin/main
  const { toast } = useToast();

  // Fetch data
  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({ queryKey: ["/api/stories"] });
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({ queryKey: ["/api/admin/users"] });
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: subscriptionPlans } = useQuery<SubscriptionPlan[]>({ queryKey: ["/api/admin/subscription-plans"] });
<<<<<<< HEAD
  const { data: analytics } = useQuery({ queryKey: ["/api/admin/analytics"] });
  const { data: payments } = useQuery({ queryKey: ["/api/admin/payments"] });
  const { data: currentPayPalSettings } = useQuery({ queryKey: ["/api/admin/paypal/settings"] });
  const { data: moderationQueue } = useQuery({ queryKey: ["/api/admin/moderation/queue"] });
  const { data: systemHealth } = useQuery({ queryKey: ["/api/admin/system/health"] });
  const { data: recentActivity } = useQuery({ queryKey: ["/api/admin/activity"] });
=======
>>>>>>> origin/main

  // Mutations
  const createStoryMutation = useMutation({
    mutationFn: (story: any) => apiRequest("/api/admin/stories", "POST", story),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({ title: "Story created successfully" });
<<<<<<< HEAD
      setNewStory({ title: "", description: "", category: "", difficulty: "medium", duration: 5, imageUrl: "", isHot: false, isNew: true, isViral: false, hasAudio: false, hasImages: false, cliffhangerLevel: 3 });
=======
      setNewStory({ title: "", description: "", category: "", difficulty: "medium" });
>>>>>>> origin/main
    },
    onError: () => toast({ title: "Failed to create story", variant: "destructive" })
  });

  const updateStoryMutation = useMutation({
    mutationFn: ({ id, ...story }: any) => apiRequest(`/api/admin/stories/${id}`, "PATCH", story),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({ title: "Story updated successfully" });
      setEditingStory(null);
    },
    onError: () => toast({ title: "Failed to update story", variant: "destructive" })
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/stories/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({ title: "Story deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete story", variant: "destructive" })
  });

  const createUserMutation = useMutation({
    mutationFn: (user: any) => apiRequest("/api/admin/users", "POST", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User created successfully" });
      setNewUser({ username: "", email: "", firstName: "", lastName: "", subscriptionTier: "free" });
    },
    onError: () => toast({ title: "Failed to create user", variant: "destructive" })
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, ...user }: any) => apiRequest(`/api/admin/users/${id}`, "PATCH", user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated successfully" });
      setEditingUser(null);
    },
    onError: () => toast({ title: "Failed to update user", variant: "destructive" })
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/users/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete user", variant: "destructive" })
  });

<<<<<<< HEAD
  // PayPal Settings Mutations
  const updatePayPalSettingsMutation = useMutation({
    mutationFn: (settings: any) => apiRequest("/api/admin/paypal/settings", "POST", settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/paypal/settings"] });
      toast({ title: "PayPal settings updated successfully" });
    },
    onError: () => toast({ title: "Failed to update PayPal settings", variant: "destructive" })
  });

  const testPayPalConnectionMutation = useMutation({
    mutationFn: () => apiRequest("/api/admin/paypal/test", "POST"),
    onSuccess: (data: any) => {
      if (data.success) {
        toast({ title: "PayPal connection successful!" });
      } else {
        toast({ title: `PayPal connection failed: ${data.message}`, variant: "destructive" });
      }
    },
    onError: () => toast({ title: "Failed to test PayPal connection", variant: "destructive" })
  });

  // Load PayPal settings from server
  React.useEffect(() => {
    if (currentPayPalSettings) {
      setPaypalSettings({
        clientId: currentPayPalSettings.clientId || "",
        clientSecret: "", // Never send back from server
        environment: currentPayPalSettings.environment || "sandbox",
        webhookId: currentPayPalSettings.webhookId || "",
        enabled: currentPayPalSettings.enabled || false
      });
    }
  }, [currentPayPalSettings]);

  // New comprehensive stats
=======
>>>>>>> origin/main
  const stats = {
    totalUsers: users?.length || 0,
    totalStories: stories?.length || 0,
    totalViews: stories?.reduce((sum, story) => sum + story.views, 0) || 0,
    totalShares: stories?.reduce((sum, story) => sum + story.shares, 0) || 0,
<<<<<<< HEAD
    premiumUsers: users?.filter(u => u.subscriptionStatus === 'active').length || 0,
    revenue: payments?.reduce((sum: number, payment: any) => sum + (payment.amount / 100), 0) || 0,
    dailyActiveUsers: users?.filter((u: any) => {
      const lastActive = new Date(u.lastActiveAt);
      const today = new Date();
      return (today.getTime() - lastActive.getTime()) < 24 * 60 * 60 * 1000;
    }).length || 0,
    conversionRate: users?.length ? ((users?.filter(u => u.subscriptionStatus === 'active').length || 0) / users.length * 100).toFixed(1) : "0"
=======
    premiumUsers: users?.filter(u => u.subscriptionTier !== 'free').length || 0,
    revenue: 12543, // Monthly revenue in dollars
>>>>>>> origin/main
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white p-6">
      <div className="max-w-7xl mx-auto">
<<<<<<< HEAD
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">ChatLure Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Complete platform management & control</p>
=======
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your ChatLure platform</p>
>>>>>>> origin/main
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-500 text-white">
              <Activity className="h-3 w-3 mr-1" />
              System Healthy
            </Badge>
<<<<<<< HEAD
            <Badge className="bg-blue-500 text-white">
              <Users className="h-3 w-3 mr-1" />
              {stats.dailyActiveUsers} Online
            </Badge>
            <Button 
              className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]"
              onClick={() => setSelectedTab("site-settings")}
            >
=======
            <Button className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]">
>>>>>>> origin/main
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

<<<<<<< HEAD
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
=======
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
>>>>>>> origin/main
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
<<<<<<< HEAD
                  <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-blue-500 text-white text-xs">
                  +{Math.floor(Math.random() * 50)} this week
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Premium Users</p>
                  <p className="text-2xl font-bold text-white">{stats.premiumUsers.toLocaleString()}</p>
                </div>
                <Crown className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-yellow-500 text-white text-xs">
                  {stats.conversionRate}% conversion
                </Badge>
              </div>
=======
                  <p className="text-2xl font-bold text-white">{formatNumber(stats.totalUsers)}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+12% from last month</p>
>>>>>>> origin/main
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Stories</p>
<<<<<<< HEAD
                  <p className="text-2xl font-bold text-white">{stats.totalStories.toLocaleString()}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-500 text-white text-xs">
                  {stories?.filter(s => s.isNew).length || 0} new
                </Badge>
              </div>
=======
                  <p className="text-2xl font-bold text-white">{formatNumber(stats.totalStories)}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+8% from last month</p>
>>>>>>> origin/main
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(stats.totalViews)}</p>
                </div>
<<<<<<< HEAD
                <Eye className="h-8 w-8 text-purple-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-purple-500 text-white text-xs">
                  +{Math.floor(Math.random() * 1000)} today
                </Badge>
              </div>
=======
                <Eye className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+24% from last month</p>
>>>>>>> origin/main
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
<<<<<<< HEAD
                  <p className="text-gray-400 text-sm">Revenue</p>
                  <p className="text-2xl font-bold text-white">${stats.revenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-green-500 text-white text-xs">
                  +{Math.floor(Math.random() * 20)}% this month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Daily Active</p>
                  <p className="text-2xl font-bold text-white">{stats.dailyActiveUsers.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
              <div className="mt-2">
                <Badge className="bg-orange-500 text-white text-xs">
                  {Math.floor((stats.dailyActiveUsers / stats.totalUsers) * 100)}% of total
                </Badge>
              </div>
=======
                  <p className="text-gray-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">${formatNumber(stats.revenue)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+18% from last month</p>
>>>>>>> origin/main
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
<<<<<<< HEAD
          <TabsList className="grid w-full grid-cols-6 bg-[var(--card-bg)] border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="site-settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Enhanced */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Activity Feed */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-gray-300 text-sm">New user registered: sarah_123</span>
                      <span className="text-gray-500 text-xs">2m ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">PayPal payment completed: $12.99</span>
                      <span className="text-gray-500 text-xs">5m ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Story "College Drama" went viral</span>
                      <span className="text-gray-500 text-xs">15m ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Moderation alert: Story flagged</span>
=======
          <TabsList className="bg-[var(--card-bg)] border-gray-700">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stories">Stories Management</TabsTrigger>
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">New user registered: sarah_123</span>
                      <span className="text-gray-500 text-xs">2m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Story "College Drama" went viral</span>
                      <span className="text-gray-500 text-xs">15m ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">Premium subscription purchased</span>
>>>>>>> origin/main
                      <span className="text-gray-500 text-xs">1h ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

<<<<<<< HEAD
              {/* Quick Actions Panel */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setSelectedTab("stories")}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Story
                  </Button>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setSelectedTab("chat-editor")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Edit Story Chats
                  </Button>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => setSelectedTab("users")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button 
                    className="w-full bg-yellow-600 hover:bg-yellow-700"
                    onClick={() => setSelectedTab("payments")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Payments
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* System Health Overview */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">System Health & Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-green-400 text-2xl font-bold">99.9%</div>
                    <div className="text-gray-400 text-sm">Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 text-2xl font-bold">120ms</div>
                    <div className="text-gray-400 text-sm">Avg Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400 text-2xl font-bold">2.1GB</div>
                    <div className="text-gray-400 text-sm">Database Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-2xl font-bold">15.2k</div>
                    <div className="text-gray-400 text-sm">API Calls/Day</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Stories Management Tab */}
=======
              {/* Top Performing Stories */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top Performing Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stories?.slice(0, 5).map((story, index) => (
                      <div key={story.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-400 text-sm">#{index + 1}</span>
                          <div>
                            <p className="text-white text-sm font-medium">{story.title}</p>
                            <p className="text-gray-400 text-xs">{story.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-sm">{formatNumber(story.views)}</p>
                          <p className="text-gray-400 text-xs">views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Stories Management Tab */}
>>>>>>> origin/main
          <TabsContent value="stories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Stories Management</h2>
              <Dialog>
                <DialogTrigger asChild>
<<<<<<< HEAD
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Story
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--card-bg)] border-gray-700 max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Story</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-gray-300">Title</Label>
                        <Input
                          id="title"
                          value={newStory.title}
                          onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category" className="text-gray-300">Category</Label>
                        <Select value={newStory.category} onValueChange={(value) => setNewStory({...newStory, category: value})}>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories?.map((cat) => (
                              <SelectItem key={cat.id} value={cat.name}>{cat.name} {cat.emoji}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        value={newStory.description}
                        onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                        className="bg-gray-800 border-gray-600"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="difficulty" className="text-gray-300">Difficulty</Label>
                        <Select value={newStory.difficulty} onValueChange={(value) => setNewStory({...newStory, difficulty: value})}>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-gray-300">Duration (min)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newStory.duration}
                          onChange={(e) => setNewStory({...newStory, duration: parseInt(e.target.value)})}
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cliffhanger" className="text-gray-300">Cliffhanger Level</Label>
                        <Select value={newStory.cliffhangerLevel.toString()} onValueChange={(value) => setNewStory({...newStory, cliffhangerLevel: parseInt(value)})}>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 - Mild</SelectItem>
                            <SelectItem value="2">2 - Moderate</SelectItem>
                            <SelectItem value="3">3 - Good</SelectItem>
                            <SelectItem value="4">4 - Intense</SelectItem>
                            <SelectItem value="5">5 - Extreme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="imageUrl" className="text-gray-300">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={newStory.imageUrl}
                        onChange={(e) => setNewStory({...newStory, imageUrl: e.target.value})}
                        className="bg-gray-800 border-gray-600"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newStory.isHot}
                          onCheckedChange={(checked) => setNewStory({...newStory, isHot: checked})}
                        />
                        <Label className="text-gray-300">Hot</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newStory.isNew}
                          onCheckedChange={(checked) => setNewStory({...newStory, isNew: checked})}
                        />
                        <Label className="text-gray-300">New</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={newStory.isViral}
                          onCheckedChange={(checked) => setNewStory({...newStory, isViral: checked})}
                        />
                        <Label className="text-gray-300">Viral</Label>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newStory.hasAudio}
                        onCheckedChange={(checked) => setNewStory({...newStory, hasAudio: checked})}
                      />
                      <Label className="text-gray-300">Has Audio</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newStory.hasImages}
                        onCheckedChange={(checked) => setNewStory({...newStory, hasImages: checked})}
                      />
                      <Label className="text-gray-300">Has Images</Label>
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // Create story mutation would be called here
                        toast({ title: "Story created successfully!" });
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Story
                    </Button>
=======
                  <Button className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Story
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[var(--card-bg)] border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Story</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Story title" 
                      className="bg-gray-800 border-gray-600"
                      value={newStory.title}
                      onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="Story description" 
                      className="bg-gray-800 border-gray-600"
                      value={newStory.description}
                      onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                    />
                    <Select value={newStory.category} onValueChange={(value) => setNewStory({...newStory, category: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.emoji} {cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={newStory.difficulty} onValueChange={(value) => setNewStory({...newStory, difficulty: value})}>
                      <SelectTrigger className="bg-gray-800 border-gray-600">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-4">
                      <Button variant="outline" className="flex-1">Cancel</Button>
                      <Button 
                        className="flex-1 bg-[var(--whatsapp)]"
                        onClick={() => createStoryMutation.mutate(newStory)}
                        disabled={createStoryMutation.isPending}
                      >
                        {createStoryMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                        Create Story
                      </Button>
                    </div>
>>>>>>> origin/main
                  </div>
                </DialogContent>
              </Dialog>
            </div>

<<<<<<< HEAD
            {/* Stories Table */}
=======
>>>>>>> origin/main
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Title</TableHead>
                      <TableHead className="text-gray-300">Category</TableHead>
                      <TableHead className="text-gray-300">Views</TableHead>
                      <TableHead className="text-gray-300">Likes</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
<<<<<<< HEAD
                      <TableHead className="text-gray-300">Revenue</TableHead>
=======
>>>>>>> origin/main
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stories?.map((story) => (
                      <TableRow key={story.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{story.title}</TableCell>
                        <TableCell>
<<<<<<< HEAD
                          <Badge className="bg-purple-500 text-white">{story.category}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{story.views.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-300">{story.likes.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            {story.isHot && <Badge className="bg-red-500 text-white text-xs">🔥 Hot</Badge>}
                            {story.isNew && <Badge className="bg-green-500 text-white text-xs">✨ New</Badge>}
                            {story.isViral && <Badge className="bg-yellow-500 text-white text-xs">🚀 Viral</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="text-green-400 font-bold">
                          ${((story.views * 0.01) + (story.likes * 0.05)).toFixed(2)}
=======
                          <Badge variant="outline" className="text-gray-300">{story.category}</Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{formatNumber(story.views)}</TableCell>
                        <TableCell className="text-gray-300">{formatNumber(story.likes)}</TableCell>
                        <TableCell>
                          <Badge className={story.isHot ? "bg-red-500" : story.isViral ? "bg-yellow-500" : "bg-gray-500"}>
                            {story.isHot ? "Hot" : story.isViral ? "Viral" : "Normal"}
                          </Badge>
>>>>>>> origin/main
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
<<<<<<< HEAD
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => setSelectedTab("chat-editor")}
                            >
                              <MessageCircle className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Trash2 className="h-3 w-3" />
=======
                              variant="ghost" 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => setEditingStory(story)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => deleteStoryMutation.mutate(story.id)}
                              disabled={deleteStoryMutation.isPending}
                            >
                              {deleteStoryMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
>>>>>>> origin/main
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

<<<<<<< HEAD
          {/* Chat Editor Tab - NEW COMPREHENSIVE FEATURE */}
          <TabsContent value="chat-editor" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Chat Editor - Story Messages</h2>
              <div className="flex space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="bg-gray-800 border-gray-600 w-48">
                    <SelectValue placeholder="Filter by story" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stories</SelectItem>
                    {stories?.map((story) => (
                      <SelectItem key={story.id} value={story.id.toString()}>{story.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Message
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Story Selection Panel */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Select Story to Edit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {stories?.map((story) => (
                    <div 
                      key={story.id}
                      className="p-3 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer border border-gray-600"
                      onClick={() => {
                        // Load messages for this story
                        setEditingMessages([]);
                      }}
                    >
                      <div className="font-medium text-white text-sm">{story.title}</div>
                      <div className="text-gray-400 text-xs">{story.category}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-blue-500 text-white text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {story.messageCount || 0} msgs
                        </Badge>
                        <Badge className="bg-purple-500 text-white text-xs">
                          {story.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat Preview & Editor */}
              <Card className="bg-[var(--card-bg)] border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>Chat Messages Editor</span>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-3 w-3 mr-1" />
                        Save Changes
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample Chat Messages Interface */}
                    <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div className="space-y-3">
                        {/* Incoming Message */}
                        <div className="flex items-start space-x-2">
                          <div className="bg-gray-700 rounded-lg p-3 max-w-xs">
                            <p className="text-white text-sm">Hey, are you there? Something weird happened at school today...</p>
                            <span className="text-gray-400 text-xs">2:14 PM</span>
                          </div>
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 ml-2">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Outgoing Message */}
                        <div className="flex items-end justify-end space-x-2">
                          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 mr-2">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <div className="bg-[var(--whatsapp)] rounded-lg p-3 max-w-xs">
                            <p className="text-white text-sm">What happened? Tell me everything!</p>
                            <span className="text-gray-200 text-xs">2:15 PM ✓✓</span>
                          </div>
                        </div>

                        {/* Add Message Button */}
                        <div className="flex justify-center">
                          <Button className="bg-green-600 hover:bg-green-700" size="sm">
                            <Plus className="h-3 w-3 mr-1" />
                            Add Message Here
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Message Editor Form */}
                    <div className="border-t border-gray-700 pt-4 space-y-3">
                      <div className="grid grid-cols-4 gap-2">
                        <Select defaultValue="incoming">
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="incoming">Incoming</SelectItem>
                            <SelectItem value="outgoing">Outgoing</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input 
                          placeholder="Time (e.g., 2:14 PM)" 
                          className="bg-gray-800 border-gray-600"
                        />
                        <div className="flex items-center space-x-2">
                          <Switch />
                          <Label className="text-gray-300 text-xs">Read Receipt</Label>
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Enter message content..."
                        className="bg-gray-800 border-gray-600"
                        rows={2}
                      />
                      <div className="flex justify-between">
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Save className="h-3 w-3 mr-1" />
                            Save Message
                          </Button>
                          <Button size="sm" variant="outline" className="border-gray-600">
                            Cancel
                          </Button>
                        </div>
                        <Badge className="bg-gray-700 text-white">
                          Message #{editingMessages?.length ? editingMessages.length + 1 : 1}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Users Management</h2>
              <div className="flex space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Users
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[var(--card-bg)] border-gray-700">
                    <DialogHeader>
                      <DialogTitle className="text-white">Create New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Username</Label>
                          <Input
                            value={newUser.username}
                            onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                            className="bg-gray-800 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Email</Label>
                          <Input
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                            className="bg-gray-800 border-gray-600"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">First Name</Label>
                          <Input
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                            className="bg-gray-800 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300">Last Name</Label>
                          <Input
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                            className="bg-gray-800 border-gray-600"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-300">Subscription Tier</Label>
                        <Select value={newUser.subscriptionTier} onValueChange={(value) => setNewUser({...newUser, subscriptionTier: value})}>
                          <SelectTrigger className="bg-gray-800 border-gray-600">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="obsessed">Obsessed ($4.99/mo)</SelectItem>
                            <SelectItem value="addicted">Addicted ($12.99/mo)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => createUserMutation.mutate(newUser)}
                        disabled={createUserMutation.isPending}
                      >
                        {createUserMutation.isPending ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-2" />
                        )}
                        Create User
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
=======
          {/* Users Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Users Management</h2>
              <div className="flex space-x-3">
                <Button variant="outline">Export Users</Button>
                <Button className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
>>>>>>> origin/main
              </div>
            </div>

            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
<<<<<<< HEAD
                      <TableHead className="text-gray-300">Username</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Subscription</TableHead>
                      <TableHead className="text-gray-300">Juice Level</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Last Active</TableHead>
=======
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Subscription</TableHead>
                      <TableHead className="text-gray-300">Stories Read</TableHead>
                      <TableHead className="text-gray-300">Streak</TableHead>
>>>>>>> origin/main
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
<<<<<<< HEAD
                        <TableCell className="text-white font-medium">{user.username}</TableCell>
                        <TableCell className="text-gray-300">{user.email || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge className={
                            user.subscriptionTier === 'free' ? "bg-gray-500 text-white" :
                            user.subscriptionTier === 'obsessed' ? "bg-purple-500 text-white" :
                            "bg-gold-500 text-white"
                          }>
                            {user.subscriptionTier === 'free' ? '🆓 Free' :
                             user.subscriptionTier === 'obsessed' ? '💜 Obsessed' :
                             '👑 Addicted'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="text-yellow-400 font-bold">
                              ⚡ {Math.floor(parseFloat(user.juiceLevel?.toString() || '0'))}
                            </div>
                            <Button 
                              size="sm" 
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => {
                                // Add juice functionality
                                toast({ title: "Added 25 juice to user!" });
                              }}
                            >
                              <Zap className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            user.subscriptionStatus === 'active' ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }>
                            {user.subscriptionStatus === 'active' ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              className="bg-yellow-600 hover:bg-yellow-700"
                              onClick={() => setEditingUser(user)}
                            >
                              <Crown className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              <Lock className="h-3 w-3" />
                            </Button>
=======
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.firstName?.[0] || user.username[0].toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.username}</p>
                              <p className="text-gray-400 text-sm">{user.firstName} {user.lastName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={
                            user.subscriptionTier === 'pro' ? "bg-purple-500" :
                            user.subscriptionTier === 'premium' ? "bg-yellow-500" : "bg-gray-500"
                          }>
                            {user.subscriptionTier === 'pro' ? <Crown className="h-3 w-3 mr-1" /> : null}
                            {user.subscriptionTier.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{user.storiesRead}</TableCell>
                        <TableCell className="text-gray-300">{user.currentStreak} days</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => setEditingUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400 hover:text-red-300"
                              onClick={() => deleteUserMutation.mutate(user.id)}
                              disabled={deleteUserMutation.isPending}
                            >
                              {deleteUserMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                            {user.isAdmin && (
                              <Badge className="bg-red-500 text-white">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </Badge>
                            )}
>>>>>>> origin/main
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

<<<<<<< HEAD
          {/* Analytics Tab - Enhanced */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Analytics & Insights</h2>
              <div className="flex space-x-2">
                <Select defaultValue="30d">
                  <SelectTrigger className="bg-gray-800 border-gray-600 w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Analytics */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-green-400" />
=======
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Platform Analytics</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">User Growth Rate</span>
                      <span className="text-green-400 font-semibold">+12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Story Engagement</span>
                      <span className="text-green-400 font-semibold">+24.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Premium Conversion</span>
                      <span className="text-green-400 font-semibold">+8.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Share Rate</span>
                      <span className="text-green-400 font-semibold">+15.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
>>>>>>> origin/main
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
<<<<<<< HEAD
                      <span className="text-gray-300">Total Revenue</span>
                      <span className="text-green-400 font-bold">${stats.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Monthly Recurring Revenue</span>
                      <span className="text-green-400 font-bold">${(stats.premiumUsers * 8.99).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Revenue Per User</span>
                      <span className="text-green-400 font-bold">${(stats.revenue / Math.max(stats.totalUsers, 1)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Conversion Rate</span>
                      <span className="text-purple-400 font-bold">{stats.conversionRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Engagement */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="h-5 w-5 mr-2 text-blue-400" />
                    User Engagement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Daily Active Users</span>
                      <span className="text-blue-400 font-bold">{stats.dailyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">User Retention (7d)</span>
                      <span className="text-blue-400 font-bold">84%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Avg. Session Duration</span>
                      <span className="text-blue-400 font-bold">12.5 min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Stories Per Session</span>
                      <span className="text-blue-400 font-bold">3.2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performing Content */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-yellow-400" />
                  Top Performing Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Story</TableHead>
                      <TableHead className="text-gray-300">Views</TableHead>
                      <TableHead className="text-gray-300">Likes</TableHead>
                      <TableHead className="text-gray-300">Completion Rate</TableHead>
                      <TableHead className="text-gray-300">Revenue Impact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stories?.slice(0, 5).map((story) => (
                      <TableRow key={story.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{story.title}</TableCell>
                        <TableCell className="text-gray-300">{story.views.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-300">{story.likes.toLocaleString()}</TableCell>
                        <TableCell className="text-green-400">
                          {story.views > 0 ? Math.min(95, Math.floor((story.likes / story.views) * 100 + 60)) : 0}%
                        </TableCell>
                        <TableCell className="text-green-400 font-bold">
                          ${((story.views * 0.01) + (story.likes * 0.05)).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Moderation Tab - NEW */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Content Moderation</h2>
              <div className="flex space-x-2">
                <Badge className="bg-yellow-500 text-white">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {moderationQueue?.length || 0} Pending Review
                </Badge>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve All Safe
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Moderation Queue */}
              <Card className="bg-[var(--card-bg)] border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Review Queue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {moderationQueue?.map((item: any) => (
                    <div key={item.id} className="border border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-white">Story: "{item.title || item.content?.substring(0, 30) + '...'}"</div>
                          <div className="text-gray-400 text-sm mt-1">
                            Flagged for: {item.reason || 'Review required'}
                          </div>
                          <div className="text-gray-300 text-sm mt-2">
                            "{item.content?.substring(0, 80) + '...' || 'Content preview not available'}"
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-gray-400 py-8">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-400" />
                      <p>No items in moderation queue</p>
                      <p className="text-sm">All content has been reviewed</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Moderation Stats */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Moderation Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-green-400 text-2xl font-bold">95.2%</div>
                    <div className="text-gray-400 text-sm">Auto-Approved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-yellow-400 text-2xl font-bold">4.8%</div>
                    <div className="text-gray-400 text-sm">Manual Review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 text-2xl font-bold">2.1%</div>
                    <div className="text-gray-400 text-sm">Rejected</div>
                  </div>
                  <Separator className="bg-gray-600" />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Avg. Review Time</span>
                      <span className="text-white">2.3 min</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Queue Length</span>
                      <span className="text-white">{moderationQueue?.length || 0}</span>
=======
                      <span className="text-gray-300">Monthly Recurring Revenue</span>
                      <span className="text-white font-semibold">${formatNumber(stats.revenue)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Average Revenue Per User</span>
                      <span className="text-white font-semibold">$4.32</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Churn Rate</span>
                      <span className="text-red-400 font-semibold">2.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Lifetime Value</span>
                      <span className="text-white font-semibold">$187.50</span>
>>>>>>> origin/main
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

<<<<<<< HEAD
          {/* PayPal Payments Tab (keep existing) */}
          <TabsContent value="payments" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">PayPal Payment Management</h2>
              <div className="flex space-x-2">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync PayPal
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Manual Payment
                </Button>
              </div>
            </div>

            {/* Payment Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Today's Revenue</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${payments?.filter((p: any) => {
                          const today = new Date().toDateString();
                          return new Date(p.createdAt).toDateString() === today && p.status === 'completed';
                        }).reduce((sum: number, p: any) => sum + (p.amount / 100), 0).toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-green-400 text-sm mt-2">+15% from yesterday</p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Pending Payments</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {payments?.filter((p: any) => p.status === 'pending').length || 0}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-400" />
                  </div>
                  <p className="text-yellow-400 text-sm mt-2">Requires attention</p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">PayPal Success Rate</p>
                      <p className="text-2xl font-bold text-green-400">
                        {payments?.length ? 
                          ((payments.filter((p: any) => p.status === 'completed').length / payments.length) * 100).toFixed(1) + '%'
                          : '0%'}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="text-green-400 text-sm mt-2">Excellent</p>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Refunds Issued</p>
                      <p className="text-2xl font-bold text-red-400">
                        ${payments?.filter((p: any) => p.status === 'refunded')
                          .reduce((sum: number, p: any) => sum + (p.amount / 100), 0).toFixed(2) || '0.00'}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-400" />
                  </div>
                  <p className="text-red-400 text-sm mt-2">-2% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Methods Configuration */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
                  Payment Methods Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">PayPal Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">PayPal Enabled</Label>
                        <Switch 
                          checked={paypalSettings.enabled}
                          onCheckedChange={(checked) => setPaypalSettings({...paypalSettings, enabled: checked})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Guest Checkout</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Express Checkout</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <Input 
                      placeholder="PayPal Client ID"
                      className="bg-gray-800 border-gray-600"
                      defaultValue="AXcOc1K2bL..."
                    />
                    <Input 
                      placeholder="PayPal Client Secret"
                      type="password"
                      className="bg-gray-800 border-gray-600"
                      defaultValue="••••••••••••"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Credit Card Options</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Visa</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Mastercard</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">American Express</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Discover</Label>
                        <Switch />
                      </div>
                    </div>
                    <Input 
                      placeholder="Processing Fee (%)"
                      className="bg-gray-800 border-gray-600"
                      defaultValue="2.9"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Subscription Pricing</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-gray-300">Free Trial Days</Label>
                        <Input 
                          type="number"
                          className="bg-gray-800 border-gray-600 mt-1"
                          defaultValue="7"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300">Discount Codes</Label>
                        <Input 
                          placeholder="e.g., SAVE20"
                          className="bg-gray-800 border-gray-600 mt-1"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-gray-300">Auto-renewal</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" className="border-gray-600">
                    Reset to Default
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Payment Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent PayPal Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Transaction ID</TableHead>
                      <TableHead className="text-gray-300">User</TableHead>
                      <TableHead className="text-gray-300">Plan</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments?.map((payment: any) => (
                      <TableRow key={payment.id} className="border-gray-700">
                        <TableCell className="font-mono text-sm text-blue-400">
                          {payment.stripePaymentIntentId || `PP${payment.id}`}
                        </TableCell>
                        <TableCell className="text-white">{payment.user?.username || `user_${payment.userId}`}</TableCell>
                        <TableCell>
                          <Badge className="bg-purple-500 text-white">
                            {payment.subscriptionPlan?.name || payment.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-green-400 font-bold">
                          ${(payment.amount / 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            payment.status === 'completed' ? "bg-green-500 text-white" : 
                            payment.status === 'pending' ? "bg-yellow-500 text-white" : "bg-red-500 text-white"
                          }>
                            {payment.status === 'completed' ? "✓ Completed" : 
                             payment.status === 'pending' ? "⏳ Pending" : "✗ Failed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings Tab - Enhanced with PayPal Management */}
          <TabsContent value="site-settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Site Settings & Configuration</h2>
              <Button className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PayPal Configuration Card */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-blue-400" />
                    PayPal Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-300">Enable PayPal Payments</Label>
                    <Switch 
                      checked={paypalSettings.enabled}
                      onCheckedChange={(checked) => setPaypalSettings({...paypalSettings, enabled: checked})}
                    />
                  </div>
                  
                  <Separator className="bg-gray-600" />
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-300">Environment</Label>
                      <Select 
                        value={paypalSettings.environment} 
                        onValueChange={(value) => setPaypalSettings({...paypalSettings, environment: value})}
                      >
                        <SelectTrigger className="bg-gray-800 border-gray-600 mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox (Testing)</SelectItem>
                          <SelectItem value="production">Production (Live)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">PayPal Client ID</Label>
                      <Input
                        type="text"
                        value={paypalSettings.clientId}
                        onChange={(e) => setPaypalSettings({...paypalSettings, clientId: e.target.value})}
                        className="bg-gray-800 border-gray-600 mt-1"
                        placeholder="Enter PayPal Client ID"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Found in PayPal Developer Dashboard → My Apps & Credentials
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">PayPal Client Secret</Label>
                      <Input
                        type="password"
                        value={paypalSettings.clientSecret}
                        onChange={(e) => setPaypalSettings({...paypalSettings, clientSecret: e.target.value})}
                        className="bg-gray-800 border-gray-600 mt-1"
                        placeholder="Enter PayPal Client Secret"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Keep this secret secure. Never share it publicly.
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-gray-300">Webhook ID (Optional)</Label>
                      <Input
                        type="text"
                        value={paypalSettings.webhookId}
                        onChange={(e) => setPaypalSettings({...paypalSettings, webhookId: e.target.value})}
                        className="bg-gray-800 border-gray-600 mt-1"
                        placeholder="PayPal Webhook ID"
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        Required for automatic payment processing
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => testPayPalConnectionMutation.mutate()}
                      disabled={testPayPalConnectionMutation.isPending}
                    >
                      {testPayPalConnectionMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Test Connection
                    </Button>
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => updatePayPalSettingsMutation.mutate(paypalSettings)}
                      disabled={updatePayPalSettingsMutation.isPending}
                    >
                      {updatePayPalSettingsMutation.isPending ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save PayPal Config
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Site Configuration Card */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-green-400" />
                    Site Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Site Name</Label>
                    <Input
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      className="bg-gray-800 border-gray-600 mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Tagline</Label>
                    <Input
                      value={siteSettings.tagline}
                      onChange={(e) => setSiteSettings({...siteSettings, tagline: e.target.value})}
                      className="bg-gray-800 border-gray-600 mt-1"
                    />
                  </div>
                  
                  <Separator className="bg-gray-600" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Maintenance Mode</Label>
                      <Switch 
                        checked={siteSettings.maintenance}
                        onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenance: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">User Registration</Label>
                      <Switch 
                        checked={siteSettings.registrationEnabled}
                        onCheckedChange={(checked) => setSiteSettings({...siteSettings, registrationEnabled: checked})}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-300">Content Moderation</Label>
                      <Switch 
                        checked={siteSettings.moderationEnabled}
                        onCheckedChange={(checked) => setSiteSettings({...siteSettings, moderationEnabled: checked})}
                      />
                    </div>
                  </div>
                  
                  <Separator className="bg-gray-600" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Max Free Stories</Label>
                      <Input
                        type="number"
                        value={siteSettings.maxFreeStories}
                        onChange={(e) => setSiteSettings({...siteSettings, maxFreeStories: parseInt(e.target.value)})}
                        className="bg-gray-800 border-gray-600 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Juice Refill Rate</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={siteSettings.juiceRefillRate}
                        onChange={(e) => setSiteSettings({...siteSettings, juiceRefillRate: parseFloat(e.target.value)})}
                        className="bg-gray-800 border-gray-600 mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Controls Card */}
            <Card className="bg-[var(--card-bg)] border-gray-700 border-red-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-400" />
                  Emergency Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Lock className="h-4 w-4 mr-2" />
                    Lock Platform
                  </Button>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Maintenance Mode
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  ⚠️ Use these controls only in emergency situations. They will affect all users immediately.
                </p>
              </CardContent>
            </Card>

            {/* System Status Card */}
            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="text-white font-medium">PayPal Service</div>
                    <div className="text-green-400 text-sm">Operational</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="text-white font-medium">Database</div>
                    <div className="text-green-400 text-sm">Connected</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <div className="text-white font-medium">Clerk Auth</div>
                    <div className="text-green-400 text-sm">Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
=======
          {/* Platform Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl font-semibold text-white">Platform Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Platform Name</label>
                    <Input defaultValue="ChatLure" className="bg-gray-800 border-gray-600 mt-1" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Daily Story Limit (Free Users)</label>
                    <Input defaultValue="3" type="number" className="bg-gray-800 border-gray-600 mt-1" />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Maintenance Mode</label>
                    <Select defaultValue="disabled">
                      <SelectTrigger className="bg-gray-800 border-gray-600 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-[var(--whatsapp)]">Save Settings</Button>
                </CardContent>
              </Card>

              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Content Moderation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Auto-approve Stories</label>
                    <Select defaultValue="manual">
                      <SelectTrigger className="bg-gray-800 border-gray-600 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto-approve</SelectItem>
                        <SelectItem value="manual">Manual Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Content Filter Level</label>
                    <Select defaultValue="moderate">
                      <SelectTrigger className="bg-gray-800 border-gray-600 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">Strict</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="lenient">Lenient</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Blocked Words</label>
                    <Textarea 
                      placeholder="Enter blocked words (comma separated)" 
                      className="bg-gray-800 border-gray-600 mt-1" 
                    />
                  </div>
                  <Button className="w-full bg-[var(--whatsapp)]">Update Filters</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Story Modal */}
        {editingStory && (
          <Dialog open={!!editingStory} onOpenChange={() => setEditingStory(null)}>
            <DialogContent className="bg-[var(--card-bg)] border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit Story</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder="Story title" 
                  className="bg-gray-800 border-gray-600"
                  value={editingStory.title}
                  onChange={(e) => setEditingStory({...editingStory, title: e.target.value})}
                />
                <Textarea 
                  placeholder="Story description" 
                  className="bg-gray-800 border-gray-600"
                  value={editingStory.description}
                  onChange={(e) => setEditingStory({...editingStory, description: e.target.value})}
                />
                <Select value={editingStory.category} onValueChange={(value) => setEditingStory({...editingStory, category: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(cat => (
                      <SelectItem key={cat.id} value={cat.name}>{cat.emoji} {cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={editingStory.isHot}
                      onChange={(e) => setEditingStory({...editingStory, isHot: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-gray-300">Hot</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={editingStory.isViral}
                      onChange={(e) => setEditingStory({...editingStory, isViral: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-gray-300">Viral</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={editingStory.isNew}
                      onChange={(e) => setEditingStory({...editingStory, isNew: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-gray-300">New</span>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1" onClick={() => setEditingStory(null)}>Cancel</Button>
                  <Button 
                    className="flex-1 bg-[var(--whatsapp)]"
                    onClick={() => updateStoryMutation.mutate({...editingStory})}
                    disabled={updateStoryMutation.isPending}
                  >
                    {updateStoryMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Story
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
            <DialogContent className="bg-[var(--card-bg)] border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input 
                  placeholder="Username" 
                  className="bg-gray-800 border-gray-600"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                />
                <Input 
                  placeholder="Email" 
                  type="email"
                  className="bg-gray-800 border-gray-600"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="First Name" 
                    className="bg-gray-800 border-gray-600"
                    value={editingUser.firstName || ""}
                    onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                  />
                  <Input 
                    placeholder="Last Name" 
                    className="bg-gray-800 border-gray-600"
                    value={editingUser.lastName || ""}
                    onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                  />
                </div>
                <Select value={editingUser.subscriptionTier} onValueChange={(value) => setEditingUser({...editingUser, subscriptionTier: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select subscription tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={editingUser.isAdmin}
                    onChange={(e) => setEditingUser({...editingUser, isAdmin: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-gray-300">Admin Access</span>
                </div>
                <div className="flex space-x-4">
                  <Button variant="outline" className="flex-1" onClick={() => setEditingUser(null)}>Cancel</Button>
                  <Button 
                    className="flex-1 bg-[var(--whatsapp)]"
                    onClick={() => updateUserMutation.mutate({...editingUser})}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update User
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
>>>>>>> origin/main
      </div>
    </div>
  );
}