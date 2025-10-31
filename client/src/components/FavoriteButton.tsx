import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface FavoriteButtonProps {
  toolId: string;
  variant?: "default" | "ghost";
  showText?: boolean;
}

export function FavoriteButton({ toolId, variant = "ghost", showText = false }: FavoriteButtonProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const numericToolId = parseInt(toolId);
  
  const { data: favoriteStatus } = useQuery<{ isFavorited: boolean }>({
    queryKey: ["/api/favorites/check", toolId],
    enabled: !isNaN(numericToolId) && !!user,
  });

  const isFavorited = favoriteStatus?.isFavorited ?? false;

  const addFavorite = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/favorites", "POST", { toolId: numericToolId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/check", toolId] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Added to favorites",
        description: "Tool saved to your favorites",
      });
    },
    onError: (error: any) => {
      if (error.message?.includes("Unauthorized")) {
        toast({
          title: "Login required",
          description: "Please log in to save favorites",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add favorite",
          variant: "destructive",
        });
      }
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/favorites/${numericToolId}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/check", toolId] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      toast({
        title: "Removed from favorites",
        description: "Tool removed from your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove favorite",
        variant: "destructive",
      });
    },
  });

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    if (isFavorited) {
      removeFavorite.mutate();
    } else {
      addFavorite.mutate();
    }
  };

  const isLoading = addFavorite.isPending || removeFavorite.isPending;

  return (
    <Button
      variant={variant}
      size={showText ? "sm" : "icon"}
      onClick={handleClick}
      disabled={isLoading}
      data-testid={`button-favorite-${toolId}`}
      className={isFavorited ? "text-primary" : ""}
    >
      <Heart
        className={`w-4 h-4 ${isFavorited ? "fill-current" : ""} ${showText ? "mr-2" : ""}`}
      />
      {showText && (isFavorited ? "Saved" : "Save")}
    </Button>
  );
}
