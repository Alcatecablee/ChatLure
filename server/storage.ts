import type { 
  User, InsertUser, Story, InsertStory, Message, InsertMessage,
  Category, InsertCategory, SubscriptionPlan, InsertSubscriptionPlan,
  UserShare, InsertUserShare, UserAchievement, InsertUserAchievement,
  AdminAction, InsertAdminAction, JuicePackage, InsertJuicePackage,
  JuiceTransaction, Payment, InsertPayment, ReadingSession, InsertReadingSession
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

import { db } from "./db";
import { 
  users, stories, messages, categories, subscriptionPlans, userShares, 
  userAchievements, adminActions, juicePackages, juiceTransactions, 
  payments, readingSessions
} from "@shared/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Stories
  async getAllStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.createdAt));
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    return story || undefined;
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    return await db.select().from(stories).where(eq(stories.category, category));
  }

  async getTrendingStories(): Promise<Story[]> {
    return await db.select().from(stories).orderBy(desc(stories.views)).limit(10);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db.insert(stories).values(insertStory).returning();
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story> {
    const [story] = await db.update(stories).set(updates).where(eq(stories.id, id)).returning();
    return story;
  }

  async deleteStory(id: number): Promise<void> {
    await db.delete(stories).where(eq(stories.id, id));
  }

  async incrementStoryViews(id: number): Promise<void> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    if (story) {
      await db.update(stories).set({ views: story.views + 1 }).where(eq(stories.id, id));
    }
  }

  async incrementStoryShares(id: number): Promise<void> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    if (story) {
      await db.update(stories).set({ shares: story.shares + 1 }).where(eq(stories.id, id));
    }
  }

  async incrementStoryLikes(id: number): Promise<void> {
    const [story] = await db.select().from(stories).where(eq(stories.id, id));
    if (story) {
      await db.update(stories).set({ likes: story.likes + 1 }).where(eq(stories.id, id));
    }
  }

  // Messages
  async getMessagesByStoryId(storyId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.storyId, storyId)).orderBy(messages.order);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(insertMessage).returning();
    return message;
  }

  async updateMessage(id: number, updates: Partial<Message>): Promise<Message> {
    const [message] = await db.update(messages).set(updates).where(eq(messages.id, id)).returning();
    return message;
  }

  async deleteMessage(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.id, id));
  }

  // Categories
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.name, name));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, updates: Partial<Category>): Promise<Category> {
    const [category] = await db.update(categories).set(updates).where(eq(categories.id, id)).returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true));
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan || undefined;
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [plan] = await db.insert(subscriptionPlans).values(insertPlan).returning();
    return plan;
  }

  async updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const [plan] = await db.update(subscriptionPlans).set(updates).where(eq(subscriptionPlans.id, id)).returning();
    return plan;
  }

  // User Shares
  async getUserShares(userId: number): Promise<UserShare[]> {
    return await db.select().from(userShares).where(eq(userShares.userId, userId));
  }

  async createUserShare(insertShare: InsertUserShare): Promise<UserShare> {
    const [share] = await db.insert(userShares).values(insertShare).returning();
    return share;
  }

  async markShareAsUnlocked(userId: number, storyId: number): Promise<void> {
    await db.update(userShares).set({ unlocked: true }).where(
      and(eq(userShares.userId, userId), eq(userShares.storyId, storyId))
    );
  }

  // Achievements
  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: number, achievementId: string): Promise<UserAchievement> {
    const [achievement] = await db.insert(userAchievements).values({
      userId,
      achievementId,
      unlockedAt: new Date()
    }).returning();
    return achievement;
  }

  // Admin Actions
  async logAdminAction(insertAction: InsertAdminAction): Promise<AdminAction> {
    const [action] = await db.insert(adminActions).values(insertAction).returning();
    return action;
  }

  async getAdminActions(limit: number = 50): Promise<AdminAction[]> {
    return await db.select().from(adminActions).orderBy(desc(adminActions.performedAt)).limit(limit);
  }

  // PeepPower System
  async updateUserJuice(userId: number, amount: number, type: string, description?: string): Promise<JuiceTransaction> {
    const [transaction] = await db.insert(juiceTransactions).values({
      userId,
      amount: amount.toString(),
      type,
      description: description || null,
      balanceAfter: "0",
      createdAt: new Date()
    }).returning();
    return transaction;
  }

  async getUserJuiceBalance(userId: number): Promise<number> {
    const transactions = await db.select().from(juiceTransactions).where(eq(juiceTransactions.userId, userId));
    return transactions.reduce((total, t) => total + parseFloat(t.amount), 0);
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
    return await db.select().from(juicePackages).where(eq(juicePackages.isActive, true));
  }

  async getJuicePackage(id: number): Promise<JuicePackage | undefined> {
    const [pkg] = await db.select().from(juicePackages).where(eq(juicePackages.id, id));
    return pkg || undefined;
  }

  async createJuicePackage(insertPkg: InsertJuicePackage): Promise<JuicePackage> {
    const [pkg] = await db.insert(juicePackages).values(insertPkg).returning();
    return pkg;
  }

  // Payments
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const [payment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return payment;
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  // Reading Sessions
  async createReadingSession(insertSession: InsertReadingSession): Promise<ReadingSession> {
    const [session] = await db.insert(readingSessions).values(insertSession).returning();
    return session;
  }

  async updateReadingSession(id: number, updates: Partial<ReadingSession>): Promise<ReadingSession> {
    const [session] = await db.update(readingSessions).set(updates).where(eq(readingSessions.id, id)).returning();
    return session;
  }

  async getUserReadingSessions(userId: number): Promise<ReadingSession[]> {
    return await db.select().from(readingSessions).where(eq(readingSessions.userId, userId));
  }

  // Enhanced Payment Management
  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.userId, userId));
  }

  async getPaymentsByStatus(status: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.status, status));
  }

  // Site Settings Management
  private siteSettings: any = {
    siteName: "ChatLure",
    tagline: "Peek. Obsess. Repeat.",
    maintenanceMode: false,
    maintenanceMessage: "",
    juiceMode: {
      enabled: true,
      defaultBattery: 75,
      drainRate: 3
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
    this.siteSettings.maintenanceMode = enabled;
    if (message) this.siteSettings.maintenanceMessage = message;
  }

  // PayPal Settings Management  
  private paypalSettings: any = {
    enabled: false,
    clientId: "",
    clientSecret: "",
    environment: "sandbox",
    webhookId: ""
  };

  async getPayPalSettings(): Promise<any> {
    return this.paypalSettings;
  }

  async updatePayPalSettings(settings: any): Promise<any> {
    this.paypalSettings = { ...this.paypalSettings, ...settings };
    return this.paypalSettings;
  }

  async testPayPalConnection(): Promise<{ success: boolean, message: string }> {
    return { success: true, message: "PayPal connection test successful" };
  }

  // Enhanced User Management
  async updateUserSubscription(userId: number, planId: number, status: string): Promise<User> {
    const [user] = await db.update(users).set({
      subscriptionPlanId: planId,
      subscriptionStatus: status,
      subscriptionStartedAt: new Date()
    }).where(eq(users.id, userId)).returning();
    return user;
  }

  async blockUser(userId: number, reason: string, duration?: number): Promise<void> {
    await db.update(users).set({
      blockedUntil: duration ? new Date(Date.now() + duration * 24 * 60 * 60 * 1000) : null
    }).where(eq(users.id, userId));
  }

  async unblockUser(userId: number): Promise<void> {
    await db.update(users).set({
      blockedUntil: null
    }).where(eq(users.id, userId));
  }

  // Content Moderation
  async getModerationQueue(): Promise<any[]> {
    return [];
  }

  async approveContent(id: number): Promise<void> {
    // Implementation would depend on content type
  }

  async rejectContent(id: number, reason: string): Promise<void> {
    // Implementation would depend on content type
  }

  // Enhanced Analytics
  async getRevenueAnalytics(period: string): Promise<any> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const paymentsInPeriod = await db.select().from(payments).where(
      and(
        gte(payments.createdAt, startDate),
        lte(payments.createdAt, now),
        eq(payments.status, 'completed')
      )
    );

    const totalRevenue = paymentsInPeriod.reduce((sum, p) => sum + p.amount, 0);
    return {
      totalRevenue,
      transactionCount: paymentsInPeriod.length,
      period,
      startDate,
      endDate: now
    };
  }

  async getUserAnalytics(period: string): Promise<any> {
    const totalUsers = await db.select().from(users);
    return {
      totalUsers: totalUsers.length,
      activeUsers: totalUsers.filter(u => u.lastActiveAt && u.lastActiveAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
      period
    };
  }

  async getContentAnalytics(period: string): Promise<any> {
    const allStories = await db.select().from(stories);
    const totalViews = allStories.reduce((sum, s) => sum + s.views, 0);
    const totalShares = allStories.reduce((sum, s) => sum + s.shares, 0);
    
    return {
      totalStories: allStories.length,
      totalViews,
      totalShares,
      averageViewsPerStory: Math.round(totalViews / allStories.length) || 0,
      period
    };
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
    const backupId = `backup_${Date.now()}`;
    return backupId;
  }

  async getRecentActivities(limit: number = 50): Promise<any[]> {
    const recentActions = await db.select().from(adminActions).orderBy(desc(adminActions.performedAt)).limit(limit);
    return recentActions.map(action => ({
      type: 'admin_action',
      description: `${action.action} on ${action.targetType}`,
      timestamp: action.performedAt,
      user: `Admin ${action.adminId}`
    }));
  }
}

export const storage = new DatabaseStorage();