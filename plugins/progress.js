// plugins/progress.js - 修正版
import { visit } from 'unist-util-visit';

export function remarkProgressPlugin(processor) {
  return function transformer(tree, file) {
    console.log('\n=== Progress Plugin (完整版) 开始 ===');
    
    // 先处理段落中的 progress 标签
    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children?.length !== 1 || node.children[0].type !== 'text') return;

      const rawText = node.children[0].value.trim();
      const match = rawText.match(/^\{%\s*progress\s+([^%]+?)\s*%}$/);
      if (!match) return;

      const argString = match[1];
      console.log(`找到 progress 标签 (段落), 参数为: "${argString}"`);

      const args = argString.split(',').map(s => s.trim());
      const pwidth = args[0] || '0';
      const pcolor = args[1] || 'blue';
      const text = args[2] || '';

      const html = `<div class="progress"><div class="progress-bar-animated progress-bar progress-bar-striped bg-${pcolor}" style="width: ${pwidth}%" aria-valuenow="${pwidth}" aria-valuemin="0" aria-valuemax="100">${text}</div></div>`;
      parent.children.splice(index, 1, { type: 'html', value: html });
    });
    
    // 再处理文本节点中的 progress 标签
    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*progress\s+([^%]+?)\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argString] = match;
        console.log(`找到 progress 标签 (文本), 参数为: "${argString}"`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        const args = argString.split(',').map(s => s.trim());
        const pwidth = args[0] || '0';
        const pcolor = args[1] || 'blue';
        const text = args[2] || '';

        const html = `<div class="progress"><div class="progress-bar-animated progress-bar progress-bar-striped bg-${pcolor}" style="width: ${pwidth}%" aria-valuenow="${pwidth}" aria-valuemin="0" aria-valuemax="100">${text}</div></div>`;
        
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
    
    console.log('=== Progress Plugin (完整版) 结束 ===\n');
  };
}