## 1. ローカルに初期構造を作る

```bash
cd raretech-docs
```

package.json 作成

```bash
npm init -y
```

## 2. markdownlint を導入

```bash
npm install markdownlint-cli --save-dev
```

## 3. 必要ファイルを作る

```bash
touch .editorconfig
touch .markdownlint.json
mkdir -p .vscode
touch .vscode/settings.json
mkdir articles
touch articles/.gitkeep
```

## 4. 各ファイルに内容を記載

package.json（編集する）

```json
{
  "name": "raretech-docs",
  "version": "1.0.0",
  "scripts": {
    "lint": "markdownlint articles/**/\*.md",
    "lint:fix": "markdownlint articles/**/\*.md --fix"
  },
  "devDependencies": {
    "markdownlint-cli": "^0.39.0"
  }
}
```

.editorconfig

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
```

.markdownlint.json

```json
{
  "MD013": false,
  "MD041": false,
  "MD033": false
}
```

.vscode/settings.json

```json
{
  "editor.formatOnSave": false,

  "[markdown]": {
    "editor.defaultFormatter": null,
    "editor.formatOnSave": false
  },

  "files.eol": "\n"
}
```

## 5. README.md を作る

## 6. 動作確認

```bash
npm run lint
```

エラーが出なければ基盤完成。
