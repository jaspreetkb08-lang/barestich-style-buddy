export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  imageUrl?: string; // Base64 string for generated images
}

export type ThemeType = 'default' | 'work' | 'date' | 'street';

export interface ThemeConfig {
  id: ThemeType;
  // Colors
  bgApp: string;
  textMain: string;
  textMuted: string;
  textHighlight: string;
  bgPanel: string; // Header, Input Area
  bgBubbleUser: string;
  textBubbleUser: string;
  bgBubbleModel: string;
  textBubbleModel: string;
  border: string;
  inputBg: string;
  buttonBg: string;
  buttonText: string;
  accentIconBg: string;
  accentIconText: string;
  
  // Fonts
  fontSans: string;
  fontSerif: string;
}

export interface PresetPrompt {
  label: string;
  content: string;
  theme: ThemeType;
}

export interface StylingRequest {
  occasion?: string;
  weather?: string;
  mood?: string;
  wardrobe?: string;
  budget?: string;
}

export interface AvatarConfig {
  gender: 'female' | 'male' | 'unisex';
  hairStyle: string;
  hairColor: string;
  skinTone: string;
  facialHair?: string;
  bodyType?: string;
}