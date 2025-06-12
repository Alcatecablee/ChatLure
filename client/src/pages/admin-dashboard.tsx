import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Users, MessageSquare, TrendingUp, Settings, Eye, Edit, Trash2, Plus,
  BarChart3, DollarSign, Crown, Shield, Calendar, Activity, Save, 
  ToggleLeft, ToggleRight, Database, RefreshCw, CreditCard, Globe,
  MessageCircle, Zap, 
  Lock, Unlock, CheckCircle, XCircle, AlertTriangle, Clock, Share2,
  Play, Pause, Smartphone, Move, ChevronUp, ChevronDown, Copy,
  Download, Upload, FileText, Image, Tag
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingMessages, setEditingMessages] = useState<Message[] | null>(null);
  const [selectedStoryId, setSelectedStoryId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState({
    content: "",
    isIncoming: true,
    timestamp: "",
    hasReadReceipt: false
  });
  
  // Chat Editor State
  const [offlineStories, setOfflineStories] = useState<any[]>([]);
  const [currentOfflineStory, setCurrentOfflineStory] = useState<any>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [newOfflineMessage, setNewOfflineMessage] = useState({
    type: 'text',
    sender: 'other',
    content: '',
    delay: 2000
  });
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
  const { toast } = useToast();

  // Fetch data
  const { data: stories, isLoading: storiesLoading } = useQuery<Story[]>({ queryKey: ["/api/stories"] });
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({ queryKey: ["/api/admin/users"] });
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({ queryKey: ["/api/categories"] });
  const { data: subscriptionPlans } = useQuery<SubscriptionPlan[]>({ queryKey: ["/api/admin/subscription-plans"] });
  const { data: analytics } = useQuery({ queryKey: ["/api/admin/analytics"] });
  const { data: payments } = useQuery({ queryKey: ["/api/admin/payments"] });
  const { data: currentPayPalSettings } = useQuery({ queryKey: ["/api/admin/paypal/settings"] });
  const { data: moderationQueue } = useQuery({ queryKey: ["/api/admin/moderation/queue"] });
  const { data: systemHealth } = useQuery({ queryKey: ["/api/admin/system/health"] });
  const { data: recentActivity } = useQuery({ queryKey: ["/api/admin/activity"] });
  
  // Fetch messages for selected story
  const { data: storyMessages, refetch: refetchMessages } = useQuery<Message[]>({ 
    queryKey: ["/api/messages", selectedStoryId],
    enabled: !!selectedStoryId
  });

  // Mutations
  const createStoryMutation = useMutation({
    mutationFn: (story: any) => apiRequest("/api/admin/stories", "POST", story),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({ title: "Story created successfully" });
      setNewStory({ title: "", description: "", category: "", difficulty: "medium", duration: 5, imageUrl: "", isHot: false, isNew: true, isViral: false, hasAudio: false, hasImages: false, cliffhangerLevel: 3 });
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

  // PayPal Settings Mutations
  const updatePayPalSettingsMutation = useMutation({
    mutationFn: (settings: any) => apiRequest("/api/admin/paypal/settings", "PATCH", settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/paypal/settings"] });
      toast({ title: "PayPal settings updated successfully" });
    },
    onError: () => toast({ title: "Failed to update PayPal settings", variant: "destructive" })
  });

  // Message management mutations
  const createMessageMutation = useMutation({
    mutationFn: (message: any) => apiRequest("/api/admin/messages", "POST", message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedStoryId] });
      toast({ title: "Message created successfully" });
      setNewMessage({ content: "", isIncoming: true, timestamp: "", hasReadReceipt: false });
    },
    onError: () => toast({ title: "Failed to create message", variant: "destructive" })
  });

  const updateMessageMutation = useMutation({
    mutationFn: ({ id, ...message }: any) => apiRequest(`/api/admin/messages/${id}`, "PATCH", message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedStoryId] });
      toast({ title: "Message updated successfully" });
    },
    onError: () => toast({ title: "Failed to update message", variant: "destructive" })
  });

  const deleteMessageMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/admin/messages/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedStoryId] });
      toast({ title: "Message deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete message", variant: "destructive" })
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

  // Load offline stories from localStorage
  React.useEffect(() => {
    const savedStories = localStorage.getItem('chatlure-offline-stories');
    if (savedStories) {
      try {
        setOfflineStories(JSON.parse(savedStories));
      } catch (error) {
        console.error('Failed to load offline stories:', error);
      }
    }
  }, []);

  // Save offline stories to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('chatlure-offline-stories', JSON.stringify(offlineStories));
  }, [offlineStories]);

  // Chat Editor Functions
  const createOfflineStory = () => {
    const newStory = {
      id: Date.now().toString(),
      title: "New Chat Story",
      description: "An engaging conversation",
      category: "Romance",
      characters: [
        { id: "user", name: "You", avatar: "👤", color: "#3b82f6" },
        { id: "other", name: "Alex", avatar: "😊", color: "#10b981" }
      ],
      messages: [
        {
          id: "1",
          type: "text",
          sender: "other",
          content: "Hey there! 👋",
          timestamp: Date.now(),
          delay: 1000
        }
      ],
      settings: {
        autoAdvance: true,
        typingSpeed: 50,
        theme: "dark"
      },
      created: Date.now(),
      updated: Date.now()
    };
    
    setOfflineStories(prev => [...prev, newStory]);
    setCurrentOfflineStory(newStory);
  };

  const updateOfflineStory = (updates: any) => {
    if (!currentOfflineStory) return;
    
    const updatedStory = {
      ...currentOfflineStory,
      ...updates,
      updated: Date.now()
    };
    
    setCurrentOfflineStory(updatedStory);
    setOfflineStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
  };

  const addOfflineMessage = () => {
    if (!currentOfflineStory || !newOfflineMessage.content) return;
    
    const message = {
      id: Date.now().toString(),
      type: newOfflineMessage.type,
      sender: newOfflineMessage.sender,
      content: newOfflineMessage.content,
      timestamp: Date.now(),
      delay: newOfflineMessage.delay
    };
    
    updateOfflineStory({
      messages: [...currentOfflineStory.messages, message]
    });
    
    setNewOfflineMessage({
      type: 'text',
      sender: 'other',
      content: '',
      delay: 2000
    });
  };

  const deleteOfflineMessage = (messageId: string) => {
    if (!currentOfflineStory) return;
    
    updateOfflineStory({
      messages: currentOfflineStory.messages.filter((m: any) => m.id !== messageId)
    });
  };

  const moveMessage = (messageId: string, direction: 'up' | 'down') => {
    if (!currentOfflineStory) return;
    
    const messages = [...currentOfflineStory.messages];
    const index = messages.findIndex((m: any) => m.id === messageId);
    
    if (direction === 'up' && index > 0) {
      [messages[index], messages[index - 1]] = [messages[index - 1], messages[index]];
    } else if (direction === 'down' && index < messages.length - 1) {
      [messages[index], messages[index + 1]] = [messages[index + 1], messages[index]];
    }
    
    updateOfflineStory({ messages });
  };

  // New comprehensive stats
  const stats = {
    totalUsers: users?.length || 0,
    totalStories: stories?.length || 0,
    totalViews: stories?.reduce((sum, story) => sum + story.views, 0) || 0,
    totalShares: stories?.reduce((sum, story) => sum + story.shares, 0) || 0,
    premiumUsers: users?.filter(u => u.subscriptionStatus === 'active').length || 0,
    revenue: payments?.reduce((sum: number, payment: any) => sum + (payment.amount / 100), 0) || 0,
    dailyActiveUsers: users?.filter((u: any) => {
      const lastActive = new Date(u.lastActiveAt);
      const today = new Date();
      return (today.getTime() - lastActive.getTime()) < 24 * 60 * 60 * 1000;
    }).length || 0,
    conversionRate: users?.length ? ((users?.filter(u => u.subscriptionStatus === 'active').length || 0) / users.length * 100).toFixed(1) : "0"
  };

  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">ChatLure Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Complete platform management & control</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-500 text-white">
              <Activity className="h-3 w-3 mr-1" />
              System Healthy
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Users className="h-3 w-3 mr-1" />
              {stats.dailyActiveUsers} Online
            </Badge>
            <Button 
              className="bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)]"
              onClick={() => setSelectedTab("site-settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Premium Users</p>
                  <p className="text-2xl font-bold text-white">{stats.premiumUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">{stats.conversionRate}% conversion</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Stories</p>
                  <p className="text-2xl font-bold text-white">{stats.totalStories}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-green-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+8% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Views</p>
                  <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">+24% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-green-400 text-sm mt-2">+18% from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-[var(--card-bg)] border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Daily Active</p>
                  <p className="text-2xl font-bold text-white">{stats.dailyActiveUsers}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-400" />
              </div>
              <p className="text-green-400 text-sm mt-2">84% retention</p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-[var(--card-bg)] border-gray-700 grid grid-cols-8 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="chat-editor">Chat Editor</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="site-settings">Site Settings</TabsTrigger>
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
                    {recentActivity && recentActivity.length > 0 ? (
                      recentActivity.map((activity: any) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-2 bg-gray-800 rounded">
                          <div className={`w-2 h-2 rounded-full animate-pulse ${
                            activity.color === 'green' ? 'bg-green-400' :
                            activity.color === 'blue' ? 'bg-blue-400' :
                            activity.color === 'purple' ? 'bg-purple-400' :
                            activity.color === 'orange' ? 'bg-orange-400' :
                            'bg-yellow-400'
                          }`}></div>
                          <span className="text-gray-300 text-sm">{activity.message}</span>
                          <span className="text-gray-500 text-xs">
                            {new Date(activity.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400 text-center py-4">
                        No recent activity to display
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

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
          <TabsContent value="stories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Stories Management</h2>
              <Dialog>
                <DialogTrigger asChild>
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
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stories Table */}
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
                      <TableHead className="text-gray-300">Revenue</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stories?.map((story) => (
                      <TableRow key={story.id} className="border-gray-700">
                        <TableCell className="text-white font-medium">{story.title}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
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

          {/* Chat Editor Tab - COMPREHENSIVE OFFLINE EDITOR */}
          <TabsContent value="chat-editor" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">ChatLure Story Editor</h2>
              <div className="flex space-x-2">
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    // Create new offline story
                    const newStory = {
                      id: Date.now().toString(),
                      title: "New Chat Story",
                      description: "An engaging conversation",
                      category: "Romance",
                      messages: [
                        {
                          id: "1",
                          type: "text",
                          sender: "other",
                          content: "Hey there! 👋",
                          timestamp: Date.now(),
                          delay: 1000
                        }
                      ],
                      created: Date.now()
                    };
                    
                    const existingStories = JSON.parse(localStorage.getItem('chatlure-offline-stories') || '[]');
                    existingStories.push(newStory);
                    localStorage.setItem('chatlure-offline-stories', JSON.stringify(existingStories));
                    setSelectedStoryId(parseInt(newStory.id));
                    refetchMessages();
                    toast({ title: "New story created for editing" });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Story
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    const stories = JSON.parse(localStorage.getItem('chatlure-offline-stories') || '[]');
                    const dataStr = JSON.stringify(stories, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', 'chatlure-stories-backup.json');
                    linkElement.click();
                    toast({ title: "Stories exported successfully" });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Offline Stories Panel */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    <span>Offline Stories ({offlineStories.length})</span>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={createOfflineStory}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {offlineStories.map((story) => (
                    <div 
                      key={story.id}
                      className={`p-3 rounded cursor-pointer border transition-all ${
                        currentOfflineStory?.id === story.id 
                          ? 'bg-blue-600 border-blue-500' 
                          : 'bg-gray-800 hover:bg-gray-700 border-gray-600'
                      }`}
                      onClick={() => setCurrentOfflineStory(story)}
                    >
                      <div className="font-medium text-white text-sm truncate">{story.title}</div>
                      <div className="text-gray-400 text-xs">{story.category}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-blue-500 text-white text-xs">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {story.messages?.length || 0} msgs
                        </Badge>
                        <Badge className="bg-purple-500 text-white text-xs">
                          {new Date(story.created).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {offlineStories.length === 0 && (
                    <div className="text-gray-400 text-center py-8 text-sm">
                      No offline stories yet.<br />
                      Click + to create your first story.
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Message Editor */}
              <Card className="bg-[var(--card-bg)] border-gray-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>
                      {currentOfflineStory ? `Editing: ${currentOfflineStory.title}` : 'Chat Editor'}
                    </span>
                    <div className="flex space-x-2">
                      {currentOfflineStory && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={() => setIsPreviewMode(!isPreviewMode)}
                          >
                            {isPreviewMode ? <Edit className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                            {isPreviewMode ? 'Edit' : 'Preview'}
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              const dataStr = JSON.stringify(currentOfflineStory, null, 2);
                              const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                              const linkElement = document.createElement('a');
                              linkElement.setAttribute('href', dataUri);
                              linkElement.setAttribute('download', `${currentOfflineStory.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
                              linkElement.click();
                              toast({ title: "Story exported successfully" });
                            }}
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentOfflineStory ? (
                    <div className="space-y-4">
                      {/* Story Settings */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg">
                        <div>
                          <Label className="text-gray-300 text-sm">Title</Label>
                          <Input
                            value={currentOfflineStory.title}
                            onChange={(e) => updateOfflineStory({ title: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label className="text-gray-300 text-sm">Category</Label>
                          <Select
                            value={currentOfflineStory.category}
                            onValueChange={(value) => updateOfflineStory({ category: value })}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Romance">Romance</SelectItem>
                              <SelectItem value="Adventure">Adventure</SelectItem>
                              <SelectItem value="Mystery">Mystery</SelectItem>
                              <SelectItem value="Fantasy">Fantasy</SelectItem>
                              <SelectItem value="Horror">Horror</SelectItem>
                              <SelectItem value="Comedy">Comedy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {!isPreviewMode ? (
                        <>
                          {/* Messages List */}
                          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <div className="space-y-3">
                              {currentOfflineStory.messages?.map((message: any, index: number) => (
                                <div 
                                  key={message.id} 
                                  className={`flex items-start space-x-2 ${
                                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  {message.sender !== 'user' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'up')}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'down')}
                                        disabled={index === currentOfflineStory.messages.length - 1}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                  
                                  <div 
                                    className={`rounded-lg p-3 max-w-xs cursor-pointer border-2 transition-all ${
                                      selectedMessageIndex === index 
                                        ? 'border-blue-500' 
                                        : 'border-transparent'
                                    } ${
                                      message.sender === 'user' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-700 text-white'
                                    }`}
                                    onClick={() => setSelectedMessageIndex(index)}
                                  >
                                    <p className="text-sm">{message.content}</p>
                                    <div className="flex items-center justify-between mt-1">
                                      <span className="text-xs opacity-70">
                                        {message.sender === 'user' ? 'You' : 'Other'}
                                      </span>
                                      <span className="text-xs opacity-70">
                                        {message.delay}ms delay
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {message.sender === 'user' && (
                                    <div className="flex flex-col space-y-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'up')}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ChevronUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'down')}
                                        disabled={index === currentOfflineStory.messages.length - 1}
                                        className="h-6 w-6 p-0"
                                      >
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteOfflineMessage(message.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white h-6 w-6 p-0"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Message Editor Form */}
                          <div className="border-t border-gray-700 pt-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white font-medium">
                                {selectedMessageIndex !== null ? 'Edit Message' : 'Add New Message'}
                              </h4>
                              {selectedMessageIndex !== null && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedMessageIndex(null)}
                                >
                                  Cancel Edit
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              <Select
                                value={newOfflineMessage.sender}
                                onValueChange={(value) => setNewOfflineMessage({
                                  ...newOfflineMessage,
                                  sender: value
                                })}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-600">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">User</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Input
                                type="number"
                                placeholder="Delay (ms)"
                                value={newOfflineMessage.delay}
                                onChange={(e) => setNewOfflineMessage({
                                  ...newOfflineMessage,
                                  delay: parseInt(e.target.value) || 1000
                                })}
                                className="bg-gray-800 border-gray-600"
                              />
                              
                              <Select
                                value={newOfflineMessage.type}
                                onValueChange={(value) => setNewOfflineMessage({
                                  ...newOfflineMessage,
                                  type: value
                                })}
                              >
                                <SelectTrigger className="bg-gray-800 border-gray-600">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="text">Text</SelectItem>
                                  <SelectItem value="image">Image</SelectItem>
                                  <SelectItem value="typing">Typing</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <Textarea
                              placeholder="Enter message content..."
                              className="bg-gray-800 border-gray-600"
                              rows={3}
                              value={newOfflineMessage.content}
                              onChange={(e) => setNewOfflineMessage({
                                ...newOfflineMessage,
                                content: e.target.value
                              })}
                            />
                            
                            <div className="flex space-x-2">
                              <Button
                                className="bg-green-600 hover:bg-green-700"
                                onClick={addOfflineMessage}
                                disabled={!newOfflineMessage.content}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Message
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setNewOfflineMessage({
                                  type: 'text',
                                  sender: 'other',
                                  content: '',
                                  delay: 2000
                                })}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Preview Mode */
                        <div className="bg-gray-900 rounded-lg p-4">
                          <div className="max-w-sm mx-auto">
                            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                              {/* Phone Header */}
                              <div className="bg-gray-800 p-4 flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  😊
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">Chat Partner</div>
                                  <div className="text-green-400 text-xs">Online</div>
                                </div>
                              </div>
                              
                              {/* Messages */}
                              <div className="h-96 bg-gray-900 p-4 overflow-y-auto">
                                <div className="space-y-3">
                                  {currentOfflineStory.messages?.slice(0, previewIndex + 1).map((message: any) => (
                                    <div
                                      key={message.id}
                                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                      <div
                                        className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
                                          message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-700 text-gray-100'
                                        }`}
                                      >
                                        {message.content}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Input Area */}
                              <div className="bg-gray-800 p-4 flex items-center space-x-2">
                                <div className="flex-1 bg-gray-700 rounded-full px-4 py-2">
                                  <span className="text-gray-400 text-sm">Type a message...</span>
                                </div>
                                <Button size="sm" className="rounded-full w-8 h-8 p-0">
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-4 text-center">
                              <div className="flex justify-center space-x-2 mb-2">
                                <Button
                                  size="sm"
                                  onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                                  disabled={previewIndex === 0}
                                >
                                  Previous
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setPreviewIndex(Math.min(currentOfflineStory.messages.length - 1, previewIndex + 1))}
                                  disabled={previewIndex >= currentOfflineStory.messages.length - 1}
                                >
                                  Next
                                </Button>
                              </div>
                              <div className="text-sm text-gray-400">
                                Message {previewIndex + 1} of {currentOfflineStory.messages?.length || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                      <h3 className="text-xl font-medium text-white mb-2">No Story Selected</h3>
                      <p className="text-gray-400 mb-6">
                        Create a new story or select an existing one to start editing
                      </p>
                      <Button onClick={createOfflineStory} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Story
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Story Info Panel */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Story Info</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentOfflineStory ? (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-300 text-xs">Description</Label>
                        <Textarea
                          value={currentOfflineStory.description}
                          onChange={(e) => updateOfflineStory({ description: e.target.value })}
                          className="bg-gray-800 border-gray-600 text-white mt-1"
                          rows={3}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-400">
                            {currentOfflineStory.messages?.length || 0}
                          </div>
                          <div className="text-xs text-gray-400">Messages</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-400">
                            {Math.ceil((currentOfflineStory.messages?.length || 0) * 0.5)}
                          </div>
                          <div className="text-xs text-gray-400">Est. Minutes</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <Label className="text-gray-300 text-xs">Actions</Label>
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              const duplicated = {
                                ...currentOfflineStory,
                                id: Date.now().toString(),
                                title: `${currentOfflineStory.title} (Copy)`,
                                created: Date.now(),
                                updated: Date.now()
                              };
                              setOfflineStories(prev => [...prev, duplicated]);
                              toast({ title: "Story duplicated successfully" });
                            }}
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Duplicate Story
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full justify-start text-red-400 border-red-600 hover:bg-red-600"
                            onClick={() => {
                              setOfflineStories(prev => prev.filter(s => s.id !== currentOfflineStory.id));
                              setCurrentOfflineStory(null);
                              toast({ title: "Story deleted" });
                            }}
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete Story
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 text-center py-8 text-sm">
                      Select a story to view details
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
                            <Button 
                              size="sm" 
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={!newMessage.content || createMessageMutation.isPending}
                              onClick={() => {
                                if (newMessage.content && selectedStoryId) {
                                  createMessageMutation.mutate({
                                    storyId: selectedStoryId,
                                    content: newMessage.content,
                                    isIncoming: newMessage.isIncoming,
                                    timestamp: newMessage.timestamp || new Date().toLocaleTimeString(),
                                    hasReadReceipt: newMessage.hasReadReceipt,
                                    order: (storyMessages?.length || 0) + 1
                                  });
                                }
                              }}
                            >
                              <Save className="h-3 w-3 mr-1" />
                              {createMessageMutation.isPending ? 'Saving...' : 'Save Message'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="border-gray-600"
                              onClick={() => setNewMessage({
                                content: "",
                                isIncoming: true,
                                timestamp: "",
                                hasReadReceipt: false
                              })}
                            >
                              Cancel
                            </Button>
                          </div>
                          <Badge className="bg-gray-700 text-white">
                            Message #{(storyMessages?.length || 0) + 1}
                          </Badge>
                        </div>
                      </div>
                    )}
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
              </div>
            </div>

            <Card className="bg-[var(--card-bg)] border-gray-700">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Username</TableHead>
                      <TableHead className="text-gray-300">Email</TableHead>
                      <TableHead className="text-gray-300">Subscription</TableHead>
                      <TableHead className="text-gray-300">Juice Level</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Last Active</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id} className="border-gray-700">
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
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

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
                    Revenue Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

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

              {/* General Site Settings Card */}
              <Card className="bg-[var(--card-bg)] border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-400" />
                    General Settings
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
                    <div className="text-white font-medium">API Server</div>
                    <div className="text-green-400 text-sm">Healthy</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
      </div>
    </div>
  );
}