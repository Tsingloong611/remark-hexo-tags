// plugins/span.js
import { visit } from 'unist-util-visit';

export function remarkPTagPlugin() {
  return function transformer(tree) {
    console.log('\n=== P Tag Plugin 开始 ===');
    
    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*p\s+([^%]+?)\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argString] = match;
        console.log(`找到 p 标签, 参数为: "${argString}"`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        const args = argString.split(',').map(s => s.trim());
        const p0 = args[0] || '';
        const p1 = args[1] || '';
        
        const html = `<p class='p ${p0}'>${p1}</p>`;
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
    
    console.log('=== P Tag Plugin 结束 ===\n');
  };
}

export function remarkSpanTagPlugin() {
  return function transformer(tree) {
    console.log('\n=== Span Tag Plugin 开始 ===');
    
    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*span\s+([^%]+?)\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argString] = match;
        console.log(`找到 span 标签, 参数为: "${argString}"`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        const args = argString.split(',').map(s => s.trim());
        const p0 = args[0] || '';
        const p1 = args[1] || '';
        
        const html = `<span class='p ${p0}'>${p1}</span>`;
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
    
    console.log('=== Span Tag Plugin 结束 ===\n');
  };
}