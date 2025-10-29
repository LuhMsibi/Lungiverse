import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/authUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2, Trash2 } from "lucide-react";
import type { Article } from "@shared/schema";

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Tool form state
  const [toolName, setToolName] = useState("");
  const [toolDescription, setToolDescription] = useState("");
  const [toolCategory, setToolCategory] = useState("");
  const [toolFeatures, setToolFeatures] = useState("");
  const [toolIsPaid, setToolIsPaid] = useState(false);
  const [toolRequiresAPI, setToolRequiresAPI] = useState(false);
  const [toolUrl, setToolUrl] = useState("");

  // Article form state
  const [articleTitle, setArticleTitle] = useState("");
  const [articleSlug, setArticleSlug] = useState("");
  const [articleExcerpt, setArticleExcerpt] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [articleCategory, setArticleCategory] = useState("");
  const [articleAuthor, setArticleAuthor] = useState("");
  const [articleReadTime, setArticleReadTime] = useState("");
  const [articleTags, setArticleTags] = useState("");

  const createToolMutation = useMutation({
    mutationFn: async (toolData: any) => {
      return apiRequest("/api/admin/tools", "POST", toolData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tools"] });
      toast({
        title: "Success",
        description: "Tool created successfully",
      });
      // Reset form
      setToolName("");
      setToolDescription("");
      setToolCategory("");
      setToolFeatures("");
      setToolIsPaid(false);
      setToolRequiresAPI(false);
      setToolUrl("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tool",
        variant: "destructive",
      });
    },
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData: any) => {
      return apiRequest("/api/admin/articles", "POST", articleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article created successfully",
      });
      // Reset form
      setArticleTitle("");
      setArticleSlug("");
      setArticleExcerpt("");
      setArticleContent("");
      setArticleCategory("");
      setArticleAuthor("");
      setArticleReadTime("");
      setArticleTags("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create article",
        variant: "destructive",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: number) => {
      return apiRequest(`/api/admin/articles/${articleId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article",
        variant: "destructive",
      });
    },
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
    enabled: user?.isAdmin === true,
  });

  const handleToolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const features = toolFeatures.split("\n").filter(f => f.trim());
    
    createToolMutation.mutate({
      name: toolName,
      description: toolDescription,
      category: toolCategory,
      features,
      isPaid: toolIsPaid,
      requiresAPI: toolRequiresAPI,
      url: toolUrl || undefined,
    });
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = articleTags.split(",").map(t => t.trim()).filter(t => t);
    
    createArticleMutation.mutate({
      title: articleTitle,
      slug: articleSlug,
      excerpt: articleExcerpt,
      content: articleContent,
      coverImage: "",
      category: articleCategory,
      authorName: articleAuthor,
      readTime: articleReadTime,
      tags,
    });
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access the admin panel</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Forbidden</CardTitle>
            <CardDescription>You do not have admin privileges to access this page</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Add new tools and articles to Lungiverse</p>
      </div>

      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tools" data-testid="tab-tools">Add Tool</TabsTrigger>
          <TabsTrigger value="articles" data-testid="tab-articles">Add Article</TabsTrigger>
          <TabsTrigger value="manage" data-testid="tab-manage">Manage Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <Card>
            <CardHeader>
              <CardTitle>Create New AI Tool</CardTitle>
              <CardDescription>Add a new AI tool to the directory</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleToolSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tool-name">Tool Name *</Label>
                  <Input
                    id="tool-name"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="ChatGPT"
                    required
                    data-testid="input-tool-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-description">Description *</Label>
                  <Textarea
                    id="tool-description"
                    value={toolDescription}
                    onChange={(e) => setToolDescription(e.target.value)}
                    placeholder="Advanced AI language model for conversations and content generation"
                    required
                    rows={3}
                    data-testid="input-tool-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-category">Category *</Label>
                  <Select value={toolCategory} onValueChange={setToolCategory} required>
                    <SelectTrigger data-testid="select-tool-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Conversion">Conversion</SelectItem>
                      <SelectItem value="Image AI">Image AI</SelectItem>
                      <SelectItem value="Text AI">Text AI</SelectItem>
                      <SelectItem value="Video AI">Video AI</SelectItem>
                      <SelectItem value="Audio AI">Audio AI</SelectItem>
                      <SelectItem value="Code AI">Code AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-features">Features (one per line) *</Label>
                  <Textarea
                    id="tool-features"
                    value={toolFeatures}
                    onChange={(e) => setToolFeatures(e.target.value)}
                    placeholder="Natural language understanding&#10;Content generation&#10;Code assistance"
                    required
                    rows={5}
                    data-testid="input-tool-features"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool-url">URL (optional)</Label>
                  <Input
                    id="tool-url"
                    type="url"
                    value={toolUrl}
                    onChange={(e) => setToolUrl(e.target.value)}
                    placeholder="https://example.com"
                    data-testid="input-tool-url"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toolIsPaid}
                      onChange={(e) => setToolIsPaid(e.target.checked)}
                      className="rounded"
                      data-testid="checkbox-tool-ispaid"
                    />
                    <span className="text-sm">Paid Tool</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toolRequiresAPI}
                      onChange={(e) => setToolRequiresAPI(e.target.checked)}
                      className="rounded"
                      data-testid="checkbox-tool-requiresapi"
                    />
                    <span className="text-sm">Requires API</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={createToolMutation.isPending}
                  className="w-full"
                  data-testid="button-submit-tool"
                >
                  {createToolMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Tool
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Create New Article</CardTitle>
              <CardDescription>Add a new article to the blog</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="article-title">Title *</Label>
                  <Input
                    id="article-title"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                    placeholder="The Future of AI Tools"
                    required
                    data-testid="input-article-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-slug">Slug *</Label>
                  <Input
                    id="article-slug"
                    value={articleSlug}
                    onChange={(e) => setArticleSlug(e.target.value)}
                    placeholder="future-of-ai-tools"
                    required
                    data-testid="input-article-slug"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-excerpt">Excerpt *</Label>
                  <Textarea
                    id="article-excerpt"
                    value={articleExcerpt}
                    onChange={(e) => setArticleExcerpt(e.target.value)}
                    placeholder="A brief summary of the article..."
                    required
                    rows={3}
                    data-testid="input-article-excerpt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-content">Content *</Label>
                  <Textarea
                    id="article-content"
                    value={articleContent}
                    onChange={(e) => setArticleContent(e.target.value)}
                    placeholder="Full article content (supports HTML/Markdown)..."
                    required
                    rows={8}
                    data-testid="input-article-content"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-category">Category *</Label>
                  <Input
                    id="article-category"
                    value={articleCategory}
                    onChange={(e) => setArticleCategory(e.target.value)}
                    placeholder="AI Tools"
                    required
                    data-testid="input-article-category"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-author">Author Name *</Label>
                  <Input
                    id="article-author"
                    value={articleAuthor}
                    onChange={(e) => setArticleAuthor(e.target.value)}
                    placeholder="John Doe"
                    required
                    data-testid="input-article-author"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-read-time">Read Time *</Label>
                  <Input
                    id="article-read-time"
                    value={articleReadTime}
                    onChange={(e) => setArticleReadTime(e.target.value)}
                    placeholder="5 min read"
                    required
                    data-testid="input-article-readtime"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="article-tags">Tags (comma-separated)</Label>
                  <Input
                    id="article-tags"
                    value={articleTags}
                    onChange={(e) => setArticleTags(e.target.value)}
                    placeholder="AI, Technology, Innovation"
                    data-testid="input-article-tags"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={createArticleMutation.isPending}
                  className="w-full"
                  data-testid="button-submit-article"
                >
                  {createArticleMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Article
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Manage Articles</CardTitle>
              <CardDescription>View and delete existing articles</CardDescription>
            </CardHeader>
            <CardContent>
              {articlesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : articles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No articles found</p>
              ) : (
                <div className="space-y-3">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                      data-testid={`article-item-${article.id}`}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{article.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {article.category} • {article.readTime} • {new Date(article.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
                            deleteArticleMutation.mutate(article.id);
                          }
                        }}
                        disabled={deleteArticleMutation.isPending}
                        data-testid={`button-delete-article-${article.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
