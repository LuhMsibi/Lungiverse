import type { Express} from "express";
import { createServer, type Server } from "http";
import { storage } from "./dbStorage";
import { chatRequestSchema, type Article, type Tool, type ArticleLegacy, type AITool } from "@shared/schema";
import OpenAI from "openai";

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
function transformTool(tool: Tool): AITool {
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
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
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
          content: `You are a helpful AI assistant for ToolForge AI, a platform that helps users discover and choose AI tools. Your role is to:

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
      const completion = await openai.chat.completions.create({
        model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
        messages,
        max_completion_tokens: 500,
      });

      const assistantMessage = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";

      // Extract tool names mentioned in the response for suggested tools
      const suggestedTools = tools
        .filter(tool => assistantMessage.toLowerCase().includes(tool.name.toLowerCase()))
        .map(tool => tool.id)
        .slice(0, 3);

      console.log(`Chat response: ${assistantMessage.substring(0, 100)}...`);
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

  const httpServer = createServer(app);
  return httpServer;
}
