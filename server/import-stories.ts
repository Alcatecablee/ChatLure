import fs from 'fs';
import { db } from './db';
import { stories, messages } from '@shared/schema';

interface ImportStory {
  id: string;
  title: string;
  description: string;
  category: string;
  characters: Array<{
    id: string;
    name: string;
    avatar: string;
    color: string;
  }>;
  messages: Array<{
    id: string;
    type: string;
    sender: string;
    content: string;
    timestamp: number;
    delay: number;
  }>;
}

export async function importStoriesFromJSON(filePath: string) {
  try {
    console.log(`Reading stories from ${filePath}...`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const storiesData: ImportStory[] = JSON.parse(fileContent);
    
    console.log(`Found ${storiesData.length} stories to import`);
    
    for (const storyData of storiesData) {
      try {
        // Create the story first
        const [insertedStory] = await db.insert(stories).values({
          title: storyData.title,
          description: storyData.description,
          category: storyData.category,
          imageUrl: `/stories/${storyData.category.toLowerCase()}-${storyData.id}.jpg`,
          views: 0,
          shares: 0,
          likes: 0,
          isHot: Math.random() > 0.7,
          isNew: Math.random() > 0.5,
          isViral: Math.random() > 0.8,
          difficulty: "medium",
          duration: Math.ceil(storyData.messages.length / 10), // Rough estimate
          hasAudio: false,
          hasImages: Math.random() > 0.6,
          cliffhangerLevel: Math.floor(Math.random() * 5) + 1,
        }).returning();
        
        console.log(`Created story: ${insertedStory.title} (ID: ${insertedStory.id})`);
        
        // Now insert all messages for this story
        const messageInserts = storyData.messages.map((msg, index) => ({
          storyId: insertedStory.id,
          content: msg.content,
          isIncoming: msg.sender !== 'user',
          timestamp: new Date(msg.timestamp).toISOString(),
          hasReadReceipt: false,
          order: index + 1,
        }));
        
        await db.insert(messages).values(messageInserts);
        console.log(`  Inserted ${messageInserts.length} messages`);
        
      } catch (error) {
        console.error(`Failed to import story "${storyData.title}":`, error);
      }
    }
    
    console.log('Story import completed');
    return { success: true, imported: storiesData.length };
    
  } catch (error) {
    console.error('Failed to import stories:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}