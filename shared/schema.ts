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

export const categories = sqliteTable("categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  username: text("username").notNull(),
  email: text("email"),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  isAdmin: integer("is_admin", { mode: 'boolean' }).default(false).notNull(),
  juiceLevel: text("juice_level").default("75").notNull(),
  maxJuiceLevel: text("max_juice_level").default("100").notNull(),
  lastJuiceRefill: integer("last_juice_refill", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  subscriptionPlanId: integer("subscription_plan_id"),
  subscriptionStatus: text("subscription_status").default("free").notNull(),
  subscriptionExpiresAt: integer("subscription_expires_at", { mode: 'timestamp' }),
  subscriptionRenewalDate: integer("subscription_renewal_date", { mode: 'timestamp' }),
  isBlocked: integer("is_blocked", { mode: 'boolean' }).default(false).notNull(),
  blockReason: text("block_reason"),
  blockExpiresAt: integer("block_expires_at", { mode: 'timestamp' }),
  totalStoriesRead: integer("total_stories_read").default(0).notNull(),
  totalJuiceSpent: text("total_juice_spent").default("0").notNull(),
  totalShares: integer("total_shares").default(0).notNull(),
  referralCode: text("referral_code"),
  referredBy: integer("referred_by"),
  lastActiveAt: integer("last_active_at", { mode: 'timestamp' }),
});

export const subscriptionPlans = sqliteTable("subscription_plans", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
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
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
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
  type: text("type").notNull(), // earned, spent, purchased, bonus
  description: text("description"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  subscriptionPlanId: integer("subscription_plan_id"),
  createdAt: integer("created_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  type: text("type").notNull(), // subscription, juice_package, one_time
  status: text("status").notNull(), // pending, completed, failed, refunded
  userId: integer("user_id").notNull(),
  amount: real("amount").notNull(),
  juiceAmount: text("juice_amount"),
  currency: text("currency").default("USD").notNull(),
  billingPeriodStart: integer("billing_period_start", { mode: 'timestamp' }),
  billingPeriodEnd: integer("billing_period_end", { mode: 'timestamp' }),
  paypalOrderId: text("paypal_order_id"),
  paypalCaptureId: text("paypal_capture_id"),
  paypalPayerId: text("paypal_payer_id"),
  paymentMethod: text("payment_method"),
});

export const readingSessions = sqliteTable("reading_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  messagesRead: integer("messages_read").default(0).notNull(),
  storyId: integer("story_id").notNull(),
  userId: integer("user_id").notNull(),
  startedAt: integer("started_at", { mode: 'timestamp' }).$defaultFn(() => new Date()),
  endedAt: integer("ended_at", { mode: 'timestamp' }),
  juiceConsumed: text("juice_consumed").default("0").notNull(),
  completed: integer("completed", { mode: 'boolean' }).default(false).notNull(),
  sharedForContinuation: integer("shared_for_continuation", { mode: 'boolean' }).default(false).notNull(),
});

export const userShares = sqliteTable("user_shares", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  storyId: integer("story_id").notNull(),
  sharedAt: integer("shared_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  unlocked: integer("unlocked", { mode: 'boolean' }).default(false).notNull(),
});

export const userAchievements = sqliteTable("user_achievements", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(),
  achievementId: text("achievement_id").notNull(),
  unlockedAt: integer("unlocked_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const adminActions = sqliteTable("admin_actions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  adminId: integer("admin_id").notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(), // user, story, payment, etc.
  targetId: integer("target_id"),
  details: text("details"),
  performedAt: integer("performed_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
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
export const siteSettings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  siteName: text("site_name").default("ChatLure").notNull(),
  tagline: text("tagline").default("Immersive Story Experience").notNull(),
  maintenanceMode: integer("maintenance_mode", { mode: 'boolean' }).default(false).notNull(),
  maintenanceMessage: text("maintenance_message"),
  juiceModeEnabled: integer("juice_mode_enabled", { mode: 'boolean' }).default(true).notNull(),
  defaultBattery: integer("default_battery").default(75).notNull(),
  drainRate: integer("drain_rate").default(3).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const paypalSettings = sqliteTable("paypal_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  enabled: integer("enabled", { mode: 'boolean' }).default(false).notNull(),
  environment: text("environment").default("sandbox").notNull(),
  clientId: text("client_id").default("").notNull(),
  webhookId: text("webhook_id"),
  hasClientSecret: integer("has_client_secret", { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
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