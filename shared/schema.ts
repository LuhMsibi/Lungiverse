import { pgTable, serial, varchar, text, boolean, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// AI Tool Categories
export const toolCategories = [
  "All Tools",
  "Conversion",
  "Image AI",
  "Text AI",
  "Video AI",
  "Audio AI",
  "Code AI",
] as const;

export type ToolCategory = typeof toolCategories[number];

// ============ DATABASE TABLES ============

// Session storage table (for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => ({
    expireIdx: index("IDX_session_expire").on(table.expire),
  })
);

// Users Table (keeping serial ID for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Tools Table
export const tools = pgTable("tools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  isPaid: boolean("is_paid").notNull().default(false),
  requiresAPI: boolean("requires_api").notNull().default(false),
  url: varchar("url", { length: 500 }),
  usageCount: integer("usage_count").notNull().default(0),
  viewCount: integer("view_count").notNull().default(0),
  averageRating: integer("average_rating").default(0),
  reviewCount: integer("review_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolSchema = createInsertSchema(tools).omit({ 
  id: true, 
  usageCount: true, 
  viewCount: true,
  averageRating: true,
  reviewCount: true,
  createdAt: true, 
  updatedAt: true 
});
export type InsertTool = z.infer<typeof insertToolSchema>;
export type Tool = typeof tools.$inferSelect;

// Articles Table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorAvatar: varchar("author_avatar", { length: 500 }),
  publishedAt: timestamp("published_at").notNull(),
  readTime: varchar("read_time", { length: 50 }).notNull(),
  tags: jsonb("tags").notNull().$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;

// Favorites Table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Prevent duplicate favorites
  uniqueUserTool: sql`UNIQUE (${table.userId}, ${table.toolId})`,
}));

export const insertFavoriteSchema = createInsertSchema(favorites).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Ensure rating is between 1 and 5
  ratingCheck: sql`CHECK (${table.rating} >= 1 AND ${table.rating} <= 5)`,
}));

export const insertReviewSchema = createInsertSchema(reviews).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Search History Table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  query: varchar("query", { length: 500 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

// Analytics Events Table
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  toolId: integer("tool_id").notNull().references(() => tools.id),
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'view', 'click', 'search'
  userId: varchar("user_id").references(() => users.id),
  metadata: jsonb("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({ 
  id: true, 
  createdAt: true 
});
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;

// Tool Submissions Table (user-submitted tools pending approval)
export const toolSubmissions = pgTable("tool_submissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  features: jsonb("features").notNull().$type<string[]>(),
  isPaid: boolean("is_paid").notNull().default(false),
  requiresAPI: boolean("requires_api").notNull().default(false),
  url: varchar("url", { length: 500 }),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertToolSubmissionSchema = createInsertSchema(toolSubmissions).omit({ 
  id: true, 
  status: true,
  createdAt: true, 
  updatedAt: true 
});
export type InsertToolSubmission = z.infer<typeof insertToolSubmissionSchema>;
export type ToolSubmission = typeof toolSubmissions.$inferSelect;

// ============ LEGACY ZODS (for compatibility) ============

// AI Tool Schema
export const aiToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(toolCategories),
  features: z.array(z.string()),
  isPaid: z.boolean(),
  requiresAPI: z.boolean(),
  url: z.string().optional(),
  usageCount: z.number().optional(),
});

export type AITool = z.infer<typeof aiToolSchema>;

export const insertAIToolSchema = aiToolSchema.omit({ id: true });
export type InsertAITool = z.infer<typeof insertAIToolSchema>;

// Article Schema (legacy for backward compatibility)
export const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  excerpt: z.string(),
  content: z.string(),
  coverImage: z.string(),
  category: z.string(),
  author: z.object({
    name: z.string(),
    avatar: z.string().optional(),
  }),
  publishedAt: z.string(),
  readTime: z.string(),
  tags: z.array(z.string()),
});

export type ArticleLegacy = z.infer<typeof articleSchema>;

// Chat Message Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

export const chatRequestSchema = z.object({
  message: z.string(),
  conversationHistory: z.array(chatMessageSchema).optional(),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;

export const chatResponseSchema = z.object({
  message: z.string(),
  suggestedTools: z.array(z.string()).optional(),
});

export type ChatResponse = z.infer<typeof chatResponseSchema>;
