import { visit } from 'unist-util-visit';

/**
 * 这是一个插件工厂函数。
 * 它接收一个标签名 (比如 'u')，然后生成一个完整的 Remark 插件。
 * @param {string} tagName - 要处理的 Hexo 标签名。
 */
function buildInlineTagPlugin(tagName) {
  return function() { // 返回一个标准的 Remark 插件工厂
    return function transformer(tree) {
      const upperTagName = tagName.charAt(0).toUpperCase() + tagName.slice(1);
      console.log(`\n=== ${upperTagName} Plugin 开始 ===`);

      visit(tree, 'text', (node, index, parent) => {
        if (parent.type !== 'paragraph') return;
        
        const { value } = node;
        // 动态创建正则表达式，例如 /\{%\s*u\s+([^%]+?)\s*%}/g
        const regex = new RegExp(`\\\{%\\s*${tagName}\\s+([^%]+?)\\\s*%}`, 'g');

        if (!regex.test(value)) {
          console.log(`检查文本节点: "${value.replace(/\r?\n/g, '\\n')}"`);
          return;
        }
        regex.lastIndex = 0;

        const newChildren = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(value)) !== null) {
          // Hexo 的 args.join(' ') 行为，在这里等同于捕获组 match[1]
          const content = match[1];
          console.log(`找到 ${tagName} 标签, 内容为: "${content}"`);

          // 添加标签前方的文本
          if (match.index > lastIndex) {
            newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
          }

          // 构建 HTML
          const html = `<${tagName}>${content}</${tagName}>`;
          
          newChildren.push({ type: 'html', value: html });
          lastIndex = regex.lastIndex;
        }

        // 添加最后一个匹配项之后的文本
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

// 使用工厂函数批量创建并导出所有插件
export const remarkUPlugin = buildInlineTagPlugin('u');
export const remarkEmpPlugin = buildInlineTagPlugin('emp');
export const remarkWavyPlugin = buildInlineTagPlugin('wavy');
export const remarkDelPlugin = buildInlineTagPlugin('del');
export const remarkKbdPlugin = buildInlineTagPlugin('kbd');
export const remarkPswPlugin = buildInlineTagPlugin('psw');