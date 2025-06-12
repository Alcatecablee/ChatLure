import { pgTable, text, integer, real, boolean, timestamp, serial } from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  storyId: integer("story_id").notNull(),
  content: text("content").notNull(),
  isIncoming: boolean("is_incoming").default(true).notNull(),
  timestamp: text("timestamp").notNull(),
  hasReadReceipt: boolean("has_read_receipt").default(false).notNull(),
  order: integer("order").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  username: text("username").notNull(),
  email: text("email"),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: boolean("is_admin").default(false).notNull(),
  juiceLevel: text("juice_level").default("75").notNull(),
  maxJuiceLevel: text("max_juice_level").default("100").notNull(),
  lastJuiceRefill: timestamp("last_juice_refill").notNull().defaultNow(),
  subscriptionPlanId: integer("subscription_plan_id"),
  subscriptionStatus: text("subscription_status").default("free").notNull(),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  subscriptionRenewalDate: timestamp("subscription_renewal_date"),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  blockReason: text("block_reason"),
  blockExpiresAt: timestamp("block_expires_at"),
  totalStoriesRead: integer("total_stories_read").default(0).notNull(),
  totalJuiceSpent: text("total_juice_spent").default("0").notNull(),
  totalShares: integer("total_shares").default(0).notNull(),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by"),
  lastActiveAt: timestamp("last_active_at"),
});

export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  price: real("price").notNull(),
  interval: text("interval").notNull(), // monthly, yearly
  features: text("features").notNull(), // JSON array as string
  juicePerDay: integer("juice_per_day"),
  maxStoriesPerDay: integer("max_stories_per_day").notNull(),
  hasUnlimitedAccess: boolean("has_unlimited_access").default(false).notNull(),
  rechargeRate: text("recharge_rate").default("normal").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const juicePackages = pgTable("juice_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  price: real("price").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  juiceAmount: text("juice_amount").notNull(),
  bonusAmount: text("bonus_amount").default("0").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const juiceTransactions = pgTable("juice_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: text("amount").notNull(),
  type: text("type").notNull(), // earned, spent, purchased, bonus
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  subscriptionPlanId: integer("subscription_plan_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  type: text("type").notNull(), // subscription, juice_package, one_time
  status: text("status").notNull(), // pending, completed, failed, refunded
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  juiceAmount: text("juice_amount"),
  currency: text("currency").default("USD").notNull(),
  billingPeriodStart: timestamp("billing_period_start"),
  billingPeriodEnd: timestamp("billing_period_end"),
  paypalOrderId: text("paypal_order_id"),
  paypalCaptureId: text("paypal_capture_id"),
  paypalPayerId: text("paypal_payer_id"),
  paymentMethod: text("payment_method"),
});

export const readingSessions = pgTable("reading_sessions", {
  id: serial("id").primaryKey(),
  messagesRead: integer("messages_read").default(0).notNull(),
  storyId: integer("story_id").notNull(),
  userId: integer("user_id").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  juiceConsumed: text("juice_consumed").default("0").notNull(),
  completed: boolean("completed").default(false).notNull(),
  sharedForContinuation: boolean("shared_for_continuation").default(false).notNull(),
});

export const userShares = pgTable("user_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  sharedAt: timestamp("shared_at").notNull().defaultNow(),
  unlocked: boolean("unlocked").default(false).notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").notNull().defaultNow(),
});

export const adminActions = pgTable("admin_actions", {
  id: serial("id").primaryKey(),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(), // user, story, payment, etc.
  targetId: integer("target_id"),
  details: text("details"),
  performedAt: timestamp("performed_at").notNull().defaultNow(),
});

// Insert schemas and types
export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
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
  startedAt: true,
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

// Site settings and PayPal settings tables
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").default("ChatLure").notNull(),
  tagline: text("tagline").default("Immersive Story Experience").notNull(),
  maintenanceMode: boolean("maintenance_mode").default(false).notNull(),
  maintenanceMessage: text("maintenance_message"),
  juiceModeEnabled: boolean("juice_mode_enabled").default(true).notNull(),
  defaultBattery: integer("default_battery").default(75).notNull(),
  drainRate: integer("drain_rate").default(3).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const paypalSettings = pgTable("paypal_settings", {
  id: serial("id").primaryKey(),
  enabled: boolean("enabled").default(false).notNull(),
  environment: text("environment").default("sandbox").notNull(),
  clientId: text("client_id").default("").notNull(),
  webhookId: text("webhook_id"),
  hasClientSecret: boolean("has_client_secret").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPayPalSettingsSchema = createInsertSchema(paypalSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SiteSettings = typeof siteSettings.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type PayPalSettings = typeof paypalSettings.$inferSelect;
export type InsertPayPalSettings = z.infer<typeof insertPayPalSettingsSchema>;