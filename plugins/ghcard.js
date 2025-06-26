import { visit } from 'unist-util-visit';

export function remarkGhcardPlugin(options = {}) {
  const ghcard_url = options.ghcard_url || 'https://github-readme-stats.vercel.app';

  return function transformer(tree) {
    console.log('\n=== Ghcard Plugin (最终版) 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;
      const regex = /\{%\s*ghcard\s+([^%]+?)\s*%}/g;

      if (!regex.test(value)) {
        return;
      }
      regex.lastIndex = 0; // 重置

      console.log(`[Ghcard] 在文本节点中找到 ghcard 标签`);

      const newChildren = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        const argString = match[1];
        
        // 添加标签前的文本
        if (match.index > lastIndex) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        // --- 参数解析和HTML构建逻辑 (同上一版) ---
        const args = argString.split(',').map(s => s.trim());
        const path = args[0] || '';
        if (path) {
            let apiUrl = '';
            if (path.includes('/')) {
              const parts = path.split('/');
              apiUrl = `${ghcard_url}/api/pin/?username=${parts[0]}&repo=${parts[1]}`;
            } else {
              apiUrl = `${ghcard_url}/api/?username=${path}`;
            }
            if (args.length > 1) {
              for (let i = 1; i < args.length; i++) { apiUrl += `&${args[i]}`; }
            }
            if (!apiUrl.includes('&show_owner=')) { apiUrl += '&show_owner=true'; }
            const finalHtml = `<a class="ghcard" rel="external nofollow noopener noreferrer" href="https://github.com/${path}"><img src="${apiUrl}"/></a>`;
            newChildren.push({ type: 'html', value: finalHtml });
        }
        // --- 逻辑结束 ---

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < value.length) {
        newChildren.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (newChildren.length > 0) {
        parent.children.splice(index, 1, ...newChildren);
      }
    });

    console.log('=== Ghcard Plugin (最终版) 结束 ===');
  };
}