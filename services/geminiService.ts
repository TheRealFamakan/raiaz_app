
import { GoogleGenAI } from "@google/genai";

// Fonction d'initialisation sécurisée
const getAIClient = () => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    return null;
  }
};

export const getStyleAdvice = async (faceShape: string, hairType: string, occasion: string) => {
  const ai = getAIClient();
  
  if (!ai) {
    return "Désolé, le conseiller IA nécessite une configuration clé API pour fonctionner. Contactez l'administrateur.";
  }

  try {
    const prompt = `En tant qu'expert visagiste MyHairCut, suggère 3 coupes de cheveux idéales pour une personne ayant un visage ${faceShape}, des cheveux ${hairType}, pour une occasion de type ${occasion}. Réponds en français de manière concise et amicale.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Aucun conseil généré pour le moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Désolé, notre conseiller IA est indisponible pour le moment. Réessayez plus tard.";
  }
};
