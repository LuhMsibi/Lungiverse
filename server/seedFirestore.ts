import { FirestoreStorage } from "./firestoreStorage";
import { firestore } from "./firebaseAdmin";

// Import seed data without importing db.ts
const toolsData = [
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
    viewCount: 4500,
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
    viewCount: 3200,
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
    viewCount: 5800,
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
    usageCount: 45000,
    viewCount: 12000,
  },
  {
    name: "Midjourney",
    description: "AI art generator producing highly artistic and creative images from text descriptions",
    category: "Image AI",
    features: ["Artistic styles", "Community gallery", "Version control"],
    isPaid: true,
    requiresAPI: false,
    url: "https://www.midjourney.com",
    usageCount: 52000,
    viewCount: 15000,
  },
  {
    name: "Stable Diffusion",
    description: "Open-source text-to-image model with extensive customization and local deployment options",
    category: "Image AI",
    features: ["Local installation", "Model customization", "Commercial use allowed"],
    isPaid: false,
    requiresAPI: false,
    url: "https://stability.ai/stable-diffusion",
    usageCount: 38000,
    viewCount: 11000,
  },
  {
    name: "Remove.bg",
    description: "AI-powered background removal tool for images with one-click processing",
    category: "Image AI",
    features: ["Instant background removal", "Bulk processing", "API integration"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.remove.bg",
    usageCount: 28000,
    viewCount: 9500,
  },
  {
    name: "Canva AI",
    description: "Comprehensive design platform with AI-powered tools for image generation and editing",
    category: "Image AI",
    features: ["Design templates", "AI image generation", "Collaboration tools"],
    isPaid: false,
    requiresAPI: false,
    url: "https://www.canva.com",
    usageCount: 62000,
    viewCount: 18000,
  },

  // Text AI Tools
  {
    name: "ChatGPT",
    description: "OpenAI's conversational AI for natural language understanding and text generation",
    category: "Text AI",
    features: ["Conversational AI", "Code generation", "Multiple languages"],
    isPaid: false,
    requiresAPI: true,
    url: "https://chat.openai.com",
    usageCount: 125000,
    viewCount: 35000,
  },
  {
    name: "Jasper AI",
    description: "AI writing assistant for marketing copy, blog posts, and creative content",
    category: "Text AI",
    features: ["SEO optimization", "Brand voice", "Template library"],
    isPaid: true,
    requiresAPI: true,
    url: "https://www.jasper.ai",
    usageCount: 18000,
    viewCount: 7200,
  },
  {
    name: "Copy.ai",
    description: "AI-powered copywriting tool for marketing content and social media posts",
    category: "Text AI",
    features: ["Marketing templates", "Tone adjustment", "Multi-language support"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.copy.ai",
    usageCount: 22000,
    viewCount: 8500,
  },
  {
    name: "Grammarly",
    description: "AI writing assistant for grammar, spelling, and style improvements",
    category: "Text AI",
    features: ["Grammar checking", "Style suggestions", "Plagiarism detection"],
    isPaid: false,
    requiresAPI: true,
    url: "https://www.grammarly.com",
    usageCount: 95000,
    viewCount: 28000,
  },
  {
    name: "QuillBot",
    description: "AI paraphrasing and summarization tool for content rewriting",
    category: "Text AI",
    features: ["Paraphrasing", "Summarization", "Citation generator"],
    isPaid: false,
    requiresAPI: true,
    url: "https://quillbot.com",
    usageCount: 42000,
    viewCount: 14000,
  },

  // Video AI Tools
  {
    name: "Runway ML",
    description: "AI-powered video editing platform with generative AI capabilities",
    category: "Video AI",
    features: ["Text-to-video", "Video editing", "Green screen removal"],
    isPaid: true,
    requiresAPI: true,
    url: "https://runwayml.com",
    usageCount: 15000,
    viewCount: 6200,
  },
  {
    name: "Synthesia",
    description: "AI video creation platform with virtual avatars and text-to-speech",
    category: "Video AI",
    features: ["AI avatars", "Multi-language", "Custom branding"],
    isPaid: true,
    requiresAPI: true,
    url: "https://www.synthesia.io",
    usageCount: 12000,
    viewCount: 5800,
  },
  {
    name: "Descript",
    description: "All-in-one video and audio editing with AI transcription and dubbing",
    category: "Video AI",
    features: ["Text-based editing", "AI transcription", "Studio sound"],
    isPaid: false,
    requiresAPI: false,
    url: "https://www.descript.com",
    usageCount: 18000,
    viewCount: 7500,
  },
  {
    name: "Pictory",
    description: "AI video creation from long-form content like articles and blog posts",
    category: "Video AI",
    features: ["Article to video", "Auto-captions", "Stock footage library"],
    isPaid: true,
    requiresAPI: true,
    url: "https://pictory.ai",
    usageCount: 9500,
    viewCount: 4200,
  },

  // Audio AI Tools
  {
    name: "ElevenLabs",
    description: "Advanced AI voice synthesis and text-to-speech with natural-sounding voices",
    category: "Audio AI",
    features: ["Voice cloning", "Multiple accents", "Emotional control"],
    isPaid: false,
    requiresAPI: true,
    url: "https://elevenlabs.io",
    usageCount: 32000,
    viewCount: 11000,
  },
  {
    name: "Murf AI",
    description: "AI voice generator for voiceovers with studio-quality output",
    category: "Audio AI",
    features: ["120+ voices", "Background music", "Video sync"],
    isPaid: false,
    requiresAPI: true,
    url: "https://murf.ai",
    usageCount: 14000,
    viewCount: 6800,
  },
  {
    name: "Adobe Podcast",
    description: "AI audio editing and enhancement for podcasts and voice recordings",
    category: "Audio AI",
    features: ["Noise reduction", "Voice enhancement", "Auto-transcription"],
    isPaid: false,
    requiresAPI: false,
    url: "https://podcast.adobe.com",
    usageCount: 19000,
    viewCount: 8200,
  },
  {
    name: "Krisp",
    description: "AI-powered noise cancellation for calls and recordings",
    category: "Audio AI",
    features: ["Background noise removal", "Echo cancellation", "Voice clarity"],
    isPaid: false,
    requiresAPI: false,
    url: "https://krisp.ai",
    usageCount: 24000,
    viewCount: 9800,
  },

  // Code AI Tools
  {
    name: "GitHub Copilot",
    description: "AI pair programmer that suggests code and entire functions in real-time",
    category: "Code AI",
    features: ["Code completion", "Multi-language support", "Context-aware suggestions"],
    isPaid: true,
    requiresAPI: false,
    url: "https://github.com/features/copilot",
    usageCount: 78000,
    viewCount: 22000,
  },
  {
    name: "Tabnine",
    description: "AI code completion tool supporting multiple IDEs and programming languages",
    category: "Code AI",
    features: ["Local/cloud models", "Team training", "Privacy-focused"],
    isPaid: false,
    requiresAPI: false,
    url: "https://www.tabnine.com",
    usageCount: 45000,
    viewCount: 15000,
  },
  {
    name: "Cursor",
    description: "AI-first code editor with built-in code generation and editing capabilities",
    category: "Code AI",
    features: ["Natural language editing", "Codebase understanding", "Multi-file edits"],
    isPaid: false,
    requiresAPI: false,
    url: "https://cursor.sh",
    usageCount: 38000,
    viewCount: 12000,
  },
  {
    name: "Replit AI",
    description: "Integrated AI assistant for coding, debugging, and learning in Replit's cloud IDE",
    category: "Code AI",
    features: ["Explain code", "Debug assistance", "Generate projects"],
    isPaid: false,
    requiresAPI: false,
    url: "https://replit.com/ai",
    usageCount: 52000,
    viewCount: 17000,
  },
  {
    name: "CodeWhisperer",
    description: "Amazon's AI coding companion with real-time code suggestions and security scanning",
    category: "Code AI",
    features: ["Security scanning", "Reference tracking", "AWS integration"],
    isPaid: false,
    requiresAPI: false,
    url: "https://aws.amazon.com/codewhisperer",
    usageCount: 28000,
    viewCount: 9500,
  },
];

const articlesData = [
  {
    title: "How AI is Transforming Business Workflows in 2025",
    slug: "ai-transforming-business-workflows-2025",
    excerpt: "Discover how artificial intelligence is revolutionizing business operations, from automation to decision-making, and what it means for your organization.",
    content: `<h2>The AI Revolution in Business</h2><p>Artificial intelligence has moved from science fiction to business reality. In 2025, companies across all sectors are leveraging AI to streamline workflows, reduce costs, and unlock new opportunities.</p><h3>Key Areas of Impact</h3><p>AI is transforming businesses in several critical ways: automating repetitive tasks, enhancing customer service with chatbots, improving decision-making through data analysis, and enabling predictive maintenance.</p><h3>Real-World Applications</h3><p>From healthcare to finance, AI tools are being deployed to solve complex problems. Machine learning algorithms analyze patient data, while AI-powered financial advisors help individuals make better investment decisions.</p><h3>The Future of Work</h3><p>As AI continues to evolve, the nature of work itself is changing. Employees are being freed from mundane tasks to focus on creative and strategic initiatives, while businesses that embrace AI are gaining competitive advantages.</p>`,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630",
    category: "AI Trends",
    authorName: "Lungisani Magubane",
    authorAvatar: "",
    publishedAt: new Date("2025-01-15"),
    readTime: "8 min read",
    tags: ["AI", "Business", "Automation", "Digital Transformation"],
  },
  {
    title: "The Complete Guide to Choosing the Right AI Tools",
    slug: "complete-guide-choosing-ai-tools",
    excerpt: "Not all AI tools are created equal. Learn how to evaluate and select the perfect AI solutions for your specific needs and budget.",
    content: `<h2>Navigating the AI Tools Landscape</h2><p>With thousands of AI tools available, choosing the right one can be overwhelming. This guide will help you make informed decisions based on your specific requirements.</p><h3>Understand Your Needs</h3><p>Before selecting an AI tool, clearly define your objectives. Are you looking to automate content creation, enhance customer service, or analyze data? Different tools excel in different areas.</p><h3>Evaluate Key Features</h3><p>Look for features that align with your goals: integration capabilities, scalability, ease of use, and pricing models. Consider whether the tool requires API access or can be used standalone.</p><h3>Consider the Learning Curve</h3><p>Some AI tools are plug-and-play, while others require technical expertise. Assess your team's capabilities and choose tools that match your skill level, or be prepared to invest in training.</p><h3>Test Before Committing</h3><p>Most AI platforms offer free trials or demo versions. Take advantage of these to test functionality, evaluate results, and ensure the tool fits your workflow before making a financial commitment.</p>`,
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630",
    category: "Guide",
    authorName: "Lungisani Magubane",
    authorAvatar: "",
    publishedAt: new Date("2025-01-10"),
    readTime: "12 min read",
    tags: ["AI Tools", "Guide", "Decision Making", "Technology"],
  },
  {
    title: "Understanding File Conversion Tools: From PDF to Everything",
    slug: "understanding-file-conversion-tools",
    excerpt: "Master the art of file conversion with our comprehensive guide to the best conversion tools and techniques for all your document needs.",
    content: `<h2>The Importance of File Conversion</h2><p>In today's digital world, we work with countless file formats. File conversion tools bridge the gap between different formats, enabling seamless collaboration and workflow efficiency.</p><h3>Common Conversion Scenarios</h3><p>From converting PDFs to Word documents for editing, to transforming images between formats for web optimization, conversion tools handle a variety of tasks that would otherwise be time-consuming or impossible.</p><h3>Choosing the Right Converter</h3><p>Not all conversion tools are equal. Factors to consider include format support, batch processing capabilities, quality retention, and whether you need cloud-based or offline solutions.</p><h3>Best Practices</h3><p>Always keep original files before converting, verify quality after conversion, and be aware of file size limitations. For sensitive documents, use tools that don't store files on their servers.</p><h3>Popular Tools</h3><p>CloudConvert, Zamzar, and PDF.co are among the top choices, each offering unique features like API access, batch processing, and extensive format support.</p>`,
    coverImage: "https://images.unsplash.com/photo-1618060932014-4deda4932554?w=1200&h=630",
    category: "Tools",
    authorName: "Lungisani Magubane",
    authorAvatar: "",
    publishedAt: new Date("2025-01-05"),
    readTime: "10 min read",
    tags: ["File Conversion", "PDF", "Tools", "Productivity"],
  },
  {
    title: "Boosting Productivity with AI: Real-World Success Stories",
    slug: "boosting-productivity-with-ai-success-stories",
    excerpt: "Learn from businesses and individuals who've achieved remarkable productivity gains through strategic AI implementation.",
    content: `<h2>AI-Powered Productivity Revolution</h2><p>Real companies and professionals are achieving extraordinary results with AI tools. These success stories demonstrate the transformative potential of artificial intelligence in everyday work.</p><h3>Case Study: Marketing Team Transformation</h3><p>A mid-sized marketing agency increased content output by 300% using AI writing assistants like Jasper AI and Copy.ai, while maintaining quality and reducing burnout among team members.</p><h3>Developer Efficiency Breakthrough</h3><p>A software development team reduced coding time by 40% with GitHub Copilot, allowing developers to focus on architecture and problem-solving rather than boilerplate code.</p><h3>Customer Service Excellence</h3><p>An e-commerce company implemented AI chatbots, handling 70% of customer inquiries instantly while improving customer satisfaction scores and freeing human agents for complex issues.</p><h3>Lessons Learned</h3><p>Success requires proper training, realistic expectations, and choosing the right tools for specific tasks. AI augments human capabilities rather than replacing them entirely.</p>`,
    coverImage: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=630",
    category: "Case Studies",
    authorName: "Lungisani Magubane",
    authorAvatar: "",
    publishedAt: new Date("2025-01-20"),
    readTime: "15 min read",
    tags: ["Productivity", "AI", "Case Studies", "Success Stories"],
  },
  {
    title: "The Future of AI Tools: Trends to Watch in 2025",
    slug: "future-of-ai-tools-trends-2025",
    excerpt: "Stay ahead of the curve with insights into emerging AI technologies and trends that will shape the tools landscape in the coming years.",
    content: `<h2>Looking Ahead: AI in 2025 and Beyond</h2><p>The AI tools landscape is evolving rapidly. Understanding emerging trends helps businesses and individuals prepare for the future and make strategic technology investments.</p><h3>Multimodal AI Integration</h3><p>The next generation of AI tools will seamlessly combine text, image, audio, and video capabilities, enabling more sophisticated and versatile applications across industries.</p><h3>Personalization and Adaptation</h3><p>AI tools are becoming smarter about learning individual user preferences and adapting to specific workflows, delivering increasingly personalized experiences.</p><h3>Ethical AI and Transparency</h3><p>As AI becomes more prevalent, tools that prioritize ethical considerations, bias mitigation, and explainable AI will gain market preference and regulatory compliance.</p><h3>Edge AI and Privacy</h3><p>More AI processing will happen locally on devices rather than in the cloud, addressing privacy concerns and enabling offline capabilities while reducing latency.</p><h3>Democratization of AI</h3><p>No-code and low-code AI platforms are making advanced capabilities accessible to non-technical users, democratizing innovation and empowering small businesses.</p>`,
    coverImage: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&h=630",
    category: "AI Trends",
    authorName: "Lungisani Magubane",
    authorAvatar: "",
    publishedAt: new Date("2025-01-25"),
    readTime: "11 min read",
    tags: ["Future Tech", "AI Trends", "Innovation", "2025"],
  },
];

const interactiveModelsData = [
  {
    name: "Llama 3.2 3B",
    description: "Fast and efficient text generation model perfect for conversational AI, content creation, and creative writing. Excellent for everyday tasks.",
    category: "Text AI",
    huggingFaceModelId: "meta-llama/Llama-3.2-3B-Instruct",
    externalUrl: "https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct",
    usageCount: 0,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Mistral 7B",
    description: "Powerful open-source language model optimized for chat and instruction following. Great for complex reasoning and detailed explanations.",
    category: "Text AI",
    huggingFaceModelId: "mistralai/Mistral-7B-Instruct-v0.3",
    externalUrl: "https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3",
    usageCount: 0,
    isActive: true,
    isFeatured: true,
  },
  {
    name: "Qwen 2.5 7B",
    description: "Advanced reasoning AI model with strong multilingual capabilities. Excellent for complex problem-solving, code generation, and analysis.",
    category: "Text AI",
    huggingFaceModelId: "Qwen/Qwen2.5-7B-Instruct",
    externalUrl: "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct",
    usageCount: 0,
    isActive: true,
    isFeatured: true,
  },
];

export async function seedFirestoreDatabase() {
  const storage = new FirestoreStorage();
  const db = firestore;
  
  console.log("🌱 Starting Firestore database seeding...");
  
  let toolsCreated = 0;
  let toolsExisted = 0;
  let articlesCreated = 0;
  let articlesExisted = 0;
  let modelsCreated = 0;
  let modelsExisted = 0;

  // Seed tools
  console.log("📦 Seeding tools...");
  for (const toolData of toolsData) {
    try {
      // Check if tool already exists
      const existingTools = await db
        .collection("tools")
        .where("name", "==", toolData.name)
        .limit(1)
        .get();

      if (existingTools.empty) {
        await storage.createTool(toolData);
        toolsCreated++;
        console.log(`  ✅ Created tool: ${toolData.name}`);
      } else {
        toolsExisted++;
        console.log(`  ⏭️  Tool already exists: ${toolData.name}`);
      }
    } catch (error) {
      console.error(`  ❌ Error creating tool ${toolData.name}:`, error);
    }
  }

  // Seed articles
  console.log("📰 Seeding articles...");
  for (const articleData of articlesData) {
    try {
      // Check if article already exists
      const existingArticles = await db
        .collection("articles")
        .where("slug", "==", articleData.slug)
        .limit(1)
        .get();

      if (existingArticles.empty) {
        await storage.createArticle(articleData);
        articlesCreated++;
        console.log(`  ✅ Created article: ${articleData.title}`);
      } else {
        articlesExisted++;
        console.log(`  ⏭️  Article already exists: ${articleData.title}`);
      }
    } catch (error) {
      console.error(`  ❌ Error creating article ${articleData.title}:`, error);
    }
  }

  // Seed interactive models
  console.log("🤖 Seeding interactive models...");
  for (const modelData of interactiveModelsData) {
    try {
      // Check if model already exists
      const existingModels = await db
        .collection("interactive_models")
        .where("name", "==", modelData.name)
        .limit(1)
        .get();

      if (existingModels.empty) {
        await storage.createInteractiveModel(modelData);
        modelsCreated++;
        console.log(`  ✅ Created model: ${modelData.name}`);
      } else {
        modelsExisted++;
        console.log(`  ⏭️  Model already exists: ${modelData.name}`);
      }
    } catch (error) {
      console.error(`  ❌ Error creating model ${modelData.name}:`, error);
    }
  }

  const result = {
    tools: {
      created: toolsCreated,
      existed: toolsExisted,
      total: toolsData.length,
    },
    articles: {
      created: articlesCreated,
      existed: articlesExisted,
      total: articlesData.length,
    },
    interactiveModels: {
      created: modelsCreated,
      existed: modelsExisted,
      total: interactiveModelsData.length,
    },
  };

  console.log("✅ Firestore database seeding complete!");
  console.log(`   Tools: ${toolsCreated} new, ${toolsExisted} already existed`);
  console.log(`   Articles: ${articlesCreated} new, ${articlesExisted} already existed`);
  console.log(`   Interactive Models: ${modelsCreated} new, ${modelsExisted} already existed`);

  return result;
}
