({
  // Please visit the URL below for more information:
  // https://shd101wyy.github.io/markdown-preview-enhanced/#/extend-parser

  onWillParseMarkdown: async function (markdown) {
    // :::info ～ ::: → 青い補足情報
    markdown = markdown.replace(
      /:::info([\s\S]*?):::/gm,
      function (match, content) {
        return `<div class="info-block">${content.trim()}</div>`;
      },
    );

    // :::alert ～ ::: → 赤い警告
    markdown = markdown.replace(
      /:::alert([\s\S]*?):::/gm,
      function (match, content) {
        return `<div class="alert-block">${content.trim()}</div>`;
      },
    );

    // :::success ～ ::: → 緑の成功
    markdown = markdown.replace(
      /:::success([\s\S]*?):::/gm,
      function (match, content) {
        return `<div class="success-block">${content.trim()}</div>`;
      },
    );

    // :::warning ～ ::: → 黄色の注意
    markdown = markdown.replace(
      /:::warning([\s\S]*?):::/gm,
      function (match, content) {
        return `<div class="warning-block">${content.trim()}</div>`;
      },
    );

    // :::toggle title="〇〇" ～ ::: → 折りたたみ
    markdown = markdown.replace(
      /:::toggle\s+title="([^"]+)"([\s\S]*?):::/gm,
      function (match, title, content) {
        // summaryの直後に改行を入れて、内部Markdownを正しく解釈させる
        return `<details class="toggle-block">\n<summary>${title}</summary>\n\n${content.trim()}\n</details>`;
      },
    );

    // :::cardlink ～ ::: → URLカード
    markdown = markdown.replace(
      /:::cardlink([\s\S]*?):::/gm,
      function (match, content) {
        const url = content.trim();

        return `
    <div class="cardlink-block">
      <a href="${url}" target="_blank" rel="noopener noreferrer">
        <div class="cardlink-url">${url}</div>
      </a>
    </div>
    `.trim();
      },
    );

    return markdown;
  },

  onDidParseMarkdown: async function (html) {
    return html;
  },
});
