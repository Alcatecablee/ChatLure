import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Plus, Save, Download, Upload, Play, Pause, MessageSquare, User,
  Clock, Share2, Heart, Eye, Trash2, Edit3, Copy, Move, ChevronUp,
  ChevronDown, Smartphone, Settings, FileText, Image, Send, MoreHorizontal,
  Users, Calendar, Tag, Zap, Crown, Star, AlertCircle, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'text' | 'image' | 'typing' | 'system' | 'choice' | 'share_unlock';
  sender: 'user' | 'other' | 'system';
  content: string;
  timestamp?: number;
  delay?: number;
  imageUrl?: string;
  choices?: Array<{ id: string; text: string; nextMessageId?: string }>;
  reactions?: Array<{ emoji: string; count: number }>;
  shareRequired?: boolean;
  juiceCost?: number;
}

interface Character {
  id: string;
  name: string;
  avatar: string;
  color: string;
  description: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  characters: Character[];
  messages: Message[];
  settings: {
    autoAdvance: boolean;
    typingSpeed: number;
    backgroundMusic: string;
    theme: 'dark' | 'light' | 'auto';
    shareUnlocks: number;
    juiceRequired: number;
    premium: boolean;
  };
  metadata: {
    created: number;
    updated: number;
    version: string;
    tags: string[];
    estimatedReadTime: number;
  };
}

export default function ChatEditor() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewMessageIndex, setPreviewMessageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("editor");
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load stories from localStorage on mount
  useEffect(() => {
    const savedStories = localStorage.getItem('chatlure-stories');
    if (savedStories) {
      try {
        setStories(JSON.parse(savedStories));
      } catch (error) {
        console.error('Failed to load stories:', error);
      }
    }
  }, []);

  // Save stories to localStorage whenever stories change
  useEffect(() => {
    localStorage.setItem('chatlure-stories', JSON.stringify(stories));
  }, [stories]);

  const createNewStory = () => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: "New Story",
      description: "An engaging chat story",
      category: "Romance",
      thumbnail: "",
      characters: [
        {
          id: "user",
          name: "You",
          avatar: "👤",
          color: "#3b82f6",
          description: "The main character"
        },
        {
          id: "other",
          name: "Alex",
          avatar: "😊",
          color: "#10b981",
          description: "Your chat partner"
        }
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
        backgroundMusic: "",
        theme: "dark",
        shareUnlocks: 3,
        juiceRequired: 10,
        premium: false
      },
      metadata: {
        created: Date.now(),
        updated: Date.now(),
        version: "1.0.0",
        tags: [],
        estimatedReadTime: 5
      }
    };

    setStories(prev => [...prev, newStory]);
    setCurrentStory(newStory);
    toast({
      title: "Story Created",
      description: "New story created successfully"
    });
  };

  const duplicateStory = (story: Story) => {
    const duplicated = {
      ...story,
      id: Date.now().toString(),
      title: `${story.title} (Copy)`,
      metadata: {
        ...story.metadata,
        created: Date.now(),
        updated: Date.now()
      }
    };
    setStories(prev => [...prev, duplicated]);
    toast({
      title: "Story Duplicated",
      description: "Story has been duplicated successfully"
    });
  };

  const deleteStory = (storyId: string) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    if (currentStory?.id === storyId) {
      setCurrentStory(null);
    }
    toast({
      title: "Story Deleted",
      description: "Story has been removed"
    });
  };

  const updateStory = (updates: Partial<Story>) => {
    if (!currentStory) return;

    const updatedStory = {
      ...currentStory,
      ...updates,
      metadata: {
        ...currentStory.metadata,
        updated: Date.now()
      }
    };

    setCurrentStory(updatedStory);
    setStories(prev => prev.map(s => s.id === updatedStory.id ? updatedStory : s));
  };

  const addMessage = (type: Message['type'] = 'text') => {
    if (!currentStory) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      sender: 'other',
      content: type === 'typing' ? 'Typing...' : 'New message',
      timestamp: Date.now(),
      delay: 1000
    };

    if (type === 'choice') {
      newMessage.choices = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' }
      ];
    }

    updateStory({
      messages: [...currentStory.messages, newMessage]
    });
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    if (!currentStory) return;

    updateStory({
      messages: currentStory.messages.map(m => 
        m.id === messageId ? { ...m, ...updates } : m
      )
    });
  };

  const deleteMessage = (messageId: string) => {
    if (!currentStory) return;

    updateStory({
      messages: currentStory.messages.filter(m => m.id !== messageId)
    });
  };

  const moveMessage = (messageId: string, direction: 'up' | 'down') => {
    if (!currentStory) return;

    const messages = [...currentStory.messages];
    const index = messages.findIndex(m => m.id === messageId);
    
    if (direction === 'up' && index > 0) {
      [messages[index], messages[index - 1]] = [messages[index - 1], messages[index]];
    } else if (direction === 'down' && index < messages.length - 1) {
      [messages[index], messages[index + 1]] = [messages[index + 1], messages[index]];
    }

    updateStory({ messages });
  };

  const exportStory = () => {
    if (!currentStory) return;

    const dataStr = JSON.stringify(currentStory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentStory.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Story Exported",
      description: "Story has been downloaded as JSON file"
    });
  };

  const importStory = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedStory = JSON.parse(e.target?.result as string);
        importedStory.id = Date.now().toString();
        importedStory.title = `${importedStory.title} (Imported)`;
        importedStory.metadata.created = Date.now();
        importedStory.metadata.updated = Date.now();
        
        setStories(prev => [...prev, importedStory]);
        setCurrentStory(importedStory);
        
        toast({
          title: "Story Imported",
          description: "Story has been imported successfully"
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import story. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  // Preview functionality
  const startPreview = () => {
    setIsPreviewMode(true);
    setPreviewMessageIndex(0);
    setIsPlaying(true);
  };

  const stopPreview = () => {
    setIsPreviewMode(false);
    setIsPlaying(false);
    setPreviewMessageIndex(0);
  };

  // Auto-advance preview messages
  useEffect(() => {
    if (!isPreviewMode || !isPlaying || !currentStory) return;

    const timer = setTimeout(() => {
      if (previewMessageIndex < currentStory.messages.length - 1) {
        setPreviewMessageIndex(prev => prev + 1);
      } else {
        setIsPlaying(false);
      }
    }, currentStory.messages[previewMessageIndex]?.delay || 2000);

    return () => clearTimeout(timer);
  }, [isPreviewMode, isPlaying, previewMessageIndex, currentStory]);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat Editor</h1>
            <p className="text-muted-foreground">Create and edit interactive chat stories</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={createNewStory} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={importStory}
              className="hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Story List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Stories ({stories.length})
                </CardTitle>
                <Input
                  placeholder="Search stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-2">
                    {filteredStories.map((story) => (
                      <Card
                        key={story.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          currentStory?.id === story.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setCurrentStory(story)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{story.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {story.description}
                              </p>
                              <div className="flex items-center mt-2 space-x-2">
                                <Badge variant="secondary" className="text-xs">
                                  {story.category}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {story.messages.length} msgs
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-1 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateStory(story);
                                }}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteStory(story.id);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-3">
            {currentStory ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="editor" className="space-y-4">
                  {/* Story Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Story Details</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={startPreview}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            onClick={exportStory}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={currentStory.title}
                            onChange={(e) => updateStory({ title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={currentStory.category}
                            onValueChange={(value) => updateStory({ category: value })}
                          >
                            <SelectTrigger>
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
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={currentStory.description}
                          onChange={(e) => updateStory({ description: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Messages */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Messages ({currentStory.messages.length})</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addMessage('text')}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Text
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addMessage('image')}
                          >
                            <Image className="w-4 h-4 mr-2" />
                            Image
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addMessage('choice')}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Choice
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-3">
                          {currentStory.messages.map((message, index) => (
                            <Card
                              key={message.id}
                              className={`${
                                selectedMessageId === message.id ? 'ring-2 ring-primary' : ''
                              } hover:shadow-sm transition-all`}
                              onClick={() => setSelectedMessageId(message.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Badge variant={message.sender === 'user' ? 'default' : 'secondary'}>
                                        {message.sender}
                                      </Badge>
                                      <Badge variant="outline">
                                        {message.type}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        #{index + 1}
                                      </span>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <Select
                                          value={message.sender}
                                          onValueChange={(value: any) => updateMessage(message.id, { sender: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                          </SelectContent>
                                        </Select>
                                        
                                        <Input
                                          type="number"
                                          placeholder="Delay (ms)"
                                          value={message.delay || 1000}
                                          onChange={(e) => updateMessage(message.id, { delay: parseInt(e.target.value) })}
                                        />
                                      </div>
                                      
                                      {message.type === 'text' && (
                                        <Textarea
                                          value={message.content}
                                          onChange={(e) => updateMessage(message.id, { content: e.target.value })}
                                          placeholder="Message content..."
                                          rows={2}
                                        />
                                      )}
                                      
                                      {message.type === 'image' && (
                                        <div className="space-y-2">
                                          <Input
                                            value={message.imageUrl || ''}
                                            onChange={(e) => updateMessage(message.id, { imageUrl: e.target.value })}
                                            placeholder="Image URL..."
                                          />
                                          <Textarea
                                            value={message.content}
                                            onChange={(e) => updateMessage(message.id, { content: e.target.value })}
                                            placeholder="Caption..."
                                            rows={1}
                                          />
                                        </div>
                                      )}
                                      
                                      {message.type === 'choice' && (
                                        <div className="space-y-2">
                                          <Textarea
                                            value={message.content}
                                            onChange={(e) => updateMessage(message.id, { content: e.target.value })}
                                            placeholder="Question or prompt..."
                                            rows={2}
                                          />
                                          {message.choices?.map((choice, choiceIndex) => (
                                            <div key={choice.id} className="flex items-center space-x-2">
                                              <Input
                                                value={choice.text}
                                                onChange={(e) => {
                                                  const newChoices = [...(message.choices || [])];
                                                  newChoices[choiceIndex] = { ...choice, text: e.target.value };
                                                  updateMessage(message.id, { choices: newChoices });
                                                }}
                                                placeholder={`Choice ${choiceIndex + 1}`}
                                              />
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                  const newChoices = message.choices?.filter((_, i) => i !== choiceIndex);
                                                  updateMessage(message.id, { choices: newChoices });
                                                }}
                                              >
                                                <Trash2 className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          ))}
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              const newChoices = [...(message.choices || []), { id: Date.now().toString(), text: 'New choice' }];
                                              updateMessage(message.id, { choices: newChoices });
                                            }}
                                          >
                                            <Plus className="w-3 h-3 mr-1" />
                                            Add Choice
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col space-y-1 ml-4">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => moveMessage(message.id, 'up')}
                                      disabled={index === 0}
                                    >
                                      <ChevronUp className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => moveMessage(message.id, 'down')}
                                      disabled={index === currentStory.messages.length - 1}
                                    >
                                      <ChevronDown className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => deleteMessage(message.id)}
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="preview">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Live Preview</CardTitle>
                        <div className="flex items-center space-x-2">
                          {isPreviewMode ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsPlaying(!isPlaying)}
                              >
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={stopPreview}
                              >
                                Stop
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={startPreview}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Start Preview
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="max-w-sm mx-auto">
                        {/* Phone Frame */}
                        <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl">
                          <div className="bg-black rounded-2xl overflow-hidden">
                            {/* Phone Header */}
                            <div className="bg-gray-800 p-4 flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  😊
                                </div>
                                <div>
                                  <div className="text-white font-medium text-sm">
                                    {currentStory.characters.find(c => c.id === 'other')?.name || 'Chat Partner'}
                                  </div>
                                  <div className="text-green-400 text-xs">Online</div>
                                </div>
                              </div>
                              <MoreHorizontal className="w-5 h-5 text-gray-400" />
                            </div>
                            
                            {/* Chat Messages */}
                            <div className="h-96 bg-gray-900 p-4 overflow-y-auto">
                              <div className="space-y-3">
                                {isPreviewMode ? (
                                  currentStory.messages.slice(0, previewMessageIndex + 1).map((message, index) => (
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
                                        {message.type === 'image' && message.imageUrl && (
                                          <img
                                            src={message.imageUrl}
                                            alt="Message"
                                            className="w-full rounded-lg mb-1"
                                          />
                                        )}
                                        {message.content}
                                        {message.type === 'choice' && message.choices && (
                                          <div className="mt-2 space-y-1">
                                            {message.choices.map((choice) => (
                                              <button
                                                key={choice.id}
                                                className="block w-full text-left px-2 py-1 bg-gray-600 rounded text-xs hover:bg-gray-500"
                                              >
                                                {choice.text}
                                              </button>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-center text-gray-500 mt-20">
                                    <Smartphone className="w-12 h-12 mx-auto mb-4" />
                                    <p>Click "Start Preview" to see your story in action</p>
                                  </div>
                                )}
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
                        </div>
                        
                        {isPreviewMode && (
                          <div className="mt-4 text-center">
                            <div className="text-sm text-muted-foreground">
                              Message {previewMessageIndex + 1} of {currentStory.messages.length}
                            </div>
                            <div className="mt-2 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${((previewMessageIndex + 1) / currentStory.messages.length) * 100}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Story Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="auto-advance">Auto Advance</Label>
                            <Switch
                              id="auto-advance"
                              checked={currentStory.settings.autoAdvance}
                              onCheckedChange={(checked) => 
                                updateStory({
                                  settings: { ...currentStory.settings, autoAdvance: checked }
                                })
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="typing-speed">Typing Speed (ms)</Label>
                            <Input
                              id="typing-speed"
                              type="number"
                              value={currentStory.settings.typingSpeed}
                              onChange={(e) => 
                                updateStory({
                                  settings: { ...currentStory.settings, typingSpeed: parseInt(e.target.value) }
                                })
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="share-unlocks">Share Unlocks Required</Label>
                            <Input
                              id="share-unlocks"
                              type="number"
                              value={currentStory.settings.shareUnlocks}
                              onChange={(e) => 
                                updateStory({
                                  settings: { ...currentStory.settings, shareUnlocks: parseInt(e.target.value) }
                                })
                              }
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="juice-required">Juice Required</Label>
                            <Input
                              id="juice-required"
                              type="number"
                              value={currentStory.settings.juiceRequired}
                              onChange={(e) => 
                                updateStory({
                                  settings: { ...currentStory.settings, juiceRequired: parseInt(e.target.value) }
                                })
                              }
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="premium">Premium Story</Label>
                            <Switch
                              id="premium"
                              checked={currentStory.settings.premium}
                              onCheckedChange={(checked) => 
                                updateStory({
                                  settings: { ...currentStory.settings, premium: checked }
                                })
                              }
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select
                              value={currentStory.settings.theme}
                              onValueChange={(value: any) => 
                                updateStory({
                                  settings: { ...currentStory.settings, theme: value }
                                })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="auto">Auto</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-3">Characters</h4>
                        <div className="space-y-3">
                          {currentStory.characters.map((character) => (
                            <Card key={character.id}>
                              <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                  <Input
                                    value={character.name}
                                    onChange={(e) => {
                                      const updatedCharacters = currentStory.characters.map(c =>
                                        c.id === character.id ? { ...c, name: e.target.value } : c
                                      );
                                      updateStory({ characters: updatedCharacters });
                                    }}
                                    placeholder="Name"
                                  />
                                  <Input
                                    value={character.avatar}
                                    onChange={(e) => {
                                      const updatedCharacters = currentStory.characters.map(c =>
                                        c.id === character.id ? { ...c, avatar: e.target.value } : c
                                      );
                                      updateStory({ characters: updatedCharacters });
                                    }}
                                    placeholder="Avatar (emoji)"
                                  />
                                  <Input
                                    value={character.color}
                                    onChange={(e) => {
                                      const updatedCharacters = currentStory.characters.map(c =>
                                        c.id === character.id ? { ...c, color: e.target.value } : c
                                      );
                                      updateStory({ characters: updatedCharacters });
                                    }}
                                    placeholder="Color"
                                  />
                                  <Input
                                    value={character.description}
                                    onChange={(e) => {
                                      const updatedCharacters = currentStory.characters.map(c =>
                                        c.id === character.id ? { ...c, description: e.target.value } : c
                                      );
                                      updateStory({ characters: updatedCharacters });
                                    }}
                                    placeholder="Description"
                                  />
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="export">
                  <Card>
                    <CardHeader>
                      <CardTitle>Export & Share</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Download className="w-12 h-12 mx-auto mb-4 text-primary" />
                              <h3 className="font-medium mb-2">Export JSON</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Download your story as a JSON file for backup or sharing
                              </p>
                              <Button onClick={exportStory} className="w-full">
                                Export Story
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <Upload className="w-12 h-12 mx-auto mb-4 text-primary" />
                              <h3 className="font-medium mb-2">Import JSON</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                Import a story from a JSON file
                              </p>
                              <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full"
                              >
                                Import Story
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-3">Story Statistics</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {currentStory.messages.length}
                              </div>
                              <div className="text-sm text-muted-foreground">Messages</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {currentStory.characters.length}
                              </div>
                              <div className="text-sm text-muted-foreground">Characters</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {Math.ceil(currentStory.messages.length * 2)}
                              </div>
                              <div className="text-sm text-muted-foreground">Est. Minutes</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-primary">
                                {currentStory.messages.filter(m => m.type === 'choice').length}
                              </div>
                              <div className="text-sm text-muted-foreground">Choices</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No Story Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Create a new story or select an existing one to start editing
                  </p>
                  <Button onClick={createNewStory}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Story
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}