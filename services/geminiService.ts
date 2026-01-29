import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";
import { RESPONSE_SCHEMA, SYSTEM_INSTRUCTION } from "../constants";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeReflection = async (text: string): Promise<AnalysisResult> => {
  const ai = getGeminiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from CareLens.");
    }

    const parsedResult = JSON.parse(resultText) as AnalysisResult;
    return parsedResult;
  } catch (error) {
    console.error("Error analyzing reflection:", error);
    throw error;
  }
};