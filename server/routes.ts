import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStorySchema, insertMessageSchema, insertCategorySchema } from "@shared/schema";
import { paypalService } from "./paypal-service";

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
    }
  });

  app.get("/api/stories/:id", async (req, res) => {
    try {
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
    }
  });

  app.post("/api/admin/stories", async (req, res) => {
    try {
      const validatedData = insertStorySchema.parse(req.body);
      const story = await storage.createStory(validatedData);
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to create story" });
    }
  });

  app.patch("/api/admin/stories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { id: _, ...updates } = req.body; // Remove id from updates to avoid duplication
      const story = await storage.updateStory(id, updates);
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to update story" });
    }
  });

  app.delete("/api/admin/stories/:id", async (req, res) => {
    try {
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
        premiumUsers: users.filter(u => u.subscriptionStatus === 'active' && u.subscriptionPlanId !== null).length,
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
    }
  });

  // Enhanced Admin routes for comprehensive management
  
  // PayPal Payment Management Routes
  app.get("/api/admin/payments", async (req, res) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.post("/api/admin/payments/paypal/webhook", async (req, res) => {
    try {
      // Handle PayPal webhook events
      const { event_type, resource } = req.body;
      
      if (event_type === "PAYMENT.SALE.COMPLETED") {
        // Update payment status in database
        const paymentId = resource.parent_payment;
        await storage.updatePayment(paymentId, { 
          status: "completed",
          paymentMethod: "paypal"
        });
      }
      
      res.json({ message: "Webhook processed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  app.post("/api/admin/payments/refund", async (req, res) => {
    try {
      const { paymentId, amount, reason } = req.body;
      // Process refund through PayPal API
      // Update payment record
      await storage.updatePayment(paymentId, { 
        status: "refunded",
        refundAmount: amount,
        refundReason: reason
      });
      res.json({ message: "Refund processed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process refund" });
    }
  });

  // Site Settings Management Routes
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.updateSiteSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  app.post("/api/admin/maintenance", async (req, res) => {
    try {
      const { enabled, message } = req.body;
      await storage.setMaintenanceMode(enabled, message);
      res.json({ message: "Maintenance mode updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update maintenance mode" });
    }
  });

  // PayPal Settings Management Routes
  app.get("/api/admin/paypal/settings", async (req, res) => {
    try {
      const settings = await storage.getPayPalSettings();
      // Don't send sensitive data to frontend
      const sanitizedSettings = {
        enabled: settings.enabled,
        environment: settings.environment,
        clientId: settings.clientId ? settings.clientId.substring(0, 8) + "..." : "",
        webhookId: settings.webhookId,
        hasClientSecret: !!settings.clientSecret
      };
      res.json(sanitizedSettings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch PayPal settings" });
    }
  });

  app.patch("/api/admin/paypal/settings", async (req, res) => {
    try {
      const settings = await storage.updatePayPalSettings(req.body);
      res.json({ message: "PayPal settings updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update PayPal settings" });
    }
  });

  app.post("/api/admin/paypal/test", async (req, res) => {
    try {
      const result = await storage.testPayPalConnection();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Failed to test PayPal connection" });
    }
  });

  // Chat/Message Management Routes
  app.get("/api/admin/messages/:storyId", async (req, res) => {
    try {
      const storyId = parseInt(req.params.storyId);
      const messages = await storage.getMessagesByStoryId(storyId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/admin/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.patch("/api/admin/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { id: _, ...updates } = req.body;
      const message = await storage.updateMessage(id, updates);
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  app.delete("/api/admin/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMessage(id);
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Enhanced User Management Routes
  app.patch("/api/admin/users/:id/subscription", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { subscriptionPlanId, status } = req.body;
      const user = await storage.updateUserSubscription(id, subscriptionPlanId, status);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user subscription" });
    }
  });

  app.patch("/api/admin/users/:id/juice", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { amount, type, description } = req.body;
      await storage.updateUserJuice(id, amount, type, description);
      res.json({ message: "User juice updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user juice" });
    }
  });

  app.post("/api/admin/users/:id/block", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason, duration } = req.body;
      await storage.blockUser(id, reason, duration);
      res.json({ message: "User blocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to block user" });
    }
  });

  app.post("/api/admin/users/:id/unblock", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.unblockUser(id);
      res.json({ message: "User unblocked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unblock user" });
    }
  });

  // Content Moderation Routes
  app.get("/api/admin/moderation/queue", async (req, res) => {
    try {
      const queue = await storage.getModerationQueue();
      res.json(queue);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch moderation queue" });
    }
  });

  app.post("/api/admin/moderation/approve/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.approveContent(id);
      res.json({ message: "Content approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve content" });
    }
  });

  app.post("/api/admin/moderation/reject/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { reason } = req.body;
      await storage.rejectContent(id, reason);
      res.json({ message: "Content rejected successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to reject content" });
    }
  });

  // Enhanced Analytics Routes
  app.get("/api/admin/analytics/revenue", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      const analytics = await storage.getRevenueAnalytics(period as string);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch revenue analytics" });
    }
  });

  app.get("/api/admin/analytics/users", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      const analytics = await storage.getUserAnalytics(period as string);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user analytics" });
    }
  });

  app.get("/api/admin/analytics/content", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      const analytics = await storage.getContentAnalytics(period as string);
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content analytics" });
    }
  });

  // System Health & Monitoring Routes
  app.get("/api/admin/system/health", async (req, res) => {
    try {
      const health = {
        status: "healthy",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
        database: await storage.checkDatabaseHealth(),
        services: {
          paypal: true,
          email: true,
          storage: true
        }
      };
      res.json(health);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system health" });
    }
  });

  app.post("/api/admin/system/backup", async (req, res) => {
    try {
      const backupId = await storage.createDatabaseBackup();
      res.json({ message: "Backup created successfully", backupId });
    } catch (error) {
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  // Activity Feed Routes
  app.get("/api/admin/activity", async (req, res) => {
    try {
      const { limit = 50 } = req.query;
      const activities = await storage.getRecentActivities(parseInt(limit as string));
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Categories Management
  app.post("/api/admin/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch("/api/admin/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { id: _, ...updates } = req.body;
      const category = await storage.updateCategory(id, updates);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // PayPal Payment Routes for Frontend Integration
  app.post("/api/paypal/create-payment", async (req, res) => {
    try {
      const { amount, currency = "USD", description, planId, guestCheckout = true } = req.body;
      
      const payment = await paypalService.createPayment({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        description,
        planId,
        guestCheckout,
        userId: req.user?.id // Optional user ID if logged in
      });

      res.json(payment);
    } catch (error) {
      console.error("Create PayPal payment error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.post("/api/paypal/capture-payment", async (req, res) => {
    try {
      const { orderId } = req.body;
      
      const result = await paypalService.capturePayment(orderId);
      
      // Save payment to database
      const payment = await storage.createPayment({
        userId: req.user?.id || null,
        type: "subscription",
        status: "completed",
        amount: result.amount,
        currency: result.currency,
        paymentMethod: "paypal",
        metadata: JSON.stringify({ paypalOrderId: orderId })
      });

      res.json({ ...result, paymentId: payment.id });
    } catch (error) {
      console.error("Capture PayPal payment error:", error);
      res.status(500).json({ message: "Failed to capture payment" });
    }
  });

  app.post("/api/paypal/create-subscription", async (req, res) => {
    try {
      const { planId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const subscription = await paypalService.createSubscription(planId, userId);
      
      res.json(subscription);
    } catch (error) {
      console.error("Create PayPal subscription error:", error);
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  app.post("/api/paypal/cancel-subscription", async (req, res) => {
    try {
      const { subscriptionId, reason } = req.body;
      
      await paypalService.cancelSubscription(subscriptionId, reason);
      
      // Update user subscription status
      if (req.user?.id) {
        await storage.updateUserSubscription(req.user.id, 0, "cancelled");
      }

      res.json({ message: "Subscription cancelled successfully" });
    } catch (error) {
      console.error("Cancel PayPal subscription error:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // PayPal Webhook Handler
  app.post("/api/paypal/webhook", async (req, res) => {
    try {
      const isValid = await paypalService.validateWebhookSignature(req.headers, JSON.stringify(req.body));
      
      if (!isValid) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }

      const event = await paypalService.processWebhook(req.body);
      
      // Handle different webhook events
      switch (event.type) {
        case 'payment_completed':
          // Update payment status
          // Update user subscription if applicable
          break;
          
        case 'subscription_activated':
          // Activate user subscription
          break;
          
        case 'subscription_cancelled':
          // Cancel user subscription
          break;
          
        case 'payment_failed':
          // Handle failed payment
          break;
      }

      res.json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error("PayPal webhook error:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Guest Payment Routes (No Authentication Required)
  app.post("/api/paypal/guest/create-payment", async (req, res) => {
    try {
      const { amount, currency = "USD", description, email } = req.body;
      
      const payment = await paypalService.createPayment({
        amount: Math.round(amount * 100),
        currency,
        description,
        guestCheckout: true
      });

      // Create guest payment record
      const guestPayment = await storage.createPayment({
        userId: null, // Guest checkout
        type: "guest_subscription",
        status: "pending",
        amount: Math.round(amount * 100),
        currency,
        paymentMethod: "paypal",
        metadata: JSON.stringify({ 
          paypalOrderId: payment.id,
          guestEmail: email 
        })
      });

      res.json({ ...payment, guestPaymentId: guestPayment.id });
    } catch (error) {
      console.error("Create guest PayPal payment error:", error);
      res.status(500).json({ message: "Failed to create guest payment" });
    }
  });

  // Payment Success/Cancel URLs
  app.get("/api/paypal/success", async (req, res) => {
    const { token, PayerID } = req.query;
    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/payment/success?token=${token}&payerId=${PayerID}`);
  });

  app.get("/api/paypal/cancel", async (req, res) => {
    // Redirect to frontend cancel page
    res.redirect(`${process.env.FRONTEND_URL}/payment/cancelled`);
  });

  app.get("/api/paypal/subscription/success", async (req, res) => {
    const { subscription_id } = req.query;
    res.redirect(`${process.env.FRONTEND_URL}/subscription/success?id=${subscription_id}`);
  });

  app.get("/api/paypal/subscription/cancel", async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/subscription/cancelled`);
  });

  // User-specific routes for dashboard
  app.get("/api/user/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.get("/api/user/reading-history/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sessions = await storage.getUserReadingSessions(id);
      
      // Get story details for each session
      const historyWithStories = await Promise.all(
        sessions.map(async (session) => {
          const story = await storage.getStoryById(session.storyId);
          return {
            ...session,
            story
          };
        })
      );
      
      res.json(historyWithStories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reading history" });
    }
  });

  app.get("/api/user/achievements/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const achievements = await storage.getUserAchievements(id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/user/analytics/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const readingSessions = await storage.getUserReadingSessions(id);
      const achievements = await storage.getUserAchievements(id);
      const juiceTransactions = await storage.getUserJuiceTransactions(id, 30);
      const userShares = await storage.getUserShares(id);

      const analytics = {
        totalStoriesRead: user.storiesRead,
        totalStoriesShared: user.storiesShared,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        totalJuiceConsumed: parseFloat(user.totalJuiceConsumed.toString()),
        currentJuiceLevel: parseFloat(user.juiceLevel.toString()),
        maxJuiceLevel: parseFloat(user.maxJuiceLevel.toString()),
        unlockedAchievements: achievements.filter(a => a.unlockedAt).length,
        totalAchievements: achievements.length,
        readingSessionsThisMonth: readingSessions.filter(s => {
          const sessionDate = new Date(s.startedAt);
          const now = new Date();
          return sessionDate.getMonth() === now.getMonth() && sessionDate.getFullYear() === now.getFullYear();
        }).length,
        averageReadingTime: readingSessions.length > 0 ? 
          readingSessions.reduce((sum, s) => {
            if (s.endedAt) {
              return sum + (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime());
            }
            return sum;
          }, 0) / readingSessions.length / 1000 / 60 : 0, // minutes
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpiresAt: user.subscriptionExpiresAt,
        lastActiveAt: user.lastActiveAt,
        memberSince: user.createdAt,
        sharesByPlatform: userShares.reduce((acc, share) => {
          acc[share.platform] = (acc[share.platform] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user analytics" });
    }
  });

  app.get("/api/user/juice-balance/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const balance = await storage.getUserJuiceBalance(id);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch juice balance" });
    }
  });

  app.get("/api/user/juice-transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { limit = 50 } = req.query;
      const transactions = await storage.getUserJuiceTransactions(id, parseInt(limit as string));
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch juice transactions" });
    }
  });

  app.get("/api/user/shares/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const shares = await storage.getUserShares(id);
      
      // Get story details for each share
      const sharesWithStories = await Promise.all(
        shares.map(async (share) => {
          const story = await storage.getStoryById(share.storyId);
          return {
            ...share,
            story
          };
        })
      );
      
      res.json(sharesWithStories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user shares" });
    }
  });

  app.patch("/api/user/profile/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      const { password, isAdmin, subscriptionStatus, juiceLevel, ...allowedUpdates } = updates;
      
      const user = await storage.updateUser(id, allowedUpdates);
      const { password: _, ...userProfile } = user;
      
      res.json(userProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  app.post("/api/user/activity", async (req, res) => {
    try {
      const { userId, type, storyId, metadata } = req.body;
      
      // Update user activity
      await storage.updateUser(userId, { lastActiveAt: new Date() });
      
      // Log activity if needed
      if (type === "story_read") {
        await storage.updateUser(userId, { 
          storiesRead: (await storage.getUser(userId))?.storiesRead + 1 || 1 
        });
      } else if (type === "story_shared") {
        await storage.updateUser(userId, { 
          storiesShared: (await storage.getUser(userId))?.storiesShared + 1 || 1 
        });
      }
      
      res.json({ message: "Activity recorded" });
    } catch (error) {
      res.status(500).json({ message: "Failed to record activity" });
    }
  });

  app.get("/api/user/subscription/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let subscriptionPlan = null;
      if (user.subscriptionPlanId) {
        const allPlans = await storage.getAllSubscriptionPlans();
        subscriptionPlan = allPlans.find(p => p.id === user.subscriptionPlanId) || null;
      }

      const subscriptionInfo = {
        status: user.subscriptionStatus,
        plan: subscriptionPlan,
        expiresAt: user.subscriptionExpiresAt,
        startedAt: user.subscriptionStartedAt,
        isActive: user.subscriptionStatus === 'active' && 
                  (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date())
      };

      res.json(subscriptionInfo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription info" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}