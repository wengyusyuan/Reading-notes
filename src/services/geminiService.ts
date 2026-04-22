import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_STORAGE_KEY = "reading_notes_gemini_api_key";

const getStoredApiKey = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(GEMINI_STORAGE_KEY)?.trim() || "";
};

export const hasGeminiApiKey = () => Boolean(getStoredApiKey());

export const ensureGeminiApiKey = () => {
  const existingKey = getStoredApiKey();
  if (existingKey) return existingKey;

  if (typeof window === "undefined") return "";

  const input = window.prompt("請輸入你自己的 Gemini API Key（只會儲存在此瀏覽器）");
  const apiKey = input?.trim() || "";
  if (!apiKey) return "";

  window.localStorage.setItem(GEMINI_STORAGE_KEY, apiKey);
  return apiKey;
};

const getAiClient = (apiKey?: string) => {
  const finalApiKey = apiKey || getStoredApiKey();
  if (!finalApiKey) return null;
  return new GoogleGenAI({ apiKey: finalApiKey });
};

export const classifyBook = async (title: string, author: string, thoughts: string) => {
  const ai = getAiClient();
  if (!ai) return "Uncategorized";

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
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
  const apiKey = ensureGeminiApiKey();
  const ai = getAiClient(apiKey);
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
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
