- [raretech-docs](#raretech-docs)
  - [1. セットアップ手順](#1-セットアップ手順)
  - [2. 拡張Markdown対応](#2-拡張markdown対応)
  - [3. RareTECH専用Markdownプレビューの再現](#3-raretech専用markdownプレビューの再現)
  - [4. 執筆の流れ](#4-執筆の流れ)

# raretech-docs

RareTECH教材専用の執筆標準環境

本リポジトリは、

- RareTECH拡張Markdown対応
- チーム再現性担保
- フォーマット崩れ防止

を実現するための RareTECH教材専用執筆基盤 である。

## 1. セットアップ手順

```
git clone
cd raretech-docs
npm install
# markdownlint が有効化される
code .
```

## 2. 拡張Markdown対応

RareTECH教材では以下の拡張記法を使用する。

```
:::info
:::alert
:::toggle
:::cardlink
```

これらを正しくプレビューするには
Markdown Preview Enhanced（MPE） が必要。

.vscode/extensions.json を用意した。
clone後にVSCodeを開くと「推奨拡張機能があります」と表示されるため、そのまま導入する。

## 3. RareTECH専用Markdownプレビューの再現

チーム全員が同じMarkdownプレビューを使えるようになる。

```bash
⌘ + Shift + P
→ Markdown Preview Enhanced: Open Preview
```

## 4. 執筆の流れ

① 記事作成

articlesディレクトリ内に下書きを作成

```
articles/記事.md
```

② 保存時に自動整形&テーブル区切りを----に更新

③ プレビュー確認

- VSCodeでMarkdown Preview Enhancedを開く
- Markdownが正しく表示されるか確認
