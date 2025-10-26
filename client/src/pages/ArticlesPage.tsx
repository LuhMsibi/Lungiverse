import { useQuery } from "@tanstack/react-query";
import { ArticleCard } from "@/components/ArticleCard";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Article } from "@shared/schema";

export default function ArticlesPage() {
  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">Articles & Guides</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Expert insights, tutorials, and reviews to help you make the most of AI tools.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <Card className="h-96 animate-pulse">
              <div className="h-full bg-muted rounded-md" />
            </Card>
            <div className="grid lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse">
                  <div className="h-full bg-muted rounded-md" />
                </Card>
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <BookOpen className="w-24 h-24 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-semibold">No articles yet</h3>
              <p className="text-muted-foreground">
                Check back soon for expert insights and guides.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-12">
            {featuredArticle && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
                <ArticleCard article={featuredArticle} featured />
              </div>
            )}

            {otherArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">More Articles</h2>
                <div className="grid lg:grid-cols-2 gap-8">
                  {otherArticles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
