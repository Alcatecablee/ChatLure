import { db } from "./db";
import { stories, messages, categories, subscriptionPlans, users } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(messages);
  await db.delete(stories);
  await db.delete(categories);
  await db.delete(subscriptionPlans);
  await db.delete(users);

  // Seed subscription plans
  const plans = await db.insert(subscriptionPlans).values([
    {
      name: "Free",
      price: 0,
      interval: "forever",
      features: ["3 stories per day", "Basic chat access", "Limited sharing"],
      maxStoriesPerDay: 3,
      hasUnlimitedAccess: false,
      isActive: true
    },
    {
      name: "Obsessed",
      price: 499, // $4.99 in cents
      interval: "monthly", 
      features: ["Unlimited stories", "Early access to new content", "Premium chat experiences", "Share to unlock instantly", "No ads"],
      maxStoriesPerDay: -1,
      hasUnlimitedAccess: true,
      isActive: true
    },
    {
      name: "Addicted",
      price: 1299, // $12.99 in cents
      interval: "monthly",
      features: ["Everything in Obsessed", "Exclusive VIP stories", "Priority support", "Custom story requests", "Beta features access"],
      maxStoriesPerDay: -1,
      hasUnlimitedAccess: true,
      isActive: true
    },
    {
      name: "Obsessed Annual",
      price: 4999, // $49.99 in cents
      interval: "yearly",
      features: ["Unlimited stories", "Early access to new content", "Premium chat experiences", "Share to unlock instantly", "No ads", "2 months free"],
      maxStoriesPerDay: -1,
      hasUnlimitedAccess: true,
      isActive: true
    }
  ]).returning();

  // Seed categories
  const categoryData = await db.insert(categories).values([
    { name: "Heartbreak", emoji: "💔", color: "from-red-500 to-pink-500", count: 0 },
    { name: "Betrayal", emoji: "🗡️", color: "from-purple-500 to-indigo-500", count: 0 },
    { name: "Scandal", emoji: "😱", color: "from-yellow-500 to-orange-500", count: 0 },
    { name: "Drama", emoji: "🎭", color: "from-green-500 to-teal-500", count: 0 },
    { name: "Secrets", emoji: "🤫", color: "from-gray-500 to-slate-500", count: 0 },
    { name: "Romance", emoji: "💕", color: "from-pink-500 to-rose-500", count: 0 },
    { name: "Mystery", emoji: "🔍", color: "from-blue-500 to-cyan-500", count: 0 },
    { name: "Revenge", emoji: "⚔️", color: "from-red-600 to-orange-600", count: 0 }
  ]).returning();

  // Create admin user
  const [adminUser] = await db.insert(users).values({
    username: "admin",
    email: "admin@chatlure.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    isAdmin: true,
    subscriptionTier: "Addicted",
    storiesRead: 0,
    storiesShared: 0,
    currentStreak: 0,
    longestStreak: 0
  }).returning();

  // Seed stories with ChatLure-themed content
  const storyData = await db.insert(stories).values([
    {
      title: "The Affair Exposed",
      description: "Sarah discovers her husband's secret messages with her best friend. Watch the explosive confrontation unfold in real-time.",
      category: "Betrayal",
      imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
      views: 2847,
      shares: 156,
      likes: 324,
      isHot: true,
      isNew: false,
      isViral: true,
      difficulty: "medium",
      duration: 8,
      hasAudio: true,
      hasImages: true,
      cliffhangerLevel: 5
    },
    {
      title: "Office Romance Gone Wrong",
      description: "Two coworkers think they're keeping their relationship secret. Their boss has been watching everything...",
      category: "Drama",
      imageUrl: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400",
      views: 1923,
      shares: 89,
      likes: 201,
      isHot: true,
      isNew: true,
      isViral: false,
      difficulty: "easy",
      duration: 6,
      hasAudio: false,
      hasImages: true,
      cliffhangerLevel: 4
    },
    {
      title: "The Inheritance War",
      description: "When grandma's will is read, family secrets explode in the group chat. Money changes everything.",
      category: "Secrets",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
      views: 3421,
      shares: 234,
      likes: 567,
      isHot: true,
      isNew: false,
      isViral: true,
      difficulty: "hard",
      duration: 12,
      hasAudio: true,
      hasImages: false,
      cliffhangerLevel: 5
    },
    {
      title: "Catfish Revealed",
      description: "After 6 months of online dating, she's about to meet him for the first time. But he's not who she thinks...",
      category: "Romance",
      imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400",
      views: 1567,
      shares: 78,
      likes: 145,
      isHot: false,
      isNew: true,
      isViral: false,
      difficulty: "medium",
      duration: 7,
      hasAudio: false,
      hasImages: true,
      cliffhangerLevel: 4
    },
    {
      title: "Wedding Day Disaster",
      description: "The bride finds photos on her phone that change everything. Will she go through with the wedding?",
      category: "Heartbreak",
      imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400",
      views: 4123,
      shares: 312,
      likes: 678,
      isHot: true,
      isNew: false,
      isViral: true,
      difficulty: "medium",
      duration: 10,
      hasAudio: true,
      hasImages: true,
      cliffhangerLevel: 5
    },
    {
      title: "The Anonymous Tip",
      description: "Someone sends proof that her boyfriend is cheating. But who is trying to destroy their relationship?",
      category: "Mystery",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      views: 987,
      shares: 45,
      likes: 89,
      isHot: false,
      isNew: true,
      isViral: false,
      difficulty: "hard",
      duration: 9,
      hasAudio: false,
      hasImages: false,
      cliffhangerLevel: 3
    }
  ]).returning();

  // Update category counts
  for (const category of categoryData) {
    const count = storyData.filter(story => story.category === category.name).length;
    await db.update(categories).set({ count }).where(eq(categories.id, category.id));
  }

  // Seed comprehensive messages for all stories
  const messageData = [];

  // Story 1: The Affair Exposed
  const story1 = storyData[0];
  messageData.push(
    {
      storyId: story1.id,
      content: "Hey babe, can't wait to see you tonight 😘",
      isIncoming: false,
      timestamp: "10:30",
      hasReadReceipt: true,
      order: 1
    },
    {
      storyId: story1.id,
      content: "Sarah's working late again... perfect timing 😏",
      isIncoming: true,
      timestamp: "10:32",
      hasReadReceipt: true,
      order: 2
    },
    {
      storyId: story1.id,
      content: "I feel so bad lying to her but...",
      isIncoming: false,
      timestamp: "10:33",
      hasReadReceipt: true,
      order: 3
    },
    {
      storyId: story1.id,
      content: "Don't feel bad. She doesn't appreciate you like I do ❤️",
      isIncoming: true,
      timestamp: "10:35",
      hasReadReceipt: true,
      order: 4
    },
    {
      storyId: story1.id,
      content: "You're right. I love you Emma",
      isIncoming: false,
      timestamp: "10:36",
      hasReadReceipt: true,
      order: 5
    },
    {
      storyId: story1.id,
      content: "I can't believe I'm saying this but... I'm falling for you",
      isIncoming: false,
      timestamp: "10:37",
      hasReadReceipt: true,
      order: 6
    },
    {
      storyId: story1.id,
      content: "I've been waiting so long to hear you say that 💕",
      isIncoming: true,
      timestamp: "10:39",
      hasReadReceipt: true,
      order: 7
    },
    {
      storyId: story1.id,
      content: "What about Sarah? Are you going to tell her?",
      isIncoming: true,
      timestamp: "10:40",
      hasReadReceipt: true,
      order: 8
    },
    {
      storyId: story1.id,
      content: "WHO IS EMMA?!",
      isIncoming: false,
      timestamp: "10:45",
      hasReadReceipt: false,
      order: 9
    },
    {
      storyId: story1.id,
      content: "SARAH?! How long have you been reading our messages?!",
      isIncoming: true,
      timestamp: "10:46",
      hasReadReceipt: false,
      order: 10
    }
  );

  // Story 2: Office Romance Gone Wrong
  const story2 = storyData[1];
  messageData.push(
    {
      storyId: story2.id,
      content: "Conference room B is empty 😉",
      isIncoming: false,
      timestamp: "2:15",
      hasReadReceipt: true,
      order: 1
    },
    {
      storyId: story2.id,
      content: "On my way! Can't wait to see you alone",
      isIncoming: true,
      timestamp: "2:16",
      hasReadReceipt: true,
      order: 2
    },
    {
      storyId: story2.id,
      content: "We need to be more careful... people are starting to notice",
      isIncoming: false,
      timestamp: "2:17",
      hasReadReceipt: true,
      order: 3
    },
    {
      storyId: story2.id,
      content: "Like who? We've been so discreet",
      isIncoming: true,
      timestamp: "2:18",
      hasReadReceipt: true,
      order: 4
    },
    {
      storyId: story2.id,
      content: "Well, well, well... interesting conversation you two are having",
      isIncoming: true,
      timestamp: "2:20",
      hasReadReceipt: false,
      order: 5
    },
    {
      storyId: story2.id,
      content: "Mr. Johnson?! How did you get in this chat?",
      isIncoming: false,
      timestamp: "2:21",
      hasReadReceipt: false,
      order: 6
    }
  );

  // Story 3: The Inheritance War
  const story3 = storyData[2];
  messageData.push(
    {
      storyId: story3.id,
      content: "The will reading is about to start. Everyone here?",
      isIncoming: false,
      timestamp: "3:00",
      hasReadReceipt: true,
      order: 1
    },
    {
      storyId: story3.id,
      content: "I'm here. This better be good news for once",
      isIncoming: true,
      timestamp: "3:01",
      hasReadReceipt: true,
      order: 2
    },
    {
      storyId: story3.id,
      content: "OMG you guys... I can't believe what the lawyer just said",
      isIncoming: false,
      timestamp: "3:45",
      hasReadReceipt: true,
      order: 3
    },
    {
      storyId: story3.id,
      content: "What?! Tell us already!",
      isIncoming: true,
      timestamp: "3:46",
      hasReadReceipt: true,
      order: 4
    },
    {
      storyId: story3.id,
      content: "Grandma left EVERYTHING to someone we've never heard of",
      isIncoming: false,
      timestamp: "3:47",
      hasReadReceipt: true,
      order: 5
    },
    {
      storyId: story3.id,
      content: "WHAT?! Who?!",
      isIncoming: true,
      timestamp: "3:47",
      hasReadReceipt: true,
      order: 6
    },
    {
      storyId: story3.id,
      content: "Someone named Maria Rodriguez. Says she's grandma's daughter",
      isIncoming: false,
      timestamp: "3:48",
      hasReadReceipt: false,
      order: 7
    }
  );

  // Story 4: Catfish Revealed
  const story4 = storyData[3];
  messageData.push(
    {
      storyId: story4.id,
      content: "I'm so nervous about meeting you today 😊",
      isIncoming: false,
      timestamp: "6:00",
      hasReadReceipt: true,
      order: 1
    },
    {
      storyId: story4.id,
      content: "Don't be! I'm excited to finally see you in person",
      isIncoming: true,
      timestamp: "6:02",
      hasReadReceipt: true,
      order: 2
    },
    {
      storyId: story4.id,
      content: "I'll be wearing the blue dress like I showed you",
      isIncoming: false,
      timestamp: "6:05",
      hasReadReceipt: true,
      order: 3
    },
    {
      storyId: story4.id,
      content: "I'm here at the cafe. Where are you?",
      isIncoming: false,
      timestamp: "7:00",
      hasReadReceipt: true,
      order: 4
    },
    {
      storyId: story4.id,
      content: "I can see you... but I'm not who you think I am",
      isIncoming: true,
      timestamp: "7:05",
      hasReadReceipt: false,
      order: 5
    }
  );

  // Story 5: Wedding Day Disaster
  const story5 = storyData[4];
  messageData.push(
    {
      storyId: story5.id,
      content: "Can't wait to marry you today! ❤️",
      isIncoming: false,
      timestamp: "9:00",
      hasReadReceipt: true,
      order: 1
    },
    {
      storyId: story5.id,
      content: "I love you so much. See you at the altar",
      isIncoming: true,
      timestamp: "9:02",
      hasReadReceipt: true,
      order: 2
    },
    {
      storyId: story5.id,
      content: "Um... who sent these photos to your phone?",
      isIncoming: false,
      timestamp: "10:30",
      hasReadReceipt: true,
      order: 3
    },
    {
      storyId: story5.id,
      content: "What photos? I didn't get any photos",
      isIncoming: true,
      timestamp: "10:31",
      hasReadReceipt: true,
      order: 4
    },
    {
      storyId: story5.id,
      content: "The ones of you and my maid of honor from last night",
      isIncoming: false,
      timestamp: "10:32",
      hasReadReceipt: false,
      order: 5
    }
  );

  // Story 6: The Anonymous Tip
  const story6 = storyData[5];
  messageData.push(
    {
      storyId: story6.id,
      content: "You don't know me, but I have something to show you",
      isIncoming: true,
      timestamp: "8:00",
      hasReadReceipt: false,
      order: 1
    },
    {
      storyId: story6.id,
      content: "Who is this? How did you get my number?",
      isIncoming: false,
      timestamp: "8:01",
      hasReadReceipt: true,
      order: 2
    },
    {
      storyId: story6.id,
      content: "That doesn't matter. What matters is what your boyfriend is doing behind your back",
      isIncoming: true,
      timestamp: "8:02",
      hasReadReceipt: false,
      order: 3
    },
    {
      storyId: story6.id,
      content: "I don't believe you. Show me proof",
      isIncoming: false,
      timestamp: "8:03",
      hasReadReceipt: true,
      order: 4
    },
    {
      storyId: story6.id,
      content: "[Photo sent]",
      isIncoming: true,
      timestamp: "8:04",
      hasReadReceipt: false,
      order: 5
    }
  );

  await db.insert(messages).values(messageData);

  console.log("Database seeded successfully!");
  console.log(`Created ${plans.length} subscription plans`);
  console.log(`Created ${categoryData.length} categories`);
  console.log(`Created ${storyData.length} stories`);
  console.log(`Created 1 admin user`);
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch(console.error).finally(() => process.exit(0));
}

export { seed };