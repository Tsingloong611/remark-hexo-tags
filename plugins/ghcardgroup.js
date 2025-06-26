import { visit } from 'unist-util-visit';

export function remarkGhcardgroupPlugin() {
  return function transformer(tree) {
    console.log('\n=== Ghcardgroup Plugin (最终版) 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      const { value } = node;

      // 只处理同时包含开始和结束标签的文本节点
      if (!value.includes('{% ghcardgroup %}') || !value.includes('{% endghcardgroup %}')) {
        return;
      }
      
      console.log(`[Ghcardgroup] 在文本节点中找到 ghcardgroup 块`);

      const newNodes = [];
      const regex = /(\{% ghcardgroup %\}|{% endghcardgroup %\})/;
      const parts = value.split(regex).filter(Boolean); // filter(Boolean) 移除空字符串

      for (const part of parts) {
        if (part === '{% ghcardgroup %}') {
          newNodes.push({ type: 'html', value: '<div class="ghcard-group">' });
        } else if (part === '{% endghcardgroup %}') {
          newNodes.push({ type: 'html', value: '</div>' });
        } else {
          newNodes.push({ type: 'text', value: part });
        }
      }

      // 替换原节点
      parent.children.splice(index, 1, ...newNodes);
    });

    console.log('=== Ghcardgroup Plugin (最终版) 结束 ===');
  };
}