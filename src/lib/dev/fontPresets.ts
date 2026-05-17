export interface FontPreset {
  id: string;
  label: string;
  /** `next/font/google` export name */
  nextImport: string;
  /** `const foo = FontName(...)` identifier */
  constName: string;
  weights: string[];
  subsets: string[];
  /** Quoted CSS font-family first segment */
  cssFamily: string;
  /** Tail after the primary family for `font-family` */
  stackTail: string;
}

export const FONT_PRESETS: FontPreset[] = [
  {
    id: "inter",
    label: "Inter",
    nextImport: "Inter",
    constName: "inter",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Inter",
    stackTail: '"SF Pro Display", system-ui, -apple-system, sans-serif',
  },
  {
    id: "dm-sans",
    label: "DM Sans",
    nextImport: "DM_Sans",
    constName: "dmSans",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "DM Sans",
    stackTail: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "source-sans-3",
    label: "Source Sans 3",
    nextImport: "Source_Sans_3",
    constName: "sourceSans3",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Source Sans 3",
    stackTail: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "manrope",
    label: "Manrope",
    nextImport: "Manrope",
    constName: "manrope",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Manrope",
    stackTail: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "questrial",
    label: "Questrial",
    nextImport: "Questrial",
    constName: "questrial",
    weights: ["400"],
    subsets: ["latin"],
    cssFamily: "Questrial",
    stackTail: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "figtree",
    label: "Figtree",
    nextImport: "Figtree",
    constName: "figtree",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Figtree",
    stackTail: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "space-grotesk",
    label: "Space Grotesk",
    nextImport: "Space_Grotesk",
    constName: "spaceGrotesk",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Space Grotesk",
    stackTail: "system-ui, -apple-system, sans-serif",
  },
  {
    id: "fraunces",
    label: "Fraunces",
    nextImport: "Fraunces",
    constName: "fraunces",
    weights: ["300", "400", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Fraunces",
    stackTail: "ui-serif, Georgia, serif",
  },
  {
    id: "lora",
    label: "Lora",
    nextImport: "Lora",
    constName: "lora",
    weights: ["400", "500", "600", "700"],
    subsets: ["latin"],
    cssFamily: "Lora",
    stackTail: "ui-serif, Georgia, serif",
  },
];

export function getFontPresetById(id: string): FontPreset | undefined {
  return FONT_PRESETS.find((p) => p.id === id);
}

export function getFontPresetByNextImport(nextImport: string): FontPreset | undefined {
  return FONT_PRESETS.find((p) => p.nextImport === nextImport);
}

export function googleFontStylesheetUrl(preset: FontPreset): string {
  const familyParam = preset.cssFamily.replace(/ /g, "+");
  const w = preset.weights.join(";");
  return `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${w}&display=swap`;
}

export function livePreviewFontStack(preset: FontPreset): string {
  return `'${preset.cssFamily}', ${preset.stackTail}`;
}
