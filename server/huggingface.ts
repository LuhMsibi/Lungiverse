/**
 * Hugging Face Inference API Integration
 * Uses user's own free API key for AI model interactions
 * Get your free API key: https://huggingface.co/settings/tokens
 */

export interface HuggingFaceTextRequest {
  inputs: string;
  parameters?: {
    max_new_tokens?: number;
    temperature?: number;
    top_p?: number;
    do_sample?: boolean;
  };
}

export interface HuggingFaceTextResponse {
  generated_text?: string;
  label?: string;
  score?: number;
}

/**
 * Call Hugging Face Inference API for text generation/processing
 */
export async function callHuggingFace(
  modelId: string,
  inputs: string,
  parameters?: Record<string, any>
): Promise<any> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("HUGGINGFACE_API_KEY not configured");
  }

  const apiUrl = `https://api-inference.huggingface.co/models/${modelId}`;
  
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs,
        parameters,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw new Error(`Failed to call Hugging Face model: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Generate text using a language model
 */
export async function generateText(modelId: string, prompt: string, maxTokens = 100): Promise<string> {
  const result = await callHuggingFace(modelId, prompt, {
    max_new_tokens: maxTokens,
    temperature: 0.7,
    do_sample: true,
  });

  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text;
  }
  
  throw new Error("Unexpected response format from Hugging Face");
}

/**
 * Summarize text
 */
export async function summarizeText(modelId: string, text: string): Promise<string> {
  const result = await callHuggingFace(modelId, text, {
    max_length: 150,
    min_length: 30,
  });

  if (Array.isArray(result) && result[0]?.summary_text) {
    return result[0].summary_text;
  }
  
  throw new Error("Unexpected response format from Hugging Face");
}

/**
 * Analyze sentiment
 */
export async function analyzeSentiment(modelId: string, text: string): Promise<{ label: string; score: number }> {
  const result = await callHuggingFace(modelId, text);

  if (Array.isArray(result) && result[0] && Array.isArray(result[0])) {
    // Find the highest score
    const topResult = result[0].reduce((prev: any, current: any) => 
      (current.score > prev.score) ? current : prev
    );
    return {
      label: topResult.label,
      score: topResult.score,
    };
  }
  
  throw new Error("Unexpected response format from Hugging Face");
}
