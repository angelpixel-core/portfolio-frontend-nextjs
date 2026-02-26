import * as fs from "fs";
import * as path from "path";

const TARGET_MIN_WIDTH_RAW =
  /@media\s*\(min-width:\s*(560|720|768|880|1024)px\)/g;
const TOKEN_MEDIA =
  /@media\s+screen\((compact|medium|content|navContent|desktop)\)/g;

const SRC_ROOT = path.resolve(__dirname, "../../");
const WORDCLOUD_PATH = path.resolve(
  __dirname,
  "../../ui/organisms/WordCloud/styles.css"
);

function listCssFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listCssFiles(fullPath));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith(".css")) {
      out.push(fullPath);
    }
  }
  return out;
}

describe("Story 25.4 - Breakpoint tokenization guardrails", () => {
  it("does not keep raw target min-width values outside WordCloud", () => {
    const cssFiles = listCssFiles(SRC_ROOT).filter(
      (filePath) => filePath !== WORDCLOUD_PATH
    );

    const offenders: string[] = [];

    for (const filePath of cssFiles) {
      const css = fs.readFileSync(filePath, "utf-8");
      TARGET_MIN_WIDTH_RAW.lastIndex = 0;
      if (TARGET_MIN_WIDTH_RAW.test(css)) {
        offenders.push(path.relative(SRC_ROOT, filePath));
      }
    }

    expect(offenders).toEqual([]);
  });

  it("keeps WordCloud as explicit exclusion (raw values allowed)", () => {
    const css = fs.readFileSync(WORDCLOUD_PATH, "utf-8");
    expect(css).toMatch(TARGET_MIN_WIDTH_RAW);
  });

  it("uses semantic screen(token) queries in migrated css", () => {
    const cssFiles = listCssFiles(SRC_ROOT).filter(
      (filePath) => filePath !== WORDCLOUD_PATH
    );

    let tokenHits = 0;
    for (const filePath of cssFiles) {
      const css = fs.readFileSync(filePath, "utf-8");
      TOKEN_MEDIA.lastIndex = 0;
      const matches = css.match(TOKEN_MEDIA);
      if (matches) {
        tokenHits += matches.length;
      }
    }

    expect(tokenHits).toBeGreaterThan(0);
  });
});
