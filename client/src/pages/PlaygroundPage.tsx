import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Sparkles, Loader2, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { InteractiveModel } from "@shared/schema";

export default function PlaygroundPage() {
  const [selectedModel, setSelectedModel] = useState<InteractiveModel | null>(null);
  const [userInput, setUserInput] = useState("");
  const [conversation, setConversation] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

  // Fetch all interactive models
  const { data: models = [], isLoading } = useQuery<InteractiveModel[]>({
    queryKey: ["/api/interactive-models"],
  });

  // Inference mutation
  const { mutate: generateResponse, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch(`/api/interactive-models/infer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: selectedModel?.id,
          message,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to generate response: ${res.statusText}`);
      }
      return res.json();
    },
    onSuccess: (data) => {
      setConversation((prev) => [
        ...prev,
        { role: "user", content: userInput },
        { role: "assistant", content: data.response },
      ]);
      setUserInput("");
    },
  });

  const handleSendMessage = () => {
    if (!userInput.trim() || isPending) return;
    generateResponse(userInput);
  };

  const handleTryModel = (model: InteractiveModel) => {
    setSelectedModel(model);
    setConversation([]);
    setUserInput("");
  };

  const handleCloseModal = () => {
    setSelectedModel(null);
    setConversation([]);
    setUserInput("");
  };

  // Group models by category
  const categories = Array.from(new Set(models.map(m => m.category)));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Playground
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interact with powerful AI models directly in your browser. Try text generation, code completion, and more - completely free!
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]" data-testid="loading-models">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Models Grid */}
      {!isLoading && (
        <Tabs defaultValue={categories[0]} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8" style={{ gridTemplateColumns: `repeat(${Math.min(categories.length, 4)}, 1fr)` }}>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} data-testid={`tab-${category.toLowerCase().replace(/ /g, "-")}`}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models
                  .filter((model) => model.category === category)
                  .map((model) => (
                    <Card key={model.id} className="flex flex-col" data-testid={`model-card-${model.id}`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2" data-testid={`model-name-${model.id}`}>
                          {model.name}
                        </CardTitle>
                        <CardDescription data-testid={`model-description-${model.id}`}>
                          {model.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <div className="text-sm text-muted-foreground">
                          <p>{model.usageCount.toLocaleString()} uses</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          onClick={() => handleTryModel(model)}
                          className="flex-1"
                          data-testid={`button-try-model-${model.id}`}
                        >
                          Try Now
                        </Button>
                        {model.externalUrl && (
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                            data-testid={`button-visit-model-${model.id}`}
                          >
                            <a href={model.externalUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Model Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col" data-testid="dialog-model">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2" data-testid="dialog-model-name">
              <Sparkles className="h-5 w-5 text-primary" />
              {selectedModel?.name}
            </DialogTitle>
            <DialogDescription data-testid="dialog-model-description">
              {selectedModel?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col gap-4 min-h-0">
            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto border rounded-lg p-4 bg-muted/30 min-h-[300px]" data-testid="conversation-area">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <Sparkles className="h-12 w-12 mb-4 opacity-50" />
                  <p className="font-medium">What would you like me to do?</p>
                  <p className="text-sm mt-2">Examples:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Summarize this article: [paste text]</li>
                    <li>• Write a product description for...</li>
                    <li>• Translate "Hello" to Spanish</li>
                    <li>• Is this review positive or negative: [text]</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${msg.role}-${idx}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isPending && (
                    <div className="flex justify-start" data-testid="loading-response">
                      <div className="bg-card border rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your message... (Shift+Enter for new line)"
                className="min-h-[80px] resize-none"
                disabled={isPending}
                data-testid="input-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isPending}
                size="icon"
                className="h-[80px] w-[80px]"
                data-testid="button-send"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* Bottom Link */}
            {selectedModel?.externalUrl && (
              <div className="text-center">
                <a
                  href={selectedModel.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  data-testid="link-visit-model"
                >
                  Visit Model on Hugging Face <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
