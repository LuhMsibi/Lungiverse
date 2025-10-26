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

// Article Schema
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

export type Article = z.infer<typeof articleSchema>;

export const insertArticleSchema = articleSchema.omit({ id: true });
export type InsertArticle = z.infer<typeof insertArticleSchema>;

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
