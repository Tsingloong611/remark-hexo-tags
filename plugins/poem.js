// plugins/poem.js
import { visit } from 'unist-util-visit';

export function remarkPoemPlugin() {
  return function transformer(tree) {
    console.log('\n=== Poem Plugin (最终版) 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*poem\s+([^%]*?)\s*%}([\s\S]*?)\{%\s*endpoem\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argsStr, content] = match;
        const args = (argsStr || '').split(',').map(s => s.trim());
        const title = args[0] || '';
        const author = args[1] || '';
        console.log(`找到 poem 块, 标题: "${title}", 作者: "${author}"`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        const html = `<div class='poem'><div class='poem-title'>${title}</div><div class='poem-author'>${author}</div>${content.trim()}</div>`;
        newNodes.push({ type: 'html', value: html });

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < value.length) {
        newNodes.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
    console.log('=== Poem Plugin (最终版) 结束 ===\n');
  };
}
