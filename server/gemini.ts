import { GoogleGenAI } from "@google/genai";

// Direct Google Gemini API integration - uses your own Google API key
// Get your free API key from: https://aistudio.google.com/app/apikey
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function generateChatResponse(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<string> {
  try {
    // Convert messages to Gemini format
    const geminiMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Add system prompt as the first user message
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model",
        parts: [{ text: "I understand. I'll help users discover the best AI tools for their needs." }]
      },
      ...geminiMessages
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return response.text || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate response from Gemini API");
  }
}

async function* createTextStream(stream: AsyncIterable<any>): AsyncIterable<string> {
  for await (const chunk of stream) {
    if (chunk.text) {
      yield chunk.text;
    }
  }
}

export async function streamChatResponse(
  messages: ChatMessage[],
  systemPrompt: string
): Promise<AsyncIterable<string>> {
  try {
    // Convert messages to Gemini format
    const geminiMessages = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Add system prompt as the first user message
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      {
        role: "model",
        parts: [{ text: "I understand. I'll help users discover the best AI tools for their needs." }]
      },
      ...geminiMessages
    ];

    const stream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents,
    });

    return createTextStream(stream);
  } catch (error) {
    console.error("Gemini streaming API error:", error);
    throw new Error("Failed to stream response from Gemini API");
  }
}
