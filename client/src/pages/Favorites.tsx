import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { AITool } from "@shared/schema";

export default function Favorites() {
  const { toast } = useToast();
  const { data: favorites, isLoading } = useQuery<AITool[]>({
    queryKey: ["/api/favorites"],
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (toolId: string) => {
      const response = await apiRequest(`/api/favorites/${toolId}`, "DELETE");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Tool has been removed from your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/tools">
            <Button variant="ghost" size="sm" data-testid="button-back-to-tools">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8">My Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tools">
          <Button variant="ghost" size="sm" data-testid="button-back-to-tools">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Heart className="w-10 h-10 text-primary fill-primary" />
        <h1 className="text-4xl font-bold">My Favorites</h1>
      </div>

      {!favorites || favorites.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground mb-4">No favorites yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Start exploring tools and click the heart icon to save your favorites
            </p>
            <Link href="/tools">
              <Button data-testid="button-browse-tools">Browse Tools</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-muted-foreground mb-6" data-testid="text-favorites-count">
            {favorites.length} {favorites.length === 1 ? "tool" : "tools"} saved
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((tool) => (
              <Card key={tool.id} className="hover-elevate" data-testid={`card-tool-${tool.id}`}>
                <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-1">{tool.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge variant="outline" className="text-xs">
                        {tool.category}
                      </Badge>
                    </CardDescription>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFavoriteMutation.mutate(tool.id)}
                    disabled={removeFavoriteMutation.isPending}
                    data-testid={`button-remove-${tool.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {tool.description}
                  </p>
                  {tool.features && tool.features.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tool.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex items-center justify-between gap-2 pt-4">
                  <div className="flex gap-2">
                    {tool.isPaid && (
                      <Badge variant="outline" className="text-xs">
                        Paid
                      </Badge>
                    )}
                    {tool.requiresAPI && (
                      <Badge variant="outline" className="text-xs">
                        API
                      </Badge>
                    )}
                  </div>
                  {tool.url && (
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" data-testid={`button-visit-${tool.id}`}>
                        Visit
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
