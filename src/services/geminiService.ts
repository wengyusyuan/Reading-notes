import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const classifyBook = async (title: string, author: string, thoughts: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Title: ${title}\nAuthor: ${author}\nThoughts: ${thoughts}\n\nPlease classify this book into a single category (e.g., Fiction, Philosophy, Science, Biography, etc.). Provide only the category name.`,
      config: {
        responseMimeType: "text/plain",
      },
    });

    return response.text?.trim() || "Uncategorized";
  } catch (error) {
    console.error("Error classifying book:", error);
    return "Uncategorized";
  }
};

export const getBookDetails = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the search query "${query}", please provide the following details for the most likely book match in JSON format: title, author, isbn, and a short category.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            author: { type: Type.STRING },
            isbn: { type: Type.STRING },
            category: { type: Type.STRING },
          },
          required: ["title", "author"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error getting book details:", error);
    return null;
  }
};
