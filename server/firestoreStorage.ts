/**
 * Firestore Storage Layer
 * Replaces dbStorage.ts - provides all CRUD operations using Firebase Firestore
 */

import admin from "firebase-admin";
import { firestore, timestamp } from "./firebaseAdmin";
import type { IStorage } from "./storage";
import type { Tool, Article, User, Favorite, Review } from "@shared/schema";

// Import FieldValue for increment operations
const FieldValue = admin.firestore.FieldValue;

export class FirestoreStorage implements IStorage {
  private db = firestore;

  // ============ TOOLS ============

  async getAllTools(): Promise<Tool[]> {
    const snapshot = await this.db.collection("tools").orderBy("id").get();
    return snapshot.docs.map(doc => this.mapTool(doc.data()));
  }

  async getTools(): Promise<Tool[]> {
    return this.getAllTools();
  }

  async getToolById(id: number | string): Promise<Tool | null> {
    const doc = await this.db.collection("tools").doc(String(id)).get();
    if (!doc.exists) return null;
    return this.mapTool(doc.data());
  }

  async searchTools(query: string): Promise<Tool[]> {
    const tools = await this.getAllTools();
    const lowerQuery = query.toLowerCase();
    
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.category.toLowerCase().includes(lowerQuery) ||
      tool.features.some(f => f.toLowerCase().includes(lowerQuery))
    );
  }

  async createTool(tool: Omit<Tool, "id" | "createdAt" | "updatedAt">): Promise<Tool> {
    // Get next ID
    const toolsSnapshot = await this.db.collection("tools").orderBy("id", "desc").limit(1).get();
    const nextId = toolsSnapshot.empty ? 1 : (toolsSnapshot.docs[0].data().id + 1);

    const now = timestamp.now();
    const newTool = {
      ...tool,
      id: nextId,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.collection("tools").doc(String(nextId)).set(newTool);
    return this.mapTool(newTool);
  }

  async incrementToolView(id: number): Promise<void> {
    const docRef = this.db.collection("tools").doc(String(id));
    await docRef.update({
      viewCount: FieldValue.increment(1),
    });
  }

  // ============ ARTICLES ============

  async getAllArticles(): Promise<Article[]> {
    const snapshot = await this.db.collection("articles")
      .orderBy("publishedAt", "desc")
      .get();
    return snapshot.docs.map(doc => this.mapArticle(doc.data()));
  }

  async getArticles(): Promise<Article[]> {
    return this.getAllArticles();
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const snapshot = await this.db.collection("articles")
      .where("slug", "==", slug)
      .limit(1)
      .get();
    
    if (snapshot.empty) return null;
    return this.mapArticle(snapshot.docs[0].data());
  }

  async createArticle(article: Omit<Article, "id" | "createdAt">): Promise<Article> {
    // Get next ID
    const articlesSnapshot = await this.db.collection("articles").orderBy("id", "desc").limit(1).get();
    const nextId = articlesSnapshot.empty ? 1 : (articlesSnapshot.docs[0].data().id + 1);

    const now = timestamp.now();
    const newArticle = {
      ...article,
      id: nextId,
      createdAt: now,
    };

    await this.db.collection("articles").doc(String(nextId)).set(newArticle);
    return this.mapArticle(newArticle);
  }

  async deleteArticle(id: number): Promise<void> {
    await this.db.collection("articles").doc(String(id)).delete();
  }

  // ============ USERS ============

  async getOrCreateUser(userData: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  }): Promise<User> {
    const userRef = this.db.collection("users").doc(userData.id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user
      await userRef.update({
        email: userData.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        profileImageUrl: userData.profileImageUrl || "",
        updatedAt: timestamp.now(),
      });
      return this.mapUser(userDoc.data());
    } else {
      // Create new user
      const now = timestamp.now();
      const newUser = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        profileImageUrl: userData.profileImageUrl || "",
        isAdmin: false,
        createdAt: now,
        updatedAt: now,
      };
      
      await userRef.set(newUser);
      return this.mapUser(newUser);
    }
  }

  async getUserById(id: string): Promise<User | null> {
    const doc = await this.db.collection("users").doc(id).get();
    if (!doc.exists) return null;
    return this.mapUser(doc.data());
  }

  // ============ FAVORITES ============

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const snapshot = await this.db.collection("favorites")
      .where("userId", "==", userId)
      .get();
    return snapshot.docs.map(doc => this.mapFavorite(doc.data()));
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return this.getUserFavorites(userId);
  }

  async addFavorite(userId: string, toolId: number): Promise<Favorite> {
    // Check if already exists
    const existing = await this.db.collection("favorites")
      .where("userId", "==", userId)
      .where("toolId", "==", toolId)
      .limit(1)
      .get();

    if (!existing.empty) {
      return this.mapFavorite(existing.docs[0].data());
    }

    // Get next ID
    const favoritesSnapshot = await this.db.collection("favorites").orderBy("id", "desc").limit(1).get();
    const nextId = favoritesSnapshot.empty ? 1 : (favoritesSnapshot.docs[0].data().id + 1);

    const now = timestamp.now();
    const newFavorite = {
      id: nextId,
      userId,
      toolId,
      createdAt: now,
    };

    await this.db.collection("favorites").doc(String(nextId)).set(newFavorite);
    return this.mapFavorite(newFavorite);
  }

  async removeFavorite(userId: string, toolId: number): Promise<void> {
    const snapshot = await this.db.collection("favorites")
      .where("userId", "==", userId)
      .where("toolId", "==", toolId)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
    }
  }

  async isFavorited(userId: string, toolId: number): Promise<boolean> {
    const snapshot = await this.db.collection("favorites")
      .where("userId", "==", userId)
      .where("toolId", "==", toolId)
      .limit(1)
      .get();
    return !snapshot.empty;
  }

  // ============ SEARCH HISTORY ============

  async addSearchHistory(userId: string, query: string): Promise<any> {
    const snapshot = await this.db.collection("search_history").orderBy("id", "desc").limit(1).get();
    const nextId = snapshot.empty ? 1 : (snapshot.docs[0].data().id + 1);
    
    const now = timestamp.now();
    const newHistory = {
      id: nextId,
      userId,
      query,
      createdAt: now,
    };
    
    await this.db.collection("search_history").doc(String(nextId)).set(newHistory);
    return newHistory;
  }

  async getUserSearchHistory(userId: string, limit: number = 10): Promise<any[]> {
    const snapshot = await this.db.collection("search_history")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => doc.data());
  }

  async clearUserSearchHistory(userId: string): Promise<void> {
    const snapshot = await this.db.collection("search_history")
      .where("userId", "==", userId)
      .get();
    
    const batch = this.db.batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // ============ ANALYTICS ============

  async trackEvent(event: { toolId: number; eventType: string; userId: string | null; metadata: any }): Promise<void> {
    const snapshot = await this.db.collection("analytics").orderBy("id", "desc").limit(1).get();
    const nextId = snapshot.empty ? 1 : (snapshot.docs[0].data().id + 1);
    
    const now = timestamp.now();
    const newEvent = {
      id: nextId,
      ...event,
      createdAt: now,
    };
    
    await this.db.collection("analytics").doc(String(nextId)).set(newEvent);
  }

  async incrementToolViewCount(toolId: number): Promise<void> {
    return this.incrementToolView(toolId);
  }

  async incrementToolUsageCount(toolId: number): Promise<void> {
    const toolRef = this.db.collection("tools").doc(String(toolId));
    const doc = await toolRef.get();
    if (doc.exists) {
      await toolRef.update({
        usageCount: (doc.data()?.usageCount || 0) + 1,
      });
    }
  }

  async getPopularTools(limit: number = 10): Promise<Tool[]> {
    const snapshot = await this.db.collection("tools")
      .orderBy("viewCount", "desc")
      .limit(limit)
      .get();
    return snapshot.docs.map(doc => this.mapTool(doc.data()));
  }

  async getTrendingTools(limit: number = 10, daysSince: number = 7): Promise<Tool[]> {
    // For simplicity, return most viewed tools
    return this.getPopularTools(limit);
  }

  async getToolAnalytics(toolId: number): Promise<any> {
    const tool = await this.getToolById(toolId);
    return {
      toolId,
      viewCount: tool?.viewCount || 0,
      usageCount: tool?.usageCount || 0,
      averageRating: tool?.averageRating || 0,
      reviewCount: tool?.reviewCount || 0,
    };
  }

  // ============ REVIEWS ============

  async getUserReview(userId: string, toolId: number): Promise<Review | null> {
    const snapshot = await this.db.collection("reviews")
      .where("userId", "==", userId)
      .where("toolId", "==", toolId)
      .limit(1)
      .get();
    return snapshot.empty ? null : this.mapReview(snapshot.docs[0].data());
  }

  async addReview(userId: string, toolId: number, rating: number, comment: string): Promise<Review> {
    return this.createReview({ userId, toolId, rating, comment });
  }

  async getToolReviews(toolId: number): Promise<Review[]> {
    return this.getReviewsByTool(toolId);
  }

  async updateReview(reviewId: number, rating: number, comment: string): Promise<Review> {
    const reviewRef = this.db.collection("reviews").doc(String(reviewId));
    await reviewRef.update({ rating, comment });
    const doc = await reviewRef.get();
    if (!doc.exists) throw new Error("Review not found");
    
    // Update tool rating
    const reviewData = doc.data();
    await this.updateToolRating(reviewData.toolId);
    
    return this.mapReview(reviewData);
  }

  async deleteReview(reviewId: number): Promise<void> {
    const reviewRef = this.db.collection("reviews").doc(String(reviewId));
    const doc = await reviewRef.get();
    if (!doc.exists) return;
    
    const toolId = doc.data()?.toolId;
    await reviewRef.delete();
    
    // Update tool rating
    if (toolId) {
      await this.updateToolRating(toolId);
    }
  }

  async getReviewsByTool(toolId: number): Promise<Review[]> {
    const snapshot = await this.db.collection("reviews")
      .where("toolId", "==", toolId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map(doc => this.mapReview(doc.data()));
  }

  async createReview(review: Omit<Review, "id" | "createdAt">): Promise<Review> {
    // Check if user already reviewed this tool
    const existing = await this.db.collection("reviews")
      .where("userId", "==", review.userId)
      .where("toolId", "==", review.toolId)
      .limit(1)
      .get();

    if (!existing.empty) {
      throw new Error("You have already reviewed this tool");
    }

    // Get next ID
    const reviewsSnapshot = await this.db.collection("reviews").orderBy("id", "desc").limit(1).get();
    const nextId = reviewsSnapshot.empty ? 1 : (reviewsSnapshot.docs[0].data().id + 1);

    const now = timestamp.now();
    const newReview = {
      ...review,
      id: nextId,
      createdAt: now,
    };

    await this.db.collection("reviews").doc(String(nextId)).set(newReview);

    // Update tool's average rating
    await this.updateToolRating(review.toolId);

    return this.mapReview(newReview);
  }

  private async updateToolRating(toolId: number): Promise<void> {
    const reviews = await this.getReviewsByTool(toolId);
    const averageRating = reviews.length > 0
      ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length)
      : 0;

    await this.db.collection("tools").doc(String(toolId)).update({
      averageRating,
      reviewCount: reviews.length,
    });
  }

  // ============ HELPER MAPPERS ============

  private mapTool(data: any): Tool {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      features: data.features || [],
      isPaid: data.isPaid || false,
      requiresAPI: data.requiresAPI || false,
      url: data.url || "",
      usageCount: data.usageCount || 0,
      viewCount: data.viewCount || 0,
      averageRating: data.averageRating || 0,
      reviewCount: data.reviewCount || 0,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
    };
  }

  private mapArticle(data: any): Article {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      category: data.category,
      authorName: data.authorName,
      authorAvatar: data.authorAvatar || "",
      publishedAt: data.publishedAt?.toDate?.() || new Date(data.publishedAt),
      readTime: data.readTime,
      tags: data.tags || [],
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    };
  }

  private mapUser(data: any): User {
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      profileImageUrl: data.profileImageUrl || "",
      isAdmin: data.isAdmin || false,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
    };
  }

  private mapFavorite(data: any): Favorite {
    return {
      id: data.id,
      userId: data.userId,
      toolId: data.toolId,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    };
  }

  private mapReview(data: any): Review {
    return {
      id: data.id,
      userId: data.userId,
      toolId: data.toolId,
      rating: data.rating,
      comment: data.comment || "",
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    };
  }
}
