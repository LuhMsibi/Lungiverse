import { db } from "./db";
import { tools, articles, users, type Tool, type Article, type User, type UpsertUser } from "@shared/schema";
import { sql, ilike, or, eq, desc } from "drizzle-orm";

export class DBStorage {
  // User operations (for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Tool operations
  async getAllTools(): Promise<Tool[]> {
    return await db.select().from(tools).orderBy(desc(tools.usageCount));
  }

  async getToolById(id: number): Promise<Tool | undefined> {
    const result = await db.select().from(tools).where(eq(tools.id, id)).limit(1);
    return result[0];
  }

  async searchTools(query: string): Promise<Tool[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(tools)
      .where(
        or(
          ilike(tools.name, searchPattern),
          ilike(tools.description, searchPattern),
          ilike(tools.category, searchPattern)
        )
      )
      .orderBy(desc(tools.usageCount));
  }

  async getAllArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.publishedAt));
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    const result = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
    return result[0];
  }

  async incrementToolViewCount(toolId: number): Promise<void> {
    await db
      .update(tools)
      .set({ viewCount: sql`${tools.viewCount} + 1` })
      .where(eq(tools.id, toolId));
  }

  async incrementToolUsageCount(toolId: number): Promise<void> {
    await db
      .update(tools)
      .set({ usageCount: sql`${tools.usageCount} + 1` })
      .where(eq(tools.id, toolId));
  }
}

export const storage = new DBStorage();
