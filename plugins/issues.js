import { visit } from 'unist-util-visit';

export function remarkIssuesPlugin() {
  return function transformer(tree) {
    console.log('\n=== Issues Plugin 开始 ===');

    visit(tree, 'paragraph', (node, index, parent) => {
      // 插件期望整个段落只有一个文本节点，且内容完全匹配 issues 标签
      if (node.children?.length !== 1 || node.children[0].type !== 'text') {
        console.log(`检查段落: 结构不符，跳过`);
        return;
      };

      const rawText = node.children[0].value.trim();
      const match = rawText.match(/^\{%\s*issues\s+([^%]+?)\s*%}$/);
      
      if (!match) {
        console.log(`检查段落: 未匹配 issues 标签`);
        return;
      }

      const argString = match[1];
      console.log(`找到 issues 标签, 参数为: "${argString}"`);

      // 1. 复刻 Hexo 插件的参数解析逻辑
      const parts = argString.split(' | ').map(p => p.trim());
      
      let type = parts[0] || '';
      let api = '';
      let group = '';

      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];
          if (part.startsWith('api=')) {
            api = part.substring(4);
          } else if (part.startsWith('group=')) {
            group = part.substring(6);
          } else if (part.startsWith('type=')) { // 允许用 key=value 覆盖 type
            type = part.substring(5);
          }
        }
      }

      // 2. 验证必要参数
      if (!type || !api) {
        console.log('[Issues] 警告: 缺少必要的 type 或 api 参数，已跳过此标签。');
        return;
      }

      // 3. 构建 HTML
      let html = `<div class="issues-api ${type}"`;
      html += ` api="${api}"`;
      if (group) {
        html += ` group="${group}"`;
      }
      html += '></div>';

      // 4. 替换原节点
      parent.children.splice(index, 1, { type: 'html', value: html });
      return index + 1;
    });

    console.log('=== Issues Plugin 结束 ===\n');
  };
}