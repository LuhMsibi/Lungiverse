import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";
import type { Article } from "@shared/schema";

export default function ArticleDetailPage() {
  const [, params] = useRoute("/article/:slug");
  const slug = params?.slug;

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const article = articles.find((a) => a.slug === slug);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="h-96 animate-pulse">
            <div className="h-full bg-muted rounded-md" />
          </Card>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <FileText className="w-24 h-24 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">Article not found</h2>
              <p className="text-muted-foreground">
                The article you're looking for doesn't exist.
              </p>
              <Link href="/articles">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Articles
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <Link href="/articles">
              <Button variant="ghost" size="sm" className="mb-4 text-white hover:text-white/80">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </Link>
            <Badge variant="secondary" className="mb-4">
              {article.category}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>By {article.authorName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card className="p-8 sm:p-12">
            <div 
              className="prose prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
              data-testid="article-content"
            />

            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
