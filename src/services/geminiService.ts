import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getGeminiResponse = async (
  prompt: string, 
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    // Construct the conversation history for context
    // We only send the text as per the simple chat structure
    const chat = ai.chats.create({
      model: model,
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      config: {
        systemInstruction: "You are NEORA, a sophisticated AI financial analyst. You provide concise, intelligent, and professional insights into stock market data, trends, and financial news. Your tone is elegant and knowledgeable. Keep responses brief but high-value.",
      }
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text || "I apologize, but I couldn't generate a response at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently unable to access the market intelligence network. Please try again later.";
  }
};