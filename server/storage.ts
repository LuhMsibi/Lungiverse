import type { AITool, Article, InsertAITool, InsertArticle } from "@shared/schema";
import { randomUUID } from "crypto";

// Image paths for articles - these will be served by the frontend
const aiTransformImage = "/attached_assets/generated_images/AI_transformation_article_cover_e693a669.png";
const aiToolsGuideImage = "/attached_assets/generated_images/AI_tools_guide_cover_1f857496.png";
const fileConversionImage = "/attached_assets/generated_images/File_conversion_article_cover_414e4d76.png";
const aiProductivityImage = "/attached_assets/generated_images/AI_productivity_article_cover_9c82a128.png";
const futureAIImage = "/attached_assets/generated_images/Future_of_AI_article_cover_2ea93ce2.png";

export interface IStorage {
  getAllTools(): Promise<AITool[]>;
  getToolById(id: string): Promise<AITool | undefined>;
  searchTools(query: string): Promise<AITool[]>;
  getAllArticles(): Promise<Article[]>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
}

export class MemStorage implements IStorage {
  private tools: Map<string, AITool>;
  private articles: Map<string, Article>;

  constructor() {
    this.tools = new Map();
    this.articles = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize AI Tools
    const toolsData: InsertAITool[] = [
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
      },
      {
        name: "Stable Diffusion",
        description: "Open-source text-to-image model with extensive customization and local deployment options",
        category: "Image AI",
        features: ["Open source", "Local deployment", "Fine-tuning support"],
        isPaid: false,
        requiresAPI: true,
        url: "https://stability.ai",
        usageCount: 38000,
      },
      {
        name: "Remove.bg",
        description: "AI-powered background removal tool for images with instant, accurate results",
        category: "Image AI",
        features: ["Instant processing", "Bulk editing", "API integration"],
        isPaid: false,
        requiresAPI: true,
        url: "https://www.remove.bg",
        usageCount: 28000,
      },
      {
        name: "Canva AI",
        description: "Design platform with AI-powered image generation, editing, and enhancement features",
        category: "Image AI",
        features: ["Text to image", "AI upscaling", "Magic eraser"],
        isPaid: false,
        requiresAPI: false,
        url: "https://www.canva.com",
        usageCount: 67000,
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
        usageCount: 125000,
      },
      {
        name: "Jasper AI",
        description: "AI writing assistant specialized in marketing copy, blog posts, and creative content",
        category: "Text AI",
        features: ["Marketing templates", "SEO optimization", "Brand voice"],
        isPaid: true,
        requiresAPI: true,
        url: "https://www.jasper.ai",
        usageCount: 34000,
      },
      {
        name: "Copy.ai",
        description: "AI copywriting tool for generating marketing content, emails, and social media posts",
        category: "Text AI",
        features: ["90+ templates", "Multi-language", "Team collaboration"],
        isPaid: false,
        requiresAPI: true,
        url: "https://www.copy.ai",
        usageCount: 29000,
      },
      {
        name: "Grammarly",
        description: "AI-powered writing assistant for grammar, spelling, tone, and style improvements",
        category: "Text AI",
        features: ["Grammar checking", "Tone detection", "Plagiarism detection"],
        isPaid: false,
        requiresAPI: true,
        url: "https://www.grammarly.com",
        usageCount: 89000,
      },
      {
        name: "QuillBot",
        description: "AI paraphrasing and summarization tool with grammar checking capabilities",
        category: "Text AI",
        features: ["Paraphrasing", "Summarization", "Citation generator"],
        isPaid: false,
        requiresAPI: true,
        url: "https://quillbot.com",
        usageCount: 41000,
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
        usageCount: 23000,
      },
      {
        name: "Synthesia",
        description: "AI video generation platform creating professional videos with AI avatars",
        category: "Video AI",
        features: ["AI avatars", "Multi-language", "Custom branding"],
        isPaid: true,
        requiresAPI: true,
        url: "https://www.synthesia.io",
        usageCount: 18000,
      },
      {
        name: "Descript",
        description: "AI-powered video and audio editor with transcription and overdub features",
        category: "Video AI",
        features: ["Text-based editing", "AI voices", "Transcription"],
        isPaid: false,
        requiresAPI: false,
        url: "https://www.descript.com",
        usageCount: 31000,
      },
      {
        name: "Pictory",
        description: "AI video creation from text and long-form content with automatic editing",
        category: "Video AI",
        features: ["Article to video", "Auto-captioning", "Stock footage"],
        isPaid: true,
        requiresAPI: true,
        url: "https://pictory.ai",
        usageCount: 14000,
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
        usageCount: 42000,
      },
      {
        name: "Murf AI",
        description: "AI voice generator for professional voiceovers with 100+ natural-sounding voices",
        category: "Audio AI",
        features: ["100+ voices", "Voice customization", "Background music"],
        isPaid: true,
        requiresAPI: true,
        url: "https://murf.ai",
        usageCount: 19000,
      },
      {
        name: "Adobe Podcast",
        description: "AI audio enhancement tool for removing noise and improving podcast quality",
        category: "Audio AI",
        features: ["Noise removal", "Enhancement", "Transcription"],
        isPaid: false,
        requiresAPI: false,
        url: "https://podcast.adobe.com",
        usageCount: 27000,
      },
      {
        name: "Krisp",
        description: "AI noise cancellation for calls and recordings with voice clarity enhancement",
        category: "Audio AI",
        features: ["Noise cancellation", "Echo removal", "All platforms"],
        isPaid: false,
        requiresAPI: false,
        url: "https://krisp.ai",
        usageCount: 35000,
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
        usageCount: 78000,
      },
      {
        name: "Tabnine",
        description: "AI code completion tool supporting all major programming languages and IDEs",
        category: "Code AI",
        features: ["AI completions", "Team learning", "Privacy focused"],
        isPaid: false,
        requiresAPI: true,
        url: "https://www.tabnine.com",
        usageCount: 45000,
      },
      {
        name: "Cursor",
        description: "AI-first code editor with built-in AI assistance and code generation",
        category: "Code AI",
        features: ["AI chat", "Code generation", "Refactoring"],
        isPaid: false,
        requiresAPI: false,
        url: "https://cursor.sh",
        usageCount: 39000,
      },
      {
        name: "Replit AI",
        description: "AI coding assistant integrated into Replit with code generation and debugging",
        category: "Code AI",
        features: ["Code generation", "Debugging help", "Project scaffolding"],
        isPaid: false,
        requiresAPI: true,
        url: "https://replit.com",
        usageCount: 52000,
      },
      {
        name: "CodeWhisperer",
        description: "Amazon's AI code generator with security scanning and AWS optimization",
        category: "Code AI",
        features: ["Code suggestions", "Security scanning", "AWS optimized"],
        isPaid: false,
        requiresAPI: true,
        url: "https://aws.amazon.com/codewhisperer",
        usageCount: 28000,
      },
    ];

    toolsData.forEach((toolData) => {
      const id = randomUUID();
      const tool: AITool = { ...toolData, id };
      this.tools.set(id, tool);
    });

    // Initialize Articles
    const articlesData: InsertArticle[] = [
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
          <p>Companies implementing AI solutions report average productivity increases of 40% and cost reductions of 25%. The technology is no longer optional—it's essential for staying competitive.</p>
          
          <h2>Getting Started</h2>
          <p>Begin by identifying repetitive tasks in your workflow. Explore AI tools in our directory that address these specific needs. Start small, measure results, and scale successful implementations.</p>
          
          <p>The future of business is intelligent, automated, and AI-powered. The question isn't whether to adopt AI, but how quickly you can integrate it into your operations.</p>
        `,
        coverImage: aiTransformImage,
        category: "Business AI",
        author: { name: "Sarah Chen", avatar: "" },
        publishedAt: "2025-01-15",
        readTime: "8 min read",
        tags: ["AI", "Business", "Automation", "Productivity"],
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
          <p>Consider whether you need a free tier, pay-per-use, or subscription model. Many tools offer free trials—take advantage of these before committing.</p>
          
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
        author: { name: "Michael Torres", avatar: "" },
        publishedAt: "2025-01-20",
        readTime: "12 min read",
        tags: ["Guide", "AI Tools", "Decision Making", "Best Practices"],
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
          <p>Video conversion tools optimize files for different platforms—4K for YouTube, compressed versions for social media, specific formats for presentations.</p>
          
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
        author: { name: "Jessica Park", avatar: "" },
        publishedAt: "2025-01-22",
        readTime: "10 min read",
        tags: ["Conversion", "Productivity", "Tools", "Workflow"],
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
          
          <h2>Measuring Your Gains</h2>
          <p>Track time saved on specific tasks. Most users report 30-50% time savings within the first month, growing to 70-80% as they master AI assistance.</p>
          
          <h2>The Future of Work</h2>
          <p>AI assistants aren't replacing humans—they're amplifying our capabilities. The professionals who master AI assistance will outperform those who don't by an order of magnitude.</p>
          
          <p>Start small, experiment widely, and measure results. Your 10x productivity increase is just a few good prompts away.</p>
        `,
        coverImage: aiProductivityImage,
        category: "Productivity",
        author: { name: "David Kim", avatar: "" },
        publishedAt: "2025-01-25",
        readTime: "11 min read",
        tags: ["AI", "Productivity", "Automation", "Work Efficiency"],
      },
      {
        title: "The Future of AI: 5 Trends to Watch in 2025",
        slug: "future-of-ai-trends-2025",
        excerpt: "Explore the cutting-edge developments shaping the future of artificial intelligence and what they mean for businesses and individuals.",
        content: `
          <h2>AI's Accelerating Evolution</h2>
          <p>Artificial intelligence is advancing faster than ever. These five trends will define AI development and adoption in 2025 and beyond.</p>
          
          <h2>Trend 1: Multimodal AI</h2>
          <p>AI systems that seamlessly work with text, images, video, and audio are becoming the norm. GPT-5 and similar models understand and generate content across all modalities.</p>
          
          <p><strong>Impact:</strong> Create entire marketing campaigns—copy, images, videos—with single prompts. Design software by describing interfaces visually and functionally.</p>
          
          <h2>Trend 2: AI Agents and Automation</h2>
          <p>Beyond simple chatbots, AI agents now complete complex multi-step tasks autonomously. They plan, execute, and adapt without constant human guidance.</p>
          
          <p><strong>Impact:</strong> Deploy AI agents to handle customer service, data analysis, content creation, and administrative tasks end-to-end.</p>
          
          <h2>Trend 3: Personalization at Scale</h2>
          <p>AI now creates genuinely personalized experiences for millions of users simultaneously. From content recommendations to custom product designs, mass customization is reality.</p>
          
          <p><strong>Impact:</strong> Businesses can offer Netflix-level personalization regardless of size. Education becomes truly adaptive to individual learning styles.</p>
          
          <h2>Trend 4: Edge AI and Local Processing</h2>
          <p>Powerful AI running directly on devices rather than in the cloud offers speed, privacy, and offline capability. Your phone's AI is as capable as cloud services were last year.</p>
          
          <p><strong>Impact:</strong> Instant AI responses, no internet required. Complete data privacy. AI assistance available everywhere, always.</p>
          
          <h2>Trend 5: AI in Scientific Discovery</h2>
          <p>AI accelerates research in medicine, materials science, and climate solutions. Models design new proteins, discover drug candidates, and optimize renewable energy systems.</p>
          
          <p><strong>Impact:</strong> Breakthrough treatments developed in months instead of years. Solutions to climate change accelerated dramatically.</p>
          
          <h2>Preparing for the Future</h2>
          
          <h3>For Businesses</h3>
          <p>Start experimenting now. Build AI literacy across your organization. Identify high-impact use cases. The companies thriving in 2027 are those investing in AI capabilities today.</p>
          
          <h3>For Individuals</h3>
          <p>Learn to work alongside AI. Master prompt engineering. Understand AI capabilities and limitations. Your career advantage lies in AI collaboration skills.</p>
          
          <h2>Ethical Considerations</h2>
          <p>As AI becomes more powerful, responsible development and deployment matter more than ever. Focus on transparency, fairness, and human oversight.</p>
          
          <h2>The Opportunity</h2>
          <p>We're witnessing a once-in-a-generation technological shift. Those who embrace AI thoughtfully and strategically will unlock unprecedented opportunities.</p>
          
          <p>The future isn't coming—it's here. The question is: are you ready to make the most of it?</p>
        `,
        coverImage: futureAIImage,
        category: "AI Trends",
        author: { name: "Dr. Emily Watson", avatar: "" },
        publishedAt: "2025-01-28",
        readTime: "13 min read",
        tags: ["AI", "Future", "Technology", "Innovation", "Trends"],
      },
    ];

    articlesData.forEach((articleData) => {
      const id = randomUUID();
      const article: Article = { ...articleData, id };
      this.articles.set(id, article);
    });
  }

  async getAllTools(): Promise<AITool[]> {
    return Array.from(this.tools.values());
  }

  async getToolById(id: string): Promise<AITool | undefined> {
    return this.tools.get(id);
  }

  async searchTools(query: string): Promise<AITool[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tools.values()).filter(
      (tool) =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.category.toLowerCase().includes(lowerQuery) ||
        tool.features.some((f) => f.toLowerCase().includes(lowerQuery))
    );
  }

  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find((a) => a.slug === slug);
  }
}

export const storage = new MemStorage();
