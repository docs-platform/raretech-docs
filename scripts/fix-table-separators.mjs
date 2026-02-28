// scripts/fix-table-separators.mjs
import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

const DASH_COUNT = 4;

/**
 * テーブル区切り行っぽい行を判定する
 * 例:
 * | --- | --- |
 * | :--- | ---: |
 * |:---:|---|
 */
function isDelimiterRow(line) {
  const trimmed = line.trim();
  if (!trimmed.includes("|")) return false;

  // パイプ区切りの各セルが「コロンとハイフンと空白」だけで構成されているか
  const cells = trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());

  if (cells.length < 2) return false;
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

/**
 * 区切りセルを `----` 固定にする（コロンは保持）
 */
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

  // 元のインデントは維持
  const indentMatch = line.match(/^\s*/);
  const indent = indentMatch ? indentMatch[0] : "";
  return indent + withPipes;
}

async function processFile(filePath) {
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
}

async function main() {
  // 引数があればそれを、なければ articles 配下の md を対象にする
  const patterns = process.argv.slice(2);
  const targets =
    patterns.length > 0 ? await fg(patterns) : await fg(["articles/**/*.md"]);

  const uniqueTargets = Array.from(new Set(targets)).filter((p) =>
    p.endsWith(".md"),
  );

  await Promise.all(uniqueTargets.map(processFile));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});