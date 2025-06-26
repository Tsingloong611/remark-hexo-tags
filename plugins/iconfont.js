import { visit } from 'unist-util-visit';

export function remarkIconPlugin() {
  return function transformer(tree) {
    console.log('\n=== Icon Plugin 开始 ===');

    visit(tree, 'text', (node, index, parent) => {
      // 检查父节点类型，避免在链接、加粗等内部进行不必要的替换
      if (parent.type !== 'paragraph') return;
      
      const { value } = node;
      // 使用 'g' 标志来查找所有 icon 标签
      const regex = /\{%\s*icon\s+([^%]+?)\s*%}/g;
      
      // 先用 .test() 快速检查是否存在，提高效率
      if (!regex.test(value)) {
        console.log(`检查文本节点: "${value.replace(/\r?\n/g, '\\n')}"`);
        return;
      }
      // 重置 lastIndex 以便 .exec() 从头开始
      regex.lastIndex = 0;

      const newChildren = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(value)) !== null) {
        const argString = match[1];
        console.log(`找到 icon 标签, 参数为: "${argString}"`);

        // 添加标签前的文本
        if (match.index > lastIndex) {
          newChildren.push({ type: 'text', value: value.slice(lastIndex, match.index) });
        }

        // 解析参数
        const args = argString.split(',').map(s => s.trim());
        const p0 = args[0] || '';
        const p1 = args[1] || '1'; // 默认尺寸为 1em

        // 构建 SVG HTML
        const svgHtml = `<svg class="icon" style="width:${p1}em; height:${p1}em" aria-hidden="true"><use xlink:href="#${p0}"></use></svg>`;
        
        newChildren.push({ type: 'html', value: svgHtml });
        lastIndex = regex.lastIndex;
      }

      // 添加最后一个匹配项之后的文本
      if (lastIndex < value.length) {
        newChildren.push({ type: 'text', value: value.slice(lastIndex) });
      }

      // 用新节点数组替换掉旧的文本节点
      if (newChildren.length > 0) {
        parent.children.splice(index, 1, ...newChildren);
      }
    });
    console.log('=== Icon Plugin 结束 ===\n');
  };
}