import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { InteractiveModel } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminInteractiveModelsPage() {
  const { user, loading } = useFirebaseAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<InteractiveModel | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    huggingfaceModelId: "",
    category: "Text AI",
    maxTokens: 1024,
  });

  // Fetch all models
  const { data: models = [], isLoading: modelsLoading } = useQuery<InteractiveModel[]>({
    queryKey: ["/api/interactive-models"],
  });

  // Check if user is admin
  const { data: adminCheck, isLoading: adminLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const isAdmin = adminCheck?.isAdmin || false;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/admin/interactive-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to create model");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Model created",
        description: "Interactive model has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interactive-models"] });
      resetForm();
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create model",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof formData }) => {
      const res = await fetch(`/api/admin/interactive-models/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to update model");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Model updated",
        description: "Interactive model has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interactive-models"] });
      resetForm();
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update model",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/interactive-models/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to delete model");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Model deleted",
        description: "Interactive model has been deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/interactive-models"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete model",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      huggingfaceModelId: "",
      category: "Text AI",
      maxTokens: 1024,
    });
    setEditingModel(null);
  };

  const handleEdit = (model: InteractiveModel) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      description: model.description,
      huggingfaceModelId: model.huggingfaceModelId,
      category: model.category,
      maxTokens: model.maxTokens,
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModel) {
      updateMutation.mutate({ id: editingModel.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this model?")) {
      deleteMutation.mutate(id);
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-muted-foreground">Please sign in to access the admin panel</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to access this page</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Interactive Models Admin</h1>
          <p className="text-muted-foreground">
            Manage AI models available in the Playground
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} data-testid="button-add-model">
              <Plus className="w-4 h-4 mr-2" />
              Add Model
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingModel ? "Edit Model" : "Add New Model"}
              </DialogTitle>
              <DialogDescription>
                {editingModel
                  ? "Update the interactive model details"
                  : "Add a new interactive model to the Playground"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Model Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Llama 3.2 3B"
                  required
                  data-testid="input-model-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe what this model does..."
                  rows={3}
                  required
                  data-testid="input-model-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="huggingfaceModelId">
                  Hugging Face Model ID
                </Label>
                <Input
                  id="huggingfaceModelId"
                  value={formData.huggingfaceModelId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      huggingfaceModelId: e.target.value,
                    })
                  }
                  placeholder="e.g., meta-llama/Llama-3.2-3B-Instruct"
                  required
                  data-testid="input-model-id"
                />
                <p className="text-sm text-muted-foreground">
                  The exact model ID from Hugging Face (without :free suffix)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category" data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Text AI">Text AI</SelectItem>
                    <SelectItem value="Image AI">Image AI</SelectItem>
                    <SelectItem value="Audio AI">Audio AI</SelectItem>
                    <SelectItem value="Code AI">Code AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTokens: parseInt(e.target.value),
                    })
                  }
                  placeholder="1024"
                  min={100}
                  max={4096}
                  required
                  data-testid="input-max-tokens"
                />
                <p className="text-sm text-muted-foreground">
                  Maximum number of tokens for model responses (100-4096)
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsFormOpen(false);
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit-model"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingModel ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {modelsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : models.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              No interactive models found. Add your first model to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {models.map((model) => (
            <Card key={model.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{model.name}</CardTitle>
                    <CardDescription className="mb-2">
                      {model.description}
                    </CardDescription>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded-md">
                        {model.category}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded-md">
                        {model.huggingfaceModelId}
                      </span>
                      <span className="px-2 py-1 bg-muted rounded-md">
                        Max tokens: {model.maxTokens}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(model)}
                      data-testid={`button-edit-${model.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(model.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-${model.id}`}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
