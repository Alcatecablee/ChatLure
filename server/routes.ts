import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema, insertMessageSchema, insertCategorySchema } from "@shared/schema";
<<<<<<< HEAD
import { paypalService } from "./paypal-service";
import { clerkClient, getAuth } from '@clerk/express';

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to get current user from Clerk
  const getCurrentUser = async (req: any) => {
    const { userId } = getAuth(req);
    if (!userId) return null;
    
    const clerkUser = await clerkClient.users.getUser(userId);
    let dbUser = await storage.getUserByClerkId(userId);
    
    // Create user in our database if they don't exist
    if (!dbUser) {
      dbUser = await storage.createUser({
        clerkId: userId,
        username: clerkUser.username || `user_${userId.slice(-8)}`,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        profileImageUrl: clerkUser.profileImageUrl,
        isAdmin: false,
        juiceLevel: "100.00",
        maxJuiceLevel: "100.00"
      });
    }
    
    return { clerkUser, dbUser };
  };

  // Auth endpoint to get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      res.json({
        id: user.dbUser.id,
        clerkId: user.dbUser.clerkId,
        username: user.dbUser.username,
        email: user.dbUser.email,
        firstName: user.dbUser.firstName,
        lastName: user.dbUser.lastName,
        profileImageUrl: user.dbUser.profileImageUrl,
        isAdmin: user.dbUser.isAdmin,
        juiceLevel: user.dbUser.juiceLevel,
        subscriptionStatus: user.dbUser.subscriptionStatus
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stories API
  app.get("/api/stories", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
=======

export async function registerRoutes(app: Express): Promise<Server> {
  // Stories routes
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  app.get("/api/stories/trending", async (req, res) => {
    try {
      const stories = await storage.getTrendingStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trending stories" });
>>>>>>> origin/main
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
<<<<<<< HEAD
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const story = await storage.getStoryById(parseInt(req.params.id));
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      console.error("Error fetching story:", error);
      res.status(500).json({ error: "Failed to fetch story" });
    }
  });

  app.get("/api/stories/:id/messages", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const messages = await storage.getMessagesByStoryId(parseInt(req.params.id));
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Admin middleware
  app.use("/api/admin/*", async (req, res, next) => {
    try {
      const user = await getCurrentUser(req);
      if (!user || !user.dbUser.isAdmin) {
        return res.status(403).json({ error: "Admin access required" });
      }
      next();
    } catch (error) {
      console.error("Admin auth error:", error);
      res.status(500).json({ error: "Authentication error" });
    }
  });

  // Admin - Users
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedUser = await storage.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Admin - Stories
  app.get("/api/admin/stories", async (req, res) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      console.error("Error fetching admin stories:", error);
      res.status(500).json({ error: "Failed to fetch stories" });
=======
      const id = parseInt(req.params.id);
      const story = await storage.getStoryById(id);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch story" });
    }
  });

  app.post("/api/stories/:id/view", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementStoryViews(id);
      res.json({ message: "View recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record view" });
    }
  });

  app.post("/api/stories/:id/share", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementStoryShares(id);
      res.json({ message: "Share recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record share" });
    }
  });

  app.post("/api/stories/:id/like", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.incrementStoryLikes(id);
      res.json({ message: "Like recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record like" });
    }
  });

  app.get("/api/stories/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const stories = await storage.getStoriesByCategory(category);
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories by category" });
    }
  });

  // Messages routes
  app.get("/api/messages/:storyId", async (req, res) => {
    try {
      const storyId = parseInt(req.params.storyId);
      const messages = await storage.getMessagesByStoryId(storyId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Subscription plans routes
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  // Admin routes
  app.get("/api/admin/stories", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
>>>>>>> origin/main
    }
  });

  app.post("/api/admin/stories", async (req, res) => {
    try {
<<<<<<< HEAD
      const story = await storage.createStory(req.body);
      res.status(201).json(story);
    } catch (error) {
      console.error("Error creating story:", error);
      res.status(500).json({ error: "Failed to create story" });
=======
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to create story" });
>>>>>>> origin/main
    }
  });

  app.patch("/api/admin/stories/:id", async (req, res) => {
    try {
<<<<<<< HEAD
      const storyId = parseInt(req.params.id);
      const story = await storage.updateStory(storyId, req.body);
      if (!story) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json(story);
    } catch (error) {
      console.error("Error updating story:", error);
      res.status(500).json({ error: "Failed to update story" });
=======
      const id = parseInt(req.params.id);
      const { id: _, ...updates } = req.body; // Remove id from updates to avoid duplication
      const story = await storage.updateStory(id, updates);
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to update story" });
>>>>>>> origin/main
    }
  });

  app.delete("/api/admin/stories/:id", async (req, res) => {
    try {
<<<<<<< HEAD
      const storyId = parseInt(req.params.id);
      const success = await storage.deleteStory(storyId);
      if (!success) {
        return res.status(404).json({ error: "Story not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting story:", error);
      res.status(500).json({ error: "Failed to delete story" });
    }
  });

  // Admin - Analytics
  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Admin - Subscription Plans
  app.get("/api/admin/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      res.status(500).json({ error: "Failed to fetch subscription plans" });
    }
  });

  app.post("/api/admin/subscription-plans", async (req, res) => {
    try {
      const plan = await storage.createSubscriptionPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      console.error("Error creating subscription plan:", error);
      res.status(500).json({ error: "Failed to create subscription plan" });
    }
  });

  app.patch("/api/admin/subscription-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.updateSubscriptionPlan(planId, req.body);
      if (!plan) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json(plan);
    } catch (error) {
      console.error("Error updating subscription plan:", error);
      res.status(500).json({ error: "Failed to update subscription plan" });
    }
  });

  app.delete("/api/admin/subscription-plans/:id", async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const success = await storage.deleteSubscriptionPlan(planId);
      if (!success) {
        return res.status(404).json({ error: "Subscription plan not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting subscription plan:", error);
      res.status(500).json({ error: "Failed to delete subscription plan" });
    }
  });

  // Admin - PayPal Settings
  app.get("/api/admin/paypal/settings", async (req, res) => {
    try {
      const settings = await paypalService.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching PayPal settings:", error);
      res.status(500).json({ error: "Failed to fetch PayPal settings" });
    }
  });

  app.post("/api/admin/paypal/settings", async (req, res) => {
    try {
      const settings = await paypalService.updateSettings(req.body);
      res.json(settings);
    } catch (error) {
      console.error("Error updating PayPal settings:", error);
      res.status(500).json({ error: "Failed to update PayPal settings" });
    }
  });

  app.post("/api/admin/paypal/test", async (req, res) => {
    try {
      const result = await paypalService.testConnection();
      res.json(result);
    } catch (error) {
      console.error("Error testing PayPal connection:", error);
      res.status(500).json({ error: "Failed to test PayPal connection" });
    }
  });

  // Payment endpoints
  app.post("/api/payments/create-subscription", async (req, res) => {
    try {
      const user = await getCurrentUser(req);
      if (!user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { planId } = req.body;
      const payment = await paypalService.createSubscription(planId, user.dbUser.id);
      res.json(payment);
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  app.post("/api/payments/webhook", async (req, res) => {
    try {
      await paypalService.handleWebhook(req.body, req.headers);
      res.json({ success: true });
    } catch (error) {
      console.error("Error handling PayPal webhook:", error);
      res.status(500).json({ error: "Webhook processing failed" });
=======
      const id = parseInt(req.params.id);
      await storage.deleteStory(id);
      res.json({ message: "Story deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete story" });
    }
  });

  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { id: _, ...updates } = req.body; // Remove id from updates to avoid duplication
      const user = await storage.updateUser(id, updates);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.get("/api/admin/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      const users = await storage.getAllUsers();
      
      const analytics = {
        totalUsers: users.length,
        totalStories: stories.length,
        totalViews: stories.reduce((sum, story) => sum + story.views, 0),
        totalShares: stories.reduce((sum, story) => sum + story.shares, 0),
        totalLikes: stories.reduce((sum, story) => sum + story.likes, 0),
        premiumUsers: users.filter(u => u.subscriptionTier !== 'free').length,
        storiesThisMonth: stories.filter(s => {
          const created = new Date(s.createdAt);
          const now = new Date();
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length,
        topCategories: stories.reduce((acc, story) => {
          acc[story.category] = (acc[story.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
>>>>>>> origin/main
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}