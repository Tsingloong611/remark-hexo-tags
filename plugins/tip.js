// plugins/tip.js - 修正版（处理段落节点）
import { visit } from 'unist-util-visit';

export function remarkTipPlugin() {
  return function transformer(tree) {
    console.log('\n=== Tip Plugin (段落处理版) 开始 ===');
    
    // 处理段落节点中的 tip 标签
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length === 0) return;
      
      // 获取段落的完整文本内容
      const fullText = node.children.map(child => {
        if (child.type === 'text') return child.value;
        if (child.type === 'strong') return `**${child.children?.map(c => c.value || '').join('') || ''}**`;
        if (child.type === 'emphasis') return `*${child.children?.map(c => c.value || '').join('') || ''}*`;
        return '';
      }).join('');
      
      // 检查是否包含完整的 tip 标签
      const tipRegex = /^\{%\s*tip((?:\s+[^%]+)*)?\s*%}([\s\S]*?)\{%\s*endtip\s*%}$/;
      const match = fullText.match(tipRegex);
      
      if (match) {
        const [fullMatch, argsStr, content] = match;
        const tipclass = argsStr ? argsStr.trim() : 'info';
        console.log(`[段落节点] 找到完整 tip 块, 类名为: "${tipclass}"`);
        
        // 处理内容
        let processedContent = content.trim();
        processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedContent = processedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
        processedContent = processedContent.replace(/\n/g, '<br>');
        
        const html = `<div class="tip ${tipclass}">${processedContent}</div>`;
        
        // 替换整个段落为 HTML 节点
        parent.children.splice(index, 1, { type: 'html', value: html });
        
        return; // 处理完成，退出
      }
    });
    
    // 作为备用，也处理文本节点中的 tip 标签
    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*tip((?:\s+[^%]+)*)?\s*%}([\s\S]*?)\{%\s*endtip\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argsStr, content] = match;
        const tipclass = argsStr ? argsStr.trim() : 'info';
        console.log(`[文本节点] 找到 tip 块, 类名为: "${tipclass}"`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        let processedContent = content.trim();
        processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        processedContent = processedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        const html = `<div class="tip ${tipclass}">${processedContent}</div>`;
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
    
    console.log('=== Tip Plugin (段落处理版) 结束 ===\n');
  };
}

// 调试版本 - 显示更多信息
export function remarkTipPluginDebug() {
  return function transformer(tree) {
    console.log('\n=== Tip Plugin Debug 开始 ===');
    
    // 打印所有包含 "tip" 的节点，包括详细结构
    tree.children.forEach((child, index) => {
      if (child.type === 'paragraph') {
        const fullText = child.children?.map(c => c.value || '').join('') || '';
        if (fullText.includes('tip')) {
          console.log(`节点 ${index} (${child.type}):`);
          console.log(`  完整文本: "${fullText}"`);
          console.log(`  子节点数量: ${child.children?.length || 0}`);
          child.children?.forEach((subChild, subIndex) => {
            console.log(`    子节点 ${subIndex} (${subChild.type}): "${subChild.value?.substring(0, 50) || ''}..."`);
          });
          
          // 测试正则表达式
          const tipRegex = /^\{%\s*tip((?:\s+[^%]+)*)?\s*%}([\s\S]*?)\{%\s*endtip\s*%}$/;
          const match = fullText.match(tipRegex);
          console.log(`  正则匹配结果: ${match ? `成功 - 类名: "${match[1]?.trim() || 'info'}"` : '失败'}`);
        }
      } else {
        const text = getNodeText(child);
        if (text.includes('tip')) {
          console.log(`节点 ${index} (${child.type}): "${text.substring(0, 100)}..."`);
        }
      }
    });
    
    console.log('=== Tip Plugin Debug 结束 ===\n');
  };
}

// 获取节点文本内容的辅助函数
function getNodeText(node) {
  if (node.type === 'text') {
    return node.value;
  } else if (node.type === 'paragraph' && node.children) {
    return node.children.map(child => child.value || '').join('');
  } else if (node.type === 'html') {
    return node.value;
  }
  return '';
}