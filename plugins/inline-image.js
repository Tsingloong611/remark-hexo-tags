import { visit } from 'unist-util-visit';

export function remarkInlineImagePlugin() {
  return function transformer(tree) {
    console.log('\n=== InlineImage Plugin 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      if (parent.type !== 'paragraph') return;
      
      const { value } = node;
      const regex = /\{%\s*inlineimage\s+([^%]+?)\s*%}/g;

      if (!regex.test(value)) {
        console.log(`检查文本节点: "${value.replace(/\r?\n/g, '\\n')}"`);
        return;
      }
      regex.lastIndex = 0;

      const newChildren = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        const argString = match[1];
        console.log(`找到 inlineimage 标签, 参数为: "${argString}"`);

        if (match.index > lastIndex) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        const args = argString.split(',').map(s => s.trim());
        const url = args[0] || '';
        let style = '';

        if (args.length > 1) {
          for (let i = 1; i < args.length; i++) {
            if (args[i].startsWith('height=')) {
              style += `height:${args[i].substring(7)};`;
            }
          }
        }
        
        const finalStyle = style || 'height:1.5em;'; // 默认高度
        const imgHtml = `<img no-lazy class="inline" src="${url}" style="${finalStyle}"/>`;
        
        newChildren.push({ type: 'html', value: imgHtml });
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < value.length) {
        newChildren.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (newChildren.length > 0) {
        parent.children.splice(index, 1, ...newChildren);
      }
    });

    console.log('=== InlineImage Plugin 结束 ===\n');
  };
}