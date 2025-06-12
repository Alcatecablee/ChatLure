import { db } from './db';
import { 
  stories, messages, categories, users, subscriptionPlans, 
  juicePackages, juiceTransactions, payments, readingSessions,
  userShares, userAchievements, adminActions, siteSettings, paypalSettings
} from '@shared/schema';

// Initialize database tables and seed data
export async function initializeDatabase() {
  try {
    console.log('Initializing PostgreSQL database...');
    
    // Tables are automatically created by Drizzle migrations
    console.log('Database tables ready');
    
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