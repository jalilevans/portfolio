import { readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  FONT_PRESETS,
  getFontPresetById,
  getFontPresetByNextImport,
  type FontPreset,
} from "@/lib/dev/fontPresets";

const LAYOUT_PATH = path.resolve(process.cwd(), "src/app/layout.tsx");

function buildFontBlock(preset: FontPreset): string {
  return `const ${preset.constName} = ${preset.nextImport}({
  subsets: ${JSON.stringify(preset.subsets)},
  weight: ${JSON.stringify(preset.weights)},
  variable: "--font-inter",
  display: "swap",
});`;
}

function patchLayout(content: string, preset: FontPreset): string {
  let out = content.replace(
    /^import \{ \w+(?:_\w+)* \} from "next\/font\/google";$/m,
    `import { ${preset.nextImport} } from "next/font/google";`
  );
  out = out.replace(
    /const \w+ = \w+\(\{\r?\n  subsets: \[[^\]]*\],\r?\n  weight: \[[^\]]*\],\r?\n  variable: "--font-inter",\r?\n  display: "swap",\r?\n\}\);/,
    buildFontBlock(preset)
  );
  out = out.replace(
    /className=\{\`\$\{\w+\.variable\} h-full antialiased\`\}\>/,
    `className={\`\$\{${preset.constName}.variable\} h-full antialiased\`}>`
  );
  return out;
}

function parsePresetFromLayout(content: string): string | null {
  const m = content.match(/^import \{ (\w+(?:_\w+)*) \} from "next\/font\/google";$/m);
  if (!m) return null;
  const preset = getFontPresetByNextImport(m[1]);
  return preset?.id ?? null;
}

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available in production" }, { status: 403 });
  }
  try {
    const layout = readFileSync(LAYOUT_PATH, "utf-8");
    const presetId = parsePresetFromLayout(layout);
    return Response.json({
      presetId: presetId ?? FONT_PRESETS[0]?.id ?? null,
      presets: FONT_PRESETS.map((p) => ({ id: p.id, label: p.label })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available in production" }, { status: 403 });
  }

  let body: { presetId: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const preset = getFontPresetById(body.presetId);
  if (!preset) {
    return Response.json({ error: "Unknown presetId" }, { status: 400 });
  }

  try {
    const layout = readFileSync(LAYOUT_PATH, "utf-8");
    const patched = patchLayout(layout, preset);
    writeFileSync(LAYOUT_PATH, patched, "utf-8");
    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
