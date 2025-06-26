// plugins/site.js - 修正版
import { visit } from 'unist-util-visit';

export function remarkSitecardPlugin() {
  return function transformer(tree) {
    console.log('\n=== Sitecard Plugin 开始 ===');
    
    // 处理段落中的 site 标签
    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children?.length !== 1 || node.children[0].type !== 'text') return;

      const rawText = node.children[0].value.trim();
      const match = rawText.match(/^\{%\s*site\s+([^%]+?)\s*%}$/);
      if (!match) return;

      const argString = match[1];
      console.log(`找到 site 标签 (段落), 参数为: "${argString}"`);

      const html = parseSiteCard(argString);
      parent.children.splice(index, 1, { type: 'html', value: html });
    });
    
    // 处理 HTML 节点中的 site 标签（来自 sitegroup 容器内部）
    visit(tree, 'html', (node, index, parent) => {
      if (!node.value || typeof node.value !== 'string') return;
      
      const regex = /\{%\s*site\s+([^%]+?)\s*%}/g;
      if (!regex.test(node.value)) return;
      
      regex.lastIndex = 0;
      let newValue = node.value;
      let hasMatch = false;
      
      newValue = newValue.replace(regex, (match, argString) => {
        hasMatch = true;
        console.log(`在 HTML 节点中找到 site 标签, 参数为: "${argString}"`);
        return parseSiteCard(argString);
      });
      
      if (hasMatch) {
        node.value = newValue;
      }
    });
    
    console.log('=== Sitecard Plugin 结束 ===\n');
  };
}

// 解析 site 卡片的辅助函数
function parseSiteCard(argString) {
  const args = argString.split(',').map(s => s.trim());
  let title = args[0] || '';
  let url = '';
  let screenshot = '';
  let avatar = '';
  let description = '';

  // 解析参数
  for (let i = 1; i < args.length; i++) {
    const tmp = args[i].trim();
    if (tmp.includes('url=')) {
      url = tmp.substring(4);
    } else if (tmp.includes('screenshot=')) {
      screenshot = tmp.substring(11);
    } else if (tmp.includes('avatar=')) {
      avatar = tmp.substring(7);
    } else if (tmp.includes('description=')) {
      description = tmp.substring(12);
    }
  }

  // 生成 HTML
  let html = `<a class="site-card" href="${url}">`;
  html += `<div class="img"><img class="no-lightbox" src="${screenshot}"/></div>`;
  html += `<div class="info">`;
  
  if (avatar.length > 0) {
    html += `<img class="no-lightbox" src="${avatar}"/>`;
  }
  
  html += `<span class="title">${title}</span>`;
  
  if (description.length > 0) {
    html += `<span class="desc">${description}</span>`;
  }
  
  html += `</div></a>`;
  
  return html;
}

export function remarkSitegroupPlugin(processor) {
  return function transformer(tree, file) {
    console.log('\n=== Sitegroup Plugin 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*sitegroup((?:\s+[^%]+)*)?\s*%}([\s\S]*?)\{%\s*endsitegroup\s*%}/g;
      
      if (!regex.test(value)) return;
      regex.lastIndex = 0;

      const newNodes = [];
      let lastIndex = 0;
      let match;
      
      while ((match = regex.exec(value)) !== null) {
        const [fullMatch, argsStr, content] = match;
        const args = (argsStr || '').trim();
        console.log(`找到 sitegroup 块, 参数为: "${args}"`);
        
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }
        
        let html;
        if (args.length > 0) {
          html = `<div class="site-card-group"><p class='p h2'>${args}</p>
${content.trim()}
</div>`;
        } else {
          html = `<div class="site-card-group">
${content.trim()}
</div>`;
        }
        
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
    
    console.log('=== Sitegroup Plugin 结束 ===\n');
  };
}