import { visit } from 'unist-util-visit';

export function remarkBdagePlugin() {
  return function transformer(tree) {
    console.log('\n=== Bdage Plugin (最终版) 开始 ===');

    visit(tree, 'paragraph', (node, index, parent) => {
      if (node.children?.length !== 1 || node.children[0].type !== 'text') return;
      
      const rawText = node.children[0].value.trim();
      const match = rawText.match(/^\{%\s*bdage\s+([^%]+?)\s*%}$/);
      
      if (!match) {
        console.log(`检查段落文本: "${rawText}"`);
        return;
      }
      
      const argString = match[1];
      console.log(`找到 bdage 标签, 参数为: "${argString}"`);

      // **最终修正逻辑：在解析出每个部分后，再精确地移除引号**
      const parts = argString.split('||').map(p => p.trim());

      const base = (parts[0] || '').split(',').map(b => b.trim().replace(/^'|'$/g, ''));
      const right = base[0] ? encodeURIComponent(base[0]) : '';
      const left = base[1] ? encodeURIComponent(base[1]) : '';
      const logo = base[2] || '';

      const message = (parts[1] || '').split(',').map(m => m.trim().replace(/^'|'$/g, ''));
      const color = message[0] || 'orange';
      const link = message[1] || '';
      const title = message[2] || '';

      const option = (parts[2] || '').trim();

      const shieldsUrl = `https://img.shields.io/badge/${left}-${right}-orange?logo=${logo}&color=${color}&link=${link}&${option}`;
      const finalHtml = `<object class="ghbdage" style="margin-inline:5px" title="${title}" standby="loading..." data="${shieldsUrl}"></object>`;
      
      parent.children.splice(index, 1, { type: 'html', value: finalHtml });
      return index + 1;
    });

    console.log('=== Bdage Plugin (最终版) 结束 ===\n');
  };
}