
import { GoogleGenAI, Type } from "@google/genai";
import { Sentiment, BookingIntent, Reservation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const geminiService = {
  async analyzeReview(comment: string): Promise<{ sentiment: Sentiment; draft: string }> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this customer review and draft a professional business response. The tone should be courteous, balanced, and solutions-oriented. Review: "${comment}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "The sentiment of the review (positive, neutral, negative)",
            },
            draft: {
              type: Type.STRING,
              description: "A draft response to the review.",
            },
          },
          required: ["sentiment", "draft"],
        },
      },
    });

    const result = JSON.parse(response.text);
    return {
      sentiment: result.sentiment.toLowerCase() as Sentiment,
      draft: result.draft,
    };
  },

  async processBookingChat(message: string, history: { role: string; text: string }[]): Promise<{ reply: string; intent: BookingIntent }> {
    const contents = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents as any,
      config: {
        systemInstruction: "You are a professional AI Assistant for 'The Gilded Plate'. Your role is to manage reservations efficiently by gathering: Guest Name, Party Size, Date, and Time. Be professional, helpful, and direct.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "The polite conversational response to the guest.",
            },
            intent: {
              type: Type.OBJECT,
              properties: {
                guestName: { type: Type.STRING },
                partySize: { type: Type.NUMBER },
                date: { type: Type.STRING },
                time: { type: Type.STRING },
                specialRequests: { type: Type.STRING },
                isComplete: { type: Type.BOOLEAN },
              },
              required: ["isComplete"],
            },
          },
          required: ["reply", "intent"],
        },
      },
    });

    return JSON.parse(response.text);
  },

  async processOwnerQuery(query: string, reservations: Reservation[]): Promise<string> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the Operational AI for 'The Gilded Plate'. You are speaking directly to the Restaurant Owner. 
      Analyze the following current reservation data and answer the owner's request concisely and professionally.
      
      Current Reservations: ${JSON.stringify(reservations)}
      
      Owner Request: "${query}"`,
      config: {
        temperature: 0.7,
      },
    });
    return response.text || "I'm sorry, I couldn't process that operational request.";
  }
};
