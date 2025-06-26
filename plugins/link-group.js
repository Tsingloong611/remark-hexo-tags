// plugins/linkgroup.js - 修正版
import { visit } from 'unist-util-visit';

export function remarkLinkgroupPlugin(processor) {
  return function transformer(tree, file) {
    console.log('\n=== Linkgroup Plugin (最终版) 开始 ===');
    if (!processor || typeof processor.parse !== 'function') {
      console.log('[Linkgroup] 警告：无法获取 processor，将使用简化处理');
      return simpleTransformer(tree, file);
    }

    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*linkgroup\s*%}([\s\S]*?)\{%\s*endlinkgroup\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, content] = match;
        console.log(`[Linkgroup] 在文本节点中找到 linkgroup 块`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        // 解析内部内容
        const contentTree = processor.parse(content.trim());
        
        // 对内部内容应用 link 插件（但不是所有插件，避免无限递归）
        if (file.data?.remarkLinkPlugin) {
          file.data.remarkLinkPlugin(contentTree, file);
        }
        
        newNodes.push({ type: 'html', value: '<div class="link-group">' });
        newNodes.push(...contentTree.children);
        newNodes.push({ type: 'html', value: '</div>' });
        
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < value.length) {
        newNodes.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
    console.log('=== Linkgroup Plugin (最终版) 结束 ===\n');
  };
  
  // 简化版本，当没有 processor 时使用
  function simpleTransformer(tree, file) {
    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*linkgroup\s*%}([\s\S]*?)\{%\s*endlinkgroup\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, content] = match;
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        const html = `<div class="link-group">
${content.trim()}
</div>`;
        
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
  }
}