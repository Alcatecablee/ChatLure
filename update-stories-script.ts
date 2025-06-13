import { db } from './server/db';
import { stories } from '@shared/schema';
import { eq } from 'drizzle-orm';

async function updateStoriesMetadata() {
  console.log('Updating stories metadata...');
  
  try {
    // Update first 3 stories to be hot/viral
    await db.update(stories)
      .set({ 
        isHot: true, 
        isViral: true, 
        views: Math.floor(Math.random() * 1000) + 1500,
        likes: Math.floor(Math.random() * 200) + 100,
        shares: Math.floor(Math.random() * 50) + 20
      })
      .where(eq(stories.id, 1));
      
    await db.update(stories)
      .set({ 
        isHot: true, 
        isViral: true, 
        views: Math.floor(Math.random() * 1000) + 1200,
        likes: Math.floor(Math.random() * 180) + 90,
        shares: Math.floor(Math.random() * 40) + 15
      })
      .where(eq(stories.id, 2));
      
    await db.update(stories)
      .set({ 
        isHot: true, 
        isNew: true, 
        views: Math.floor(Math.random() * 800) + 800,
        likes: Math.floor(Math.random() * 150) + 70,
        shares: Math.floor(Math.random() * 30) + 10
      })
      .where(eq(stories.id, 3));
    
    // Update remaining stories to be new
    await db.update(stories)
      .set({ 
        isNew: true, 
        views: Math.floor(Math.random() * 500) + 300,
        likes: Math.floor(Math.random() * 100) + 50,
        shares: Math.floor(Math.random() * 20) + 5
      })
      .where(eq(stories.id, 4));
      
    await db.update(stories)
      .set({ 
        isNew: true, 
        views: Math.floor(Math.random() * 500) + 400,
        likes: Math.floor(Math.random() * 120) + 60,
        shares: Math.floor(Math.random() * 25) + 8
      })
      .where(eq(stories.id, 5));
      
    await db.update(stories)
      .set({ 
        isNew: true, 
        views: Math.floor(Math.random() * 600) + 350,
        likes: Math.floor(Math.random() * 110) + 55,
        shares: Math.floor(Math.random() * 22) + 6
      })
      .where(eq(stories.id, 6));
    
    console.log('Successfully updated all stories with metadata');
    
    // Fetch and display updated stories
    const updatedStories = await db.select().from(stories);
    console.log('\nUpdated stories:');
    updatedStories.forEach(story => {
      console.log(`- ${story.title}: views=${story.views}, likes=${story.likes}, shares=${story.shares}, hot=${story.isHot}, new=${story.isNew}, viral=${story.isViral}`);
    });
    
  } catch (error) {
    console.error('Failed to update stories:', error);
  }
  
  process.exit(0);
}

updateStoriesMetadata().catch(console.error);