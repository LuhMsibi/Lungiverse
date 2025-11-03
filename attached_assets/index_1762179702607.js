// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/firestoreStorage.ts
import admin2 from "firebase-admin";

// server/firebaseAdmin.ts
import admin from "firebase-admin";
var firebaseApp;
function initializeFirebaseAdmin() {
  if (firebaseApp) {
    return firebaseApp;
  }
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || "lungiverse-75fe3";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!clientEmail || !privateKey) {
      throw new Error(
        "Firebase credentials not found. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables."
      );
    }
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey
      }),
      projectId
    });
    console.log("\u2705 Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("\u274C Failed to initialize Firebase Admin SDK:", error);
    throw error;
  }
  return firebaseApp;
}
initializeFirebaseAdmin();
var auth = admin.auth();
var firestore = admin.firestore();
var timestamp = admin.firestore.Timestamp;

// server/firestoreStorage.ts
var FieldValue = admin2.firestore.FieldValue;
var FirestoreStorage = class {
  db = firestore;
  // ============ TOOLS ============
  async getAllTools() {
    const snapshot = await this.db.collection("tools").orderBy("id").get();
    return snapshot.docs.map((doc) => this.mapTool(doc.data()));
  }
  async getTools() {
    return this.getAllTools();
  }
  async getToolById(id) {
    const doc = await this.db.collection("tools").doc(String(id)).get();
    if (!doc.exists) return null;
    return this.mapTool(doc.data());
  }
  async searchTools(query) {
    const tools2 = await this.getAllTools();
    const lowerQuery = query.toLowerCase();
    return tools2.filter(
      (tool) => tool.name.toLowerCase().includes(lowerQuery) || tool.description.toLowerCase().includes(lowerQuery) || tool.category.toLowerCase().includes(lowerQuery) || tool.features.some((f) => f.toLowerCase().includes(lowerQuery))
    );
  }
  async createTool(tool) {
    const toolsSnapshot = await this.db.collection("tools").orderBy("id", "desc").limit(1).get();
    const nextId = toolsSnapshot.empty ? 1 : toolsSnapshot.docs[0].data().id + 1;
    const now = timestamp.now();
    const newTool = {
      ...tool,
      id: nextId,
      createdAt: now,
      updatedAt: now
    };
    await this.db.collection("tools").doc(String(nextId)).set(newTool);
    return this.mapTool(newTool);
  }
  async incrementToolView(id) {
    const docRef = this.db.collection("tools").doc(String(id));
    await docRef.update({
      viewCount: FieldValue.increment(1)
    });
  }
  // ============ ARTICLES ============
  async getAllArticles() {
    const snapshot = await this.db.collection("articles").orderBy("publishedAt", "desc").get();
    return snapshot.docs.map((doc) => this.mapArticle(doc.data()));
  }
  async getArticles() {
    return this.getAllArticles();
  }
  async getArticleBySlug(slug) {
    const snapshot = await this.db.collection("articles").where("slug", "==", slug).limit(1).get();
    if (snapshot.empty) return null;
    return this.mapArticle(snapshot.docs[0].data());
  }
  async createArticle(article) {
    const articlesSnapshot = await this.db.collection("articles").orderBy("id", "desc").limit(1).get();
    const nextId = articlesSnapshot.empty ? 1 : articlesSnapshot.docs[0].data().id + 1;
    const now = timestamp.now();
    const newArticle = {
      ...article,
      id: nextId,
      createdAt: now
    };
    await this.db.collection("articles").doc(String(nextId)).set(newArticle);
    return this.mapArticle(newArticle);
  }
  async deleteArticle(id) {
    await this.db.collection("articles").doc(String(id)).delete();
  }
  // ============ USERS ============
  async getOrCreateUser(userData) {
    const userRef = this.db.collection("users").doc(userData.id);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      await userRef.update({
        email: userData.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        profileImageUrl: userData.profileImageUrl || "",
        updatedAt: timestamp.now()
      });
      return this.mapUser(userDoc.data());
    } else {
      const now = timestamp.now();
      const newUser = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        profileImageUrl: userData.profileImageUrl || "",
        isAdmin: false,
        createdAt: now,
        updatedAt: now
      };
      await userRef.set(newUser);
      return this.mapUser(newUser);
    }
  }
  async getUserById(id) {
    const doc = await this.db.collection("users").doc(id).get();
    if (!doc.exists) return null;
    return this.mapUser(doc.data());
  }
  // ============ FAVORITES ============
  async getUserFavorites(userId) {
    const snapshot = await this.db.collection("favorites").where("userId", "==", userId).get();
    return snapshot.docs.map((doc) => this.mapFavorite(doc.data()));
  }
  async getFavorites(userId) {
    return this.getUserFavorites(userId);
  }
  async addFavorite(userId, toolId) {
    const existing = await this.db.collection("favorites").where("userId", "==", userId).where("toolId", "==", toolId).limit(1).get();
    if (!existing.empty) {
      return this.mapFavorite(existing.docs[0].data());
    }
    const favoritesSnapshot = await this.db.collection("favorites").orderBy("id", "desc").limit(1).get();
    const nextId = favoritesSnapshot.empty ? 1 : favoritesSnapshot.docs[0].data().id + 1;
    const now = timestamp.now();
    const newFavorite = {
      id: nextId,
      userId,
      toolId,
      createdAt: now
    };
    await this.db.collection("favorites").doc(String(nextId)).set(newFavorite);
    return this.mapFavorite(newFavorite);
  }
  async removeFavorite(userId, toolId) {
    const snapshot = await this.db.collection("favorites").where("userId", "==", userId).where("toolId", "==", toolId).limit(1).get();
    if (!snapshot.empty) {
      await snapshot.docs[0].ref.delete();
    }
  }
  async isFavorited(userId, toolId) {
    const snapshot = await this.db.collection("favorites").where("userId", "==", userId).where("toolId", "==", toolId).limit(1).get();
    return !snapshot.empty;
  }
  // ============ SEARCH HISTORY ============
  async addSearchHistory(userId, query) {
    const snapshot = await this.db.collection("search_history").orderBy("id", "desc").limit(1).get();
    const nextId = snapshot.empty ? 1 : snapshot.docs[0].data().id + 1;
    const now = timestamp.now();
    const newHistory = {
      id: nextId,
      userId,
      query,
      createdAt: now
    };
    await this.db.collection("search_history").doc(String(nextId)).set(newHistory);
    return newHistory;
  }
  async getUserSearchHistory(userId, limit = 10) {
    const snapshot = await this.db.collection("search_history").where("userId", "==", userId).orderBy("createdAt", "desc").limit(limit).get();
    return snapshot.docs.map((doc) => doc.data());
  }
  async clearUserSearchHistory(userId) {
    const snapshot = await this.db.collection("search_history").where("userId", "==", userId).get();
    const batch = this.db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  // ============ ANALYTICS ============
  async trackEvent(event) {
    const snapshot = await this.db.collection("analytics").orderBy("id", "desc").limit(1).get();
    const nextId = snapshot.empty ? 1 : snapshot.docs[0].data().id + 1;
    const now = timestamp.now();
    const newEvent = {
      id: nextId,
      ...event,
      createdAt: now
    };
    await this.db.collection("analytics").doc(String(nextId)).set(newEvent);
  }
  async incrementToolViewCount(toolId) {
    return this.incrementToolView(toolId);
  }
  async incrementToolUsageCount(toolId) {
    const toolRef = this.db.collection("tools").doc(String(toolId));
    const doc = await toolRef.get();
    if (doc.exists) {
      await toolRef.update({
        usageCount: (doc.data()?.usageCount || 0) + 1
      });
    }
  }
  async getPopularTools(limit = 10) {
    const snapshot = await this.db.collection("tools").orderBy("viewCount", "desc").limit(limit).get();
    return snapshot.docs.map((doc) => this.mapTool(doc.data()));
  }
  async getTrendingTools(limit = 10, daysSince = 7) {
    return this.getPopularTools(limit);
  }
  async getToolAnalytics(toolId) {
    const tool = await this.getToolById(toolId);
    return {
      toolId,
      viewCount: tool?.viewCount || 0,
      usageCount: tool?.usageCount || 0,
      averageRating: tool?.averageRating || 0,
      reviewCount: tool?.reviewCount || 0
    };
  }
  // ============ REVIEWS ============
  async getUserReview(userId, toolId) {
    const snapshot = await this.db.collection("reviews").where("userId", "==", userId).where("toolId", "==", toolId).limit(1).get();
    return snapshot.empty ? null : this.mapReview(snapshot.docs[0].data());
  }
  async addReview(userId, toolId, rating, comment) {
    return this.createReview({ userId, toolId, rating, comment });
  }
  async getToolReviews(toolId) {
    return this.getReviewsByTool(toolId);
  }
  async updateReview(reviewId, rating, comment) {
    const reviewRef = this.db.collection("reviews").doc(String(reviewId));
    await reviewRef.update({ rating, comment });
    const doc = await reviewRef.get();
    if (!doc.exists) throw new Error("Review not found");
    const reviewData = doc.data();
    await this.updateToolRating(reviewData.toolId);
    return this.mapReview(reviewData);
  }
  async deleteReview(reviewId) {
    const reviewRef = this.db.collection("reviews").doc(String(reviewId));
    const doc = await reviewRef.get();
    if (!doc.exists) return;
    const toolId = doc.data()?.toolId;
    await reviewRef.delete();
    if (toolId) {
      await this.updateToolRating(toolId);
    }
  }
  async getReviewsByTool(toolId) {
    const snapshot = await this.db.collection("reviews").where("toolId", "==", toolId).orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => this.mapReview(doc.data()));
  }
  async createReview(review) {
    const existing = await this.db.collection("reviews").where("userId", "==", review.userId).where("toolId", "==", review.toolId).limit(1).get();
    if (!existing.empty) {
      throw new Error("You have already reviewed this tool");
    }
    const reviewsSnapshot = await this.db.collection("reviews").orderBy("id", "desc").limit(1).get();
    const nextId = reviewsSnapshot.empty ? 1 : reviewsSnapshot.docs[0].data().id + 1;
    const now = timestamp.now();
    const newReview = {
      ...review,
      id: nextId,
      createdAt: now
    };
    await this.db.collection("reviews").doc(String(nextId)).set(newReview);
    await this.updateToolRating(review.toolId);
    return this.mapReview(newReview);
  }
  async updateToolRating(toolId) {
    const reviews2 = await this.getReviewsByTool(toolId);
    const averageRating = reviews2.length > 0 ? Math.round(reviews2.reduce((sum, r) => sum + r.rating, 0) / reviews2.length) : 0;
    await this.db.collection("tools").doc(String(toolId)).update({
      averageRating,
      reviewCount: reviews2.length
    });
  }
  // ============ HELPER MAPPERS ============
  mapTool(data) {
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
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
    };
  }
  mapArticle(data) {
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
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
    };
  }
  mapUser(data) {
    return {
      id: data.id,
      email: data.email,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      profileImageUrl: data.profileImageUrl || "",
      isAdmin: data.isAdmin || false,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
      updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt)
    };
  }
  mapFavorite(data) {
    return {
      id: data.id,
      userId: data.userId,
      toolId: data.toolId,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
    };
  }
  mapReview(data) {
    return {
      id: data.id,
      userId: data.userId,
      toolId: data.toolId,
      rating: data.rating,
      comment: data.comment || "",
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt)
    };
  }
};

// server/firebaseAuth.ts
async function verifyFirebaseToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = void 0;
      return next();
    }
    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      isAdmin: decodedToken.isAdmin === true
      // Custom claim
    };
    next();
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    req.user = void 0;
    next();
  }
}
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized - Please log in" });
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized - Please log in" });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }
  next();
}
async function setAdminClaim(uid, isAdmin = true) {
  try {
    await auth.setCustomUserClaims(uid, { isAdmin });
    console.log(`\u2705 Admin claim set for user ${uid}: ${isAdmin}`);
    return true;
  } catch (error) {
    console.error(`\u274C Error setting admin claim for user ${uid}:`, error);
    throw error;
  }
}

// shared/schema.ts
import { pgTable, serial, varchar, text, boolean, integer, timestamp as timestamp2, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var toolCategories = [
  "All Tools",
  "Conversion",
  "Image AI",
  "Text AI",
  "Video AI",
  "Audio AI",
  "Code AI"
];
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp2("expire").notNull()
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire)
  })
);
var users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().notNull()
});
var tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type(),
  isPaid: boolean("is_paid").notNull().default(false),
  requiresAPI: boolean("requires_api").notNull().default(false),
  url: varchar("url", { length: 500 }),
  usageCount: integer("usage_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  averageRating: integer("average_rating").default(0),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().notNull()
});
var insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  usageCount: true,
  viewCount: true,
  averageRating: true,
  reviewCount: true,
  createdAt: true,
  updatedAt: true
});
var articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorAvatar: varchar("author_avatar", { length: 500 }),
  publishedAt: timestamp2("published_at").notNull(),
  readTime: varchar("read_time", { length: 50 }).notNull(),
  tags: jsonb("tags").notNull().$type(),
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true
});
var favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  createdAt: timestamp2("created_at").defaultNow().notNull()
}, (table) => ({
  // Prevent duplicate favorites
  uniqueUserTool: sql`UNIQUE (${table.userId}, ${table.toolId})`
}));
var insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true
});
var reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().notNull()
}, (table) => ({
  // Ensure rating is between 1 and 5
  ratingCheck: sql`CHECK (${table.rating} >= 1 AND ${table.rating} <= 5)`
}));
var insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  query: varchar("query", { length: 500 }).notNull(),
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  createdAt: true
});
var analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  eventType: varchar("event_type", { length: 50 }).notNull(),
  // 'view', 'click', 'search'
  userId: varchar("user_id").references(() => users.id),
  metadata: jsonb("metadata").$type(),
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true
});
var toolSubmissions = pgTable("tool_submissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type(),
  isPaid: boolean("is_paid").notNull().default(false),
  requiresAPI: boolean("requires_api").notNull().default(false),
  url: varchar("url", { length: 500 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  // 'pending', 'approved', 'rejected'
  createdAt: timestamp2("created_at").defaultNow().notNull(),
  updatedAt: timestamp2("updated_at").defaultNow().notNull()
});
var insertToolSubmissionSchema = createInsertSchema(toolSubmissions).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true
});
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  // 'new', 'read', 'responded'
  createdAt: timestamp2("created_at").defaultNow().notNull()
});
var insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  status: true,
  createdAt: true
});
var aiToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(toolCategories),
  features: z.array(z.string()),
  isPaid: z.boolean(),
  requiresAPI: z.boolean(),
  url: z.string().optional(),
  usageCount: z.number().optional()
});
var insertAIToolSchema = aiToolSchema.omit({ id: true });
var articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  coverImage: z.string(),
  category: z.string(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional()
  }),
  publishedAt: z.string(),
  readTime: z.string(),
  tags: z.array(z.string())
});
var chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number()
});
var chatRequestSchema = z.object({
  message: z.string(),
  conversationHistory: z.array(chatMessageSchema).optional()
});
var chatResponseSchema = z.object({
  message: z.string(),
  suggestedTools: z.array(z.string()).optional()
});

// server/routes.ts
import OpenAI from "openai";

// server/db.ts
import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle(pool);

// server/seed.ts
var aiTransformImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630";
var aiToolsGuideImage = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630";
var fileConversionImage = "https://images.unsplash.com/photo-1618060932014-4deda4932554?w=1200&h=630";
var aiProductivityImage = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=630";
var futureAIImage = "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=630";
var aiTrendsImage = "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630";
var aiStocksImage = "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=630";
var aiApplicationsImage = "https://images.unsplash.com/photo-1677756119517-756a188d2d94?w=1200&h=630";
var toolsData = [
  // Conversion Tools
  {
    name: "CloudConvert",
    description: "Universal file converter supporting 200+ formats including documents, images, videos, and audio files",
    category: "Conversion",
    features: ["Supports 200+ formats", "Batch processing", "API access available"],
    isPaid: false,
    requiresAPI: true,
    url: "https://cloudconvert.com",
    usageCount: 12500,
    viewCount: 4500
  },
  {
    name: "PDF.co",
    description: "Complete PDF toolkit for converting, merging, splitting, and editing PDF documents with API",
    category: "Conversion",
    features: ["PDF to Word/Excel", "Merge & split PDFs", "OCR support"],
    isPaid: false,
    requiresAPI: true,
    url: "https://pdf.co",
    usageCount: 8900,
    viewCount: 3200
  },
  {
    name: "Zamzar",
    description: "Online file converter for documents, images, videos, and audio with email notification",
    category: "Conversion",
    features: ["1000+ conversion types", "Email delivery", "Cloud storage integration"],
    isPaid: false,
    requiresAPI: false,
    url: "https://www.zamzar.com",
    usageCount: 15200,
    viewCount: 5800
  },
  // Image AI Tools
  {
    name: "DALL-E 3",
    description: "OpenAI's advanced text-to-image generation model creating stunning, photorealistic images",
    category: "Image AI",
    features: ["Photorealistic generation", "Multiple styles", "High resolution output"],
    isPaid: true,
    requiresAPI: true,
    url: "https://openai.com/dall-e-3",
    usageCount: 45e3,
    viewCount: 12e3
  },
  {
    name: "Midjourney",
    description: "AI art generator producing highly artistic and creative images from text descriptions",
    category: "Image AI",
    features: ["Artistic styles", "Community gallery", "Version control"],
    isPaid: true,
    requiresAPI: false,
    url: "https://www.midjourney.com",
    usageCount: 52e3,
    viewCount: 15e3
  },
  {
    name: "Stable Diffusion",
    description: "Open-source text-to-image model with extensive customization and local deployment options",
    category: "Image AI",
    features: ["Open source", "Local deployment", "Fine-tuning support"],
    isPaid: false,
    requiresAPI: true,
    url: "https://stability.ai",
    usageCount: 38e3,
    viewCount: 9500
  },
  {
    name: "Remove.bg",
    description: "AI-powered background removal tool for images with instant, accurate results",
    category: "Image AI",
    features: ["Instant processing", "Bulk editing", "API integration"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.remove.bg",
    usageCount: 28e3,
    viewCount: 7200
  },
  {
    name: "Canva AI",
    description: "Design platform with AI-powered image generation, editing, and enhancement features",
    category: "Image AI",
    features: ["Text to image", "AI upscaling", "Magic eraser"],
    isPaid: false,
    requiresAPI: false,
    url: "https://www.canva.com",
    usageCount: 67e3,
    viewCount: 18e3
  },
  // Text AI Tools
  {
    name: "ChatGPT",
    description: "Advanced conversational AI for writing, coding, analysis, and creative tasks",
    category: "Text AI",
    features: ["Natural conversation", "Code generation", "Multiple languages"],
    isPaid: false,
    requiresAPI: true,
    url: "https://chat.openai.com",
    usageCount: 125e3,
    viewCount: 32e3
  },
  {
    name: "Jasper AI",
    description: "AI writing assistant specialized in marketing copy, blog posts, and creative content",
    category: "Text AI",
    features: ["Marketing templates", "SEO optimization", "Brand voice"],
    isPaid: true,
    requiresAPI: true,
    url: "https://www.jasper.ai",
    usageCount: 34e3,
    viewCount: 8900
  },
  {
    name: "Copy.ai",
    description: "AI copywriting tool for generating marketing content, emails, and social media posts",
    category: "Text AI",
    features: ["90+ templates", "Multi-language", "Team collaboration"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.copy.ai",
    usageCount: 29e3,
    viewCount: 7600
  },
  {
    name: "Grammarly",
    description: "AI-powered writing assistant for grammar, spelling, tone, and style improvements",
    category: "Text AI",
    features: ["Grammar checking", "Tone detection", "Plagiarism detection"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.grammarly.com",
    usageCount: 89e3,
    viewCount: 21e3
  },
  {
    name: "QuillBot",
    description: "AI paraphrasing and summarization tool with grammar checking capabilities",
    category: "Text AI",
    features: ["Paraphrasing", "Summarization", "Citation generator"],
    isPaid: false,
    requiresAPI: true,
    url: "https://quillbot.com",
    usageCount: 41e3,
    viewCount: 10500
  },
  // Video AI Tools
  {
    name: "Runway ML",
    description: "AI video editing and generation platform with text-to-video and enhancement features",
    category: "Video AI",
    features: ["Text to video", "Video enhancement", "Green screen removal"],
    isPaid: true,
    requiresAPI: true,
    url: "https://runwayml.com",
    usageCount: 23e3,
    viewCount: 6200
  },
  {
    name: "Synthesia",
    description: "AI video generation platform creating professional videos with AI avatars",
    category: "Video AI",
    features: ["AI avatars", "Multi-language", "Custom branding"],
    isPaid: true,
    requiresAPI: true,
    url: "https://www.synthesia.io",
    usageCount: 18e3,
    viewCount: 4900
  },
  {
    name: "Descript",
    description: "AI-powered video and audio editor with transcription and overdub features",
    category: "Video AI",
    features: ["Text-based editing", "AI voices", "Transcription"],
    isPaid: false,
    requiresAPI: false,
    url: "https://www.descript.com",
    usageCount: 31e3,
    viewCount: 8300
  },
  {
    name: "Pictory",
    description: "AI video creation from text and long-form content with automatic editing",
    category: "Video AI",
    features: ["Article to video", "Auto-captioning", "Stock footage"],
    isPaid: true,
    requiresAPI: true,
    url: "https://pictory.ai",
    usageCount: 14e3,
    viewCount: 3800
  },
  // Audio AI Tools
  {
    name: "ElevenLabs",
    description: "Advanced AI voice generation and cloning with realistic, emotional speech",
    category: "Audio AI",
    features: ["Voice cloning", "Multi-language", "Emotional range"],
    isPaid: false,
    requiresAPI: true,
    url: "https://elevenlabs.io",
    usageCount: 42e3,
    viewCount: 11e3
  },
  {
    name: "Murf AI",
    description: "AI voice generator for professional voiceovers with 100+ natural-sounding voices",
    category: "Audio AI",
    features: ["100+ voices", "Voice customization", "Background music"],
    isPaid: true,
    requiresAPI: true,
    url: "https://murf.ai",
    usageCount: 19e3,
    viewCount: 5100
  },
  {
    name: "Adobe Podcast",
    description: "AI audio enhancement tool for removing noise and improving podcast quality",
    category: "Audio AI",
    features: ["Noise removal", "Enhancement", "Transcription"],
    isPaid: false,
    requiresAPI: false,
    url: "https://podcast.adobe.com",
    usageCount: 27e3,
    viewCount: 7100
  },
  {
    name: "Krisp",
    description: "AI noise cancellation for calls and recordings with voice clarity enhancement",
    category: "Audio AI",
    features: ["Noise cancellation", "Echo removal", "All platforms"],
    isPaid: false,
    requiresAPI: false,
    url: "https://krisp.ai",
    usageCount: 35e3,
    viewCount: 9200
  },
  // Code AI Tools
  {
    name: "GitHub Copilot",
    description: "AI pair programmer suggesting code completions and entire functions in real-time",
    category: "Code AI",
    features: ["Code completion", "Multiple languages", "IDE integration"],
    isPaid: true,
    requiresAPI: true,
    url: "https://github.com/features/copilot",
    usageCount: 78e3,
    viewCount: 19500
  },
  {
    name: "Tabnine",
    description: "AI code completion tool supporting all major programming languages and IDEs",
    category: "Code AI",
    features: ["AI completions", "Team learning", "Privacy focused"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.tabnine.com",
    usageCount: 45e3,
    viewCount: 11800
  },
  {
    name: "Cursor",
    description: "AI-first code editor with built-in AI assistance and code generation",
    category: "Code AI",
    features: ["AI chat", "Code generation", "Refactoring"],
    isPaid: false,
    requiresAPI: false,
    url: "https://cursor.sh",
    usageCount: 39e3,
    viewCount: 10200
  },
  {
    name: "Replit AI",
    description: "AI coding assistant integrated into Replit with code generation and debugging",
    category: "Code AI",
    features: ["Code generation", "Debugging help", "Project scaffolding"],
    isPaid: false,
    requiresAPI: true,
    url: "https://replit.com",
    usageCount: 52e3,
    viewCount: 13600
  },
  {
    name: "CodeWhisperer",
    description: "Amazon's AI code generator with security scanning and AWS optimization",
    category: "Code AI",
    features: ["Code suggestions", "Security scanning", "AWS optimized"],
    isPaid: false,
    requiresAPI: true,
    url: "https://aws.amazon.com/codewhisperer",
    usageCount: 28e3,
    viewCount: 7300
  }
];
var articlesData = [
  {
    title: "How AI is Transforming Business Workflows in 2025",
    slug: "ai-transforming-business-workflows-2025",
    excerpt: "Discover how artificial intelligence is revolutionizing the way businesses operate, from automation to intelligent decision-making.",
    content: `
<h2>The AI Revolution in Business</h2>
<p>Artificial intelligence has moved from a futuristic concept to an essential business tool. In 2025, companies of all sizes are leveraging AI to streamline operations, reduce costs, and unlock new opportunities.</p>

<h2>Key Areas of Transformation</h2>
<h3>1. Intelligent Automation</h3>
<p>AI-powered automation tools are handling repetitive tasks with unprecedented accuracy. From data entry to customer service, businesses are freeing up human resources for more strategic work.</p>

<h3>2. Predictive Analytics</h3>
<p>Machine learning algorithms analyze vast amounts of data to predict trends, customer behavior, and market shifts, enabling proactive decision-making.</p>

<h3>3. Enhanced Customer Experience</h3>
<p>AI chatbots and virtual assistants provide 24/7 customer support, while recommendation engines deliver personalized experiences at scale.</p>

<h3>4. Content Creation and Marketing</h3>
<p>AI writing tools and image generators are revolutionizing content creation, allowing marketers to produce high-quality materials faster than ever.</p>

<h2>Real-World Impact</h2>
<p>Companies implementing AI solutions report average productivity increases of 40% and cost reductions of 25%. The technology is no longer optional\u2014it's essential for staying competitive.</p>

<h2>Getting Started</h2>
<p>Begin by identifying repetitive tasks in your workflow. Explore AI tools in our directory that address these specific needs. Start small, measure results, and scale successful implementations.</p>

<p>The future of business is intelligent, automated, and AI-powered. The question isn't whether to adopt AI, but how quickly you can integrate it into your operations.</p>
    `,
    coverImage: aiTransformImage,
    category: "Business AI",
    authorName: "Sarah Chen",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-01-15"),
    readTime: "8 min read",
    tags: ["AI", "Business", "Automation", "Productivity"]
  },
  {
    title: "The Complete Guide to Choosing the Right AI Tools for Your Needs",
    slug: "complete-guide-choosing-ai-tools",
    excerpt: "Navigate the overwhelming landscape of AI tools with our comprehensive guide to selecting the perfect solution for your specific requirements.",
    content: `
<h2>Understanding Your Needs</h2>
<p>With thousands of AI tools available, choosing the right one can feel overwhelming. This guide will help you make informed decisions based on your specific requirements.</p>

<h2>Step 1: Define Your Use Case</h2>
<p>Start by clearly identifying what you want to achieve. Are you looking to:</p>
<ul>
  <li>Generate content (text, images, videos)?</li>
  <li>Automate repetitive tasks?</li>
  <li>Analyze data and gain insights?</li>
  <li>Enhance customer communication?</li>
  <li>Convert files between formats?</li>
</ul>

<h2>Step 2: Evaluate Key Factors</h2>
<h3>Cost and Pricing Model</h3>
<p>Consider whether you need a free tier, pay-per-use, or subscription model. Many tools offer free trials\u2014take advantage of these before committing.</p>

<h3>Integration Capabilities</h3>
<p>Ensure the tool integrates with your existing workflow and tech stack. API availability is crucial for automation.</p>

<h3>Ease of Use</h3>
<p>A powerful tool is useless if your team can't use it effectively. Look for intuitive interfaces and good documentation.</p>

<h3>Scalability</h3>
<p>Choose tools that can grow with your needs. What works for 10 users might not work for 100.</p>

<h2>Step 3: Test and Compare</h2>
<p>Never rely on marketing claims alone. Test multiple tools side-by-side with real use cases. Create a scoring matrix comparing features, cost, and user experience.</p>

<h2>Popular Tool Categories</h2>
<p><strong>Text AI:</strong> ChatGPT, Jasper, Copy.ai for content creation and writing assistance.</p>
<p><strong>Image AI:</strong> DALL-E, Midjourney, Stable Diffusion for visual content generation.</p>
<p><strong>Code AI:</strong> GitHub Copilot, Tabnine for development assistance.</p>
<p><strong>Conversion Tools:</strong> CloudConvert, PDF.co for file format changes.</p>

<h2>Making the Final Decision</h2>
<p>Combine quantitative metrics (cost, features) with qualitative factors (user experience, support quality). Start with one or two tools, master them, then expand your toolkit as needed.</p>

<p>Remember: the best tool is the one you'll actually use. Choose simplicity and effectiveness over complexity and features you don't need.</p>
    `,
    coverImage: aiToolsGuideImage,
    category: "Guides",
    authorName: "Michael Torres",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-01-20"),
    readTime: "12 min read",
    tags: ["Guide", "AI Tools", "Decision Making", "Best Practices"]
  },
  {
    title: "Top 10 File Conversion Tools Every Professional Needs",
    slug: "top-10-file-conversion-tools",
    excerpt: "From PDF to Word conversions to video format changes, these essential tools will handle all your file conversion needs efficiently.",
    content: `
<h2>Why File Conversion Tools Matter</h2>
<p>In today's digital workplace, we constantly work with different file formats. Having reliable conversion tools saves time, maintains quality, and ensures compatibility across platforms.</p>

<h2>The Essential Conversion Tools</h2>

<h3>1. CloudConvert - The Universal Converter</h3>
<p>Supporting over 200 formats, CloudConvert handles documents, images, videos, and audio. Its API makes automation easy, and batch processing saves countless hours.</p>

<h3>2. PDF.co - PDF Powerhouse</h3>
<p>Specializing in PDF operations, this tool excels at PDF to Word, Excel, and image conversions. OCR support makes scanned documents searchable and editable.</p>

<h3>3. Zamzar - Simple and Reliable</h3>
<p>With a straightforward interface and email delivery, Zamzar handles over 1,000 conversion types without requiring software installation.</p>

<h3>4. Handbrake - Video Conversion Expert</h3>
<p>Open-source and powerful, Handbrake converts videos between formats with fine-grained control over quality and compression settings.</p>

<h3>5. FFmpeg - Developer's Choice</h3>
<p>Command-line tool offering unmatched flexibility for audio and video conversion. Perfect for automation and batch processing.</p>

<h2>Use Cases and Best Practices</h2>

<h3>Document Workflows</h3>
<p>Use PDF converters when receiving contracts in PDF that need editing. Convert to Word, make changes, and convert back to PDF for distribution.</p>

<h3>Media Production</h3>
<p>Video conversion tools optimize files for different platforms\u20144K for YouTube, compressed versions for social media, specific formats for presentations.</p>

<h3>Data Processing</h3>
<p>Convert spreadsheets between Excel, CSV, and database formats for data migration and analysis tasks.</p>

<h2>Quality Considerations</h2>
<p>Always keep original files. Conversions can lose quality, especially with images and videos. Test outputs before deleting sources.</p>

<h2>Security Tips</h2>
<p>For sensitive documents, use local conversion tools rather than cloud-based services. Many tools offer desktop versions for offline conversion.</p>

<h2>Automation Potential</h2>
<p>Most professional conversion tools offer APIs. Integrate them into your workflows to automatically convert files as they're uploaded or generated.</p>

<p>With these tools in your arsenal, you'll never struggle with incompatible file formats again. Choose based on your primary needs, but having backups ensures you're always prepared.</p>
    `,
    coverImage: fileConversionImage,
    category: "Tools Review",
    authorName: "Jessica Park",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-01-22"),
    readTime: "10 min read",
    tags: ["Conversion", "Productivity", "Tools", "Workflow"]
  },
  {
    title: "How AI Assistants Can 10x Your Productivity",
    slug: "ai-assistants-10x-productivity",
    excerpt: "Learn practical strategies for leveraging AI assistants to dramatically increase your output and focus on high-value work.",
    content: `
<h2>The Productivity Revolution</h2>
<p>AI assistants have evolved from simple chatbots to powerful productivity multipliers. When used strategically, they can genuinely increase your output tenfold.</p>

<h2>Understanding AI Assistants</h2>
<p>Modern AI assistants like ChatGPT, Claude, and specialized tools can handle writing, coding, analysis, research, and creative tasks. The key is knowing when and how to use them.</p>

<h2>10 Ways to 10x Your Productivity</h2>

<h3>1. Email Management</h3>
<p>Use AI to draft responses, summarize long email threads, and organize your inbox. What took 2 hours now takes 20 minutes.</p>

<h3>2. Content Creation</h3>
<p>Generate first drafts, outlines, and ideas instantly. Focus your time on editing and adding personal insights rather than staring at blank pages.</p>

<h3>3. Research and Summarization</h3>
<p>AI assistants can digest long documents, extract key points, and create actionable summaries in seconds.</p>

<h3>4. Code Generation</h3>
<p>Developers using AI coding assistants report 40% faster development times. AI handles boilerplate while you focus on architecture.</p>

<h3>5. Data Analysis</h3>
<p>Upload datasets and get instant insights, visualizations, and recommendations. No need to be a data scientist.</p>

<h3>6. Meeting Notes and Action Items</h3>
<p>AI transcribes meetings, identifies action items, and creates organized notes automatically.</p>

<h3>7. Learning and Skill Development</h3>
<p>Get personalized explanations, examples, and practice problems for any topic you're learning.</p>

<h3>8. Brainstorming and Ideation</h3>
<p>Generate dozens of ideas in minutes, then refine the best ones. AI excels at creative exploration.</p>

<h3>9. Task Breakdown</h3>
<p>Large projects become manageable when AI helps break them into actionable steps with timelines.</p>

<h3>10. Quality Assurance</h3>
<p>Use AI to review your work for errors, inconsistencies, and improvements before submission.</p>

<h2>Best Practices</h2>
<p><strong>Be Specific:</strong> Clear, detailed prompts get better results. Include context, desired format, and examples.</p>
<p><strong>Iterate:</strong> First outputs are starting points. Refine and improve through conversation.</p>
<p><strong>Verify:</strong> AI can make mistakes. Always review and fact-check important outputs.</p>
<p><strong>Combine Tools:</strong> Use specialized AI tools for specific tasks rather than one tool for everything.</p>

<h2>Common Pitfalls to Avoid</h2>
<p>Don't rely blindly on AI outputs. Don't use AI for tasks requiring human empathy or judgment. Don't share sensitive information with AI tools.</p>

<h2>The Future is Already Here</h2>
<p>AI assistants aren't replacing human workers\u2014they're multiplying human capability. The professionals who learn to leverage AI effectively will outperform those who don't by orders of magnitude.</p>

<p>Start today. Pick one task you do daily. Find an AI tool that helps with it. Master that integration. Then expand. The 10x productivity boost isn't hype\u2014it's achievable with the right approach.</p>
    `,
    coverImage: aiProductivityImage,
    category: "Productivity",
    authorName: "David Kim",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-01-25"),
    readTime: "15 min read",
    tags: ["Productivity", "AI", "Efficiency", "Workflow"]
  },
  {
    title: "The Future of AI Tools: 5 Trends to Watch in 2025",
    slug: "future-ai-tools-2025-trends",
    excerpt: "From multi-modal AI to specialized vertical solutions, discover the emerging trends shaping the AI tools landscape this year.",
    content: `
<h2>The Rapid Evolution Continues</h2>
<p>The AI tools landscape is evolving faster than ever. What seemed cutting-edge six months ago is now table stakes. Here are the five biggest trends defining 2025.</p>

<h2>1. Multi-Modal AI Integration</h2>
<p>Tools that can simultaneously process text, images, audio, and video are becoming standard. GPT-5's multi-modal capabilities are just the beginning.</p>
<p><strong>Impact:</strong> Create video tutorials from text descriptions, generate presentations from voice notes, or analyze images with natural language queries.</p>

<h2>2. Vertical-Specific AI Solutions</h2>
<p>Generic AI tools are giving way to specialized solutions for specific industries and use cases.</p>
<p><strong>Examples:</strong> AI legal assistants trained on case law, medical AI for diagnosis support, financial AI for compliance and risk assessment.</p>

<h2>3. On-Device AI Processing</h2>
<p>Privacy concerns and latency requirements are driving AI computation to edge devices.</p>
<p><strong>Benefits:</strong> Faster processing, no cloud dependency, complete privacy, offline functionality.</p>

<h2>4. AI Agents and Automation</h2>
<p>Beyond simple task completion, AI agents can now manage complex, multi-step workflows autonomously.</p>
<p><strong>Use Cases:</strong> Research agents that gather and synthesize information, customer service agents handling end-to-end support, coding agents that build complete features.</p>

<h2>5. Collaborative Human-AI Workflows</h2>
<p>The best results come from humans and AI working together, not AI replacing humans.</p>
<p><strong>Pattern:</strong> AI generates options \u2192 Human selects and refines \u2192 AI implements \u2192 Human validates.</p>

<h2>What This Means for You</h2>
<p>Stay flexible. The tools you use today might be obsolete in six months. Focus on understanding AI capabilities rather than mastering specific tools.</p>

<h2>Preparing for the Future</h2>
<p>Develop AI literacy. Experiment with new tools monthly. Join communities discussing AI developments. Most importantly, focus on problems to solve, not tools to use.</p>

<h2>The Bottom Line</h2>
<p>AI tools will continue to become more powerful, more specialized, and more integrated into every aspect of work. The winners will be those who adapt quickly and leverage AI to augment their unique human capabilities.</p>

<p>The future isn't about AI replacing humans. It's about AI-enhanced humans outperforming both traditional humans and pure AI. Position yourself at that intersection.</p>
    `,
    coverImage: futureAIImage,
    category: "Trends",
    authorName: "Emily Rodriguez",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-01-28"),
    readTime: "11 min read",
    tags: ["Future", "Trends", "AI", "Innovation"]
  },
  {
    title: "Top AI Trends Shaping 2025: What You Need to Know",
    slug: "top-ai-trends-2025",
    excerpt: "Discover the biggest AI trends revolutionizing technology in 2025, from agentic AI to multimodal systems. Learn what's driving innovation and how these developments will impact businesses and individuals.",
    content: `<h2>What is the AI Trend in 2025?</h2><p>The number one trend dominating 2025 is agentic AI \u2013 artificial intelligence systems that can autonomously complete tasks, make decisions, and collaborate with other AI agents. Unlike previous generations of AI that simply generated content or answered questions, agentic AI actually "does work" by executing multi-step workflows with minimal human intervention.</p><h2>What are the Biggest AI Trends?</h2><h3>1. AI Reasoning and Frontier Models</h3><p>Large language models are evolving beyond simple content generation to develop genuine reasoning capabilities. Morgan Stanley identifies "AI reasoning for enterprise data" as the biggest untapped potential in the market.</p><h3>2. Multimodal AI Systems</h3><p>Multimodal AI, which processes and integrates text, images, video, and audio simultaneously, has reached the "Peak of Inflated Expectations" according to Gartner.</p><h3>3. AI Trust, Risk & Security Management</h3><p>As AI systems become more powerful and autonomous, ensuring their safety, accuracy, and trustworthiness has become paramount.</p><h2>Enterprise ROI Pressure</h2><p>After years of pilot projects and experimentation, 2025 marks the year where enterprises must prove AI delivers real business value.</p><h2>Quick Stats</h2><ul><li>Market Growth: 36.6% CAGR through 2030</li><li>Small Business Adoption: 89% using AI tools</li><li>IT Leaders: 68% expect to deploy agentic AI within 6 months</li></ul>`,
    coverImage: aiTrendsImage,
    category: "AI Trends",
    authorName: "Lungisani",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-10-29"),
    readTime: "12 min read",
    tags: ["AI", "2025", "Trends", "Technology", "Machine Learning", "Agentic AI", "Business"]
  },
  {
    title: "Which AI Stock Will Boom in 2025? Top Picks and Investment Guide",
    slug: "ai-stocks-boom-2025",
    excerpt: "Explore the best AI stocks positioned for explosive growth in 2025. From NVIDIA and Microsoft to emerging players like CoreWeave, discover where smart investors are putting their money.",
    content: `<h2>What Are the Top 3 AI Stocks to Buy Now?</h2><h3>1. NVIDIA (NVDA)</h3><p>With a market capitalization of $4.4 trillion, NVIDIA has become the world's most valuable company by dominating the AI chip market. The company controls over 80% of AI data center chips.</p><ul><li>Net profit grew 63% YoY to $86B</li><li>Analysts forecast 23% annual growth through 2030</li><li>Trading at lower forward P/E than Walmart despite hypergrowth</li></ul><h3>2. Microsoft (MSFT)</h3><p>Microsoft's $13 billion investment in OpenAI has positioned the company as the enterprise leader in AI adoption.</p><ul><li>Azure OpenAI serves 65%+ of Fortune 500</li><li>$80+ billion capex in FY 2025 for AI data centers</li><li>Customers pay 160% premiums for AI-enhanced services</li></ul><h3>3. Alphabet/Google (GOOGL)</h3><p>Google's position stems from its unique combination of consumer reach and enterprise cloud services.</p><ul><li>2 billion+ daily users across major products</li><li>Proprietary TPU chips plus NVIDIA GPUs</li><li>Forward P/E of 24 (reasonable for growth trajectory)</li></ul><h2>Which Stock Is Going to Skyrocket?</h2><p>CoreWeave (CRWV) represents one of the most exciting AI IPO stories of 2025. This cloud platform achieved 100x revenue growth from 2022 to 2024, reaching $1.9B in annual revenue.</p><h2>Market Projections</h2><p>The AI market is projected to grow from $270B (2024) to $3.5T (2033) with a 31.5% CAGR.</p>`,
    coverImage: aiStocksImage,
    category: "Investment",
    authorName: "Lungisani",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-10-29"),
    readTime: "15 min read",
    tags: ["AI", "Stocks", "Investment", "NVIDIA", "Microsoft", "Technology", "Finance", "2025"]
  },
  {
    title: "What AI is Used For in 2025: Applications, Jobs, and 7 Types Explained",
    slug: "what-ai-used-for-2025",
    excerpt: "From healthcare to coding, discover how AI is being used in 2025. Learn about the 7 types of AI, high-paying jobs, and what AI will and won't replace in the workforce.",
    content: `<h2>What Will AI Do by 2025?</h2><p>By 2025, AI has moved well beyond the experimental phase into widespread practical deployment across virtually every industry.</p><h3>Healthcare Revolution</h3><ul><li>Drug Development: AI analyzes millions of molecular combinations</li><li>Medical Diagnostics: Computer vision detects diseases in MRI scans</li><li>Patient Care: AI monitors patient vitals in real-time</li></ul><h3>Manufacturing Excellence</h3><ul><li>Predictive Maintenance: AI predicts equipment failures</li><li>Quality Control: Computer vision inspects products at superhuman speeds</li><li>Supply Chain Optimization: Real-time monitoring and optimization</li></ul><h2>What Are 7 Types of AI?</h2><ol><li><strong>Reactive AI</strong> - Basic form responding to inputs without memory</li><li><strong>Limited Memory AI</strong> - Learns from historical data</li><li><strong>Theory of Mind AI</strong> - Understands emotions (emerging)</li><li><strong>Self-Aware AI</strong> - Has consciousness (theoretical)</li><li><strong>Narrow AI</strong> - Designed for specific tasks</li><li><strong>General AI</strong> - Human-level intelligence (doesn't exist yet)</li><li><strong>Superintelligent AI</strong> - Surpasses human intelligence (hypothetical)</li></ol><h2>What Jobs Will AI Not Replace?</h2><ul><li>Artists and Designers</li><li>Strategic Planners</li><li>Healthcare Workers</li><li>Teachers and Educators</li><li>Scientific Researchers</li></ul><h2>Top AI Job Roles</h2><table><tr><th>Role</th><th>Salary</th></tr><tr><td>Machine Learning Engineer</td><td>$120K-$180K+</td></tr><tr><td>AI Research Scientist</td><td>$150K-$250K+</td></tr><tr><td>NLP Specialist</td><td>$130K-$200K</td></tr></table>`,
    coverImage: aiApplicationsImage,
    category: "AI Applications",
    authorName: "Lungisani",
    authorAvatar: "",
    publishedAt: /* @__PURE__ */ new Date("2025-10-29"),
    readTime: "14 min read",
    tags: ["AI", "Jobs", "Applications", "2025", "Careers", "Technology", "Automation"]
  }
];

// server/seedData.ts
async function seedDatabase() {
  let toolsInserted = 0;
  let toolsSkipped = 0;
  let articlesInserted = 0;
  let articlesSkipped = 0;
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
  for (const article of articlesData) {
    try {
      const result = await db.insert(articles).values(article).onConflictDoUpdate({
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
          tags: article.tags
        }
      }).returning();
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
    articlesSkipped
  };
}

// server/routes.ts
var storage = new FirestoreStorage();
var openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});
function transformArticle(article) {
  return {
    id: article.id.toString(),
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    category: article.category,
    author: {
      name: article.authorName,
      avatar: article.authorAvatar || void 0
    },
    publishedAt: article.publishedAt.toISOString(),
    readTime: article.readTime,
    tags: article.tags
  };
}
function transformTool(tool) {
  return {
    id: tool.id.toString(),
    name: tool.name,
    description: tool.description,
    category: tool.category,
    features: tool.features,
    isPaid: tool.isPaid,
    requiresAPI: tool.requiresAPI,
    url: tool.url || void 0,
    usageCount: tool.usageCount,
    averageRating: tool.averageRating || void 0,
    reviewCount: tool.reviewCount
  };
}
async function registerRoutes(app2) {
  app2.use(verifyFirebaseToken);
  app2.get("/api/auth/user", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({
        id: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "User",
        email: user.email,
        profileImage: user.profileImageUrl,
        isAdmin: user.isAdmin || false
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/make-me-admin", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const userEmail = req.user.email;
      await setAdminClaim(userId, true);
      console.log(`\u2705 Admin privileges granted to user: ${userEmail} (${userId})`);
      res.json({
        success: true,
        message: "Admin privileges granted! Please sign out and sign back in for changes to take effect.",
        requiresReAuth: true
      });
    } catch (error) {
      console.error("Error granting admin privileges:", error);
      res.status(500).json({ error: "Failed to grant admin privileges" });
    }
  });
  app2.get("/api/tools", async (req, res) => {
    try {
      const tools2 = await storage.getAllTools();
      res.json(tools2.map(transformTool));
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });
  app2.get("/api/tools/search", async (req, res) => {
    try {
      const query = req.query.q;
      if (!query) {
        return res.status(400).json({ error: "Search query required" });
      }
      const tools2 = await storage.searchTools(query);
      res.json(tools2.map(transformTool));
    } catch (error) {
      console.error("Error searching tools:", error);
      res.status(500).json({ error: "Failed to search tools" });
    }
  });
  app2.get("/api/articles", async (req, res) => {
    try {
      const articles2 = await storage.getAllArticles();
      res.json(articles2.map(transformArticle));
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });
  app2.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json(transformArticle(article));
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });
  app2.post("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const { toolId } = req.body;
      if (!toolId || typeof toolId !== "number") {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      const favorite = await storage.addFavorite(userId, toolId);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      if (error.message?.includes("duplicate") || error.code === "23505") {
        return res.status(409).json({ error: "Tool already favorited" });
      }
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });
  app2.delete("/api/favorites/:toolId", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      await storage.removeFavorite(userId, toolId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });
  app2.get("/api/favorites", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const tools2 = await storage.getUserFavorites(userId);
      res.json(tools2.map(transformTool));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });
  app2.get("/api/favorites/check/:toolId", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      const isFavorited = await storage.isFavorited(userId, toolId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ error: "Failed to check favorite" });
    }
  });
  app2.post("/api/search-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Invalid query" });
      }
      const history = await storage.addSearchHistory(userId, query);
      res.json(history);
    } catch (error) {
      console.error("Error adding search history:", error);
      res.status(500).json({ error: "Failed to add search history" });
    }
  });
  app2.get("/api/search-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const limit = parseInt(req.query.limit) || 10;
      const history = await storage.getUserSearchHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });
  app2.delete("/api/search-history", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      await storage.clearUserSearchHistory(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing search history:", error);
      res.status(500).json({ error: "Failed to clear search history" });
    }
  });
  app2.post("/api/analytics/track", async (req, res) => {
    try {
      const { toolId, eventType, userId, metadata } = req.body;
      if (!toolId || !eventType) {
        return res.status(400).json({ error: "toolId and eventType are required" });
      }
      await storage.trackEvent({
        toolId,
        eventType,
        userId: userId || null,
        metadata: metadata || null
      });
      if (eventType === "view") {
        await storage.incrementToolViewCount(toolId);
      } else if (eventType === "click") {
        await storage.incrementToolUsageCount(toolId);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });
  app2.get("/api/analytics/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const tools2 = await storage.getPopularTools(limit);
      res.json(tools2.map(transformTool));
    } catch (error) {
      console.error("Error fetching popular tools:", error);
      res.status(500).json({ error: "Failed to fetch popular tools" });
    }
  });
  app2.get("/api/analytics/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const daysSince = parseInt(req.query.daysSince) || 7;
      const tools2 = await storage.getTrendingTools(limit, daysSince);
      res.json(tools2.map(transformTool));
    } catch (error) {
      console.error("Error fetching trending tools:", error);
      res.status(500).json({ error: "Failed to fetch trending tools" });
    }
  });
  app2.get("/api/analytics/tool/:toolId", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      const analytics = await storage.getToolAnalytics(toolId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching tool analytics:", error);
      res.status(500).json({ error: "Failed to fetch tool analytics" });
    }
  });
  app2.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const { toolId, rating, comment } = req.body;
      if (!toolId || typeof toolId !== "number") {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      const existingReview = await storage.getUserReview(userId, toolId);
      if (existingReview) {
        return res.status(409).json({ error: "You have already reviewed this tool. Use PUT to update." });
      }
      const review = await storage.addReview(userId, toolId, rating, comment);
      res.json(review);
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({ error: "Failed to add review" });
    }
  });
  app2.get("/api/reviews/tool/:toolId", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      const reviews2 = await storage.getToolReviews(toolId);
      res.json(reviews2);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });
  app2.get("/api/reviews/user/:toolId", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({ error: "Invalid toolId" });
      }
      const review = await storage.getUserReview(userId, toolId);
      res.json(review || null);
    } catch (error) {
      console.error("Error fetching user review:", error);
      res.status(500).json({ error: "Failed to fetch user review" });
    }
  });
  app2.put("/api/reviews/:reviewId", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const reviewId = parseInt(req.params.reviewId);
      const { rating, comment } = req.body;
      if (isNaN(reviewId)) {
        return res.status(400).json({ error: "Invalid reviewId" });
      }
      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: "Rating must be between 1 and 5" });
      }
      const existingReview = await storage.getReviewById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      if (existingReview.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to update this review" });
      }
      const review = await storage.updateReview(reviewId, rating, comment);
      res.json(review);
    } catch (error) {
      console.error("Error updating review:", error);
      res.status(500).json({ error: "Failed to update review" });
    }
  });
  app2.delete("/api/reviews/:reviewId", requireAuth, async (req, res) => {
    try {
      const userId = req.user.uid;
      const reviewId = parseInt(req.params.reviewId);
      if (isNaN(reviewId)) {
        return res.status(400).json({ error: "Invalid reviewId" });
      }
      const existingReview = await storage.getReviewById(reviewId);
      if (!existingReview) {
        return res.status(404).json({ error: "Review not found" });
      }
      if (existingReview.userId !== userId) {
        return res.status(403).json({ error: "Unauthorized to delete this review" });
      }
      await storage.deleteReview(reviewId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ error: "Failed to delete review" });
    }
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const validationResult = chatRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.error("Chat validation error:", validationResult.error);
        console.error("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ error: "Invalid request format", details: validationResult.error });
      }
      const { message, conversationHistory = [] } = validationResult.data;
      console.log(`Chat request: message="${message}", history length=${conversationHistory.length}`);
      const tools2 = await storage.getAllTools();
      const toolsContext = tools2.map(
        (t) => `${t.name} (${t.category}): ${t.description}`
      ).join("\n");
      const messages = [
        {
          role: "system",
          content: `You are a helpful AI assistant for Lungiverse, a platform that helps users discover and choose AI tools. Your role is to:

1. Understand user needs and recommend appropriate AI tools from our catalog
2. Provide clear, concise information about tools and their capabilities
3. Help users understand which tools best fit their specific use cases
4. Be friendly, professional, and helpful

Available tools in our catalog:
${toolsContext}

When recommending tools:
- Match tools to the user's specific needs
- Mention if tools are free or paid, and if they require API access
- Highlight key features that address the user's requirements
- Recommend 2-3 tools when appropriate, not just one
- Be honest about limitations

Keep responses concise and actionable.`
        },
        ...conversationHistory.map((msg) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: message
        }
      ];
      console.log("Calling OpenAI API with model: gpt-4.1");
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        // Using gpt-4.1 for reliable responses
        messages,
        max_tokens: 1e3
        // Increased token limit for complete responses
      });
      console.log("OpenAI response received:", {
        choices: completion.choices?.length,
        hasContent: !!completion.choices?.[0]?.message?.content,
        finishReason: completion.choices?.[0]?.finish_reason
      });
      const assistantMessage = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
      const suggestedTools = tools2.filter((tool) => assistantMessage.toLowerCase().includes(tool.name.toLowerCase())).map((tool) => tool.id).slice(0, 3);
      console.log(`Chat response generated: ${assistantMessage.substring(0, 100)}${assistantMessage.length > 100 ? "..." : ""}`);
      res.json({
        message: assistantMessage,
        suggestedTools
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ error: "Failed to process chat request", details: String(error) });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      await storage.createContactMessage({
        name,
        email,
        subject,
        message
      });
      res.json({ success: true, message: "Your message has been sent successfully. We'll get back to you soon!" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });
  app2.post("/api/admin/tools", requireAdmin, async (req, res) => {
    try {
      const { name, description, category, features, isPaid, requiresAPI, url } = req.body;
      if (!name || !description || !category || !features) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const tool = await storage.createTool({
        name,
        description,
        category,
        features,
        isPaid: isPaid || false,
        requiresAPI: requiresAPI || false,
        url
      });
      res.json(transformTool(tool));
    } catch (error) {
      console.error("Error creating tool:", error);
      res.status(500).json({ error: "Failed to create tool" });
    }
  });
  app2.post("/api/admin/articles", requireAdmin, async (req, res) => {
    try {
      const { title, slug, excerpt, content, coverImage, category, authorName, authorAvatar, readTime, tags } = req.body;
      if (!title || !slug || !excerpt || !content || !category || !authorName || !readTime) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const article = await storage.createArticle({
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || "",
        category,
        authorName,
        authorAvatar,
        readTime,
        tags: tags || []
      });
      res.json(transformArticle(article));
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });
  app2.delete("/api/admin/articles/:id", requireAdmin, async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      if (isNaN(articleId)) {
        return res.status(400).json({ error: "Invalid article ID" });
      }
      await storage.deleteArticle(articleId);
      res.json({ success: true, message: "Article deleted successfully" });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ error: "Failed to delete article" });
    }
  });
  app2.post("/api/admin/seed", requireAdmin, async (req, res) => {
    try {
      console.log("\u{1F331} Starting database seed from admin endpoint...");
      const result = await seedDatabase();
      console.log("\u2705 Database seeding complete:", result);
      res.json({
        success: true,
        message: "Database seeded successfully",
        ...result
      });
    } catch (error) {
      console.error("\u274C Error seeding database:", error);
      res.status(500).json({
        error: "Failed to seed database",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      ),
      await import("@replit/vite-plugin-dev-banner").then(
        (m) => m.devBanner()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
