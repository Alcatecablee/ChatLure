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

  return (
    <div className="min-h-screen bg-[var(--page-bg)] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">ChatLure Admin Dashboard</h1>
          <p className="text-gray-400">Manage your chat stories platform</p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="chat-editor" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat Editor
            </TabsTrigger>
            <TabsTrigger value="users" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="stories" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Package className="h-4 w-4 mr-2" />
              Stories
            </TabsTrigger>
            <TabsTrigger value="moderation" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Moderation
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">Welcome to ChatLure Admin</h3>
              <p className="text-gray-400">Select a tab to get started with managing your platform</p>
            </div>
          </TabsContent>

          <TabsContent value="chat-editor" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Chat Editor</h3>
                <p className="text-gray-400">Create and edit interactive chat stories offline</p>
              </div>
              <div className="space-x-2">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
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
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const dataStr = JSON.stringify(offlineStories, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                    const linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', 'chatlure-stories.json');
                    linkElement.click();
                    toast({ title: "Stories exported successfully" });
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">Users Management</h3>
              <p className="text-gray-400">User management features will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">Analytics Dashboard</h3>
              <p className="text-gray-400">Analytics and insights will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="stories" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">Stories Management</h3>
              <p className="text-gray-400">Story management features will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">Content Moderation</h3>
              <p className="text-gray-400">Moderation tools will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">Payment Management</h3>
              <p className="text-gray-400">Payment and billing features will be here</p>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-white mb-4">System Settings</h3>
              <p className="text-gray-400">Configuration and settings will be here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}