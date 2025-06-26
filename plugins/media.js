// plugins/media.js - 修正版
import { visit } from 'unist-util-visit';

// 工厂函数，用于创建 audio 和 video 插件
function buildMediaPlugin(tagName) {
  const upperTagName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  return function() {
    return function transformer(tree) {
      console.log(`\n=== ${upperTagName} Plugin 开始 ===`);
      visit(tree, 'paragraph', (node, index, parent) => {
        if (node.children?.length !== 1 || node.children[0].type !== 'text') {
          console.log(`检查段落: 结构不符，跳过`);
          return;
        }
        
        const rawText = node.children[0].value.trim();
        const regex = new RegExp(`^\\{%\\s*${tagName}\\s+([^%]+?)\\s*%}$`);
        const match = rawText.match(regex);
        
        if (!match) {
          console.log(`检查段落: 未匹配 ${tagName} 标签`);
          return;
        }

        const src = match[1].trim();
        console.log(`找到 ${tagName} 标签, src 为: "${src}"`);
        
        const type = tagName === 'audio' ? 'audio/mp3' : 'video/mp4';
        const html = `<div class="${tagName}"><${tagName} controls preload><source src='${src}' type='${type}'>Your browser does not support the ${tagName} tag.</${tagName}></div>`;

        parent.children.splice(index, 1, { type: 'html', value: html });
      });
      
      // 还需要处理 HTML 节点内的 video 标签（来自 videos 容器内部）
      visit(tree, 'html', (node, index, parent) => {
        if (!node.value || typeof node.value !== 'string') return;
        
        const regex = new RegExp(`\\{%\\s*${tagName}\\s+([^%]+?)\\s*%}`, 'g');
        if (!regex.test(node.value)) return;
        
        regex.lastIndex = 0;
        let newValue = node.value;
        let hasMatch = false;
        
        newValue = newValue.replace(regex, (match, src) => {
          hasMatch = true;
          console.log(`在 HTML 节点中找到 ${tagName} 标签, src 为: "${src.trim()}"`);
          const type = tagName === 'audio' ? 'audio/mp3' : 'video/mp4';
          return `<div class="${tagName}"><${tagName} controls preload><source src='${src.trim()}' type='${type}'>Your browser does not support the ${tagName} tag.</${tagName}></div>`;
        });
        
        if (hasMatch) {
          node.value = newValue;
        }
      });
      
      console.log(`=== ${upperTagName} Plugin 结束 ===\n`);
    };
  };
}

// videos 包裹插件 - 不变
export function remarkVideosPlugin(processor) {
  return function transformer(tree, file) {
    console.log('\n=== Videos Plugin (最终版) 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*videos((?:\s+[^%]+)*)?\s*%}([\s\S]*?)\{%\s*endvideos\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argsStr, content] = match;
        console.log(`[Videos] 在文本节点中找到 videos 块`);

        const args = (argsStr || '').trim().split(',').map(s => s.trim()).filter(s => s);
        const cls = args[0] ? ' ' + args[0] : '';
        const col = Number(args[1]) || 0;
        const colAttr = col > 0 ? ` col='${col}'` : '';

        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        // 处理内容：保持原样，让后续的 video 插件处理
        const html = `<div class="videos${cls}"${colAttr}>
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
    console.log('=== Videos Plugin (最终版) 结束 ===\n');
  };
}

export const remarkAudioPlugin = buildMediaPlugin('audio');
export const remarkVideoPlugin = buildMediaPlugin('video');