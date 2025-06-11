import { useQuery } from "@tanstack/react-query";
<<<<<<< HEAD
import { MessageCircle, Flame, Eye, Share2, Bookmark, ArrowRight, Rocket, Smartphone } from "lucide-react";
=======
import { MessageCircle, Flame, Eye, Share2, Bookmark, ArrowRight, Rocket } from "lucide-react";
>>>>>>> origin/main
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import StoryCard from "@/components/story-card";
import StoryTeaser from "@/components/story-teaser";
<<<<<<< HEAD
import PhoneModal from "@/components/phone-modal";
=======
import ChatSimulator from "@/components/chat-simulator";
>>>>>>> origin/main
import SocialShare from "@/components/social-share";
import ViralChallenge from "@/components/viral-challenge";
import StreakCounter from "@/components/streak-counter";
import { formatNumber, getCategoryGradient } from "@/lib/utils";
import type { Story, Category } from "@shared/schema";

export default function Home() {
  const { data: trendingStories, isLoading: storiesLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories/trending"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* Hero Section */}
<<<<<<< HEAD
      <section className="relative overflow-hidden fade-in">
        <div className="relative bg-background px-4 py-16 md:py-24 border-b border-border">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground animate-in slide-in-from-bottom-8 duration-1000">
              ChatLure
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-destructive animate-in slide-in-from-bottom-8 duration-1000 delay-200">
              Peek. Obsess. Repeat.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-1000 delay-400">
              Dive into the addictive world of secret chats. Watch hyper-realistic conversations unfold with drama, scandal, and explosive cliffhangers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-600">
              <Link href="/chat/1">
                <Button 
                  size="lg" 
                  className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 btn-primary"
=======
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        <div className="relative bg-gradient-to-br from-surface via-background to-surface px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-text-secondary to-text-muted bg-clip-text text-transparent">
              ChatLure
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-destructive">
              Peek. Obsess. Repeat.
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Dive into the addictive world of secret chats. Watch hyper-realistic conversations unfold with drama, scandal, and explosive cliffhangers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/chat/1">
                <Button 
                  size="lg" 
                  className="px-8 py-4 bg-gradient-to-r from-primary to-accent-blue hover:from-accent-blue hover:to-primary rounded-xl text-primary-foreground font-semibold text-lg shadow-xl transform hover:scale-105 transition-all"
>>>>>>> origin/main
                >
                  <Flame className="mr-2 h-5 w-5" />
                  Start Watching
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
<<<<<<< HEAD
                className="px-8 py-4 border-2 border-border hover:border-primary text-foreground rounded-xl font-semibold text-lg transition-all duration-200 bg-transparent hover:bg-surface btn-secondary"
=======
                className="px-8 py-4 border-2 border-border hover:border-primary text-foreground rounded-xl font-semibold text-lg transition-colors bg-transparent hover:bg-surface"
>>>>>>> origin/main
                onClick={() => {
                  const element = document.querySelector('#featured-stories') as HTMLElement;
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Share2 className="mr-2 h-5 w-5" />
                Browse Stories
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Teasers */}
<<<<<<< HEAD
      <section id="featured-stories" className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h3 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Flame className="mr-3 h-10 w-10 text-destructive animate-pulse" />
=======
      <section id="featured-stories" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Flame className="mr-3 h-10 w-10 text-destructive" />
>>>>>>> origin/main
              🔥 Viral Stories Everyone's Obsessing Over
            </h3>
            <p className="text-xl text-muted-foreground">Carefully crafted to trigger curiosity and spark viral sharing</p>
          </div>
          
          {storiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
<<<<<<< HEAD
                <Card key={i} className="card-enhanced skeleton animate-pulse">
=======
                <Card key={i} className="bg-card border-border animate-pulse">
>>>>>>> origin/main
                  <div className="h-48 bg-surface rounded-t-2xl"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-surface rounded mb-2"></div>
                    <div className="h-3 bg-surface rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-surface rounded w-16"></div>
                      <div className="h-3 bg-surface rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingStories?.map((story, index) => (
<<<<<<< HEAD
                <div key={story.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <StoryTeaser 
                    story={story} 
                    size={index === 0 ? "large" : "medium"}
                    showPreview={story.isViral}
                  />
                </div>
=======
                <StoryTeaser 
                  key={story.id} 
                  story={story} 
                  size={index === 0 ? "large" : "medium"}
                  showPreview={story.isViral}
                />
>>>>>>> origin/main
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Demo Section */}
<<<<<<< HEAD
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 text-foreground fade-in">Experience the Thrill</h3>
          <p className="text-muted-foreground mb-8 text-lg fade-in">Watch a conversation unfold right now. Feel your heart race as secrets are revealed...</p>
          
          <div className="glass-effect rounded-2xl p-8 border border-border shadow-2xl fade-in">
            <div className="text-center space-y-6">
              <div className="mx-auto w-32 h-32 bg-surface rounded-2xl flex items-center justify-center border border-border shadow-lg">
                <Smartphone className="w-16 h-16 text-primary" />
              </div>
              
              <div>
                <h4 className="text-xl font-bold text-foreground mb-2">Live Chat Preview</h4>
                <p className="text-muted-foreground mb-6">Click to peek into someone's private messages...</p>
                
                <PhoneModal 
                  storyId={1} 
                  triggerText="👀 Start Peeking"
                  trigger={
                    <Button 
                      size="lg" 
                      className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <Smartphone className="mr-2 h-5 w-5" />
                      👀 Start Peeking
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-xl border border-border card-enhanced hover:scale-105 transition-all duration-300">
              <Flame className="w-8 h-8 text-destructive mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">Real-Time Drama</h4>
              <p className="text-muted-foreground text-sm">Watch messages appear with authentic typing delays and realistic conversation flow</p>
            </div>
            <div className="bg-surface p-6 rounded-xl border border-border card-enhanced hover:scale-105 transition-all duration-300">
              <Share2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">Viral Sharing</h4>
              <p className="text-muted-foreground text-sm">Share shocking moments to unlock endings and spread the obsession</p>
            </div>
            <div className="bg-surface p-6 rounded-xl border border-border card-enhanced hover:scale-105 transition-all duration-300">
              <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-foreground mb-2">Addictive Voyeurism</h4>
              <p className="text-muted-foreground text-sm">Feel like you're secretly peeking into someone's private conversations</p>
=======
      <section className="py-16 px-4 bg-gradient-to-b from-[var(--dark-bg)] to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 text-white">Experience the Thrill</h3>
          <p className="text-gray-300 mb-8 text-lg">Watch a conversation unfold right now. Feel your heart race as secrets are revealed...</p>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <ChatSimulator storyId={1} />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 p-6 rounded-xl border border-red-500/20">
              <Flame className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Real-Time Drama</h4>
              <p className="text-gray-400 text-sm">Watch messages appear with authentic typing delays and realistic conversation flow</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 rounded-xl border border-purple-500/20">
              <Share2 className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Viral Sharing</h4>
              <p className="text-gray-400 text-sm">Share shocking moments to unlock endings and spread the obsession</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 p-6 rounded-xl border border-green-500/20">
              <Eye className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Addictive Voyeurism</h4>
              <p className="text-gray-400 text-sm">Feel like you're secretly peeking into someone's private conversations</p>
>>>>>>> origin/main
            </div>
          </div>
        </div>
      </section>

      {/* Viral Challenges */}
      <ViralChallenge />

      {/* Categories */}
<<<<<<< HEAD
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground fade-in">Explore by Category</h3>
=======
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Explore by Category</h3>
>>>>>>> origin/main
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
<<<<<<< HEAD
                <div key={i} className="card-enhanced skeleton animate-pulse rounded-2xl p-6">
                  <div className="h-12 w-12 bg-surface rounded mx-auto mb-4"></div>
                  <div className="h-4 bg-surface rounded mb-2"></div>
                  <div className="h-3 bg-surface rounded"></div>
=======
                <div key={i} className="bg-gray-700 rounded-2xl p-6 animate-pulse">
                  <div className="h-12 w-12 bg-gray-600 rounded mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-600 rounded"></div>
>>>>>>> origin/main
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
<<<<<<< HEAD
              {categories?.map((category, index) => (
                <Link key={category.id} href={`/category/${category.name.toLowerCase()}`}>
                  <Card 
                    className="card-enhanced hover-scale cursor-pointer fade-in bg-surface border border-border"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{category.emoji}</div>
                      <h4 className="text-foreground font-semibold mb-2">{category.name}</h4>
                      <p className="text-muted-foreground text-sm">{formatNumber(category.count)} stories</p>
=======
              {categories?.map((category) => (
                <Link key={category.id} href={`/category/${category.name.toLowerCase()}`}>
                  <Card className={`bg-gradient-to-br ${getCategoryGradient(category.name)} hover:scale-105 transition-all cursor-pointer`}>
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-3">{category.emoji}</div>
                      <h4 className="text-white font-semibold mb-2">{category.name}</h4>
                      <p className="text-gray-300 text-sm">{formatNumber(category.count)} stories</p>
>>>>>>> origin/main
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Social Proof */}
<<<<<<< HEAD
      <section className="py-16 px-4 bg-background border-y border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 text-foreground fade-in">Join the Viral Revolution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center fade-in">
              <div className="text-4xl font-bold text-primary mb-2">2.3M+</div>
              <p className="text-muted-foreground">Active Watchers</p>
            </div>
            <div className="text-center fade-in" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold text-destructive mb-2">15M+</div>
              <p className="text-muted-foreground">Stories Shared</p>
            </div>
            <div className="text-center fade-in" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-muted-foreground">Drama Stories</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden glass-effect shadow-2xl fade-in">
            <img 
              src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
              alt="People sharing stories"
              className="w-full h-64 object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center p-6">
              <Link href="/chat/1">
                <Button size="lg" className="btn-primary px-8 py-3 text-lg font-semibold hover:scale-105 transition-all duration-200">
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </Link>
=======
      <section className="py-16 px-4 bg-gradient-to-r from-[var(--whatsapp)]/10 to-[var(--whatsapp-dark)]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8">Join the Viral Revolution</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--whatsapp)] mb-2">2.3M+</div>
              <p className="text-gray-400">Active Watchers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--dramatic)] mb-2">15M+</div>
              <p className="text-gray-400">Stories Shared</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[var(--highlight)] mb-2">50K+</div>
              <p className="text-gray-400">Drama Stories</p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400" 
              alt="Group of people looking shocked at their phones showing dramatic chat conversations" 
              className="w-full h-64 object-cover" 
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-white mb-4">Ready to get obsessed?</h4>
                <Button 
                  size="lg"
                  className="px-8 py-4 bg-[var(--whatsapp)] hover:bg-[var(--whatsapp-dark)] text-white font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
              </div>
>>>>>>> origin/main
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
<<<<<<< HEAD
      <footer className="bg-background py-12 px-4 border-t border-border">
=======
      <footer className="bg-gray-900 py-12 px-4">
>>>>>>> origin/main
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
<<<<<<< HEAD
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <MessageCircle className="text-primary-foreground text-lg" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground">ChatLure</h4>
                  <p className="text-sm text-muted-foreground">Peek. Obsess. Repeat.</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">Dive into the addictive world of secret chats and viral storytelling.</p>
=======
                <div className="w-10 h-10 bg-gradient-to-r from-[var(--whatsapp)] to-[var(--whatsapp-dark)] rounded-xl flex items-center justify-center">
                  <MessageCircle className="text-white text-lg" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">ChatLure</h4>
                  <p className="text-sm text-gray-400">Peek. Obsess. Repeat.</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">Dive into the addictive world of secret chats and viral storytelling.</p>
>>>>>>> origin/main
              <SocialShare />
            </div>
            
            <div>
<<<<<<< HEAD
              <h5 className="text-foreground font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-muted-foreground">
                {categories?.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.name.toLowerCase()}`} className="hover:text-primary transition-colors">
=======
              <h5 className="text-white font-semibold mb-4">Categories</h5>
              <ul className="space-y-2 text-gray-400">
                {categories?.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <Link href={`/category/${category.name.toLowerCase()}`} className="hover:text-[var(--whatsapp)] transition-colors">
>>>>>>> origin/main
                      {category.emoji} {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
<<<<<<< HEAD
              <h5 className="text-foreground font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
=======
              <h5 className="text-white font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-[var(--whatsapp)] transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-[var(--whatsapp)] transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-[var(--whatsapp)] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[var(--whatsapp)] transition-colors">Terms of Service</a></li>
>>>>>>> origin/main
              </ul>
            </div>
          </div>
          
<<<<<<< HEAD
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">&copy; 2024 ChatLure. All rights reserved. Get ready to be obsessed.</p>
=======
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 ChatLure. All rights reserved. Get ready to be obsessed.</p>
>>>>>>> origin/main
          </div>
        </div>
      </footer>

      {/* Floating Social Share Bar (Mobile) */}
<<<<<<< HEAD
      <div className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-sm border-t border-border p-4 md:hidden z-40">
        <div className="flex items-center justify-between">
          <span className="text-foreground font-medium text-sm">Share the drama!</span>
=======
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)]/95 backdrop-blur-sm border-t border-gray-700 p-4 md:hidden z-40">
        <div className="flex items-center justify-between">
          <span className="text-white font-medium text-sm">Share the drama!</span>
>>>>>>> origin/main
          <SocialShare compact />
        </div>
      </div>

      {/* Streak Counter */}
      <StreakCounter />
    </div>
  );
}
