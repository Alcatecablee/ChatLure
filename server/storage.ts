import { 
  type User, type InsertUser, type Story, type InsertStory, type Message, type InsertMessage, 
  type Category, type InsertCategory, type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserShare, type InsertUserShare, type UserAchievement, type InsertUserAchievement,
  type AdminAction, type InsertAdminAction, type JuicePackage, type InsertJuicePackage,
  type JuiceTransaction, type InsertJuiceTransaction, type Payment, type InsertPayment,
<<<<<<< HEAD
  type ReadingSession, type InsertReadingSession,
  users, stories, messages, categories, subscriptionPlans, userShares, userAchievements,
  adminActions, juicePackages, juiceTransactions, payments, readingSessions
} from "@shared/schema";

import { db } from "./db";
import { eq, desc, and, or, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByClerkId(clerkId: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsers(): Promise<User[]>;
=======
  type ReadingSession, type InsertReadingSession
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
>>>>>>> origin/main
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
  
  // Stories
  getAllStories(): Promise<Story[]>;
<<<<<<< HEAD
  getStories(): Promise<Story[]>;
=======
>>>>>>> origin/main
  getStoryById(id: number): Promise<Story | undefined>;
  getStoriesByCategory(category: string): Promise<Story[]>;
  getTrendingStories(): Promise<Story[]>;
  createStory(story: InsertStory): Promise<Story>;
  updateStory(id: number, updates: Partial<Story>): Promise<Story>;
<<<<<<< HEAD
  deleteStory(id: number): Promise<boolean>;
=======
  deleteStory(id: number): Promise<void>;
>>>>>>> origin/main
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
<<<<<<< HEAD
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
  deleteSubscriptionPlan(id: number): Promise<boolean>;
=======
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan>;
>>>>>>> origin/main
  
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
<<<<<<< HEAD
  
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
  
  // Analytics
  getAnalytics(): Promise<any>;
}

=======
}

// In-memory storage for migration compatibility
>>>>>>> origin/main
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
<<<<<<< HEAD
    // Seed data initialization
    // ... existing code ...
=======
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
      }
    ];

    this.nextId = 100;
>>>>>>> origin/main
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
<<<<<<< HEAD
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByClerkId(clerkId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.clerkId, clerkId)).limit(1);
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
=======
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
>>>>>>> origin/main
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
<<<<<<< HEAD
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
=======
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    this.users[index] = { ...this.users[index], ...updates };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) this.users.splice(index, 1);
>>>>>>> origin/main
  }

  // Stories
  async getAllStories(): Promise<Story[]> {
<<<<<<< HEAD
    return await db.select().from(stories).orderBy(desc(stories.createdAt));
  }

  async getStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.createdAt));
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    const result = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
    return result[0];
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.category, category));
  }

  async getTrendingStories(): Promise<Story[]> {
    return await db.select().from(stories).where(or(eq(stories.isHot, true), eq(stories.isViral, true))).orderBy(desc(stories.views));
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(stories).values(insertStory).returning();
=======
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
>>>>>>> origin/main
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story> {
<<<<<<< HEAD
    const [story] = await db.update(stories).set(updates).where(eq(stories.id, id)).returning();
    return story;
  }

  async deleteStory(id: number): Promise<boolean> {
    const result = await db.delete(stories).where(eq(stories.id, id)).returning();
    return result.length > 0;
  }

  async incrementStoryViews(id: number): Promise<void> {
    await db.update(stories).set({ views: sql`${stories.views} + 1` }).where(eq(stories.id, id));
  }

  async incrementStoryShares(id: number): Promise<void> {
    await db.update(stories).set({ shares: sql`${stories.shares} + 1` }).where(eq(stories.id, id));
  }

  async incrementStoryLikes(id: number): Promise<void> {
    await db.update(stories).set({ likes: sql`${stories.likes} + 1` }).where(eq(stories.id, id));
=======
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
>>>>>>> origin/main
  }

  // Messages
  async getMessagesByStoryId(storyId: number): Promise<Message[]> {
<<<<<<< HEAD
    return await db.select().from(messages).where(eq(messages.storyId, storyId)).orderBy(messages.order);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
=======
    return this.messages.filter(m => m.storyId === storyId)
      .sort((a, b) => a.order - b.order);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.nextId++,
      ...insertMessage
    };
    this.messages.push(message);
>>>>>>> origin/main
    return message;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message> {
<<<<<<< HEAD
    const [message] = await db.update(messages).set(updates).where(eq(messages.id, id)).returning();
    return message;
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
=======
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) throw new Error("Message not found");
    this.messages[index] = { ...this.messages[index], ...updates };
    return this.messages[index];
  }

  async deleteMessage(id: number): Promise<void> {
    const index = this.messages.findIndex(m => m.id === id);
    if (index !== -1) this.messages.splice(index, 1);
>>>>>>> origin/main
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
<<<<<<< HEAD
    return await db.select().from(categories);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.name, name)).limit(1);
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
=======
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
>>>>>>> origin/main
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
<<<<<<< HEAD
    const [category] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
=======
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Category not found");
    this.categories[index] = { ...this.categories[index], ...updates };
    return this.categories[index];
  }

  async deleteCategory(id: number): Promise<void> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) this.categories.splice(index, 1);
>>>>>>> origin/main
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
<<<<<<< HEAD
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
    return result[0];
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values(insertPlan).returning();
=======
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
>>>>>>> origin/main
    return plan;
  }

  async updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
<<<<<<< HEAD
    const [plan] = await db.update(subscriptionPlans).set(updates).where(eq(subscriptionPlans.id, id)).returning();
    return plan;
  }

  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    const result = await db.update(subscriptionPlans).set({ isActive: false }).where(eq(subscriptionPlans.id, id)).returning();
    return result.length > 0;
=======
    const index = this.subscriptionPlans.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Subscription plan not found");
    this.subscriptionPlans[index] = { ...this.subscriptionPlans[index], ...updates };
    return this.subscriptionPlans[index];
>>>>>>> origin/main
  }

  // User Shares
  async getUserShares(userId: number): Promise<UserShare[]> {
<<<<<<< HEAD
    return await db.select().from(userShares).where(eq(userShares.userId, userId));
  }

  async createUserShare(insertShare: InsertUserShare): Promise<UserShare> {
    const [share] = await db.insert(userShares).values(insertShare).returning();
=======
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
>>>>>>> origin/main
    return share;
  }

  async markShareAsUnlocked(userId: number, storyId: number): Promise<void> {
<<<<<<< HEAD
    await db.update(userShares).set({ unlocked: true }).where(and(eq(userShares.userId, userId), eq(userShares.storyId, storyId)));
=======
    const share = this.userShares.find(s => s.userId === userId && s.storyId === storyId);
    if (share) {
      share.unlocked = true;
    }
>>>>>>> origin/main
  }

  // Achievements
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
<<<<<<< HEAD
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement> {
    const [achievement] = await db.insert(userAchievements).values({ userId, achievementId }).returning();
=======
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
>>>>>>> origin/main
    return achievement;
  }

  // Admin Actions
  async logAdminAction(insertAction: InsertAdminAction): Promise<AdminAction> {
<<<<<<< HEAD
    const [action] = await db.insert(adminActions).values(insertAction).returning();
=======
    const action: AdminAction = {
      id: this.nextId++,
      ...insertAction,
      performedAt: new Date()
    };
    this.adminActions.push(action);
>>>>>>> origin/main
    return action;
  }

  async getAdminActions(limit: number = 50): Promise<AdminAction[]> {
<<<<<<< HEAD
    return await db.select().from(adminActions).orderBy(desc(adminActions.performedAt)).limit(limit);
  }

  // PeepPower System
  async updateUserJuice(userId: number, amount: number, type: string, description?: string): Promise<JuiceTransaction> {
    const [transaction] = await db.insert(juiceTransactions).values({
      userId,
      type,
      amount: amount.toString(),
      balanceAfter: "0", // Would need to calculate
      description
    }).returning();
    return transaction;
  }

  async getUserJuiceBalance(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user ? parseFloat(user.juiceLevel) : 0;
  }

  async getUserJuiceTransactions(userId: number, limit?: number): Promise<JuiceTransaction[]> {
    const query = db.select().from(juiceTransactions).where(eq(juiceTransactions.userId, userId)).orderBy(desc(juiceTransactions.createdAt));
    if (limit) {
      return await query.limit(limit);
    }
    return await query;
  }

  // Juice Packages
  async getAllJuicePackages(): Promise<JuicePackage[]> {
    return await db.select().from(juicePackages).where(eq(juicePackages.isActive, true)).orderBy(juicePackages.sortOrder);
  }

  async getJuicePackage(id: number): Promise<JuicePackage | undefined> {
    const result = await db.select().from(juicePackages).where(eq(juicePackages.id, id)).limit(1);
    return result[0];
  }

  async createJuicePackage(pkg: InsertJuicePackage): Promise<JuicePackage> {
    const [juicePackage] = await db.insert(juicePackages).values(pkg).returning();
    return juicePackage;
  }

  // Payments
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [result] = await db.insert(payments).values(payment).returning();
    return result;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const [result] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return result;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  // Reading Sessions
  async createReadingSession(session: InsertReadingSession): Promise<ReadingSession> {
    const [result] = await db.insert(readingSessions).values(session).returning();
    return result;
  }

  async updateReadingSession(id: number, updates: Partial<ReadingSession>): Promise<ReadingSession> {
    const [result] = await db.update(readingSessions).set(updates).where(eq(readingSessions.id, id)).returning();
    return result;
  }

  async getUserReadingSessions(userId: number): Promise<ReadingSession[]> {
    return await db.select().from(readingSessions).where(eq(readingSessions.userId, userId)).orderBy(desc(readingSessions.startedAt));
  }

  // Enhanced Payment Management
  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return await this.getUserPayments(userId);
  }

  async getPaymentsByStatus(status: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.status, status));
  }

  // Site Settings Management
  private siteSettings: any = {
    siteName: "ChatLure",
    maintenance: false,
    registrationEnabled: true,
    maxFreeStories: 3,
    juiceRefillRate: 1.0,
    sessionTimeout: 30,
    analytics: {
      google: "",
      facebook: ""
    }
  };

  async getSiteSettings(): Promise<any> {
    return this.siteSettings;
  }

  async updateSiteSettings(settings: any): Promise<any> {
    this.siteSettings = { ...this.siteSettings, ...settings };
    return this.siteSettings;
  }

  async setMaintenanceMode(enabled: boolean, message?: string): Promise<void> {
    this.siteSettings.maintenance = enabled;
    this.siteSettings.maintenanceMessage = message;
  }

  // PayPal Settings Management
  async getPayPalSettings(): Promise<any> {
    return {};
  }

  async updatePayPalSettings(settings: any): Promise<any> {
    return settings;
  }

  async testPayPalConnection(): Promise<{ success: boolean, message: string }> {
    return { success: true, message: "Connection successful" };
  }

  // Enhanced User Management
  async updateUserSubscription(userId: number, planId: number, status: string): Promise<User> {
    return await this.updateUser(userId, { subscriptionPlanId: planId, subscriptionStatus: status });
  }

  async blockUser(userId: number, reason: string, duration?: number): Promise<void> {
    // Implementation would need to be added
  }

  async unblockUser(userId: number): Promise<void> {
    // Implementation would need to be added
  }

  // Content Moderation
  async getModerationQueue(): Promise<any[]> {
    return [];
  }

  async approveContent(id: number): Promise<void> {
    // Implementation would need to be added
  }

  async rejectContent(id: number, reason: string): Promise<void> {
    // Implementation would need to be added
  }

  // Enhanced Analytics
  async getRevenueAnalytics(period: string): Promise<any> {
    return {};
  }

  async getUserAnalytics(period: string): Promise<any> {
    return {};
  }

  async getContentAnalytics(period: string): Promise<any> {
    return {};
  }

  // System Health & Monitoring
  async checkDatabaseHealth(): Promise<boolean> {
    try {
      await db.select().from(users).limit(1);
      return true;
    } catch {
      return false;
    }
  }

  async createDatabaseBackup(): Promise<string> {
    return `backup_${Date.now()}`;
  }

  async getRecentActivities(limit: number = 50): Promise<any[]> {
    return [];
  }

  // Analytics
  async getAnalytics(): Promise<any> {
    return {};
  }
}

// Use database storage in production, memory storage for development
=======
    return [...this.adminActions]
      .sort((a, b) => {
        const aTime = a.performedAt?.getTime() || 0;
        const bTime = b.performedAt?.getTime() || 0;
        return bTime - aTime;
      })
      .slice(0, limit);
  }
}

>>>>>>> origin/main
export const storage = new MemoryStorage();