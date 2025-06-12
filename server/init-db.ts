import { db } from './db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import { 
  stories, messages, categories, users, subscriptionPlans, 
  juicePackages, juiceTransactions, payments, readingSessions,
  userShares, userAchievements, adminActions, siteSettings, paypalSettings
} from '@shared/schema';

// Initialize database tables and seed data
export async function initializeDatabase() {
  try {
    console.log('Initializing SQLite database...');
    
    // Create tables directly since migrations are problematic
    console.log('Creating database tables...');
    
    // Create tables manually using raw SQL
    const dbInstance = new Database('database.sqlite');
      
      // Create all necessary tables for SQLite
      const createTables = `
        CREATE TABLE IF NOT EXISTS "stories" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "title" text NOT NULL,
          "description" text NOT NULL,
          "category" text NOT NULL,
          "image_url" text NOT NULL,
          "views" integer DEFAULT 0 NOT NULL,
          "shares" integer DEFAULT 0 NOT NULL,
          "likes" integer DEFAULT 0 NOT NULL,
          "is_hot" integer DEFAULT 0 NOT NULL,
          "is_new" integer DEFAULT 0 NOT NULL,
          "is_viral" integer DEFAULT 0 NOT NULL,
          "difficulty" text DEFAULT 'easy' NOT NULL,
          "duration" integer DEFAULT 5 NOT NULL,
          "has_audio" integer DEFAULT 0 NOT NULL,
          "has_images" integer DEFAULT 0 NOT NULL,
          "cliffhanger_level" integer DEFAULT 3 NOT NULL,
          "created_at" text NOT NULL DEFAULT (datetime('now')),
          "updated_at" text NOT NULL DEFAULT (datetime('now'))
        );
        
        CREATE TABLE IF NOT EXISTS "messages" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "story_id" integer NOT NULL,
          "content" text NOT NULL,
          "is_incoming" integer DEFAULT 1 NOT NULL,
          "timestamp" text NOT NULL,
          "has_read_receipt" integer DEFAULT 0 NOT NULL,
          "order" integer NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "categories" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "name" text NOT NULL,
          "description" text,
          "image_url" text
        );
        
        CREATE TABLE IF NOT EXISTS "users" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "created_at" text NOT NULL DEFAULT (datetime('now')),
          "updated_at" text NOT NULL DEFAULT (datetime('now')),
          "username" text NOT NULL,
          "email" text,
          "password" text NOT NULL,
          "first_name" text,
          "last_name" text,
          "profile_image_url" text,
          "is_admin" integer DEFAULT 0 NOT NULL,
          "juice_level" text DEFAULT '75' NOT NULL,
          "max_juice_level" text DEFAULT '100' NOT NULL,
          "last_juice_refill" text NOT NULL DEFAULT (datetime('now')),
          "subscription_plan_id" integer,
          "subscription_status" text DEFAULT 'free' NOT NULL,
          "subscription_expires_at" text,
          "subscription_renewal_date" text,
          "is_blocked" integer DEFAULT 0 NOT NULL,
          "block_reason" text,
          "block_expires_at" text,
          "total_stories_read" integer DEFAULT 0 NOT NULL,
          "total_juice_spent" text DEFAULT '0' NOT NULL,
          "total_shares" integer DEFAULT 0 NOT NULL,
          "referral_code" text,
          "referred_by" integer,
          "last_active_at" text,
          UNIQUE("username"),
          UNIQUE("email")
        );
        
        CREATE TABLE IF NOT EXISTS "subscription_plans" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "name" text NOT NULL,
          "created_at" text NOT NULL DEFAULT (datetime('now')),
          "updated_at" text NOT NULL DEFAULT (datetime('now')),
          "price" real NOT NULL,
          "interval" text NOT NULL,
          "features" text NOT NULL,
          "juice_per_day" integer,
          "max_stories_per_day" integer NOT NULL,
          "has_unlimited_access" integer DEFAULT 0 NOT NULL,
          "recharge_rate" text DEFAULT 'normal' NOT NULL,
          "is_active" integer DEFAULT 1 NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "juice_packages" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "name" text NOT NULL,
          "created_at" text NOT NULL DEFAULT (datetime('now')),
          "price" real NOT NULL,
          "is_active" integer DEFAULT 1 NOT NULL,
          "juice_amount" text NOT NULL,
          "bonus_amount" text DEFAULT '0' NOT NULL,
          "sort_order" integer DEFAULT 0 NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "juice_transactions" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "user_id" integer NOT NULL,
          "amount" text NOT NULL,
          "type" text NOT NULL,
          "description" text,
          "created_at" text NOT NULL DEFAULT (datetime('now'))
        );
        
        CREATE TABLE IF NOT EXISTS "user_shares" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "user_id" integer NOT NULL,
          "story_id" integer NOT NULL,
          "platform" text NOT NULL,
          "shared_at" text NOT NULL DEFAULT (datetime('now')),
          "is_unlocked" integer DEFAULT 0 NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "user_achievements" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "user_id" integer NOT NULL,
          "achievement_id" text NOT NULL,
          "unlocked_at" text NOT NULL DEFAULT (datetime('now')),
          "progress" integer DEFAULT 0 NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "admin_actions" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "admin_id" integer NOT NULL,
          "action" text NOT NULL,
          "target_type" text NOT NULL,
          "target_id" integer,
          "details" text,
          "created_at" text NOT NULL DEFAULT (datetime('now'))
        );
        
        CREATE TABLE IF NOT EXISTS "payments" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "user_id" integer NOT NULL,
          "amount" real NOT NULL,
          "currency" text DEFAULT 'USD' NOT NULL,
          "status" text NOT NULL,
          "payment_method" text NOT NULL,
          "payment_id" text,
          "plan_id" integer,
          "package_id" integer,
          "metadata" text,
          "created_at" text NOT NULL DEFAULT (datetime('now')),
          "updated_at" text NOT NULL DEFAULT (datetime('now'))
        );
        
        CREATE TABLE IF NOT EXISTS "reading_sessions" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "user_id" integer NOT NULL,
          "story_id" integer NOT NULL,
          "started_at" text NOT NULL DEFAULT (datetime('now')),
          "ended_at" text,
          "duration" integer,
          "progress" integer DEFAULT 0 NOT NULL,
          "completed" integer DEFAULT 0 NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "site_settings" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "key" text NOT NULL,
          "value" text NOT NULL,
          "type" text DEFAULT 'string' NOT NULL,
          "description" text,
          "category" text DEFAULT 'general' NOT NULL,
          "updated_at" text NOT NULL DEFAULT (datetime('now'))
        );
        
        CREATE TABLE IF NOT EXISTS "paypal_settings" (
          "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
          "client_id" text NOT NULL,
          "client_secret" text NOT NULL,
          "environment" text DEFAULT 'sandbox' NOT NULL,
          "webhook_id" text,
          "is_active" integer DEFAULT 1 NOT NULL,
          "last_tested" text,
          "test_result" text,
          "updated_at" text NOT NULL DEFAULT (datetime('now'))
        );
      `;
      
    dbInstance.exec(createTables);
    dbInstance.close();
    console.log('Database tables created successfully');
    
    // Create initial site settings if they don't exist
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values([
        {
          key: "siteName",
          value: "ChatLure",
          type: "string",
          description: "The name of the site",
          category: "general"
        },
        {
          key: "tagline",
          value: "Peek, Obsess, Repeat",
          type: "string",
          description: "Site tagline",
          category: "general"
        },
        {
          key: "maintenanceMode",
          value: "false",
          type: "boolean",
          description: "Whether the site is in maintenance mode",
          category: "general"
        },
        {
          key: "juiceModeEnabled",
          value: "true",
          type: "boolean",
          description: "Whether juice mode is enabled",
          category: "features"
        },
        {
          key: "defaultBattery",
          value: "75",
          type: "number",
          description: "Default battery level for new users",
          category: "features"
        },
        {
          key: "drainRate",
          value: "3",
          type: "number",
          description: "Battery drain rate",
          category: "features"
        }
      ]);
      console.log('Created initial site settings');
    }

    // Create initial PayPal settings if they don't exist
    const existingPayPal = await db.select().from(paypalSettings).limit(1);
    if (existingPayPal.length === 0) {
      await db.insert(paypalSettings).values({
        clientId: "",
        clientSecret: "",
        environment: "sandbox",
        webhookId: "",
        isActive: false,
        testResult: ""
      });
      console.log('Created initial PayPal settings');
    }

    // Create default subscription plans if they don't exist
    const existingPlans = await db.select().from(subscriptionPlans).limit(1);
    if (existingPlans.length === 0) {
      await db.insert(subscriptionPlans).values([
        {
          name: "PeepPower Starter",
          price: 9.99,
          interval: "monthly",
          features: JSON.stringify(["50 juice per day", "Basic stories", "Standard recharge"]),
          juicePerDay: 50,
          maxStoriesPerDay: 5,
          hasUnlimitedAccess: false,
          rechargeRate: "normal",
          isActive: true,
        },
        {
          name: "PeepPower Pro",
          price: 19.99,
          interval: "monthly", 
          features: JSON.stringify(["100 juice per day", "Premium stories", "Fast recharge"]),
          juicePerDay: 100,
          maxStoriesPerDay: 15,
          hasUnlimitedAccess: false,
          rechargeRate: "fast",
          isActive: true,
        },
        {
          name: "PeepPower Unlimited",
          price: 39.99,
          interval: "monthly",
          features: JSON.stringify(["Unlimited juice", "All stories", "Instant recharge"]),
          juicePerDay: null,
          maxStoriesPerDay: 999,
          hasUnlimitedAccess: true,
          rechargeRate: "instant",
          isActive: true,
        }
      ]);
      console.log('Created default subscription plans');
    }

    // Create default juice packages if they don't exist
    const existingPackages = await db.select().from(juicePackages).limit(1);
    if (existingPackages.length === 0) {
      await db.insert(juicePackages).values([
        {
          name: "Small Juice Pack",
          price: 2.99,
          juiceAmount: "25",
          bonusAmount: "0",
          sortOrder: 1,
          isActive: true,
        },
        {
          name: "Medium Juice Pack",
          price: 4.99,
          juiceAmount: "50",
          bonusAmount: "5",
          sortOrder: 2,
          isActive: true,
        },
        {
          name: "Large Juice Pack",
          price: 9.99,
          juiceAmount: "100",
          bonusAmount: "15",
          sortOrder: 3,
          isActive: true,
        }
      ]);
      console.log('Created default juice packages');
    }

    // Create default categories if they don't exist
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length === 0) {
      await db.insert(categories).values([
        {
          name: "Romance",
          description: "Heartwarming love stories",
          imageUrl: "/categories/romance.jpg"
        },
        {
          name: "Adventure",
          description: "Thrilling adventures and quests",
          imageUrl: "/categories/adventure.jpg"
        },
        {
          name: "Mystery",
          description: "Intriguing mysteries to solve",
          imageUrl: "/categories/mystery.jpg"
        },
        {
          name: "Fantasy",
          description: "Magical worlds and creatures",
          imageUrl: "/categories/fantasy.jpg"
        }
      ]);
      console.log('Created default categories');
    }

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
}