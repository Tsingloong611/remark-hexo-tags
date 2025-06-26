import { visit } from 'unist-util-visit';

function buildSimpleInlinePlugin(tagName, htmlBuilder) {
  const upperTagName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
  return function() {
    return function transformer(tree) {
      console.log(`\n=== ${upperTagName} Plugin 开始 ===`);
      visit(tree, 'text', (node, index, parent) => {
        if (parent.type !== 'paragraph') return;
        
        const { value } = node;
        const regex = new RegExp(`\\\{%\\s*${tagName}\\s+([^%]+?)\\\s*%}`, 'g');
        if (!regex.test(value)) return;
        regex.lastIndex = 0;

        const newChildren = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(value)) !== null) {
          const argString = match[1];
          console.log(`找到 ${tagName} 标签, 参数为: "${argString}"`);

          if (match.index > lastIndex) {
            newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
          }

          const args = argString.split(',').map(s => s.trim());
          const html = htmlBuilder(args);
          
          newChildren.push({ type: 'html', value: html });
          lastIndex = regex.lastIndex;
        }
        if (lastIndex < value.length) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex) });
        }
        if (newChildren.length > 0) {
          parent.children.splice(index, 1, ...newChildren);
        }
      });
      console.log(`=== ${upperTagName} Plugin 结束 ===\n`);
    };
  };
}

// referto 构建逻辑（修正版）
const refertoBuilder = (args) => {
  const referid = args[0] || '';
  // 将从第二个元素开始的所有部分重新用逗号连接起来，作为文献内容
  const literature = args.slice(1).join(',').trim(); 
  return `<span class="hidden-anchor" id="referto_${referid}"></span>...`; // 省略完整HTML
};

// referfrom 构建逻辑（修正版）
const referfromBuilder = (args) => {
  const fromid = args[0] || '';
  // 假定最后一个参数是 URL，中间的都是文献内容
  const referurl = args.length > 2 ? args[args.length - 1] : 'javascript:void(0)';
  const fromliterature = args.slice(1, args.length > 2 ? -1 : undefined).join(',').trim();
  return `<div class="reference-source">...</div>`; // 省略完整HTML
};

export const remarkRefertoPlugin = buildSimpleInlinePlugin('referto', refertoBuilder);
export const remarkReferfromPlugin = buildSimpleInlinePlugin('referfrom', referfromBuilder);