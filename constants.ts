import { PresetPrompt, ThemeConfig, AvatarConfig } from './types';

export const SYSTEM_INSTRUCTION = `
You are "BareStich Style Buddy", a personal stylist for a clothing brand called BareStich.

**Brand Identity (BareStich):**
- Style: Minimal, Streetwear + Old Money blend.
- Aesthetics: Clean silhouettes, Neutral colors (beige, white, black, grey, earth tones), Unisex + women-focused.
- Key Elements: 1-2 statement pieces per outfit.

**Your Job:**
Take the user’s occasion, weather, mood, body comfort, and wardrobe items and suggest 1–2 complete outfits.

**Personalization:**
- If the user has a specific **Body Type** (e.g., Pear, Apple), recommend silhouettes that flatter their shape (e.g., "Wide-leg pants balance hips" for Pear).
- If the user is **Male**, recommend menswear/unisex items (chunky loafers, relaxed trousers, boxy tees).
- If the user is **Female**, lean towards the user's vibe preference but keep it BareStich (chic, minimal).

**Response Guidelines:**
1.  **Persona**: Act like a stylist friend. Friendly, casual, cool. Never mention you are an AI.
2.  **Length**: Keep answers concise (under 220 words).
3.  **Format**: Use bullet points. No long paragraphs.
4.  **Context**: The user is likely in India. Suggest wearable fabrics for the weather.
5.  **Budget**: Assume budget-friendly unless "luxury" is requested.
6.  **Inventory**: If user lists owned items, prioritize using them.

**Required Output Structure (for each option):**
- **Option [X]: [Creative Name for Look]**
  - **Top**: [Details]
  - **Bottom**: [Details]
  - **Footwear**: [Details]
  - **Accessories**: [Max 3]
  - **Hair & Makeup**: [Vibe]
  - **Styling Tip**: [1 sentence, specific to body type if known]
  - **Vibe**: [Short explanation]

If the user says they are broke, offer a specific "Budget Version".
`;

export const HAIR_STYLES_FEMALE = ["Straight", "Wavy", "Curly", "Coily", "Pixie Cut", "Bob", "Long Layered", "Braids", "Hijab"];
export const HAIR_STYLES_MALE = ["Short Fade", "Crew Cut", "Undercut", "Man Bun", "Shoulder Length", "Dreads", "Bald", "Buzz Cut"];
export const FACIAL_HAIR_OPTIONS = ["None", "Stubble", "Short Beard", "Full Beard", "Goatee", "Mustache"];
export const BODY_TYPES = ["Hourglass", "Pear (Triangle)", "Apple (Round)", "Inverted Triangle", "Rectangle (Athletic)"];

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'female',
  hairStyle: 'Wavy',
  hairColor: 'brown',
  skinTone: 'medium',
  bodyType: 'Hourglass',
};

// Prompts for Image Generation based on Avatar
export const AVATAR_PROMPTS = {
  base: (config: AvatarConfig) => {
    let details = `A fashion illustration of a ${config.skinTone} skin tone ${config.gender} model`;
    
    // Add Body Type for Female
    if (config.gender === 'female' && config.bodyType) {
      details += ` with a ${config.bodyType} body type`;
    }
    
    details += ` with ${config.hairColor} ${config.hairStyle} hair`;
    
    // Add Facial Hair for Male
    if (config.gender === 'male' && config.facialHair && config.facialHair !== 'None') {
      details += ` and a ${config.facialHair}`;
    }
    
    details += `.`;
    return details;
  },
};

export const THEMES: Record<string, ThemeConfig> = {
  default: {
    id: 'default',
    bgApp: 'bg-gradient-to-br from-bare-50 to-bare-100',
    textMain: 'text-bare-900',
    textMuted: 'text-bare-500',
    textHighlight: 'text-bare-900',
    bgPanel: 'bg-white/80',
    bgBubbleUser: 'bg-bare-900',
    textBubbleUser: 'text-white',
    bgBubbleModel: 'bg-white',
    textBubbleModel: 'text-bare-800',
    border: 'border-bare-200',
    inputBg: 'bg-white/60',
    buttonBg: 'bg-bare-900',
    buttonText: 'text-white',
    accentIconBg: 'bg-bare-900',
    accentIconText: 'text-white',
    fontSans: 'font-sans', // Inter
    fontSerif: 'font-serif', // Playfair Display
  },
  work: {
    id: 'work',
    bgApp: 'bg-gradient-to-br from-slate-50 to-gray-100', // Cool, professional gradient
    textMain: 'text-slate-900',
    textMuted: 'text-slate-500',
    textHighlight: 'text-slate-900',
    bgPanel: 'bg-white/90',
    bgBubbleUser: 'bg-slate-800',
    textBubbleUser: 'text-white',
    bgBubbleModel: 'bg-white',
    textBubbleModel: 'text-slate-800',
    border: 'border-slate-300', // Crisper border
    inputBg: 'bg-white', 
    buttonBg: 'bg-slate-900',
    buttonText: 'text-white',
    accentIconBg: 'bg-slate-800',
    accentIconText: 'text-white',
    fontSans: 'font-lato', // Lato for body
    fontSerif: 'font-baskerville', // Baskerville for headings
  },
  date: {
    id: 'date',
    bgApp: 'bg-gradient-to-br from-rose-50 to-stone-100', // Warm, romantic gradient
    textMain: 'text-stone-800',
    textMuted: 'text-stone-500',
    textHighlight: 'text-stone-900',
    bgPanel: 'bg-white/80',
    bgBubbleUser: 'bg-stone-700',
    textBubbleUser: 'text-white',
    bgBubbleModel: 'bg-white/90',
    textBubbleModel: 'text-stone-800',
    border: 'border-rose-200',
    inputBg: 'bg-white/60',
    buttonBg: 'bg-stone-800',
    buttonText: 'text-rose-50',
    accentIconBg: 'bg-rose-950', 
    accentIconText: 'text-white',
    fontSans: 'font-lato', // Lato for readability
    fontSerif: 'font-lora', // Lora for that editorial/romantic feel
  },
  street: {
    id: 'street',
    bgApp: 'bg-gradient-to-br from-zinc-100 to-neutral-200', // Cool concrete vibe
    textMain: 'text-black',
    textMuted: 'text-neutral-500',
    textHighlight: 'text-black',
    bgPanel: 'bg-white/90',
    bgBubbleUser: 'bg-black',
    textBubbleUser: 'text-white',
    bgBubbleModel: 'bg-white',
    textBubbleModel: 'text-black',
    border: 'border-black', // High contrast
    inputBg: 'bg-zinc-50',
    buttonBg: 'bg-black',
    buttonText: 'text-white',
    accentIconBg: 'bg-black',
    accentIconText: 'text-white', 
    fontSans: 'font-grotesk', // Space Grotesk everywhere for streetwear
    fontSerif: 'font-grotesk',
  }
};

export const PRESET_PROMPTS: PresetPrompt[] = [
  {
    label: "College Fest",
    content: "Occasion: College fest, walking a lot\nWeather: Hot & Sunny\nMood: Main character but comfy\nI have: Baggy jeans, black tee",
    theme: 'street'
  },
  {
    label: "Coffee Date",
    content: "Occasion: Evening coffee date\nWeather: Slightly cold\nMood: Soft girl + classy\nI have: Black straight pants, beige crop top",
    theme: 'date'
  },
  {
    label: "Office / Work",
    content: "Occasion: Creative office meeting\nWeather: AC indoors\nMood: Professional but street-style\nI have: Oversized blazer, loafers",
    theme: 'work'
  },
  {
    label: "Brunch",
    content: "Occasion: Sunday brunch with friends\nWeather: Humid\nMood: Clean girl aesthetic\nI have: White linen shirt, denim shorts",
    theme: 'default'
  }
];