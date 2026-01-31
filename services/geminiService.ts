
import { GoogleGenAI } from "@google/genai";

// Always use named parameter for apiKey and obtain it from process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStyleAdvice = async (faceShape: string, hairType: string, occasion: string) => {
  try {
    const prompt = `En tant qu'expert visagiste MyHairCut, suggère 3 coupes de cheveux idéales pour une personne ayant un visage ${faceShape}, des cheveux ${hairType}, pour une occasion de type ${occasion}. Réponds en français de manière concise et amicale.`;
    
    // Call generateContent with both model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Access the text property directly from the response.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Désolé, notre conseiller IA est indisponible pour le moment. Essayez de consulter les galeries de nos coiffeurs !";
  }
};
