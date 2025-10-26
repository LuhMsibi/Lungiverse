import { db } from "./db";
import { 
  tools, 
  articles, 
  users, 
  favorites, 
  searchHistory,
  type Tool, 
  type Article, 
  type User, 
  type UpsertUser,
  type Favorite,
  type InsertFavorite,
  type SearchHistory,
  type InsertSearchHistory
} from "@shared/schema";
import { sql, ilike, or, eq, desc, and } from "drizzle-orm";

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

  // Favorites operations
  async addFavorite(userId: string, toolId: number): Promise<Favorite> {
    const [favorite] = await db
      .insert(favorites)
      .values({ userId, toolId })
      .returning();
    return favorite;
  }

  async removeFavorite(userId: string, toolId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.toolId, toolId)));
  }

  async getUserFavorites(userId: string): Promise<Tool[]> {
    const result = await db
      .select({
        id: tools.id,
        name: tools.name,
        description: tools.description,
        category: tools.category,
        features: tools.features,
        isPaid: tools.isPaid,
        requiresAPI: tools.requiresAPI,
        url: tools.url,
        usageCount: tools.usageCount,
        viewCount: tools.viewCount,
        averageRating: tools.averageRating,
        reviewCount: tools.reviewCount,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
      })
      .from(favorites)
      .innerJoin(tools, eq(favorites.toolId, tools.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
    return result;
  }

  async isFavorited(userId: string, toolId: number): Promise<boolean> {
    const result = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.toolId, toolId)))
      .limit(1);
    return result.length > 0;
  }

  // Search history operations
  async addSearchHistory(userId: string, query: string): Promise<SearchHistory> {
    const [history] = await db
      .insert(searchHistory)
      .values({ userId, query })
      .returning();
    return history;
  }

  async getUserSearchHistory(userId: string, limit: number = 10): Promise<SearchHistory[]> {
    return await db
      .select()
      .from(searchHistory)
      .where(eq(searchHistory.userId, userId))
      .orderBy(desc(searchHistory.createdAt))
      .limit(limit);
  }

  async clearUserSearchHistory(userId: string): Promise<void> {
    await db
      .delete(searchHistory)
      .where(eq(searchHistory.userId, userId));
  }
}

export const storage = new DBStorage();
