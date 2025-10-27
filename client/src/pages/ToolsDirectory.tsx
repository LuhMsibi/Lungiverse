import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Search, SlidersHorizontal, Clock, X } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { AITool, ToolCategory, SearchHistory } from "@shared/schema";
import { toolCategories } from "@shared/schema";

export default function ToolsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("All Tools");
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  const { user } = useAuth();

  const { data: tools = [], isLoading } = useQuery<AITool[]>({
    queryKey: ["/api/tools"],
  });

  const { data: searchHistory = [] } = useQuery<SearchHistory[]>({
    queryKey: ["/api/search-history"],
    enabled: showSearchHistory && !!user,
  });

  const saveSearchMutation = useMutation({
    mutationFn: async (query: string) => {
      if (!user) return;
      return apiRequest("/api/search-history", "POST", { query });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-history"] });
    },
    onError: () => {
    },
  });

  const clearHistoryMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      return apiRequest("/api/search-history", "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/search-history"] });
    },
    onError: () => {
    },
  });

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = 
        selectedCategory === "All Tools" || tool.category === selectedCategory;

      const matchesFree = !showFreeOnly || !tool.isPaid;

      return matchesSearch && matchesCategory && matchesFree;
    });
  }, [tools, searchQuery, selectedCategory, showFreeOnly]);

  useEffect(() => {
    if (user && searchQuery.trim() && searchQuery.trim().length >= 3) {
      const timeoutId = setTimeout(() => {
        saveSearchMutation.mutate(searchQuery.trim());
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, user]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">AI Tools Directory</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our comprehensive collection of AI tools and utilities. Filter by category or search for specific features.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools by name, description, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchHistory(true)}
              onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
              className="pl-12 h-12 text-base"
              data-testid="input-tools-search"
            />
            
            {showSearchHistory && user && searchHistory.length > 0 && (
              <Card className="absolute z-10 w-full mt-2 p-4 shadow-lg" data-testid="card-search-history">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Recent Searches</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistoryMutation.mutate()}
                    data-testid="button-clear-history"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {searchHistory.slice(0, 10).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearchQuery(item.query);
                        setShowSearchHistory(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover-elevate active-elevate-2 text-sm"
                      data-testid={`button-history-${item.id}`}
                    >
                      {item.query}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter:</span>
              </div>
              
              <Button
                variant={showFreeOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                data-testid="button-free-only"
              >
                Free Only
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {toolCategories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover-elevate active-elevate-2"
                  onClick={() => setSelectedCategory(category)}
                  data-testid={`badge-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground" data-testid="text-results-count">
            Showing {filteredTools.length} of {tools.length} tools
          </p>
        </div>

        {/* Tools Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(9)].map((_, i) => (
              <Card key={i} className="h-80 animate-pulse">
                <div className="h-full bg-muted rounded-md" />
              </Card>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="space-y-4">
              <Search className="w-24 h-24 mx-auto text-muted-foreground" />
              <h3 className="text-2xl font-semibold">No tools found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We couldn't find any tools matching your criteria. Try adjusting your filters or search terms.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All Tools");
                  setShowFreeOnly(false);
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
