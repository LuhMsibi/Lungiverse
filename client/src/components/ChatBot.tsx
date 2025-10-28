import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send, Sparkles, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage, ChatRequest, ChatResponse } from "@shared/schema";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (data: ChatRequest) => {
      const response = await apiRequest("/api/chat", "POST", data);
      const jsonData = await response.json();
      return jsonData as ChatResponse;
    },
    onSuccess: (data: ChatResponse) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: data.message,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    chatMutation.mutate({
      message: input,
      conversationHistory: messages,
    });
    setInput("");
  };

  const suggestedPrompts = [
    "Find me a PDF to Word converter",
    "What are the best AI writing tools?",
    "Show me free image generators",
  ];

  const chatbotContent = (
    <>
      {!isOpen && (
        <Button
          size="icon"
          className="h-16 w-16 rounded-full shadow-2xl hover:shadow-primary/50 animate-pulse-glow bg-gradient-to-br from-primary to-chart-2"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 9999
          }}
          onClick={() => setIsOpen(true)}
          data-testid="button-chatbot-open"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      )}

      {isOpen && (
        <Card 
          className="w-full sm:w-96 h-[600px] max-h-[calc(100vh-100px)] shadow-2xl flex flex-col mx-4 sm:mx-0"
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '0',
            left: '0',
            maxWidth: 'calc(100vw - 2rem)',
            zIndex: 9999
          }}
          data-testid="card-chatbot"
        >
          <CardHeader className="border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                data-testid="button-chatbot-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Hi! I'm here to help you find the perfect AI tool. Ask me anything!
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Try asking:</p>
                    {suggestedPrompts.map((prompt, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="cursor-pointer hover-elevate active-elevate-2 text-xs block w-full py-2"
                        onClick={() => setInput(prompt)}
                        data-testid={`badge-suggested-${idx}`}
                      >
                        {prompt}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${message.role}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <CardFooter className="border-t flex-shrink-0 p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 w-full"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe what you need..."
                disabled={chatMutation.isPending}
                data-testid="input-chat"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || chatMutation.isPending}
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );

  if (!isMounted || typeof document === 'undefined') {
    return null;
  }

  return createPortal(chatbotContent, document.body);
}
