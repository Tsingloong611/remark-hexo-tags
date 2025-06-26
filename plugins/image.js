import { visit } from 'unist-util-visit';

export function remarkImagePlugin() {
  return function transformer(tree) {
    console.log('\n=== Image Plugin 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      // 仅在段落中的文本节点里查找
      if (parent.type !== 'paragraph') return;
      
      const { value } = node;
      
      // 打印正在检查的每一个文本节点
      console.log(`检查文本节点: "${value.replace(/\r?\n/g, '\\n')}"`);

      // 正则表达式：在文本中查找所有 image 标签
      const regex = /\{%\s*image\s+(.+?)\s*%}/g;

      // 如果快速测试失败，说明这个节点里肯定没有 image 标签，直接跳过
      if (!regex.test(value)) {
        return;
      }
      
      // 重置正则表达式的 lastIndex，以便 .exec() 从头开始查找
      regex.lastIndex = 0;

      const newChildren = [];
      let lastIndex = 0;
      let match;

      // 循环查找所有匹配的 image 标签
      while ((match = regex.exec(value)) !== null) {
        const argString = match[1];
        console.log(`找到 image 标签, 参数为: "${argString}"`);

        // 1. 添加上一个匹配项到当前匹配项之间的文本
        if (match.index > lastIndex) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        // 2. 解析参数
        const args = argString.split(',').map(s => s.trim());
        const url = args[0] || '';
        let alt = '', bg = '', style = '';

        if (url && args.length > 1) {
          for (let i = 1; i < args.length; i++) {
            const part = args[i];
            if (part.startsWith('alt=')) alt = part.substring(4);
            else if (part.startsWith('width=')) style += `width:${part.substring(6)};`;
            else if (part.startsWith('height=')) style += `height:${part.substring(7)};`;
            else if (part.startsWith('bg=')) bg = part.substring(3);
          }
        }

        // 3. 构建 HTML
        let imgTag = `<img class="img" src="${url}"`;
        if (alt) imgTag += ` alt="${alt}"`;
        if (style) imgTag += ` style="${style}"`;
        imgTag += '/>';

        let finalHtml = '<div class="img-wrap">';
        finalHtml += `<div class="img-bg"`;
        if (bg) finalHtml += ` style="background:${bg}"`;
        finalHtml += `>${imgTag}</div>`;
        if (alt) finalHtml += `<span class="image-caption">${alt}</span>`;
        finalHtml += '</div>';
        
        newChildren.push({ type: 'html', value: finalHtml });
        lastIndex = regex.lastIndex;
      }

      // 4. 添加最后一个匹配项之后的剩余文本
      if (lastIndex < value.length) {
        newChildren.push({ type: 'text', value: value.slice(lastIndex) });
      }

      // 5. 替换原节点
      if (newChildren.length > 0) {
        parent.children.splice(index, 1, ...newChildren);
      }
    });

    console.log('=== Image Plugin 结束 ===\n');
  };
}