import { visit } from 'unist-util-visit';

export function remarkLinkPlugin(options = {}) {
  // 从选项中获取占位图，或使用一个默认值
  const placeholderImg = options.link_placeholder || 'https://unpkg.zhimg.com/hexo-butterfly-tag-plugins-plus@latest/lib/assets/default.svg';

  return function transformer(tree) {
    console.log('\n=== Link Plugin 开始 ===');

    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children?.length !== 1 || node.children[0].type !== 'text') {
        console.log(`检查段落: 结构不符，跳过`);
        return;
      };

      const rawText = node.children[0].value.trim();
      const match = rawText.match(/^\{%\s*link\s+([^%]+?)\s*%}$/);
      
      if (!match) {
        console.log(`检查段落: 未匹配 link 标签`);
        return;
      }

      const argString = match[1];
      console.log(`找到 link 标签, 参数为: "${argString}"`);

      const args = argString.split(',').map(s => s.trim());

      if (args.length < 2) {
        console.log('[Link] 警告: link 标签至少需要 2 个参数 (title, url)，已跳过。');
        return;
      }

      const text = args[0] || '';
      const url = args[1] || '';
      const img = args[2] || placeholderImg; // 如果第三个参数不存在，使用占位图

      let result = '';
      result += '<div class="tag link"><a class="link-card" title="' + text + '" href="' + url + '">';
      result += '<div class="left">';
      result += '<img src="' + img + '"/>';
      result += '</div>';
      result += '<div class="right"><p class="text">' + text + '</p><p class="url">' + url + '</p></div>';
      result += '</a></div>';

      parent.children.splice(index, 1, { type: 'html', value: result });
      return index + 1;
    });

    console.log('=== Link Plugin 结束 ===\n');
  };
}