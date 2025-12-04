import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION, AVATAR_PROMPTS } from "../constants";
import { AvatarConfig } from "../types";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY environment variable is missing.");
    }
    genAI = new GoogleGenAI({ apiKey });
  }
  return genAI;
};

export const initializeChat = async () => {
  try {
    const ai = getAIClient();
    chatSession = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, 
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string, avatarConfig?: AvatarConfig): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    throw new Error("Chat session could not be initialized.");
  }

  try {
    // Inject user context into the message (hidden from UI, visible to model)
    let userContext = "";
    if (avatarConfig) {
        userContext = `[User Profile: Gender: ${avatarConfig.gender}`;
        if (avatarConfig.gender === 'female' && avatarConfig.bodyType) {
            userContext += `, Body Type: ${avatarConfig.bodyType}`;
        }
        if (avatarConfig.gender === 'male' && avatarConfig.facialHair) {
            userContext += `, Facial Hair: ${avatarConfig.facialHair}`;
        }
        userContext += `, Hair: ${avatarConfig.hairColor} ${avatarConfig.hairStyle}] `;
    }

    const result = await chatSession.sendMessage({
      message: userContext + message,
    });
    return result.text || "Sorry, I couldn't generate a style tip right now. Try again?";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

export const generateFashionImage = async (outfitDescription: string, avatar: AvatarConfig): Promise<string | null> => {
  try {
    const ai = getAIClient();
    
    const avatarDetails = AVATAR_PROMPTS.base(avatar);

    // Construct a specific prompt for the image model
    const imagePrompt = `
      Create a high-quality fashion illustration or styled outfit board.
      Subject: ${avatarDetails}
      Outfit: ${outfitDescription}
      Style: Minimal, clean aesthetics, studio lighting, neutral background, BareStich brand vibe (Streetwear + Old Money).
      View: Full body or 3/4 view, posing naturally.
      Format: Fashion sketch / Digital Illustration style (Bitmoji-like but premium).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: imagePrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Extract base64 image data from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};