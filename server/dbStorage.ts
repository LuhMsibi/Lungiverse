import { db } from "./db";
import { 
  tools, 
  articles, 
  users, 
  favorites, 
  reviews,
  searchHistory,
  analyticsEvents,
  type Tool, 
  type Article, 
  type User, 
  type UpsertUser,
  type Favorite,
  type InsertFavorite,
  type Review,
  type SearchHistory,
  type InsertSearchHistory,
  type AnalyticsEvent,
  type InsertAnalyticsEvent
} from "@shared/schema";
import { sql, ilike, or, eq, desc, and, count, gt } from "drizzle-orm";

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

  async createTool(toolData: {
    name: string;
    description: string;
    category: string;
    features: string[];
    isPaid: boolean;
    requiresAPI: boolean;
    url?: string;
  }): Promise<Tool> {
    const [tool] = await db
      .insert(tools)
      .values(toolData)
      .returning();
    return tool;
  }

  async createArticle(articleData: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    authorName: string;
    authorAvatar?: string;
    readTime: string;
    tags: string[];
  }): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values({
        ...articleData,
        publishedAt: new Date(),
      })
      .returning();
    return article;
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

  // Review operations
  async addReview(userId: string, toolId: number, rating: number, comment?: string): Promise<Review> {
    const [review] = await db
      .insert(reviews)
      .values({ userId, toolId, rating, comment })
      .returning();
    
    await this.updateToolRating(toolId);
    return review;
  }

  async getToolReviews(toolId: number): Promise<Array<Review & { userName: string; userAvatar?: string }>> {
    const result = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        toolId: reviews.toolId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: sql<string>`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
        userAvatar: users.profileImageUrl,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.toolId, toolId))
      .orderBy(desc(reviews.createdAt));
    return result;
  }

  async getUserReview(userId: string, toolId: number): Promise<Review | undefined> {
    const result = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.userId, userId), eq(reviews.toolId, toolId)))
      .limit(1);
    return result[0];
  }

  async updateReview(reviewId: number, rating: number, comment?: string): Promise<Review> {
    const [review] = await db
      .update(reviews)
      .set({ rating, comment, updatedAt: new Date() })
      .where(eq(reviews.id, reviewId))
      .returning();
    
    await this.updateToolRating(review.toolId);
    return review;
  }

  async getReviewById(reviewId: number): Promise<Review | undefined> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);
    return result[0];
  }

  async deleteReview(reviewId: number): Promise<void> {
    const result = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);
    
    if (result.length > 0) {
      const toolId = result[0].toolId;
      await db.delete(reviews).where(eq(reviews.id, reviewId));
      await this.updateToolRating(toolId);
    }
  }

  private async updateToolRating(toolId: number): Promise<void> {
    const result = await db
      .select({
        count: count(reviews.id),
        avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
      })
      .from(reviews)
      .where(eq(reviews.toolId, toolId));
    
    const reviewCount = Number(result[0]?.count || 0);
    const averageRating = Math.round(Number(result[0]?.avg || 0));

    await db
      .update(tools)
      .set({ reviewCount, averageRating })
      .where(eq(tools.id, toolId));
  }

  // Analytics operations
  async trackEvent(event: InsertAnalyticsEvent): Promise<void> {
    await db.insert(analyticsEvents).values(event);
  }

  async getPopularTools(limit: number = 10): Promise<Tool[]> {
    return await db
      .select()
      .from(tools)
      .orderBy(desc(tools.viewCount), desc(tools.usageCount))
      .limit(limit);
  }

  async getTrendingTools(limit: number = 10, daysSince: number = 7): Promise<Tool[]> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysSince);
    
    const recentViews = await db
      .select({
        toolId: analyticsEvents.toolId,
        eventCount: count(analyticsEvents.id).as('count'),
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.eventType, 'view'),
          gt(analyticsEvents.createdAt, sinceDate)
        )
      )
      .groupBy(analyticsEvents.toolId)
      .orderBy(desc(sql`count`))
      .limit(limit);

    const toolIds = recentViews.map(rv => rv.toolId);
    if (toolIds.length === 0) {
      return await this.getPopularTools(limit);
    }

    const trendingTools = await db
      .select()
      .from(tools)
      .where(sql`${tools.id} IN (${sql.join(toolIds, sql`, `)})`);
    
    return toolIds.map(id => trendingTools.find(t => t.id === id)).filter(Boolean) as Tool[];
  }

  async getToolAnalytics(toolId: number): Promise<{
    viewCount: number;
    usageCount: number;
    recentViews: number;
    recentClicks: number;
  }> {
    const tool = await this.getToolById(toolId);
    if (!tool) {
      throw new Error('Tool not found');
    }

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 7);

    const recentEvents = await db
      .select({
        eventType: analyticsEvents.eventType,
        eventCount: count(analyticsEvents.id).as('count'),
      })
      .from(analyticsEvents)
      .where(
        and(
          eq(analyticsEvents.toolId, toolId),
          gt(analyticsEvents.createdAt, sinceDate)
        )
      )
      .groupBy(analyticsEvents.eventType);

    const recentViews = recentEvents.find(e => e.eventType === 'view')?.eventCount || 0;
    const recentClicks = recentEvents.find(e => e.eventType === 'click')?.eventCount || 0;

    return {
      viewCount: tool.viewCount,
      usageCount: tool.usageCount,
      recentViews: Number(recentViews),
      recentClicks: Number(recentClicks),
    };
  }
}

export const storage = new DBStorage();
