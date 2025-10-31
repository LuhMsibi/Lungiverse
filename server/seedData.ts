import { db } from "./db";
import { tools, articles } from "@shared/schema";

// Import the canonical seed data from seed.ts (source of truth)
// This ensures production and development use the same dataset
import { toolsData, articlesData } from "./seed";

/**
 * Seeds the database with AI tools and articles.
 * Safe to run multiple times - inserts new tools and updates existing articles with latest data.
 * Returns statistics about what was processed.
 */
export async function seedDatabase() {
  let toolsInserted = 0;
  let toolsSkipped = 0;
  let articlesInserted = 0;
  let articlesSkipped = 0;
  
  // Insert tools with conflict handling
  for (const tool of toolsData) {
    try {
      const result = await db.insert(tools).values(tool).onConflictDoNothing().returning();
      if (result.length > 0) {
        toolsInserted++;
      } else {
        toolsSkipped++;
      }
    } catch (error) {
      console.error(`Error inserting tool ${tool.name}:`, error);
      toolsSkipped++;
    }
  }
  
  // Insert or update articles with conflict handling
  for (const article of articlesData) {
    try {
      const result = await db.insert(articles)
        .values(article)
        .onConflictDoUpdate({
          target: articles.slug,
          set: {
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            coverImage: article.coverImage,
            category: article.category,
            authorName: article.authorName,
            authorAvatar: article.authorAvatar,
            publishedAt: article.publishedAt,
            readTime: article.readTime,
            tags: article.tags,
          }
        })
        .returning();
      
      if (result.length > 0) {
        articlesInserted++;
      }
    } catch (error) {
      console.error(`Error inserting/updating article ${article.title}:`, error);
      articlesSkipped++;
    }
  }
  
  return {
    toolsTotal: toolsData.length,
    toolsInserted,
    toolsSkipped,
    articlesTotal: articlesData.length,
    articlesInserted,
    articlesSkipped,
  };
}
