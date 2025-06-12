import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  views: integer("views").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  isHot: integer("is_hot", { mode: 'boolean' }).default(false).notNull(),
  isNew: integer("is_new", { mode: 'boolean' }).default(false).notNull(),
  isViral: integer("is_viral", { mode: 'boolean' }).default(false).notNull(),
  difficulty: text("difficulty").default("easy").notNull(), // easy, medium, hard
  duration: integer("duration").default(5).notNull(), // minutes
  hasAudio: integer("has_audio", { mode: 'boolean' }).default(false).notNull(),
  hasImages: integer("has_images", { mode: 'boolean' }).default(false).notNull(),
  cliffhangerLevel: integer("cliffhanger_level").default(3).notNull(), // 1-5
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  storyId: integer("story_id").notNull(),
  content: text("content").notNull(),
  isIncoming: integer("is_incoming", { mode: 'boolean' }).default(true).notNull(),
  timestamp: text("timestamp").notNull(),
  hasReadReceipt: integer("has_read_receipt", { mode: 'boolean' }).default(false).notNull(),
  order: integer("order").notNull(),
});

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
  username: text("username").notNull(),
  email: text("email"),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: integer("is_admin", { mode: 'boolean' }).default(false).notNull(),
  juiceLevel: text("juice_level").default("75").notNull(),
  maxJuiceLevel: text("max_juice_level").default("100").notNull(),
  lastJuiceRefill: text("last_juice_refill").notNull().default(new Date().toISOString()),
  subscriptionPlanId: integer("subscription_plan_id"),
  subscriptionStatus: text("subscription_status").default("free").notNull(),
  subscriptionExpiresAt: text("subscription_expires_at"),
  subscriptionRenewalDate: text("subscription_renewal_date"),
  isBlocked: integer("is_blocked", { mode: 'boolean' }).default(false).notNull(),
  blockReason: text("block_reason"),
  blockExpiresAt: text("block_expires_at"),
  totalStoriesRead: integer("total_stories_read").default(0).notNull(),
  totalJuiceSpent: text("total_juice_spent").default("0").notNull(),
  totalShares: integer("total_shares").default(0).notNull(),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by"),
  lastActiveAt: text("last_active_at"),
});

export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
  price: real("price").notNull(),
  interval: text("interval").notNull(), // monthly, yearly
  features: text("features").notNull(), // JSON array as string
  juicePerDay: integer("juice_per_day"),
  maxStoriesPerDay: integer("max_stories_per_day").notNull(),
  hasUnlimitedAccess: integer("has_unlimited_access", { mode: 'boolean' }).default(false).notNull(),
  rechargeRate: text("recharge_rate").default("normal").notNull(),
  isActive: integer("is_active", { mode: 'boolean' }).default(true).notNull(),
});

export const juicePackages = sqliteTable("juice_packages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  price: real("price").notNull(),
  isActive: integer("is_active", { mode: 'boolean' }).default(true).notNull(),
  juiceAmount: text("juice_amount").notNull(),
  bonusAmount: text("bonus_amount").default("0").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const juiceTransactions = sqliteTable("juice_transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  amount: text("amount").notNull(),
  type: text("type").notNull(), // purchase, spend, refund, bonus
  description: text("description"),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const userShares = sqliteTable("user_shares", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  platform: text("platform").notNull(), // instagram, tiktok, twitter, facebook
  sharedAt: text("shared_at").notNull().default(new Date().toISOString()),
  isUnlocked: integer("is_unlocked", { mode: 'boolean' }).default(false).notNull(),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: text("unlocked_at").notNull().default(new Date().toISOString()),
  progress: integer("progress").default(0).notNull(),
});

export const adminActions = sqliteTable("admin_actions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(), // user, story, category, etc
  targetId: integer("target_id"),
  details: text("details"), // JSON string
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD").notNull(),
  status: text("status").notNull(), // pending, completed, failed, refunded
  paymentMethod: text("payment_method").notNull(), // paypal, stripe, etc
  paymentId: text("payment_id"), // External payment ID
  planId: integer("plan_id"), // For subscription payments
  packageId: integer("package_id"), // For juice package payments
  metadata: text("metadata"), // JSON string for additional data
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const readingSessions = sqliteTable("reading_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  startedAt: text("started_at").notNull().default(new Date().toISOString()),
  endedAt: text("ended_at"),
  duration: integer("duration"), // in seconds
  progress: integer("progress").default(0).notNull(), // percentage
  completed: integer("completed", { mode: 'boolean' }).default(false).notNull(),
});

export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull(),
  value: text("value").notNull(),
  type: text("type").default("string").notNull(), // string, number, boolean, json
  description: text("description"),
  category: text("category").default("general").notNull(),
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

export const paypalSettings = sqliteTable("paypal_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  clientId: text("client_id").notNull(),
  clientSecret: text("client_secret").notNull(),
  environment: text("environment").default("sandbox").notNull(), // sandbox, production
  webhookId: text("webhook_id"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true).notNull(),
  lastTested: text("last_tested"),
  testResult: text("test_result"), // JSON string
  updatedAt: text("updated_at").notNull().default(new Date().toISOString()),
});

// Insert schemas
export const insertStorySchema = createInsertSchema(stories).omit({ id: true, createdAt: true, updatedAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true });
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertJuicePackageSchema = createInsertSchema(juicePackages).omit({ id: true, createdAt: true });
export const insertJuiceTransactionSchema = createInsertSchema(juiceTransactions).omit({ id: true, createdAt: true });
export const insertUserShareSchema = createInsertSchema(userShares).omit({ id: true, sharedAt: true });
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true, unlockedAt: true });
export const insertAdminActionSchema = createInsertSchema(adminActions).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true, updatedAt: true });
export const insertReadingSessionSchema = createInsertSchema(readingSessions).omit({ id: true, startedAt: true });
export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({ id: true, updatedAt: true });
export const insertPayPalSettingsSchema = createInsertSchema(paypalSettings).omit({ id: true, updatedAt: true });

// Types
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type JuicePackage = typeof juicePackages.$inferSelect;
export type InsertJuicePackage = z.infer<typeof insertJuicePackageSchema>;
export type JuiceTransaction = typeof juiceTransactions.$inferSelect;
export type InsertJuiceTransaction = z.infer<typeof insertJuiceTransactionSchema>;
export type UserShare = typeof userShares.$inferSelect;
export type InsertUserShare = z.infer<typeof insertUserShareSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type AdminAction = typeof adminActions.$inferSelect;
export type InsertAdminAction = z.infer<typeof insertAdminActionSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type ReadingSession = typeof readingSessions.$inferSelect;
export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type PayPalSettings = typeof paypalSettings.$inferSelect;
export type InsertPayPalSettings = z.infer<typeof insertPayPalSettingsSchema>;