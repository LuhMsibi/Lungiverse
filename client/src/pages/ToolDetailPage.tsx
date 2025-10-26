import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Star, Check, ArrowLeft } from "lucide-react";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import type { AITool } from "@shared/schema";

export default function ToolDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: tools = [], isLoading } = useQuery<AITool[]>({
    queryKey: ["/api/tools"],
  });

  const tool = tools.find((t) => t.id === id);

  const { data: reviews = [] } = useQuery<any[]>({
    queryKey: ["/api/reviews/tool", id],
    enabled: !!id,
  });

  const { data: userReview } = useQuery<any>({
    queryKey: ["/api/reviews/user", id],
    enabled: !!user && !!id,
  });

  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        toast({
          title: "Login required",
          description: "Please log in to submit a review",
          variant: "destructive",
        });
        return;
      }
      if (rating === 0) {
        toast({
          title: "Rating required",
          description: "Please select a star rating",
          variant: "destructive",
        });
        return;
      }

      return await apiRequest("/api/reviews", "POST", {
        toolId: parseInt(id!),
        rating,
        comment: comment.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/tool", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/user", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      setRating(0);
      setComment("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to submit review",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="h-96 animate-pulse">
          <div className="h-full bg-muted" />
        </Card>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link href="/tools">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
        </Link>
      </div>
    );
  }

  const displayRating = hoveredRating || rating;
  const averageRating = (tool as any).averageRating || 0;
  const reviewCount = (tool as any).reviewCount || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Link href="/tools">
          <Button variant="ghost" size="sm" data-testid="button-back-to-tools">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tools
          </Button>
        </Link>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{tool.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="secondary">{tool.category}</Badge>
                  {!tool.isPaid && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      Free
                    </Badge>
                  )}
                  {tool.requiresAPI && (
                    <Badge variant="outline">Requires API</Badge>
                  )}
                  {averageRating > 0 && (
                    <div className="flex items-center gap-1" data-testid="tool-rating">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{averageRating}</span>
                      <span className="text-muted-foreground">({reviewCount} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton toolId={tool.id} />
                {tool.url && (
                  <Button onClick={() => window.open(tool.url, '_blank')} data-testid="button-try-tool">
                    Try Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{tool.description}</p>
            </div>

            {tool.features && tool.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Key Features</h2>
                <ul className="space-y-2">
                  {tool.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.usageCount && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {tool.usageCount.toLocaleString()} users have tried this tool
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold">Reviews & Ratings</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && !userReview && (
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg">
                <h3 className="font-semibold">Write a Review</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform hover:scale-110"
                        data-testid={`star-rating-${star}`}
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= displayRating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Review (Optional)</label>
                  <Textarea
                    placeholder="Share your experience with this tool..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    data-testid="textarea-review"
                  />
                </div>
                <Button
                  onClick={() => submitReviewMutation.mutate()}
                  disabled={submitReviewMutation.isPending || rating === 0}
                  data-testid="button-submit-review"
                >
                  {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            )}

            {!user && (
              <div className="text-center py-6 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground mb-2">Please log in to write a review</p>
              </div>
            )}

            {userReview && (
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-sm font-medium mb-2">You have already reviewed this tool</p>
                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= userReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                {userReview.comment && (
                  <p className="text-sm text-muted-foreground">{userReview.comment}</p>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">All Reviews ({reviews.length})</h3>
              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review this tool!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="flex gap-4 p-4 rounded-lg bg-muted/30" data-testid={`review-${review.id}`}>
                      <Avatar>
                        <AvatarImage src={review.userAvatar} />
                        <AvatarFallback>{review.userName[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex items-center gap-1 mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
