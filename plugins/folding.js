import { visit } from 'unist-util-visit';

export function remarkFoldingPlugin() {
  return function transformer(tree) {
    console.log('\n=== Folding Plugin 开始 ===');

    visit(tree, 'paragraph', (node, index, parent) => {
      const { children } = node;
      if (!children || children.length === 0) return;

      const firstChild = children[0];
      const lastChild = children[children.length - 1];

      // 为了日志输出，我们将一个段落内的所有文本内容合并起来查看
      const combinedTextForLogging = children.map(child => {
        if (child.type === 'text') return child.value;
        if (child.type === 'image') return `[图片: ${child.url}]`;
        if (child.type === 'strong') return `[加粗: ${child.children[0]?.value}]`;
        return `[${child.type}]`;
      }).join('');
      console.log(`检查段落文本: "${combinedTextForLogging.replace(/\r?\n/g, '\\n')}"`);

      // 1. 检查是否为 folding 块的结构
      if (firstChild.type !== 'text' || lastChild.type !== 'text') return;
      
      const startMatch = firstChild.value.match(/^\{%\s*folding((?:\s+[^%]+)*)?\s*%}(\r?\n)?/);
      if (!startMatch || !lastChild.value.endsWith('{% endfolding %}')) return;
      
      // 2. 解析参数
      const argsStr = (startMatch[1] || '').trim();
      const args = argsStr.split(',').map(s => s.trim()).filter(Boolean); // .filter(Boolean) 移除空字符串

      let attributes = '';
      let title = '';

      if (args.length > 1) { // 处理 "属性, 标题" 格式
        const styleArg = args[0];
        title = args[1];
        // 如果是 style，则包裹 style=""，否则直接作为属性（如 open）
        attributes = styleArg.includes(':') ? `style="${styleArg}"` : styleArg;
      } else if (args.length === 1) { // 处理单个参数
        const singleArg = args[0];
        // 判断单个参数是属性还是标题
        if (singleArg.includes(':') || singleArg === 'open') {
          attributes = singleArg.includes(':') ? `style="${singleArg}"` : singleArg;
          title = '详细信息'; // 如果只提供了属性，给一个默认标题
        } else {
          title = singleArg;
        }
      }
      
      console.log(`找到 folding 标签，标题为: "${title}", 属性为: "${attributes}"`);

      // 3. 提取内容节点 (逻辑同上一版)
      const contentNodes = [];
      const firstChildContent = firstChild.value.replace(startMatch[0], '');
      if (firstChildContent) {
          contentNodes.push({ type: 'text', value: firstChildContent });
      }
      contentNodes.push(...children.slice(1, children.length - 1));
      if (children.length > 1) {
          const lastChildContent = lastChild.value.replace(/(\r?\n)?\{%\s*endfolding\s*%}$/, '');
          if (lastChildContent) {
              contentNodes.push({ type: 'text', value: lastChildContent });
          }
      }
      
      // 4. 构造替换节点
      const openTag = { type: 'html', value: `<details class="folding-tag" ${attributes}><summary> ${title} </summary><div class='content'>` };
      const closeTag = { type: 'html', value: `</div></details>` };
      
      // 5. 替换 AST 中的原段落
      parent.children.splice(index, 1, openTag, ...contentNodes, closeTag);
      return index + contentNodes.length + 2;
    });

    console.log('=== Folding Plugin 结束 ===\n');
  };
}