import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { Search, Sparkles, Zap, Shield, ArrowRight, RefreshCw, Image, FileText, Video, Headphones, Code } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { ArticleCard } from "@/components/ArticleCard";
import { useQuery } from "@tanstack/react-query";
import type { AITool, Article } from "@shared/schema";
import { useState } from "react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: tools = [], isLoading: toolsLoading } = useQuery<AITool[]>({
    queryKey: ["/api/tools"],
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const featuredTools = tools.slice(0, 6);
  const featuredArticles = articles.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/tools?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const categories = [
    { name: "Conversion", icon: RefreshCw, count: "50+" },
    { name: "Image AI", icon: Image, count: "40+" },
    { name: "Text AI", icon: FileText, count: "60+" },
    { name: "Video AI", icon: Video, count: "30+" },
    { name: "Audio AI", icon: Headphones, count: "25+" },
    { name: "Code AI", icon: Code, count: "45+" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-slate-700/25" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="space-y-4">
                <Badge variant="outline" className="text-sm">
                  <Sparkles className="mr-2 h-3 w-3" />
                  250+ AI Tools Available
                </Badge>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                  Discover the{" "}
                  <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Perfect AI Tool
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Your centralized platform for discovering, comparing, and using AI tools and conversion utilities. Find exactly what you need with intelligent search and expert recommendations.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Updated Daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Verified Tools</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/tools">
                  <Button size="lg" className="w-full sm:w-auto" data-testid="button-explore-tools">
                    Explore Tools
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/articles">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-read-guides">
                    Read Guides
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative lg:h-[500px] animate-fade-in-up [animation-delay:200ms]">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-chart-2/20 rounded-3xl blur-3xl" />
              <div className="relative h-full flex items-center justify-center">
                <Sparkles className="w-64 h-64 text-primary/30 animate-pulse-glow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Find Your Perfect Tool
              </h2>
              <p className="text-lg text-muted-foreground">
                Describe what you need or search by name
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Try: 'PDF to Word converter' or 'AI image generator'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 pl-16 pr-32 text-lg border-2 focus:border-primary transition-all"
                  data-testid="input-hero-search"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  data-testid="button-hero-search"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured AI Tools</h2>
              <p className="text-muted-foreground">Discover the most popular tools</p>
            </div>
            <Link href="/tools">
              <Button variant="outline" data-testid="button-view-all-tools">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {toolsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-64 animate-pulse">
                  <div className="h-full bg-muted" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to find your perfect AI tool
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Search</h3>
                <p className="text-muted-foreground">
                  Use our intelligent search to describe what you need or browse by category
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-chart-2/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold">Discover</h3>
                <p className="text-muted-foreground">
                  Explore detailed information, features, and pricing for each tool
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-chart-3/10 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-chart-3" />
                </div>
                <h3 className="text-xl font-semibold">Implement</h3>
                <p className="text-muted-foreground">
                  Get started with direct links and integration guides for your chosen tool
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-lg text-muted-foreground">
              Explore tools organized by their primary function
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.name} href={`/tools?category=${encodeURIComponent(category.name)}`}>
                  <Card className="text-center p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-center">
                        <IconComponent className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {category.count} tools
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Insights</h2>
              <p className="text-muted-foreground">Expert guides and AI tool reviews</p>
            </div>
            <Link href="/articles">
              <Button variant="outline" data-testid="button-view-all-articles">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {articlesLoading ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <div className="h-full bg-muted" />
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-primary to-chart-2 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
            <CardContent className="relative py-16 px-8 text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to Find Your Perfect AI Tool?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Start exploring our curated collection of AI tools and let our intelligent chatbot guide you to the perfect solution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/tools">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto" data-testid="button-cta-explore">
                    Start Exploring
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
