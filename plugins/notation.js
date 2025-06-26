// plugins/nota.js - 保持不变
import { visit } from 'unist-util-visit';

export function remarkNotaPlugin() {
  return function transformer(tree) {
    console.log('\n=== Nota Plugin 开始 ===');
    visit(tree, 'text', (node, index, parent) => {
      if (parent.type !== 'paragraph') return;
      
      const { value } = node;
      const regex = /\{%\s*nota\s+([^%]+?)\s*%}/g;
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newChildren = [];
      let lastIndex = 0;
      let match;
      while ((match = regex.exec(value)) !== null) {
        const argString = match[1];
        console.log(`找到 nota 标签, 参数为: "${argString}"`);

        if (match.index > lastIndex) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        const args = argString.split(',').map(s => s.trim());
        const p0 = args[0] || '';
        const p1 = args[1] || '';
        const html = `<span class='nota' data-nota='${p1}'>${p0}</span>`;
        
        newChildren.push({ type: 'html', value: html });
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < value.length) {
        newChildren.push({ type: 'text', value: value.slice(lastIndex) });
      }
      if (newChildren.length > 0) {
        parent.children.splice(index, 1, ...newChildren);
      }
    });
    console.log('=== Nota Plugin 结束 ===\n');
  };
}