({
  onWillParseMarkdown: async function (markdown) {
    function wrapBlock(type, content) {
      return `
<div class="${type}-block">

${content.trim()}

</div>
`;
    }
    // :::info ～ ::: → 青い補足情報
    markdown = markdown.replace(/:::info([\s\S]*?):::/gm, (match, content) =>
      wrapBlock("info", content),
    );

    // :::alert ～ ::: → 赤い警告
    markdown = markdown.replace(/:::alert([\s\S]*?):::/gm, (match, content) =>
      wrapBlock("alert", content),
    );

    // :::success ～ ::: → 緑の成功
    markdown = markdown.replace(/:::success([\s\S]*?):::/gm, (match, content) =>
      wrapBlock("success", content),
    );

    // :::warning ～ ::: → 黄色の注意
    markdown = markdown.replace(/:::warning([\s\S]*?):::/gm, (match, content) =>
      wrapBlock("warning", content),
    );

    // :::toggle title="〇〇" ～ ::: → 折りたたみ
    markdown = markdown.replace(
      /:::toggle\s+title="([^"]+)"([\s\S]*?):::/gm,
      function (match, title, content) {
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
