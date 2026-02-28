import fs from "node:fs/promises";
import fg from "fast-glob";
import path from "node:path";

const DASH_COUNT = 4;

/**
 * テーブル区切り行判定
 */
function isDelimiterRow(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;

  const cells = trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

  if (cells.length < 2) return false;
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

/**
 * 通常のテーブル行か？
 */
function isTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return false;
  if (!trimmed.endsWith("|")) return false;
  return trimmed.includes("|");
}

/**
 * 区切りセルを ---- 固定
 */
function normalizeDelimiterCell(cell) {
  const trimmed = cell.trim();
  const leftColon = trimmed.startsWith(":");
  const rightColon = trimmed.endsWith(":");

  const dashes = "-".repeat(DASH_COUNT);

  if (leftColon && rightColon) return `:${dashes}:`;
  if (leftColon) return `:${dashes}`;
  if (rightColon) return `${dashes}:`;
  return dashes;
}

/**
 * 区切り行正規化
 */
function normalizeDelimiterRow(line) {
  const indent = line.match(/^\s*/)?.[0] ?? "";

  const body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = body.split("|").map(normalizeDelimiterCell);

  return indent + "|" + cells.join("|") + "|";
}

/**
 * 通常テーブル行正規化（前後スペース除去）
 */
function normalizeTableRow(line) {
  const indent = line.match(/^\s*/)?.[0] ?? "";

  const body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  const cells = body.split("|").map((c) => c.trim());

  return indent + "|" + cells.join("|") + "|";
}

async function processFile(filePath) {
  try {
    const original = await fs.readFile(filePath, "utf-8");
    const lines = original.split("\n");

    let changed = false;

    const next = lines.map((line) => {
      if (isDelimiterRow(line)) {
        changed = true;
        return normalizeDelimiterRow(line);
      }

      if (isTableRow(line)) {
        changed = true;
        return normalizeTableRow(line);
      }

      return line;
    });

    if (changed) {
      await fs.writeFile(filePath, next.join("\n"), "utf-8");
    }
  } catch {
    // ignore
  }
}

async function main() {
  const args = process.argv.slice(2);

  let targets = [];

  if (args.length > 0) {
    targets = await fg(args, { absolute: true });
  } else {
    targets = await fg(["articles/**/*.md"], { absolute: true });
  }

  const mdTargets = targets.filter((p) => p.endsWith(".md"));
  await Promise.all(mdTargets.map(processFile));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
