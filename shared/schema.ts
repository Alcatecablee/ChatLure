import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  views: integer("views").default(0).notNull(),
  shares: integer("shares").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
  isHot: boolean("is_hot").default(false).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  isViral: boolean("is_viral").default(false).notNull(),
  difficulty: text("difficulty").default("easy").notNull(), // easy, medium, hard
  duration: integer("duration").default(5).notNull(), // minutes
  hasAudio: boolean("has_audio").default(false).notNull(),
  hasImages: boolean("has_images").default(false).notNull(),
  cliffhangerLevel: integer("cliffhanger_level").default(3).notNull(), // 1-5
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  content: text("content").notNull(),
  isIncoming: boolean("is_incoming").notNull(),
  timestamp: text("timestamp").notNull(),
  hasReadReceipt: boolean("has_read_receipt").default(false).notNull(),
  order: integer("order").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  count: integer("count").default(0).notNull(),
  color: text("color").notNull(),
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  views: true,
  shares: true,
  likes: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  count: true,
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  
  // PeepPower System
  juiceLevel: decimal("juice_level", { precision: 5, scale: 2 }).default("100.00").notNull(),
  maxJuiceLevel: decimal("max_juice_level", { precision: 5, scale: 2 }).default("100.00").notNull(),
  lastJuiceRefill: timestamp("last_juice_refill").defaultNow(),
  
  // Subscription Management
  subscriptionPlanId: integer("subscription_plan_id"),
  subscriptionStatus: text("subscription_status").default("none").notNull(), // none, active, cancelled, expired
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  subscriptionStartedAt: timestamp("subscription_started_at"),
  
  // Usage & Analytics
  storiesRead: integer("stories_read").default(0).notNull(),
  storiesShared: integer("stories_shared").default(0).notNull(),
  messagesRead: integer("messages_read").default(0).notNull(),
  totalJuiceConsumed: decimal("total_juice_consumed", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalJuicePurchased: decimal("total_juice_purchased", { precision: 10, scale: 2 }).default("0.00").notNull(),
  totalSpent: decimal("total_spent", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  // Engagement
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// PeepPower Business Features
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // PeepPower Starter, Pro, Unlimited
  price: integer("price").notNull(), // in cents
  interval: text("interval").notNull(), // monthly, yearly
  features: text("features").array().notNull(),
  juicePerDay: integer("juice_per_day"), // null means unlimited
  maxStoriesPerDay: integer("max_stories_per_day").notNull(),
  hasUnlimitedAccess: boolean("has_unlimited_access").default(false).notNull(),
  rechargeRate: decimal("recharge_rate", { precision: 3, scale: 2 }).default("1.00").notNull(), // multiplier for recharge speed
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Juice/Battery Top-up Packages
export const juicePackages = pgTable("juice_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Quick Boost, Power Pack, etc.
  juiceAmount: decimal("juice_amount", { precision: 5, scale: 2 }).notNull(),
  bonusAmount: decimal("bonus_amount", { precision: 5, scale: 2 }).default("0.00").notNull(),
  price: integer("price").notNull(), // in cents
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Juice Transactions
export const juiceTransactions = pgTable("juice_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // consumption, purchase, refill, bonus, share_reward
  amount: decimal("amount", { precision: 5, scale: 2 }).notNull(), // positive for gain, negative for consumption
  balanceAfter: decimal("balance_after", { precision: 5, scale: 2 }).notNull(),
  storyId: integer("story_id"), // if related to story reading
  messageId: integer("message_id"), // if related to specific message
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Records
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // subscription, juice_topup, paygo
  status: text("status").notNull(), // pending, completed, failed, refunded
  amount: integer("amount").notNull(), // in cents
  currency: text("currency").default("USD").notNull(),
  
  // Subscription specific
  subscriptionPlanId: integer("subscription_plan_id"),
  billingPeriodStart: timestamp("billing_period_start"),
  billingPeriodEnd: timestamp("billing_period_end"),
  
  // Juice package specific
  juicePackageId: integer("juice_package_id"),
  juiceAmount: decimal("juice_amount", { precision: 5, scale: 2 }),
  
  // Pay-as-you-go specific
  messagesCount: integer("messages_count"),
  pricePerMessage: decimal("price_per_message", { precision: 3, scale: 2 }),
  
  // Payment provider data
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  paymentMethod: text("payment_method"), // card, paypal, etc.
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User Reading Sessions
export const readingSessions = pgTable("reading_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  messagesRead: integer("messages_read").default(0).notNull(),
  juiceConsumed: decimal("juice_consumed", { precision: 5, scale: 2 }).default("0.00").notNull(),
  completed: boolean("completed").default(false).notNull(),
  sharedForContinuation: boolean("shared_for_continuation").default(false).notNull(),
});

export const userShares = pgTable("user_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  platform: text("platform").notNull(), // twitter, facebook, instagram, tiktok
  sharedAt: timestamp("shared_at").defaultNow(),
  unlocked: boolean("unlocked").default(false).notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const adminActions = pgTable("admin_actions", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(), // user, story, message, category
  targetId: integer("target_id"),
  details: text("details"),
  performedAt: timestamp("performed_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isAdmin: true,
  storiesRead: true,
  storiesShared: true,
  messagesRead: true,
  totalJuiceConsumed: true,
  totalJuicePurchased: true,
  totalSpent: true,
  currentStreak: true,
  longestStreak: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJuicePackageSchema = createInsertSchema(juicePackages).omit({
  id: true,
  createdAt: true,
});

export const insertJuiceTransactionSchema = createInsertSchema(juiceTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReadingSessionSchema = createInsertSchema(readingSessions).omit({
  id: true,
});

export const insertUserShareSchema = createInsertSchema(userShares).omit({
  id: true,
  sharedAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertAdminActionSchema = createInsertSchema(adminActions).omit({
  id: true,
  performedAt: true,
});

// Type Exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;

export type JuicePackage = typeof juicePackages.$inferSelect;
export type InsertJuicePackage = z.infer<typeof insertJuicePackageSchema>;

export type JuiceTransaction = typeof juiceTransactions.$inferSelect;
export type InsertJuiceTransaction = z.infer<typeof insertJuiceTransactionSchema>;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;

export type ReadingSession = typeof readingSessions.$inferSelect;
export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;
export type UserShare = typeof userShares.$inferSelect;
export type InsertUserShare = z.infer<typeof insertUserShareSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type AdminAction = typeof adminActions.$inferSelect;
export type InsertAdminAction = z.infer<typeof insertAdminActionSchema>;
