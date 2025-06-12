import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Plus, Download, Upload, Edit, Trash2, Eye, Save, Users, Package, 
  MessageCircle, TrendingUp, DollarSign, Activity, Settings, 
  ChevronUp, ChevronDown, Send, Copy, Code, FileJson, Palette
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("chat-editor");
  
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

  const deleteOfflineStory = (id: string) => {
    setOfflineStories(prev => prev.filter(s => s.id !== id));
    if (currentOfflineStory?.id === id) {
      setCurrentOfflineStory(null);
      setSelectedMessageIndex(null);
    }
  };

  const addMessage = () => {
    if (!currentOfflineStory || !newOfflineMessage.content.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      ...newOfflineMessage,
      timestamp: Date.now()
    };
    
    updateOfflineStory({
      messages: [...(currentOfflineStory.messages || []), message]
    });
    
    setNewOfflineMessage({
      type: 'text',
      sender: 'other',
      content: '',
      delay: 2000
    });
  };

  const updateMessage = (index: number, updates: any) => {
    if (!currentOfflineStory) return;
    
    const updatedMessages = [...currentOfflineStory.messages];
    updatedMessages[index] = { ...updatedMessages[index], ...updates };
    updateOfflineStory({ messages: updatedMessages });
  };

  const deleteMessage = (messageId: string) => {
    if (!currentOfflineStory) return;
    
    const updatedMessages = currentOfflineStory.messages.filter((m: any) => m.id !== messageId);
    updateOfflineStory({ messages: updatedMessages });
    setSelectedMessageIndex(null);
  };

  const moveMessage = (messageId: string, direction: 'up' | 'down') => {
    if (!currentOfflineStory) return;
    
    const messages = [...currentOfflineStory.messages];
    const index = messages.findIndex((m: any) => m.id === messageId);
    
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= messages.length) return;
    
    [messages[index], messages[newIndex]] = [messages[newIndex], messages[index]];
    updateOfflineStory({ messages });
  };

  const duplicateMessage = (messageId: string) => {
    if (!currentOfflineStory) return;
    
    const messageIndex = currentOfflineStory.messages.findIndex((m: any) => m.id === messageId);
    if (messageIndex === -1) return;
    
    const originalMessage = currentOfflineStory.messages[messageIndex];
    const duplicatedMessage = {
      ...originalMessage,
      id: Date.now().toString(),
      content: originalMessage.content + " (copy)"
    };
    
    const updatedMessages = [...currentOfflineStory.messages];
    updatedMessages.splice(messageIndex + 1, 0, duplicatedMessage);
    updateOfflineStory({ messages: updatedMessages });
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#f0f6fc] mb-2">Admin Dashboard</h1>
          <p className="text-[#7d8590]">Manage your ChatLure platform with cursor.com-inspired design</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-[#161b22] border border-[#21262d] p-1">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-[#0969da] data-[state=active]:text-white text-[#f0f6fc]"
            >
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="chat-editor" 
              className="data-[state=active]:bg-[#0969da] data-[state=active]:text-white text-[#f0f6fc]"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat Editor
            </TabsTrigger>
            <TabsTrigger 
              value="stories" 
              className="data-[state=active]:bg-[#0969da] data-[state=active]:text-white text-[#f0f6fc]"
            >
              <Package className="w-4 h-4 mr-2" />
              Stories
            </TabsTrigger>
            <TabsTrigger 
              value="users" 
              className="data-[state=active]:bg-[#0969da] data-[state=active]:text-white text-[#f0f6fc]"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-[#0969da] data-[state=active]:text-white text-[#f0f6fc]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="data-[state=active]:bg-[#0969da] data-[state=active]:text-white text-[#f0f6fc]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat-editor" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-[#f0f6fc]">Chat Editor</h3>
                <p className="text-[#7d8590]">Create and edit interactive chat stories with cursor.com-inspired design</p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  className="bg-[#238636] hover:bg-[#2ea043] border border-[#30363d] text-white"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.json';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          try {
                            const imported = JSON.parse(e.target?.result as string);
                            if (Array.isArray(imported)) {
                              setOfflineStories(prev => [...prev, ...imported]);
                            } else {
                              setOfflineStories(prev => [...prev, imported]);
                            }
                            toast({ title: "Stories imported successfully" });
                          } catch (error) {
                            toast({ title: "Failed to import stories", variant: "destructive" });
                          }
                        };
                        reader.readAsText(file);
                      }
                    };
                    input.click();
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button 
                  variant="outline"
                  className="border-[#30363d] hover:bg-[#21262d] text-[#f0f6fc]"
                  onClick={() => {
                    const dataStr = JSON.stringify(offlineStories, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'chatlure-stories.json';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  disabled={offlineStories.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
                <Button 
                  onClick={createOfflineStory} 
                  className="bg-[#0969da] hover:bg-[#0860ca] border border-[#1f6feb] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Story
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
              {/* Story List Sidebar */}
              <Card className="col-span-3 bg-[#0d1117] border-[#21262d] shadow-2xl">
                <CardHeader className="pb-3 border-b border-[#21262d]">
                  <CardTitle className="text-[#f0f6fc] text-lg flex items-center justify-between">
                    <div className="flex items-center">
                      <FileJson className="w-5 h-5 mr-2 text-[#0969da]" />
                      Stories
                    </div>
                    <Badge variant="secondary" className="bg-[#21262d] text-[#7d8590] border border-[#30363d]">
                      {offlineStories.length}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-[#7d8590] text-sm">
                    {offlineStories.length} {offlineStories.length === 1 ? 'story' : 'stories'} created
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto p-3">
                  {offlineStories.map((story) => (
                    <div
                      key={story.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border group hover:scale-[1.02] ${
                        currentOfflineStory?.id === story.id
                          ? 'bg-[#1f2937] border-[#0969da] shadow-lg shadow-[#0969da]/20'
                          : 'bg-[#161b22] border-[#30363d] hover:bg-[#21262d] hover:border-[#484f58]'
                      }`}
                      onClick={() => setCurrentOfflineStory(story)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[#f0f6fc] text-sm font-semibold truncate mb-1">
                            {story.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs mb-2">
                            <Badge variant="secondary" className="bg-[#21262d] text-[#7d8590] px-2 py-0.5 text-xs">
                              {story.category}
                            </Badge>
                            <span className="text-[#7d8590]">
                              {story.messages?.length || 0} msg
                            </span>
                          </div>
                          <div className="text-xs text-[#7d8590]">
                            Updated {new Date(story.updated).toLocaleDateString()}
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 ml-2 text-[#7d8590] hover:text-[#f85149] opacity-0 group-hover:opacity-100 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOfflineStory(story.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {offlineStories.length === 0 && (
                    <div className="text-center py-12 text-[#7d8590]">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#30363d]" />
                      <p className="text-sm mb-2">No stories yet</p>
                      <p className="text-xs">Create your first story to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Main Editor */}
              <Card className="col-span-9 bg-[#0d1117] border-[#21262d] shadow-2xl">
                <CardContent className="p-6 h-full flex flex-col">
                  {currentOfflineStory ? (
                    <div className="flex flex-col h-full">
                      {/* Story Header */}
                      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                        <div>
                          <Label className="text-[#f0f6fc] text-sm font-medium mb-2 block">Story Title</Label>
                          <Input
                            value={currentOfflineStory.title}
                            onChange={(e) => updateOfflineStory({ title: e.target.value })}
                            className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] focus:border-[#0969da] focus:ring-[#0969da]/20"
                            placeholder="Enter story title..."
                          />
                        </div>
                        <div>
                          <Label className="text-[#f0f6fc] text-sm font-medium mb-2 block">Category</Label>
                          <Select
                            value={currentOfflineStory.category}
                            onValueChange={(value) => updateOfflineStory({ category: value })}
                          >
                            <SelectTrigger className="bg-[#21262d] border-[#30363d] text-[#f0f6fc] focus:border-[#0969da]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#161b22] border-[#30363d]">
                              <SelectItem value="Romance">💕 Romance</SelectItem>
                              <SelectItem value="Adventure">🗺️ Adventure</SelectItem>
                              <SelectItem value="Mystery">🕵️ Mystery</SelectItem>
                              <SelectItem value="Fantasy">🧙 Fantasy</SelectItem>
                              <SelectItem value="Horror">👻 Horror</SelectItem>
                              <SelectItem value="Comedy">😄 Comedy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {!isPreviewMode ? (
                        <>
                          {/* Messages List */}
                          <div className="bg-[#0c0e13] rounded-lg p-4 max-h-96 overflow-y-auto border border-[#21262d] mb-4 shadow-inner">
                            <div className="space-y-3">
                              {currentOfflineStory.messages?.map((message: any, index: number) => (
                                <div 
                                  key={message.id} 
                                  className={`flex items-start space-x-2 group hover:bg-[#161b22] rounded-lg p-2 transition-all ${
                                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                                  }`}
                                >
                                  {message.sender !== 'user' && (
                                    <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'up')}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0 hover:bg-[#21262d]"
                                        title="Move up"
                                      >
                                        <ChevronUp className="h-3 w-3 text-[#7d8590]" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'down')}
                                        disabled={index === currentOfflineStory.messages.length - 1}
                                        className="h-6 w-6 p-0 hover:bg-[#21262d]"
                                        title="Move down"
                                      >
                                        <ChevronDown className="h-3 w-3 text-[#7d8590]" />
                                      </Button>
                                    </div>
                                  )}
                                  
                                  <div 
                                    className={`rounded-lg p-3 max-w-xs cursor-pointer border-2 transition-all duration-200 relative group/message ${
                                      selectedMessageIndex === index 
                                        ? 'border-[#0969da] shadow-lg shadow-[#0969da]/20' 
                                        : 'border-transparent hover:border-[#30363d]'
                                    } ${
                                      message.sender === 'user' 
                                        ? 'bg-[#0969da] text-white' 
                                        : 'bg-[#21262d] text-[#f0f6fc]'
                                    }`}
                                    onClick={() => setSelectedMessageIndex(index)}
                                  >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                    <div className="flex items-center justify-between mt-2 text-xs">
                                      <span className="opacity-70 font-medium">
                                        {message.sender === 'user' ? 'You' : 'Character'}
                                      </span>
                                      <span className="opacity-70">
                                        {message.delay}ms
                                      </span>
                                    </div>
                                    {selectedMessageIndex === index && (
                                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#0969da] rounded-full animate-pulse"></div>
                                    )}
                                    
                                    {/* Message Actions */}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover/message:opacity-100 transition-opacity bg-[#21262d] rounded flex space-x-1 p-1">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          duplicateMessage(message.id);
                                        }}
                                        className="h-5 w-5 p-0 text-[#7d8590] hover:text-[#f0f6fc]"
                                        title="Duplicate"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  {message.sender === 'user' && (
                                    <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'up')}
                                        disabled={index === 0}
                                        className="h-6 w-6 p-0 hover:bg-[#21262d]"
                                        title="Move up"
                                      >
                                        <ChevronUp className="h-3 w-3 text-[#7d8590]" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => moveMessage(message.id, 'down')}
                                        disabled={index === currentOfflineStory.messages.length - 1}
                                        className="h-6 w-6 p-0 hover:bg-[#21262d]"
                                        title="Move down"
                                      >
                                        <ChevronDown className="h-3 w-3 text-[#7d8590]" />
                                      </Button>
                                    </div>
                                  )}
                                  
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteMessage(message.id)}
                                    className="h-6 w-6 p-0 text-[#7d8590] hover:text-[#f85149] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#f85149]/10"
                                    title="Delete message"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                              {currentOfflineStory.messages?.length === 0 && (
                                <div className="text-center py-12 text-[#7d8590]">
                                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-[#30363d]" />
                                  <p className="text-sm mb-2">No messages yet</p>
                                  <p className="text-xs">Add your first message below</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Selected Message Editor */}
                          {selectedMessageIndex !== null && (
                            <div className="mb-4 p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                              <h4 className="text-[#f0f6fc] text-sm font-semibold mb-3 flex items-center">
                                <Edit className="w-4 h-4 mr-2 text-[#0969da]" />
                                Edit Message #{selectedMessageIndex + 1}
                              </h4>
                              <div className="grid grid-cols-3 gap-3 mb-3">
                                <div>
                                  <Label className="text-[#f0f6fc] text-xs font-medium">Sender</Label>
                                  <Select
                                    value={currentOfflineStory.messages[selectedMessageIndex].sender}
                                    onValueChange={(value) => updateMessage(selectedMessageIndex, { sender: value })}
                                  >
                                    <SelectTrigger className="bg-[#21262d] border-[#30363d] h-8 text-[#f0f6fc]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#161b22] border-[#30363d]">
                                      <SelectItem value="user">👤 You</SelectItem>
                                      <SelectItem value="other">💬 Character</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[#f0f6fc] text-xs font-medium">Type</Label>
                                  <Select
                                    value={currentOfflineStory.messages[selectedMessageIndex].type}
                                    onValueChange={(value) => updateMessage(selectedMessageIndex, { type: value })}
                                  >
                                    <SelectTrigger className="bg-[#21262d] border-[#30363d] h-8 text-[#f0f6fc]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#161b22] border-[#30363d]">
                                      <SelectItem value="text">📝 Text</SelectItem>
                                      <SelectItem value="image">🖼️ Image</SelectItem>
                                      <SelectItem value="typing">⌨️ Typing</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[#f0f6fc] text-xs font-medium">Delay (ms)</Label>
                                  <Input
                                    type="number"
                                    value={currentOfflineStory.messages[selectedMessageIndex].delay}
                                    onChange={(e) => updateMessage(selectedMessageIndex, { delay: parseInt(e.target.value) })}
                                    className="bg-[#21262d] border-[#30363d] h-8 text-[#f0f6fc]"
                                  />
                                </div>
                              </div>
                              <div>
                                <Label className="text-[#f0f6fc] text-xs font-medium">Content</Label>
                                <Textarea
                                  value={currentOfflineStory.messages[selectedMessageIndex].content}
                                  onChange={(e) => updateMessage(selectedMessageIndex, { content: e.target.value })}
                                  className="bg-[#21262d] border-[#30363d] mt-1 text-[#f0f6fc] focus:border-[#0969da] focus:ring-[#0969da]/20"
                                  rows={3}
                                  placeholder="Enter message content..."
                                />
                              </div>
                            </div>
                          )}

                          {/* Add New Message */}
                          <div className="mb-4 p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                            <h4 className="text-[#f0f6fc] text-sm font-semibold mb-3 flex items-center">
                              <Plus className="w-4 h-4 mr-2 text-[#238636]" />
                              Add New Message
                            </h4>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                              <div>
                                <Label className="text-[#f0f6fc] text-xs font-medium">Sender</Label>
                                <Select
                                  value={newOfflineMessage.sender}
                                  onValueChange={(value) => setNewOfflineMessage(prev => ({ ...prev, sender: value }))}
                                >
                                  <SelectTrigger className="bg-[#21262d] border-[#30363d] h-8 text-[#f0f6fc]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#161b22] border-[#30363d]">
                                    <SelectItem value="user">👤 You</SelectItem>
                                    <SelectItem value="other">💬 Character</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[#f0f6fc] text-xs font-medium">Type</Label>
                                <Select
                                  value={newOfflineMessage.type}
                                  onValueChange={(value) => setNewOfflineMessage(prev => ({ ...prev, type: value }))}
                                >
                                  <SelectTrigger className="bg-[#21262d] border-[#30363d] h-8 text-[#f0f6fc]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#161b22] border-[#30363d]">
                                    <SelectItem value="text">📝 Text</SelectItem>
                                    <SelectItem value="image">🖼️ Image</SelectItem>
                                    <SelectItem value="typing">⌨️ Typing</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[#f0f6fc] text-xs font-medium">Delay (ms)</Label>
                                <Input
                                  type="number"
                                  value={newOfflineMessage.delay}
                                  onChange={(e) => setNewOfflineMessage(prev => ({ ...prev, delay: parseInt(e.target.value) }))}
                                  className="bg-[#21262d] border-[#30363d] h-8 text-[#f0f6fc]"
                                />
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <Textarea
                                placeholder="Enter your message content here..."
                                value={newOfflineMessage.content}
                                onChange={(e) => setNewOfflineMessage(prev => ({ ...prev, content: e.target.value }))}
                                className="bg-[#21262d] border-[#30363d] flex-1 text-[#f0f6fc] focus:border-[#238636] focus:ring-[#238636]/20"
                                rows={2}
                              />
                              <Button
                                onClick={addMessage}
                                disabled={!newOfflineMessage.content.trim()}
                                className="bg-[#238636] hover:bg-[#2ea043] px-6 border border-[#30363d] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-between items-center pt-4 border-t border-[#21262d]">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setIsPreviewMode(true)}
                                className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#f0f6fc]"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Live Preview
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(currentOfflineStory, null, 2));
                                  toast({ title: "Story copied to clipboard" });
                                }}
                                className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#f0f6fc]"
                              >
                                <Code className="h-4 w-4 mr-2" />
                                Copy JSON
                              </Button>
                            </div>
                            <div className="text-xs text-[#7d8590] flex items-center space-x-4">
                              <span>{currentOfflineStory.messages?.length || 0} messages</span>
                              <span>•</span>
                              <span>Last updated: {new Date(currentOfflineStory.updated).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Preview Mode */
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-center mb-4 p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                            <h4 className="text-[#f0f6fc] text-lg font-semibold flex items-center">
                              <Eye className="w-5 h-5 mr-2 text-[#0969da]" />
                              Live Preview - {currentOfflineStory.title}
                            </h4>
                            <Button
                              variant="outline"
                              onClick={() => setIsPreviewMode(false)}
                              className="bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-[#f0f6fc]"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Back to Editor
                            </Button>
                          </div>
                          
                          <div className="flex-1 max-w-sm mx-auto">
                            {/* Phone Mockup with cursor.com styling */}
                            <div className="bg-[#0d1117] rounded-[2.5rem] p-4 border-4 border-[#21262d] shadow-2xl">
                              {/* Phone Header */}
                              <div className="bg-[#161b22] rounded-t-lg p-3 flex items-center justify-between border-b border-[#21262d]">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-[#0969da] to-[#6f42c1] rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white text-sm font-bold">A</span>
                                  </div>
                                  <div>
                                    <div className="text-[#f0f6fc] text-sm font-semibold">Alex</div>
                                    <div className="text-[#238636] text-xs flex items-center">
                                      <div className="w-2 h-2 bg-[#238636] rounded-full mr-1 animate-pulse"></div>
                                      Online
                                    </div>
                                  </div>
                                </div>
                                <div className="text-[#7d8590] text-xs">
                                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                              
                              {/* Messages Area */}
                              <div className="bg-[#0c0e13] rounded-b-lg p-4 h-80 overflow-y-auto border border-[#21262d]">
                                <div className="space-y-3">
                                  {currentOfflineStory.messages?.slice(0, previewIndex + 1).map((message: any, index: number) => (
                                    <div 
                                      key={message.id}
                                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                                      style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                      <div 
                                        className={`rounded-2xl p-3 max-w-xs shadow-lg ${
                                          message.sender === 'user' 
                                            ? 'bg-[#0969da] text-white' 
                                            : 'bg-[#21262d] text-[#f0f6fc] border border-[#30363d]'
                                        }`}
                                      >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                        <div className="text-xs opacity-70 mt-1 flex justify-between items-center">
                                          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                          {message.sender === 'user' && (
                                            <span className="text-blue-200">✓✓</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Input Area */}
                              <div className="bg-[#161b22] p-4 flex items-center space-x-3 border-t border-[#21262d]">
                                <div className="flex-1 bg-[#21262d] rounded-full px-4 py-2 border border-[#30363d]">
                                  <span className="text-[#7d8590] text-sm">Type a message...</span>
                                </div>
                                <Button size="sm" className="rounded-full w-10 h-10 p-0 bg-[#0969da] hover:bg-[#0860ca]">
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-6 text-center">
                              <div className="flex justify-center space-x-3 mb-3">
                                <Button
                                  size="sm"
                                  onClick={() => setPreviewIndex(Math.max(0, previewIndex - 1))}
                                  disabled={previewIndex === 0}
                                  className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#f0f6fc]"
                                >
                                  Previous
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setPreviewIndex(Math.min(currentOfflineStory.messages.length - 1, previewIndex + 1))}
                                  disabled={previewIndex >= currentOfflineStory.messages.length - 1}
                                  className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#f0f6fc]"
                                >
                                  Next
                                </Button>
                              </div>
                              <div className="text-sm text-[#7d8590] bg-[#161b22] px-3 py-1 rounded-full inline-block border border-[#21262d]">
                                Message {previewIndex + 1} of {currentOfflineStory.messages?.length || 0}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="mb-6">
                        <div className="w-24 h-24 mx-auto mb-4 bg-[#161b22] rounded-full flex items-center justify-center border border-[#21262d]">
                          <MessageCircle className="w-12 h-12 text-[#30363d]" />
                        </div>
                        <h3 className="text-xl font-semibold text-[#f0f6fc] mb-2">No Story Selected</h3>
                        <p className="text-[#7d8590] mb-8 max-w-md mx-auto">
                          Create a new story or select an existing one from the sidebar to start building your interactive chat experience with our cursor.com-inspired editor
                        </p>
                      </div>
                      <Button onClick={createOfflineStory} className="bg-[#238636] hover:bg-[#2ea043] border border-[#30363d] px-6 py-3 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Story
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Other tabs remain the same but with cursor.com styling */}
          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#f0f6fc] mb-4">Dashboard Overview</h3>
              <p className="text-[#7d8590]">Analytics and overview will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#f0f6fc] mb-4">Users Management</h3>
              <p className="text-[#7d8590]">User management features will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#f0f6fc] mb-4">Analytics Dashboard</h3>
              <p className="text-[#7d8590]">Analytics and insights will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#f0f6fc] mb-4">Stories Management</h3>
              <p className="text-[#7d8590]">Story management features will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-[#f0f6fc] mb-4">System Settings</h3>
              <p className="text-[#7d8590]">Configuration and settings will be here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}