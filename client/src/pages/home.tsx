import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Flame, Eye, Share2, Bookmark, ArrowRight, Rocket, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import StoryCard from "@/components/story-card";
import StoryTeaser from "@/components/story-teaser";
import PhoneModal from "@/components/phone-modal";
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
      <section className="relative overflow-hidden fade-in">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface opacity-50"></div>
        <div className="absolute inset-0 bg-dot-pattern opacity-10"></div>
        
        {/* Floating Chat Bubbles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-3 border border-green-500/30">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="absolute top-32 right-16 animate-float-delayed">
            <div className="bg-blue-500/20 backdrop-blur-sm rounded-2xl p-3 border border-blue-500/30">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="absolute bottom-32 left-16 animate-bounce-slow">
            <div className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-3 border border-red-500/30">
              <Flame className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="absolute bottom-20 right-10 animate-pulse-slow">
            <div className="bg-purple-500/20 backdrop-blur-sm rounded-2xl p-3 border border-purple-500/30">
              <Share2 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="relative bg-background px-4 py-20 md:py-32 border-b border-border">
          <div className="max-w-6xl mx-auto">
            {/* Main Content */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center bg-red-500/10 border border-red-500/20 rounded-full px-6 py-2 mb-8 animate-in slide-in-from-bottom-8 duration-1000">
                <Flame className="w-4 h-4 text-red-400 mr-2 animate-pulse" />
                <span className="text-red-400 font-semibold text-sm">🔥 GOING VIRAL RIGHT NOW</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-foreground animate-in slide-in-from-bottom-8 duration-1000 delay-200">
                <span className="bg-gradient-to-r from-foreground via-primary to-destructive bg-clip-text text-transparent">
                  ChatLure
                </span>
              </h1>
              
              <div className="relative mb-8 animate-in slide-in-from-bottom-8 duration-1000 delay-400">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 text-destructive">
                  Peek. Obsess. Repeat.
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              
              <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-4 max-w-4xl mx-auto leading-relaxed animate-in slide-in-from-bottom-8 duration-1000 delay-600">
                Dive into the <span className="text-foreground font-semibold">addictive world</span> of secret chats
              </p>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-in slide-in-from-bottom-8 duration-1000 delay-800">
                Watch <span className="text-red-400 font-semibold">hyper-realistic conversations</span> unfold with drama, scandal, and explosive cliffhangers that'll keep you coming back for more
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom-8 duration-1000 delay-1000">
                <Link href="/chat/1">
                  <Button 
                    size="lg" 
                    className="px-12 py-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-2xl text-white font-bold text-xl shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-300 btn-primary group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <Flame className="mr-3 h-6 w-6 animate-pulse" />
                    👀 Start Peeking Now
                    <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-12 py-6 border-2 border-border hover:border-primary text-foreground rounded-2xl font-bold text-xl transition-all duration-300 bg-transparent hover:bg-surface btn-secondary group backdrop-blur-sm"
                  onClick={() => {
                    const element = document.querySelector('#featured-stories') as HTMLElement;
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Share2 className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Browse Stories
                </Button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center animate-in slide-in-from-bottom-8 duration-1000 delay-1200">
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-black text-primary">2.4M+</div>
                <div className="text-muted-foreground font-semibold">Addicted Users</div>
                <div className="text-sm text-muted-foreground">Can't stop peeking</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-black text-destructive">97%</div>
                <div className="text-muted-foreground font-semibold">Share Rate</div>
                <div className="text-sm text-muted-foreground">Stories go viral instantly</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-black text-green-500">45min</div>
                <div className="text-muted-foreground font-semibold">Avg Session</div>
                <div className="text-sm text-muted-foreground">Completely hooked</div>
              </div>
            </div>

            {/* Preview Cards */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-1000 delay-1400">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative bg-background/80 backdrop-blur-sm border border-red-500/20 rounded-2xl overflow-hidden hover:border-red-500/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                        <Flame className="w-6 h-6 text-red-400" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">💔 Heartbreak</div>
                        <div className="text-sm text-muted-foreground">Most addictive</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "Wait... did she just say what I think she said? OMG I can't believe this is happening..."
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-red-400 font-semibold">🔥 VIRAL</span>
                      <span className="text-xs text-muted-foreground">2.1M views</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative bg-background/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-500/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Eye className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">🕵️ Mystery</div>
                        <div className="text-sm text-muted-foreground">Mind-bending</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "The messages are getting weirder... who is this person really? Something doesn't add up..."
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-green-400 font-semibold">NEW</span>
                      <span className="text-xs text-muted-foreground">1.8M views</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Card className="relative bg-background/80 backdrop-blur-sm border border-green-500/20 rounded-2xl overflow-hidden hover:border-green-500/40 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">😂 Comedy</div>
                        <div className="text-sm text-muted-foreground">Share-worthy</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      "LMAOOO did they really just autocorrect THAT to their boss?! This is going on my story..."
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-orange-400 font-semibold">HOT</span>
                      <span className="text-xs text-muted-foreground">3.2M views</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Teasers */}
      <section id="featured-stories" className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h3 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center">
              <Flame className="mr-3 h-10 w-10 text-destructive animate-pulse" />
              🔥 Viral Stories Everyone's Obsessing Over
            </h3>
            <p className="text-xl text-muted-foreground">Carefully crafted to trigger curiosity and spark viral sharing</p>
          </div>
          
          {storiesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="card-enhanced skeleton animate-pulse">
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
                <div key={story.id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <StoryTeaser 
                    story={story} 
                    size={index === 0 ? "large" : "medium"}
                    showPreview={story.isViral}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Interactive Demo Section */}
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
            <Card className="card-enhanced bg-surface border border-border fade-in">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Immersive Experience</h4>
                <p className="text-muted-foreground text-sm">Watch messages unfold in real-time with authentic delays</p>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced bg-surface border border-border fade-in">
              <CardContent className="p-6 text-center">
                <Share2 className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Viral Sharing</h4>
                <p className="text-muted-foreground text-sm">Share to unlock plot twists and surprise endings</p>
              </CardContent>
            </Card>
            
            <Card className="card-enhanced bg-surface border border-border fade-in">
              <CardContent className="p-6 text-center">
                <Rocket className="w-8 h-8 text-primary mx-auto mb-3" />
                <h4 className="font-bold text-foreground mb-2">Addictive Content</h4>
                <p className="text-muted-foreground text-sm">Stories designed to keep you coming back for more</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in">
            <h3 className="text-3xl font-bold text-foreground mb-4">Choose Your Drama</h3>
            <p className="text-muted-foreground text-lg">Every category is designed to trigger different emotions and sharing behaviors</p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-24 bg-surface rounded"></div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((category, index) => (
                <Card 
                  key={category.id} 
                  className={`cursor-pointer hover:scale-105 transition-all duration-200 border-2 hover:border-primary fade-in ${getCategoryGradient(category.name)}`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{category.emoji}</div>
                    <h4 className="font-bold text-foreground mb-1">{category.name}</h4>
                    <p className="text-xs text-muted-foreground">{formatNumber(category.storyCount)} stories</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Viral Challenge Section */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <ViralChallenge />
        </div>
      </section>

      {/* Streak Counter */}
      <section className="py-8 px-4 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto">
          <StreakCounter />
        </div>
      </section>
    </div>
  );
}
