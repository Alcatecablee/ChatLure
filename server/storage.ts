import { 
  type User, type InsertUser, type Story, type InsertStory, type Message, type InsertMessage, 
  type Category, type InsertCategory, type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserShare, type InsertUserShare, type UserAchievement, type InsertUserAchievement,
  type AdminAction, type InsertAdminAction, type JuicePackage, type InsertJuicePackage,
  type JuiceTransaction, type InsertJuiceTransaction, type Payment, type InsertPayment,
  type ReadingSession, type InsertReadingSession
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Stories
  getAllStories(): Promise<Story[]>;
  getStoryById(id: number): Promise<Story | undefined>;
  getStoriesByCategory(category: string): Promise<Story[]>;
  getTrendingStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<Story>): Promise<Story>;
  deleteStory(id: number): Promise<void>;
  incrementStoryViews(id: number): Promise<void>;
  incrementStoryShares(id: number): Promise<void>;
  incrementStoryLikes(id: number): Promise<void>;
  
  // Messages
  getMessagesByStoryId(storyId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: number, updates: Partial<Message>): Promise<Message>;
  deleteMessage(id: number): Promise<void>;
  
  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, updates: Partial<Category>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  
  // Subscription Plans
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
  
  // User Shares
  getUserShares(userId: number): Promise<UserShare[]>;
  createUserShare(share: InsertUserShare): Promise<UserShare>;
  markShareAsUnlocked(userId: number, storyId: number): Promise<void>;
  
  // Achievements
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement>;
  
  // Admin Actions
  logAdminAction(action: InsertAdminAction): Promise<AdminAction>;
  getAdminActions(limit?: number): Promise<AdminAction[]>;
  
  // PeepPower System
  updateUserJuice(userId: number, amount: number, type: string, description?: string): Promise<JuiceTransaction>;
  getUserJuiceBalance(userId: number): Promise<number>;
  getUserJuiceTransactions(userId: number, limit?: number): Promise<JuiceTransaction[]>;
  
  // Juice Packages
  getAllJuicePackages(): Promise<JuicePackage[]>;
  getJuicePackage(id: number): Promise<JuicePackage | undefined>;
  createJuicePackage(pkg: InsertJuicePackage): Promise<JuicePackage>;
  
  // Payments
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment>;
  getUserPayments(userId: number): Promise<Payment[]>;
  
  // Reading Sessions
  createReadingSession(session: InsertReadingSession): Promise<ReadingSession>;
  updateReadingSession(id: number, updates: Partial<ReadingSession>): Promise<ReadingSession>;
  getUserReadingSessions(userId: number): Promise<ReadingSession[]>;
  
  // Enhanced Payment Management
  getAllPayments(): Promise<Payment[]>;
  getPaymentsByUser(userId: number): Promise<Payment[]>;
  getPaymentsByStatus(status: string): Promise<Payment[]>;
  
  // Site Settings Management
  getSiteSettings(): Promise<any>;
  updateSiteSettings(settings: any): Promise<any>;
  setMaintenanceMode(enabled: boolean, message?: string): Promise<void>;
  
  // PayPal Settings Management
  getPayPalSettings(): Promise<any>;
  updatePayPalSettings(settings: any): Promise<any>;
  testPayPalConnection(): Promise<{ success: boolean, message: string }>;
  
  // Enhanced User Management
  updateUserSubscription(userId: number, planId: number, status: string): Promise<User>;
  blockUser(userId: number, reason: string, duration?: number): Promise<void>;
  unblockUser(userId: number): Promise<void>;
  
  // Content Moderation
  getModerationQueue(): Promise<any[]>;
  approveContent(id: number): Promise<void>;
  rejectContent(id: number, reason: string): Promise<void>;
  
  // Enhanced Analytics
  getRevenueAnalytics(period: string): Promise<any>;
  getUserAnalytics(period: string): Promise<any>;
  getContentAnalytics(period: string): Promise<any>;
  
  // System Health & Monitoring
  checkDatabaseHealth(): Promise<boolean>;
  createDatabaseBackup(): Promise<string>;
  getRecentActivities(limit: number): Promise<any[]>;
}

// In-memory storage for migration compatibility
export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private stories: Story[] = [];
  private messages: Message[] = [];
  private categories: Category[] = [];
  private subscriptionPlans: SubscriptionPlan[] = [];
  private userShares: UserShare[] = [];
  private userAchievements: UserAchievement[] = [];
  private adminActions: AdminAction[] = [];
  private juicePackages: JuicePackage[] = [];
  private juiceTransactions: JuiceTransaction[] = [];
  private payments: Payment[] = [];
  private readingSessions: ReadingSession[] = [];
  private nextId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed some initial data for the app to work
    this.categories = [
      { id: 1, name: "Mystery", emoji: "🔍", count: 15, color: "#8B5CF6" },
      { id: 2, name: "Romance", emoji: "💖", count: 23, color: "#EC4899" },
      { id: 3, name: "Adventure", emoji: "🗺️", count: 12, color: "#059669" },
      { id: 4, name: "Horror", emoji: "👻", count: 8, color: "#DC2626" }
    ];

    const now = new Date();
    this.stories = [
      {
        id: 1,
        title: "The Missing Phone",
        description: "A mysterious text conversation that changes everything",
        category: "Mystery",
        imageUrl: "https://images.unsplash.com/photo-1512446816042-444d641267d4?w=400",
        views: 1250,
        shares: 89,
        likes: 234,
        isHot: true,
        isNew: false,
        isViral: false,
        difficulty: "medium",
        duration: 15,
        hasAudio: false,
        hasImages: true,
        cliffhangerLevel: 8,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        title: "Love at First Text",
        description: "When a wrong number leads to true love",
        category: "Romance",
        imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400",
        views: 2341,
        shares: 156,
        likes: 567,
        isHot: false,
        isNew: true,
        isViral: true,
        difficulty: "easy",
        duration: 12,
        hasAudio: true,
        hasImages: false,
        cliffhangerLevel: 6,
        createdAt: now,
        updatedAt: now
      }
    ];

    this.messages = [
      {
        id: 1,
        storyId: 1,
        content: "Hey, did you find my phone? I left it at the coffee shop downtown and I'm really hoping someone turned it in. It has all my work files and personal photos on it.",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 1
      },
      {
        id: 2,
        storyId: 1,
        content: "I think you have the wrong number... I didn't find any phone. But wait, what coffee shop are you talking about?",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 2
      },
      {
        id: 3,
        storyId: 1,
        content: "Oh no! Sorry about that. It's the one on Fifth Street next to the bookstore. I was sitting by the window around 2 PM today. The phone has a blue case with a small crack on the back.",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 3
      },
      {
        id: 4,
        storyId: 1,
        content: "Actually, I work at that coffee shop! I just got off my shift. Let me check with my manager if anyone turned in a phone today. What's your name?",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 4
      },
      {
        id: 5,
        storyId: 1,
        content: "Really?! What are the odds? My name is Sarah. I was wearing a red jacket and I think I ordered a caramel latte. I'm so nervous about losing all my photos from my trip to Europe last month.",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 5
      },
      {
        id: 6,
        storyId: 1,
        content: "Wait a minute... Sarah with the red jacket? I remember you! You left a tip in our jar and smiled at me. I'm checking the lost and found now...",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 6
      },
      {
        id: 7,
        storyId: 1,
        content: "Yes, that was me! You were so sweet, you drew a little heart on my cup. Please tell me you found it! I'm literally pacing around my apartment right now.",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 7
      },
      {
        id: 8,
        storyId: 1,
        content: "I found it! Blue case with a crack, just like you said. But here's the thing... I've been hoping to text you ever since that day but didn't have your number. Maybe losing your phone was fate?",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 8
      },
      {
        id: 9,
        storyId: 1,
        content: "Oh my god, are you serious right now? You've been thinking about me too? I was actually hoping to see you again but was too shy to ask for your number. This is unbelievable!",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 9
      },
      {
        id: 10,
        storyId: 1,
        content: "I know this might sound crazy, but would you like to grab dinner sometime? I can bring your phone back then. Unless you think I'm being too forward... I just felt this connection when I saw you.",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 10
      },
      // Messages for Story 2: "Love at First Text"
      {
        id: 11,
        storyId: 2,
        content: "Hi! I think I got your number from my friend Emma? She said you might be interested in tutoring for organic chemistry? I'm really struggling with my upcoming exam 😅",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 1
      },
      {
        id: 12,
        storyId: 2,
        content: "I think there might be some confusion... I'm not a tutor and I don't know anyone named Emma. You might have the wrong number!",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 2
      },
      {
        id: 13,
        storyId: 2,
        content: "Oh no! I'm so embarrassed 🙈 Sorry for bothering you! Emma must have given me the wrong number. I guess I'll have to figure out chemistry on my own lol",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 3
      },
      {
        id: 14,
        storyId: 2,
        content: "Wait, don't worry about it! I actually did take organic chemistry a few years ago. What specific topics are you struggling with? Maybe I can help point you in the right direction!",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 4
      },
      {
        id: 15,
        storyId: 2,
        content: "Really?! You're so kind! I'm having trouble with stereochemistry and reaction mechanisms. My professor explains things so fast and I get lost 😭",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 5
      },
      {
        id: 16,
        storyId: 2,
        content: "Oh I remember those! They're tricky but once you get the hang of it, it clicks. Have you tried drawing out the molecules step by step? Visual learning really helps with stereochemistry.",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 6
      },
      {
        id: 17,
        storyId: 2,
        content: "I tried but I think I'm doing it wrong 😅 You seem to really know your stuff! Are you in grad school or something? And thank you so much for helping a random stranger!",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 7
      },
      {
        id: 18,
        storyId: 2,
        content: "I'm actually a biochemist now! And honestly, helping you is making my day better. Work was pretty stressful today. What's your major? And don't worry, we've all been there with organic chem!",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 8
      },
      {
        id: 19,
        storyId: 2,
        content: "Wow, a biochemist! That's so cool! I'm pre-med, hoping to get into medical school next year. This chemistry grade could make or break my GPA though 😰 What kind of research do you do?",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 9
      },
      {
        id: 20,
        storyId: 2,
        content: "Pre-med! That's awesome. I work on protein folding research - basically trying to understand how proteins get their shapes. And don't stress too much about one grade, med schools look at the whole picture. You seem dedicated!",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 10
      },
      {
        id: 21,
        storyId: 2,
        content: "That sounds fascinating! You're making me feel so much better about everything. I can't believe a wrong number led to meeting someone so kind and smart. Is it weird that I'm actually glad Emma gave me the wrong number? 😊",
        isIncoming: true,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 11
      },
      {
        id: 22,
        storyId: 2,
        content: "Not weird at all! I'm glad she did too. You seem really sweet and determined. I have an idea - would you like to meet up for coffee sometime? I could bring some of my old organic chem notes and we could go over them together?",
        isIncoming: false,
        timestamp: new Date().toISOString(),
        hasReadReceipt: true,
        order: 12
      }
    ];

    this.nextId = 100;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const now = new Date();
    const user: User = {
      id: this.nextId++,
      ...insertUser,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      isAdmin: false,
      subscriptionTier: insertUser.subscriptionTier || "free",
      subscriptionExpiresAt: insertUser.subscriptionExpiresAt || null,
      storiesRead: 0,
      storiesShared: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveAt: now,
      createdAt: now,
      updatedAt: now
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) this.users.splice(index, 1);
  }

  // Stories
  async getAllStories(): Promise<Story[]> {
    return [...this.stories].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    return this.stories.find(s => s.id === id);
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    return this.stories.filter(s => s.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getTrendingStories(): Promise<Story[]> {
    return [...this.stories]
      .sort((a, b) => (b.views + b.shares) - (a.views + a.shares))
      .slice(0, 10);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const now = new Date();
    const story: Story = {
      id: this.nextId++,
      ...insertStory,
      views: 0,
      shares: 0,
      likes: 0,
      createdAt: now,
      updatedAt: now
    };
    this.stories.push(story);
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story> {
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Story not found");
    this.stories[index] = { ...this.stories[index], ...updates };
    return this.stories[index];
  }

  async deleteStory(id: number): Promise<void> {
    const index = this.stories.findIndex(s => s.id === id);
    if (index !== -1) this.stories.splice(index, 1);
  }

  async incrementStoryViews(id: number): Promise<void> {
    const story = await this.getStoryById(id);
    if (story) {
      story.views += 1;
    }
  }

  async incrementStoryShares(id: number): Promise<void> {
    const story = await this.getStoryById(id);
    if (story) {
      story.shares += 1;
    }
  }

  async incrementStoryLikes(id: number): Promise<void> {
    const story = await this.getStoryById(id);
    if (story) {
      story.likes += 1;
    }
  }

  // Messages
  async getMessagesByStoryId(storyId: number): Promise<Message[]> {
    return this.messages.filter(m => m.storyId === storyId)
      .sort((a, b) => a.order - b.order);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.nextId++,
      ...insertMessage
    };
    this.messages.push(message);
    return message;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message> {
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Message not found");
    this.messages[index] = { ...this.messages[index], ...updates };
    return this.messages[index];
  }

  async deleteMessage(id: number): Promise<void> {
    const index = this.messages.findIndex(m => m.id === id);
    if (index !== -1) this.messages.splice(index, 1);
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    return this.categories.find(c => c.name === name);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      id: this.nextId++,
      ...insertCategory,
      count: 0
    };
    this.categories.push(category);
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  async deleteCategory(id: number): Promise<void> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) this.categories.splice(index, 1);
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return [...this.subscriptionPlans];
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.find(p => p.id === id);
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const plan: SubscriptionPlan = {
      id: this.nextId++,
      ...insertPlan
    };
    this.subscriptionPlans.push(plan);
    return plan;
  }

  async updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const index = this.subscriptionPlans.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Subscription plan not found");
    this.subscriptionPlans[index] = { ...this.subscriptionPlans[index], ...updates };
    return this.subscriptionPlans[index];
  }

  // User Shares
  async getUserShares(userId: number): Promise<UserShare[]> {
    return this.userShares.filter(s => s.userId === userId);
  }

  async createUserShare(insertShare: InsertUserShare): Promise<UserShare> {
    const share: UserShare = {
      id: this.nextId++,
      ...insertShare,
      sharedAt: new Date(),
      unlocked: false
    };
    this.userShares.push(share);
    return share;
  }

  async markShareAsUnlocked(userId: number, storyId: number): Promise<void> {
    const share = this.userShares.find(s => s.userId === userId && s.storyId === storyId);
    if (share) {
      share.unlocked = true;
    }
  }

  // Achievements
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return this.userAchievements.filter(a => a.userId === userId);
  }

  async unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement> {
    const achievement: UserAchievement = {
      id: this.nextId++,
      userId,
      achievementId,
      unlockedAt: new Date()
    };
    this.userAchievements.push(achievement);
    return achievement;
  }

  // Admin Actions
  async logAdminAction(insertAction: InsertAdminAction): Promise<AdminAction> {
    const action: AdminAction = {
      id: this.nextId++,
      ...insertAction,
      performedAt: new Date()
    };
    this.adminActions.push(action);
    return action;
  }

  async getAdminActions(limit: number = 50): Promise<AdminAction[]> {
    return [...this.adminActions]
      .sort((a, b) => {
        const aTime = a.performedAt?.getTime() || 0;
        const bTime = b.performedAt?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }

  // PeepPower System
  async updateUserJuice(userId: number, amount: number, type: string, description?: string): Promise<JuiceTransaction> {
    const transaction: JuiceTransaction = {
      id: this.nextId++,
      userId,
      amount,
      type,
      description,
      createdAt: new Date()
    };
    this.juiceTransactions.push(transaction);
    return transaction;
  }

  async getUserJuiceBalance(userId: number): Promise<number> {
    return this.juiceTransactions.filter(t => t.userId === userId).reduce((total, t) => total + t.amount, 0);
  }

  async getUserJuiceTransactions(userId: number, limit?: number): Promise<JuiceTransaction[]> {
    return this.juiceTransactions.filter(t => t.userId === userId).slice(0, limit || 50);
  }

  // Juice Packages
  async getAllJuicePackages(): Promise<JuicePackage[]> {
    return [...this.juicePackages];
  }

  async getJuicePackage(id: number): Promise<JuicePackage | undefined> {
    return this.juicePackages.find(p => p.id === id);
  }

  async createJuicePackage(pkg: InsertJuicePackage): Promise<JuicePackage> {
    const juicePackageObj: JuicePackage = {
      id: this.nextId++,
      ...pkg,
      createdAt: new Date()
    };
    this.juicePackages.push(juicePackageObj);
    return juicePackageObj;
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const paymentObj: Payment = {
      id: this.nextId++,
      ...payment,
      createdAt: new Date()
    };
    this.payments.push(paymentObj);
    return paymentObj;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Payment not found");
    
    this.payments[index] = { ...this.payments[index], ...updates, updatedAt: new Date() };
    return this.payments[index];
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return this.payments.filter(p => p.userId === userId);
  }

  // Reading Sessions
  async createReadingSession(session: InsertReadingSession): Promise<ReadingSession> {
    const readingSession: ReadingSession = {
      id: this.nextId++,
      ...session,
      createdAt: new Date()
    };
    this.readingSessions.push(readingSession);
    return readingSession;
  }

  async updateReadingSession(id: number, updates: Partial<ReadingSession>): Promise<ReadingSession> {
    const index = this.readingSessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Reading session not found");
    this.readingSessions[index] = { ...this.readingSessions[index], ...updates };
    return this.readingSessions[index];
  }

  async getUserReadingSessions(userId: number): Promise<ReadingSession[]> {
    return this.readingSessions.filter(s => s.userId === userId);
  }

  // Enhanced Payment Management
  async getAllPayments(): Promise<Payment[]> {
    return [...this.payments];
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return this.payments.filter(payment => payment.userId === userId);
  }

  async getPaymentsByStatus(status: string): Promise<Payment[]> {
    return this.payments.filter(payment => payment.status === status);
  }

  // Site Settings Management
  private siteSettings: any = {
    siteName: "ChatLure",
    tagline: "Peek. Obsess. Repeat.",
    maintenance: false,
    registrationEnabled: true,
    maxFreeStories: 3,
    juiceRefillRate: 1.0,
    moderationEnabled: true,
    paypal: {
      enabled: false,
      clientId: "",
      clientSecret: "",
      environment: "sandbox",
      webhookId: ""
    }
  };

  async getSiteSettings(): Promise<any> {
    return { ...this.siteSettings };
  }

  async updateSiteSettings(settings: any): Promise<any> {
    this.siteSettings = { ...this.siteSettings, ...settings, lastUpdated: new Date() };
    return this.siteSettings;
  }

  async setMaintenanceMode(enabled: boolean, message?: string): Promise<void> {
    this.siteSettings.maintenance = enabled;
    this.siteSettings.maintenanceMessage = message;
  }

  // PayPal Settings Management
  async getPayPalSettings(): Promise<any> {
    return this.siteSettings.paypal;
  }

  async updatePayPalSettings(settings: any): Promise<any> {
    this.siteSettings.paypal = { ...this.siteSettings.paypal, ...settings };
    
    // Reinitialize PayPal service with new settings
    const { paypalService } = await import('./paypal-service');
    await paypalService.reinitialize();
    
    return this.siteSettings.paypal;
  }

  async testPayPalConnection(): Promise<{ success: boolean, message: string }> {
    try {
      const { paypalService } = await import('./paypal-service');
      return await paypalService.testConnection();
    } catch (error) {
      return { success: false, message: 'PayPal service not available' };
    }
  }

  // Enhanced User Management
  async updateUserSubscription(userId: number, planId: number, status: string): Promise<User> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");

    user.subscriptionPlanId = planId;
    user.subscriptionStatus = status;
    if (status === 'active') {
      user.subscriptionStartedAt = new Date();
      user.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }
    user.updatedAt = new Date();

    return user;
  }

  private blockedUsers: Set<number> = new Set();

  async blockUser(userId: number, reason: string, duration?: number): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");

    this.blockedUsers.add(userId);
    
    // Log admin action
    await this.logAdminAction({
      adminId: 1, // This would be the actual admin ID in a real implementation
      action: "block_user",
      targetType: "user",
      targetId: userId,
      details: { reason, duration }
    });
  }

  async unblockUser(userId: number): Promise<void> {
    this.blockedUsers.delete(userId);
    
    await this.logAdminAction({
      adminId: 1,
      action: "unblock_user",
      targetType: "user",
      targetId: userId,
      details: {}
    });
  }

  // Content Moderation
  private moderationQueue: any[] = [];

  async getModerationQueue(): Promise<any[]> {
    // Simulate moderation queue items
    return [
      {
        id: 1,
        type: "story",
        contentId: 1,
        reportReason: "inappropriate",
        reportedBy: "user_123",
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        type: "message",
        contentId: 5,
        reportReason: "spam",
        reportedBy: "user_456",
        status: "pending",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ];
  }

  async approveContent(id: number): Promise<void> {
    await this.logAdminAction({
      adminId: 1,
      action: "approve_content",
      targetType: "moderation",
      targetId: id,
      details: {}
    });
  }

  async rejectContent(id: number, reason: string): Promise<void> {
    await this.logAdminAction({
      adminId: 1,
      action: "reject_content",
      targetType: "moderation",
      targetId: id,
      details: { reason }
    });
  }

  // Enhanced Analytics
  async getRevenueAnalytics(period: string): Promise<any> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const periodPayments = this.payments.filter(p => 
      p.createdAt >= startDate && p.status === 'completed'
    );

    const totalRevenue = periodPayments.reduce((sum, p) => sum + p.amount, 0);
    const transactionCount = periodPayments.length;
    const averageOrder = transactionCount > 0 ? totalRevenue / transactionCount : 0;

    return {
      period,
      totalRevenue: totalRevenue / 100, // Convert to dollars
      transactionCount,
      averageOrderValue: averageOrder / 100,
      revenueGrowth: Math.random() * 20 + 5, // Simulated growth percentage
      topPaymentMethods: [
        { method: 'PayPal', count: Math.floor(transactionCount * 0.7), revenue: totalRevenue * 0.7 },
        { method: 'Credit Card', count: Math.floor(transactionCount * 0.3), revenue: totalRevenue * 0.3 }
      ]
    };
  }

  async getUserAnalytics(period: string): Promise<any> {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => {
      const lastActive = u.lastActiveAt || new Date(0);
      return (Date.now() - lastActive.getTime()) < 7 * 24 * 60 * 60 * 1000; // Active in last 7 days
    }).length;

    const premiumUsers = this.users.filter(u => u.subscriptionStatus === 'active').length;

    return {
      period,
      totalUsers,
      activeUsers,
      premiumUsers,
      conversionRate: totalUsers > 0 ? (premiumUsers / totalUsers * 100).toFixed(2) : 0,
      userGrowth: Math.random() * 15 + 2, // Simulated growth
      averageSessionDuration: Math.floor(Math.random() * 20 + 10), // Minutes
      retentionRate: Math.floor(Math.random() * 30 + 60), // Percentage
      topCountries: [
        { country: 'United States', users: Math.floor(totalUsers * 0.4) },
        { country: 'United Kingdom', users: Math.floor(totalUsers * 0.2) },
        { country: 'Canada', users: Math.floor(totalUsers * 0.15) },
        { country: 'Australia', users: Math.floor(totalUsers * 0.1) },
        { country: 'Other', users: Math.floor(totalUsers * 0.15) }
      ]
    };
  }

  async getContentAnalytics(period: string): Promise<any> {
    const totalStories = this.stories.length;
    const totalViews = this.stories.reduce((sum, s) => sum + s.views, 0);
    const totalLikes = this.stories.reduce((sum, s) => sum + s.likes, 0);
    const totalShares = this.stories.reduce((sum, s) => sum + s.shares, 0);

    return {
      period,
      totalStories,
      totalViews,
      totalLikes,
      totalShares,
      averageViewsPerStory: totalStories > 0 ? Math.floor(totalViews / totalStories) : 0,
      engagementRate: totalViews > 0 ? ((totalLikes + totalShares) / totalViews * 100).toFixed(2) : 0,
      topCategories: this.categories.map(cat => ({
        name: cat.name,
        stories: this.stories.filter(s => s.category === cat.name).length,
        totalViews: this.stories.filter(s => s.category === cat.name).reduce((sum, s) => sum + s.views, 0)
      })).sort((a, b) => b.totalViews - a.totalViews),
      viralStories: this.stories.filter(s => s.isViral).length,
      averageReadingTime: Math.floor(Math.random() * 10 + 5) // Minutes
    };
  }

  // System Health & Monitoring
  async checkDatabaseHealth(): Promise<boolean> {
    // Simulate database health check
    return true;
  }

  async createDatabaseBackup(): Promise<string> {
    const backupId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await this.logAdminAction({
      adminId: 1,
      action: "create_backup",
      targetType: "system",
      targetId: 0,
      details: { backupId }
    });

    return backupId;
  }

  private activities: any[] = [];

  async getRecentActivities(limit: number = 50): Promise<any[]> {
    // Generate some sample activities
    const sampleActivities = [
      {
        id: 1,
        type: 'user_registration',
        description: 'New user registered: sarah_123',
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        severity: 'info'
      },
      {
        id: 2,
        type: 'payment_completed',
        description: 'PayPal payment completed: $12.99',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        severity: 'success'
      },
      {
        id: 3,
        type: 'story_viral',
        description: 'Story "College Drama" went viral',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        severity: 'info'
      },
      {
        id: 4,
        type: 'moderation_alert',
        description: 'Content flagged for review',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        severity: 'warning'
      },
      {
        id: 5,
        type: 'system_backup',
        description: 'Database backup completed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        severity: 'success'
      }
    ];

    return sampleActivities.slice(0, limit);
  }
}

export const storage = new MemoryStorage();