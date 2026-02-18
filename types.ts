
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  model: string;
  aspectRatio: AspectRatio;
}

export interface GenerationOptions {
  aspectRatio: AspectRatio;
  highQuality: boolean;
  imageSize?: ImageSize;
}

// Fixed: Define AIStudio as a named interface to resolve the "Property must be of type AIStudio" error.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    // Fixed: Added readonly modifier and used the AIStudio interface to match existing global declarations.
    readonly aistudio: AIStudio;
  }
}