// scripts/fix-table-separators.mjs
import fs from "node:fs/promises";
import fg from "fast-glob";
import path from "node:path";

const DASH_COUNT = 4;

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

function normalizeCell(cell) {
  const trimmed = cell.trim();
  const leftColon = trimmed.startsWith(":");
  const rightColon = trimmed.endsWith(":");

  const dashes = "-".repeat(DASH_COUNT);
  if (leftColon && rightColon) return `:${dashes}:`;
  if (leftColon) return `:${dashes}`;
  if (rightColon) return `${dashes}:`;
  return dashes;
}

function normalizeDelimiterRow(line) {
  const hasLeadingPipe = line.trimStart().startsWith("|");
  const hasTrailingPipe = line.trimEnd().endsWith("|");

  const raw = line.trim();
  const body = raw.replace(/^\|/, "").replace(/\|$/, "");
  const cells = body.split("|").map((c) => c.trim());

  const normalizedCells = cells.map(normalizeCell);

  const joined = normalizedCells.join("|");
  const withPipes =
    (hasLeadingPipe ? "|" : "") + joined + (hasTrailingPipe ? "|" : "");

  const indentMatch = line.match(/^\s*/);
  const indent = indentMatch ? indentMatch[0] : "";
  return indent + withPipes;
}

async function processFile(filePath) {
  try {
    const original = await fs.readFile(filePath, "utf-8");
    const lines = original.split("\n");

    let changed = false;
    const next = lines.map((line) => {
      if (!isDelimiterRow(line)) return line;
      changed = true;
      return normalizeDelimiterRow(line);
    });

    if (changed) {
      await fs.writeFile(filePath, next.join("\n"), "utf-8");
    }
  } catch {
    // ignore non-md or missing files
  }
}

async function main() {
  const args = process.argv.slice(2);

  let targets = [];

  if (args.length > 0) {
    // globでも単一ファイルでも対応
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
