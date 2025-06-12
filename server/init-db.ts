import { db } from './db';
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
    
    // Get the raw SQLite database instance
    const sqlite = new Database(process.env.DATABASE_URL || './database.sqlite');
    
    // Create tables using raw SQL
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS site_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        site_name TEXT DEFAULT 'ChatLure' NOT NULL,
        tagline TEXT DEFAULT 'Immersive Story Experience' NOT NULL,
        maintenance_mode INTEGER DEFAULT 0 NOT NULL,
        maintenance_message TEXT,
        juice_mode_enabled INTEGER DEFAULT 1 NOT NULL,
        default_battery INTEGER DEFAULT 75 NOT NULL,
        drain_rate INTEGER DEFAULT 3 NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS paypal_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        enabled INTEGER DEFAULT 0 NOT NULL,
        environment TEXT DEFAULT 'sandbox' NOT NULL,
        client_id TEXT DEFAULT '' NOT NULL,
        webhook_id TEXT,
        has_client_secret INTEGER DEFAULT 0 NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at INTEGER,
        updated_at INTEGER,
        username TEXT NOT NULL,
        email TEXT,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        profile_image_url TEXT,
        is_admin INTEGER DEFAULT 0 NOT NULL,
        juice_level TEXT DEFAULT '75' NOT NULL,
        max_juice_level TEXT DEFAULT '100' NOT NULL,
        last_juice_refill INTEGER NOT NULL,
        subscription_plan_id INTEGER,
        subscription_status TEXT DEFAULT 'free' NOT NULL,
        subscription_expires_at INTEGER,
        subscription_renewal_date INTEGER,
        is_blocked INTEGER DEFAULT 0 NOT NULL,
        block_reason TEXT,
        block_expires_at INTEGER,
        total_stories_read INTEGER DEFAULT 0 NOT NULL,
        total_juice_spent TEXT DEFAULT '0' NOT NULL,
        total_shares INTEGER DEFAULT 0 NOT NULL,
        referral_code TEXT,
        referred_by INTEGER,
        last_active_at INTEGER
      );
      
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at INTEGER,
        updated_at INTEGER,
        price REAL NOT NULL,
        interval TEXT NOT NULL,
        features TEXT NOT NULL,
        juice_per_day INTEGER,
        max_stories_per_day INTEGER NOT NULL,
        has_unlimited_access INTEGER DEFAULT 0 NOT NULL,
        recharge_rate TEXT DEFAULT 'normal' NOT NULL,
        is_active INTEGER DEFAULT 1 NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS juice_packages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        created_at INTEGER,
        price REAL NOT NULL,
        is_active INTEGER DEFAULT 1 NOT NULL,
        juice_amount TEXT NOT NULL,
        bonus_amount TEXT DEFAULT '0' NOT NULL,
        sort_order INTEGER DEFAULT 0 NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT
      );
      
      CREATE TABLE IF NOT EXISTS stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT NOT NULL,
        views INTEGER DEFAULT 0 NOT NULL,
        shares INTEGER DEFAULT 0 NOT NULL,
        likes INTEGER DEFAULT 0 NOT NULL,
        is_hot INTEGER DEFAULT 0 NOT NULL,
        is_new INTEGER DEFAULT 0 NOT NULL,
        is_viral INTEGER DEFAULT 0 NOT NULL,
        difficulty TEXT DEFAULT 'easy' NOT NULL,
        duration INTEGER DEFAULT 5 NOT NULL,
        has_audio INTEGER DEFAULT 0 NOT NULL,
        has_images INTEGER DEFAULT 0 NOT NULL,
        cliffhanger_level INTEGER DEFAULT 3 NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        story_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        is_incoming INTEGER DEFAULT 1 NOT NULL,
        timestamp TEXT NOT NULL,
        has_read_receipt INTEGER DEFAULT 0 NOT NULL,
        "order" INTEGER NOT NULL
      );
    `);
    
    console.log('Database tables created successfully');
    
    // Create initial site settings if they don't exist
    const existingSettings = await db.select().from(siteSettings).limit(1);
    if (existingSettings.length === 0) {
      await db.insert(siteSettings).values({
        siteName: "ChatLure",
        tagline: "Immersive Story Experience",
        maintenanceMode: false,
        juiceModeEnabled: true,
        defaultBattery: 75,
        drainRate: 3,
      });
      console.log('Created initial site settings');
    }

    // Create initial PayPal settings if they don't exist
    const existingPayPal = await db.select().from(paypalSettings).limit(1);
    if (existingPayPal.length === 0) {
      await db.insert(paypalSettings).values({
        enabled: false,
        environment: "sandbox",
        clientId: "",
        hasClientSecret: false,
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