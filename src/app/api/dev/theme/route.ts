import { readFileSync, writeFileSync } from "fs";
import path from "path";

const GLOBALS_PATH = path.resolve(process.cwd(), "src/app/globals.css");
const DESIGN_PATH = path.resolve(process.cwd(), "docs/DESIGN.md");

// Maps --color-primary  →  primary  (strips "--color-" prefix)
function cssVarToDesignKey(cssVar: string): string {
  return cssVar.replace(/^--color-/, "");
}

function updateGlobalsCss(
  source: string,
  colors: Record<string, string>
): string {
  let result = source;
  for (const [cssVar, hex] of Object.entries(colors)) {
    // Matches:  --color-primary: #0066cc;
    const re = new RegExp(
      `(${cssVar.replace(/-/g, "\\-")}:\\s*)#[0-9a-fA-F]{3,8}`,
      "g"
    );
    result = result.replace(re, `$1${hex}`);
  }
  return result;
}

function updateDesignMd(
  source: string,
  colors: Record<string, string>,
  previousHexByVar: Record<string, string>
): string {
  let result = source;

  for (const [cssVar, newHex] of Object.entries(colors)) {
    const designKey = cssVarToDesignKey(cssVar);
    const oldHex = previousHexByVar[cssVar];

    // 1. Update YAML frontmatter:  primary: "#0066cc"
    const frontmatterRe = new RegExp(
      `(${designKey.replace(/-/g, "\\-")}:\\s*)"#[0-9a-fA-F]{3,8}"`,
      "g"
    );
    result = result.replace(frontmatterRe, `$1"${newHex}"`);

    // 2. Update inline hex callouts in prose — only swap the exact old value
    if (oldHex && oldHex.toLowerCase() !== newHex.toLowerCase()) {
      const oldHexRe = new RegExp(oldHex.replace("#", "#"), "gi");
      result = result.replace(oldHexRe, newHex);
    }
  }

  return result;
}

// Parse current hex values out of globals.css so we can diff for DESIGN.md prose
function parseCurrentColors(source: string): Record<string, string> {
  const map: Record<string, string> = {};
  const re = /(--color-[\w-]+):\s*(#[0-9a-fA-F]{3,8})/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    map[m[1]] = m[2];
  }
  return map;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json({ error: "Not available in production" }, { status: 403 });
  }

  let body: { colors: Record<string, string> };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { colors } = body;
  if (!colors || typeof colors !== "object") {
    return Response.json({ error: "Missing colors map" }, { status: 400 });
  }

  try {
    const currentCss = readFileSync(GLOBALS_PATH, "utf-8");
    const previousHexByVar = parseCurrentColors(currentCss);

    const updatedCss = updateGlobalsCss(currentCss, colors);
    writeFileSync(GLOBALS_PATH, updatedCss, "utf-8");

    const currentDesign = readFileSync(DESIGN_PATH, "utf-8");
    const updatedDesign = updateDesignMd(currentDesign, colors, previousHexByVar);
    writeFileSync(DESIGN_PATH, updatedDesign, "utf-8");

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
