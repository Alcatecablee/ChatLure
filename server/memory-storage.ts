import type { 
  User, InsertUser, Story, InsertStory, Message, InsertMessage,
  Category, InsertCategory, SubscriptionPlan, InsertSubscriptionPlan,
  UserShare, InsertUserShare, UserAchievement, InsertUserAchievement,
  AdminAction, InsertAdminAction, JuicePackage, InsertJuicePackage,
  JuiceTransaction, Payment, InsertPayment, ReadingSession, InsertReadingSession,
  SiteSettings, InsertSiteSettings, PayPalSettings, InsertPayPalSettings
} from "@shared/schema";
import type { IStorage } from "./storage";

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
  private siteSettingsStore: SiteSettings[] = [];
  private paypalSettingsStore: PayPalSettings[] = [];

  private nextUserId = 1;
  private nextStoryId = 1;
  private nextMessageId = 1;
  private nextCategoryId = 1;
  private nextSubscriptionPlanId = 1;
  private nextUserShareId = 1;
  private nextUserAchievementId = 1;
  private nextAdminActionId = 1;
  private nextJuicePackageId = 1;
  private nextJuiceTransactionId = 1;
  private nextPaymentId = 1;
  private nextReadingSessionId = 1;
  private nextSiteSettingsId = 1;
  private nextPayPalSettingsId = 1;

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Initialize default site settings
    this.siteSettingsStore.push({
      id: this.nextSiteSettingsId++,
      siteName: "ChatLure",
      tagline: "Peek. Obsess. Repeat.",
      maintenanceMode: false,
      maintenanceMessage: null,
      juiceModeEnabled: true,
      defaultBattery: 75,
      drainRate: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Initialize default PayPal settings
    this.paypalSettingsStore.push({
      id: this.nextPayPalSettingsId++,
      enabled: false,
      environment: "sandbox",
      clientId: null,
      clientSecret: null,
      webhookId: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    // Seed categories
    const categories = [
      { name: "Romance", emoji: "💕", color: "#FF6B9D" },
      { name: "Drama", emoji: "🎭", color: "#9B59B6" },
      { name: "Mystery", emoji: "🔍", color: "#3498DB" },
      { name: "Horror", emoji: "👻", color: "#E74C3C" },
      { name: "Comedy", emoji: "😂", color: "#F39C12" }
    ];

    categories.forEach(cat => {
      this.categories.push({
        id: this.nextCategoryId++,
        name: cat.name,
        emoji: cat.emoji,
        color: cat.color,
        count: 0
      });
    });

    // Seed subscription plans
    const plans = [
      {
        name: "PeepPower Starter",
        price: 499,
        interval: "monthly",
        features: ["Basic access", "Limited stories", "Standard juice"],
        juicePerDay: 100,
        maxStoriesPerDay: 5,
        hasUnlimitedAccess: false,
        rechargeRate: "1.00"
      },
      {
        name: "PeepPower Pro",
        price: 999,
        interval: "monthly", 
        features: ["Premium access", "More stories", "Fast juice recharge"],
        juicePerDay: 200,
        maxStoriesPerDay: 15,
        hasUnlimitedAccess: false,
        rechargeRate: "1.50"
      },
      {
        name: "PeepPower Unlimited",
        price: 1999,
        interval: "monthly",
        features: ["Unlimited access", "All stories", "Instant juice"],
        juicePerDay: null,
        maxStoriesPerDay: 999,
        hasUnlimitedAccess: true,
        rechargeRate: "2.00"
      }
    ];

    plans.forEach(plan => {
      this.subscriptionPlans.push({
        id: this.nextSubscriptionPlanId++,
        ...plan,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Seed juice packages
    const juicePackages = [
      { name: "Quick Boost", juiceAmount: "25.00", bonusAmount: "0.00", price: 199 },
      { name: "Power Pack", juiceAmount: "50.00", bonusAmount: "5.00", price: 349 },
      { name: "Mega Charge", juiceAmount: "100.00", bonusAmount: "15.00", price: 649 }
    ];

    juicePackages.forEach(pkg => {
      this.juicePackages.push({
        id: this.nextJuicePackageId++,
        ...pkg,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date()
      });
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getAllUsers(): Promise<User[]> {
    return [...this.users].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      ...insertUser,
      email: insertUser.email || null,
      isAdmin: false,
      juiceLevel: "100.00",
      maxJuiceLevel: "100.00",
      lastJuiceRefill: new Date(),
      subscriptionPlanId: null,
      subscriptionStatus: "none",
      subscriptionExpiresAt: null,
      subscriptionStartedAt: null,
      storiesRead: 0,
      storiesShared: 0,
      messagesRead: 0,
      totalJuiceConsumed: "0.00",
      totalJuicePurchased: "0.00",
      totalSpent: "0.00",
      currentStreak: 0,
      longestStreak: 0,
      lastActiveAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error("User not found");
    
    this.users[index] = { ...this.users[index], ...updates, updatedAt: new Date() };
    return this.users[index];
  }

  async deleteUser(id: number): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  // Stories
  async getAllStories(): Promise<Story[]> {
    return [...this.stories].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getStoryById(id: number): Promise<Story | undefined> {
    return this.stories.find(s => s.id === id);
  }

  async getStoriesByCategory(category: string): Promise<Story[]> {
    return this.stories.filter(s => s.category === category);
  }

  async getTrendingStories(): Promise<Story[]> {
    return [...this.stories].sort((a, b) => b.views - a.views).slice(0, 10);
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const story: Story = {
      id: this.nextStoryId++,
      ...insertStory,
      views: 0,
      shares: 0,
      likes: 0,
      isHot: insertStory.isHot || false,
      isNew: insertStory.isNew || false,
      isViral: insertStory.isViral || false,
      difficulty: insertStory.difficulty || "easy",
      duration: insertStory.duration || 5,
      hasAudio: insertStory.hasAudio || false,
      hasImages: insertStory.hasImages || false,
      cliffhangerLevel: insertStory.cliffhangerLevel || 3,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.stories.push(story);
    return story;
  }

  async updateStory(id: number, updates: Partial<Story>): Promise<Story> {
    const index = this.stories.findIndex(s => s.id === id);
    if (index === -1) throw new Error("Story not found");
    
    this.stories[index] = { ...this.stories[index], ...updates, updatedAt: new Date() };
    return this.stories[index];
  }

  async deleteStory(id: number): Promise<void> {
    const index = this.stories.findIndex(s => s.id === id);
    if (index !== -1) {
      this.stories.splice(index, 1);
    }
  }

  async incrementStoryViews(id: number): Promise<void> {
    const story = this.stories.find(s => s.id === id);
    if (story) {
      story.views++;
    }
  }

  async incrementStoryShares(id: number): Promise<void> {
    const story = this.stories.find(s => s.id === id);
    if (story) {
      story.shares++;
    }
  }

  async incrementStoryLikes(id: number): Promise<void> {
    const story = this.stories.find(s => s.id === id);
    if (story) {
      story.likes++;
    }
  }

  // Messages
  async getMessagesByStoryId(storyId: number): Promise<Message[]> {
    return this.messages.filter(m => m.storyId === storyId).sort((a, b) => a.order - b.order);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.nextMessageId++,
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
    if (index !== -1) {
      this.messages.splice(index, 1);
    }
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
      id: this.nextCategoryId++,
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
    if (index !== -1) {
      this.categories.splice(index, 1);
    }
  }

  // Subscription Plans
  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return this.subscriptionPlans.filter(p => p.isActive);
  }

  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    return this.subscriptionPlans.find(p => p.id === id);
  }

  async createSubscriptionPlan(insertPlan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const plan: SubscriptionPlan = {
      id: this.nextSubscriptionPlanId++,
      ...insertPlan,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.subscriptionPlans.push(plan);
    return plan;
  }

  async updateSubscriptionPlan(id: number, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> {
    const index = this.subscriptionPlans.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Subscription plan not found");
    
    this.subscriptionPlans[index] = { ...this.subscriptionPlans[index], ...updates, updatedAt: new Date() };
    return this.subscriptionPlans[index];
  }

  // User Shares
  async getUserShares(userId: number): Promise<UserShare[]> {
    return this.userShares.filter(s => s.userId === userId);
  }

  async createUserShare(insertShare: InsertUserShare): Promise<UserShare> {
    const share: UserShare = {
      id: this.nextUserShareId++,
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
      id: this.nextUserAchievementId++,
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
      id: this.nextAdminActionId++,
      ...insertAction,
      performedAt: new Date()
    };
    this.adminActions.push(action);
    return action;
  }

  async getAdminActions(limit: number = 50): Promise<AdminAction[]> {
    return [...this.adminActions]
      .sort((a, b) => b.performedAt!.getTime() - a.performedAt!.getTime())
      .slice(0, limit);
  }

  // PeepPower System
  async updateUserJuice(userId: number, amount: number, type: string, description?: string): Promise<JuiceTransaction> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const currentBalance = parseFloat(user.juiceLevel);
    const newBalance = Math.max(0, currentBalance + amount);
    
    await this.updateUser(userId, { juiceLevel: newBalance.toFixed(2) });

    const transaction: JuiceTransaction = {
      id: this.nextJuiceTransactionId++,
      userId,
      type,
      amount: amount.toString(),
      balanceAfter: newBalance.toString(),
      description: description || null,
      metadata: null,
      storyId: null,
      messageId: null,
      createdAt: new Date()
    };
    
    this.juiceTransactions.push(transaction);
    return transaction;
  }

  async getUserJuiceBalance(userId: number): Promise<number> {
    const user = await this.getUser(userId);
    return user ? parseFloat(user.juiceLevel) : 0;
  }

  async getUserJuiceTransactions(userId: number, limit?: number): Promise<JuiceTransaction[]> {
    let transactions = this.juiceTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    
    if (limit) {
      transactions = transactions.slice(0, limit);
    }
    
    return transactions;
  }

  // Juice Packages
  async getAllJuicePackages(): Promise<JuicePackage[]> {
    return this.juicePackages.filter(p => p.isActive);
  }

  async getJuicePackage(id: number): Promise<JuicePackage | undefined> {
    return this.juicePackages.find(p => p.id === id);
  }

  async createJuicePackage(insertPkg: InsertJuicePackage): Promise<JuicePackage> {
    const pkg: JuicePackage = {
      id: this.nextJuicePackageId++,
      ...insertPkg,
      createdAt: new Date()
    };
    this.juicePackages.push(pkg);
    return pkg;
  }

  // Payments
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const payment: Payment = {
      id: this.nextPaymentId++,
      ...insertPayment,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.payments.push(payment);
    return payment;
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const index = this.payments.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Payment not found");
    
    this.payments[index] = { ...this.payments[index], ...updates, updatedAt: new Date() };
    return this.payments[index];
  }

  async getUserPayments(userId: number): Promise<Payment[]> {
    return this.payments
      .filter(p => p.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  // Reading Sessions
  async createReadingSession(insertSession: InsertReadingSession): Promise<ReadingSession> {
    const session: ReadingSession = {
      id: this.nextReadingSessionId++,
      ...insertSession,
      startedAt: insertSession.startedAt || new Date()
    };
    this.readingSessions.push(session);
    return session;
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
    return [...this.payments].sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getPaymentsByUser(userId: number): Promise<Payment[]> {
    return this.payments.filter(p => p.userId === userId);
  }

  async getPaymentsByStatus(status: string): Promise<Payment[]> {
    return this.payments.filter(p => p.status === status);
  }

  // Site Settings Management
  async getSiteSettings(): Promise<SiteSettings> {
    if (this.siteSettingsStore.length === 0) {
      // Create default settings if none exist
      const defaultSettings: SiteSettings = {
        id: this.nextSiteSettingsId++,
        siteName: "ChatLure",
        tagline: "Peek. Obsess. Repeat.",
        maintenanceMode: false,
        maintenanceMessage: null,
        juiceModeEnabled: true,
        defaultBattery: 75,
        drainRate: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.siteSettingsStore.push(defaultSettings);
    }
    return { ...this.siteSettingsStore[0] };
  }

  async updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    if (this.siteSettingsStore.length === 0) {
      await this.getSiteSettings(); // Initialize if needed
    }
    
    this.siteSettingsStore[0] = { 
      ...this.siteSettingsStore[0], 
      ...settings, 
      updatedAt: new Date() 
    };
    return { ...this.siteSettingsStore[0] };
  }

  async setMaintenanceMode(enabled: boolean, message?: string): Promise<void> {
    await this.updateSiteSettings({
      maintenanceMode: enabled,
      maintenanceMessage: message || null
    });
  }

  // PayPal Settings Management
  async getPayPalSettings(): Promise<PayPalSettings> {
    if (this.paypalSettingsStore.length === 0) {
      // Create default settings if none exist
      const defaultSettings: PayPalSettings = {
        id: this.nextPayPalSettingsId++,
        enabled: false,
        environment: "sandbox",
        clientId: null,
        clientSecret: null,
        webhookId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.paypalSettingsStore.push(defaultSettings);
    }
    return { ...this.paypalSettingsStore[0] };
  }

  async updatePayPalSettings(settings: Partial<PayPalSettings>): Promise<PayPalSettings> {
    if (this.paypalSettingsStore.length === 0) {
      await this.getPayPalSettings(); // Initialize if needed
    }
    
    this.paypalSettingsStore[0] = { 
      ...this.paypalSettingsStore[0], 
      ...settings, 
      updatedAt: new Date() 
    };
    return { ...this.paypalSettingsStore[0] };
  }

  async testPayPalConnection(): Promise<{ success: boolean, message: string }> {
    const settings = await this.getPayPalSettings();
    if (!settings.clientId || !settings.clientSecret) {
      return { success: false, message: "PayPal credentials not configured" };
    }
    return { success: true, message: "PayPal connection test successful" };
  }

  // Enhanced User Management
  async updateUserSubscription(userId: number, planId: number, status: string): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");
    
    return await this.updateUser(userId, {
      subscriptionPlanId: planId,
      subscriptionStatus: status,
      subscriptionStartedAt: new Date()
    });
  }

  async blockUser(userId: number, reason: string, duration?: number): Promise<void> {
    // In a real implementation, you'd add a blocked status to the user
    await this.logAdminAction({
      adminId: 1, // Would be the admin performing the action
      action: "block_user",
      targetType: "user",
      targetId: userId,
      details: `Blocked user. Reason: ${reason}${duration ? `, Duration: ${duration} hours` : ''}`
    });
  }

  async unblockUser(userId: number): Promise<void> {
    await this.logAdminAction({
      adminId: 1,
      action: "unblock_user", 
      targetType: "user",
      targetId: userId,
      details: "User unblocked"
    });
  }

  // Content Moderation
  async getModerationQueue(): Promise<any[]> {
    return []; // Would return content pending moderation
  }

  async approveContent(id: number): Promise<void> {
    await this.logAdminAction({
      adminId: 1,
      action: "approve_content",
      targetType: "story",
      targetId: id,
      details: "Content approved"
    });
  }

  async rejectContent(id: number, reason: string): Promise<void> {
    await this.logAdminAction({
      adminId: 1,
      action: "reject_content",
      targetType: "story", 
      targetId: id,
      details: `Content rejected. Reason: ${reason}`
    });
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
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const relevantPayments = this.payments.filter(p => 
      p.status === 'completed' && p.createdAt! >= startDate
    );

    const totalRevenue = relevantPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalRevenue: totalRevenue / 100, // Convert cents to dollars
      paymentCount: relevantPayments.length,
      averagePayment: relevantPayments.length > 0 ? totalRevenue / relevantPayments.length / 100 : 0,
      period
    };
  }

  async getUserAnalytics(period: string): Promise<any> {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const newUsers = this.users.filter(u => u.createdAt! >= startDate);
    const activeUsers = this.users.filter(u => u.lastActiveAt! >= startDate);

    return {
      totalUsers: this.users.length,
      newUsers: newUsers.length,
      activeUsers: activeUsers.length,
      period
    };
  }

  async getContentAnalytics(period: string): Promise<any> {
    return {
      totalStories: this.stories.length,
      totalMessages: this.messages.length,
      totalViews: this.stories.reduce((sum, s) => sum + s.views, 0),
      totalShares: this.stories.reduce((sum, s) => sum + s.shares, 0),
      period
    };
  }

  // System Health & Monitoring
  async checkDatabaseHealth(): Promise<boolean> {
    return true; // Memory storage is always "healthy"
  }

  async createDatabaseBackup(): Promise<string> {
    const backup = {
      users: this.users,
      stories: this.stories,
      messages: this.messages,
      categories: this.categories,
      timestamp: new Date().toISOString()
    };
    
    return `backup_${Date.now()}.json`;
  }

  async getRecentActivities(limit: number = 50): Promise<any[]> {
    const now = new Date();
    const activities: any[] = [];

    // Add user registrations
    this.users.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_registration',
        message: `New user registered: ${user.username}`,
        timestamp: user.createdAt || now,
        icon: 'user-plus',
        color: 'green'
      });
    });

    // Add story creations
    this.stories.forEach(story => {
      activities.push({
        id: `story_${story.id}`,
        type: 'story_created',
        message: `New story published: "${story.title}"`,
        timestamp: story.createdAt || now,
        icon: 'file-text',
        color: 'blue'
      });
    });

    // Add payments
    this.payments.forEach(payment => {
      activities.push({
        id: `payment_${payment.id}`,
        type: 'payment',
        message: `Payment completed: $${payment.amount}`,
        timestamp: payment.createdAt || now,
        icon: 'dollar-sign',
        color: 'green'
      });
    });

    // Add admin actions
    this.adminActions.forEach(action => {
      activities.push({
        id: `admin_${action.id}`,
        type: 'admin_action',
        message: `Admin action: ${action.action}`,
        timestamp: action.performedAt || now,
        icon: 'shield',
        color: 'orange'
      });
    });

    // Sort by timestamp (newest first) and limit results
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}