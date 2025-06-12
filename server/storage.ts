import type { 
  User, InsertUser, Story, InsertStory, Message, InsertMessage,
  Category, InsertCategory, SubscriptionPlan, InsertSubscriptionPlan,
  UserShare, InsertUserShare, UserAchievement, InsertUserAchievement,
  AdminAction, InsertAdminAction, JuicePackage, InsertJuicePackage,
  JuiceTransaction, Payment, InsertPayment, ReadingSession, InsertReadingSession,
  SiteSettings, PayPalSettings
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
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings>;
  setMaintenanceMode(enabled: boolean, message?: string): Promise<void>;
  
  // PayPal Settings Management
  getPayPalSettings(): Promise<PayPalSettings>;
  updatePayPalSettings(settings: Partial<PayPalSettings>): Promise<PayPalSettings>;
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

import { MemoryStorage } from "./memory-storage";

export const storage = new MemoryStorage();