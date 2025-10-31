import type { Express} from "express";
import { createServer, type Server } from "http";
import { FirestoreStorage } from "./firestoreStorage";
import { verifyFirebaseToken, requireAuth, requireAdmin, type AuthenticatedRequest } from "./firebaseAuth";
import { chatRequestSchema, type Article, type Tool, type ArticleLegacy, type AITool } from "@shared/schema";

// Initialize Firestore storage
const storage = new FirestoreStorage();
import OpenAI from "openai";
import { seedDatabase } from "./seedData";

// Using Replit's AI Integrations service for OpenAI - reference: blueprint:javascript_openai_ai_integrations
// The newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

// Transform DB Article to frontend-expected format
function transformArticle(article: Article): ArticleLegacy {
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
      avatar: article.authorAvatar || undefined,
    },
    publishedAt: article.publishedAt.toISOString(),
    readTime: article.readTime,
    tags: article.tags,
  };
}

// Transform DB Tool to frontend-expected format
function transformTool(tool: Tool): AITool & { averageRating?: number; reviewCount?: number } {
  return {
    id: tool.id.toString(),
    name: tool.name,
    description: tool.description,
    category: tool.category as any,
    features: tool.features,
    isPaid: tool.isPaid,
    requiresAPI: tool.requiresAPI,
    url: tool.url || undefined,
    usageCount: tool.usageCount,
    averageRating: tool.averageRating || undefined,
    reviewCount: tool.reviewCount,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply Firebase auth middleware globally
  app.use(verifyFirebaseToken);

  // Auth routes
  app.get('/api/auth/user', requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User',
        email: user.email,
        profileImage: user.profileImageUrl,
        isAdmin: user.isAdmin || false,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Get all AI tools
  app.get("/api/tools", async (req, res) => {
    try {
      const tools = await storage.getAllTools();
      res.json(tools.map(transformTool));
    } catch (error) {
      console.error("Error fetching tools:", error);
      res.status(500).json({ error: "Failed to fetch tools" });
    }
  });

  // Search AI tools
  app.get("/api/tools/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Search query required" });
      }
      const tools = await storage.searchTools(query);
      res.json(tools.map(transformTool));
    } catch (error) {
      console.error("Error searching tools:", error);
      res.status(500).json({ error: "Failed to search tools" });
    }
  });

  // Get all articles
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getAllArticles();
      res.json(articles.map(transformArticle));
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ error: "Failed to fetch articles" });
    }
  });

  // Get article by slug
  app.get("/api/articles/:slug", async (req, res) => {
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

  // Favorites endpoints
  app.post("/api/favorites", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const { toolId } = req.body;
      
      if (!toolId || typeof toolId !== 'number') {
        return res.status(400).json({ error: "Invalid toolId" });
      }

      const favorite = await storage.addFavorite(userId, toolId);
      res.json(favorite);
    } catch (error: any) {
      console.error("Error adding favorite:", error);
      if (error.message?.includes('duplicate') || error.code === '23505') {
        return res.status(409).json({ error: "Tool already favorited" });
      }
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:toolId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
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

  app.get("/api/favorites", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const tools = await storage.getUserFavorites(userId);
      res.json(tools.map(transformTool));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.get("/api/favorites/check/:toolId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
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

  // Search history endpoints
  app.post("/api/search-history", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Invalid query" });
      }

      const history = await storage.addSearchHistory(userId, query);
      res.json(history);
    } catch (error) {
      console.error("Error adding search history:", error);
      res.status(500).json({ error: "Failed to add search history" });
    }
  });

  app.get("/api/search-history", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const limit = parseInt(req.query.limit as string) || 10;
      const history = await storage.getUserSearchHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ error: "Failed to fetch search history" });
    }
  });

  app.delete("/api/search-history", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      await storage.clearUserSearchHistory(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing search history:", error);
      res.status(500).json({ error: "Failed to clear search history" });
    }
  });

  // Analytics endpoints
  app.post("/api/analytics/track", async (req, res) => {
    try {
      const { toolId, eventType, userId, metadata } = req.body;
      
      if (!toolId || !eventType) {
        return res.status(400).json({ error: "toolId and eventType are required" });
      }

      await storage.trackEvent({
        toolId,
        eventType,
        userId: userId || null,
        metadata: metadata || null,
      });

      if (eventType === 'view') {
        await storage.incrementToolViewCount(toolId);
      } else if (eventType === 'click') {
        await storage.incrementToolUsageCount(toolId);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking event:", error);
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  app.get("/api/analytics/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const tools = await storage.getPopularTools(limit);
      res.json(tools.map(transformTool));
    } catch (error) {
      console.error("Error fetching popular tools:", error);
      res.status(500).json({ error: "Failed to fetch popular tools" });
    }
  });

  app.get("/api/analytics/trending", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const daysSince = parseInt(req.query.daysSince as string) || 7;
      const tools = await storage.getTrendingTools(limit, daysSince);
      res.json(tools.map(transformTool));
    } catch (error) {
      console.error("Error fetching trending tools:", error);
      res.status(500).json({ error: "Failed to fetch trending tools" });
    }
  });

  app.get("/api/analytics/tool/:toolId", async (req, res) => {
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

  // Review endpoints
  app.post("/api/reviews", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
      const { toolId, rating, comment } = req.body;

      if (!toolId || typeof toolId !== 'number') {
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

  app.get("/api/reviews/tool/:toolId", async (req, res) => {
    try {
      const toolId = parseInt(req.params.toolId);
      if (isNaN(toolId)) {
        return res.status(400).json({ error: "Invalid toolId" });
      }

      const reviews = await storage.getToolReviews(toolId);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/user/:toolId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
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

  app.put("/api/reviews/:reviewId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
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

  app.delete("/api/reviews/:reviewId", requireAuth, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.uid;
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

  // Chatbot endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const validationResult = chatRequestSchema.safeParse(req.body);
      if (!validationResult.success) {
        console.error("Chat validation error:", validationResult.error);
        console.error("Request body:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ error: "Invalid request format", details: validationResult.error });
      }

      const { message, conversationHistory = [] } = validationResult.data;
      console.log(`Chat request: message="${message}", history length=${conversationHistory.length}`);

      // Get all tools for context
      const tools = await storage.getAllTools();
      
      // Build context about available tools
      const toolsContext = tools.map(t => 
        `${t.name} (${t.category}): ${t.description}`
      ).join('\n');

      // Build conversation messages
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
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

Keep responses concise and actionable.`,
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: "user",
          content: message,
        },
      ];

      // Call OpenAI API
      console.log("Calling OpenAI API with model: gpt-4.1");
      const completion = await openai.chat.completions.create({
        model: "gpt-4.1", // Using gpt-4.1 for reliable responses
        messages,
        max_tokens: 1000, // Increased token limit for complete responses
      });

      console.log("OpenAI response received:", {
        choices: completion.choices?.length,
        hasContent: !!completion.choices?.[0]?.message?.content,
        finishReason: completion.choices?.[0]?.finish_reason
      });

      const assistantMessage = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      // Extract tool names mentioned in the response for suggested tools
      const suggestedTools = tools
        .filter(tool => assistantMessage.toLowerCase().includes(tool.name.toLowerCase()))
        .map(tool => tool.id)
        .slice(0, 3);

      console.log(`Chat response generated: ${assistantMessage.substring(0, 100)}${assistantMessage.length > 100 ? '...' : ''}`);
      res.json({
        message: assistantMessage,
        suggestedTools,
      });
    } catch (error) {
      console.error("Error in chat endpoint:", error);
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
      }
      res.status(500).json({ error: "Failed to process chat request", details: String(error) });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      await storage.createContactMessage({
        name,
        email,
        subject,
        message,
      });

      res.json({ success: true, message: "Your message has been sent successfully. We'll get back to you soon!" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ error: "Failed to send message. Please try again later." });
    }
  });

  // Admin endpoints
  app.post("/api/admin/tools", requireAdmin, async (req: AuthenticatedRequest, res) => {
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
        url,
      });

      res.json(transformTool(tool));
    } catch (error) {
      console.error("Error creating tool:", error);
      res.status(500).json({ error: "Failed to create tool" });
    }
  });

  app.post("/api/admin/articles", requireAdmin, async (req: AuthenticatedRequest, res) => {
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
        tags: tags || [],
      });

      res.json(transformArticle(article));
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ error: "Failed to create article" });
    }
  });

  app.delete("/api/admin/articles/:id", requireAdmin, async (req: AuthenticatedRequest, res) => {
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

  app.post("/api/admin/seed", requireAdmin, async (req: AuthenticatedRequest, res) => {
    try {
      console.log("🌱 Starting database seed from admin endpoint...");
      const result = await seedDatabase();
      console.log("✅ Database seeding complete:", result);
      res.json({
        success: true,
        message: "Database seeded successfully",
        ...result,
      });
    } catch (error) {
      console.error("❌ Error seeding database:", error);
      res.status(500).json({ 
        error: "Failed to seed database", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
