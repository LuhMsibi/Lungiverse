/**
 * Hugging Face Inference API Integration (2025 - Chat Completion)
 * Uses user's own free API key for AI model interactions
 * Get your free API key: https://huggingface.co/settings/tokens
 * 
 * New API uses OpenAI-compatible chat completion format
 * Documentation: https://huggingface.co/docs/inference-providers
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface HuggingFaceChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface HuggingFaceChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generate chat completion using Hugging Face Inference API
 * Uses OpenAI-compatible format
 */
export async function generateChatCompletion(
  modelId: string,
  userMessage: string,
  systemPrompt?: string,
  maxTokens = 500
): Promise<string> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY not configured");
  }

  // New Hugging Face API endpoint (2025)
  const apiUrl = "https://router.huggingface.co/v1/chat/completions";
  
  // Build messages array
  const messages: ChatMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: userMessage });

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error (${response.status}): ${errorText}`);
    }

    const result: HuggingFaceChatResponse = await response.json();
    
    if (result.choices && result.choices.length > 0) {
      return result.choices[0].message.content;
    }
    
    throw new Error("No response from Hugging Face API");
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw new Error(`Failed to call Hugging Face model: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
