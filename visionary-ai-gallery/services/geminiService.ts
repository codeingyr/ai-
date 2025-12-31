import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIImage = async (config: GenerationConfig): Promise<string> => {
  try {
    // Construct a rich prompt based on category to enhance results
    // We append English style keywords to ensure the model understands the aesthetic even if the input is Chinese
    let enhancedPrompt = config.prompt;
    
    // Simple prompt engineering based on category
    switch (config.category) {
      case 'Landscape': // Category keys are still in English internally
        enhancedPrompt += ", highly detailed landscape, cinematic lighting, 8k resolution, photorealistic, wide angle";
        break;
      case 'Anime':
        enhancedPrompt += ", anime style, vibrant colors, studio ghibli inspired, high quality, 2D render";
        break;
      case 'Product':
        enhancedPrompt += ", product photography, studio lighting, clean background, commercial quality, 4k";
        break;
      case 'Poster':
        enhancedPrompt += ", poster design, bold typography, graphic design, vector art style, flat design";
        break;
      case 'Character':
        enhancedPrompt += ", character design, detailed face, expressive, concept art, portrait lighting";
        break;
      case 'Abstract':
        enhancedPrompt += ", abstract art, geometric shapes, fluid forms, vibrant colors, digital art, wallpaper";
        break;
    }

    // Add a general quality booster
    enhancedPrompt += ", masterpiece, best quality, sharp focus";

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        }
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
