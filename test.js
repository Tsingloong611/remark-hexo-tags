import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import remarkHexoTagPlugins from './index.js'
import fs from 'fs'

const markdown = fs.readFileSync("D:\\NeoBlog\\major-mercury\\src\\content\\blog\\引索.md", 'utf8'); // 确保 demo.md 包含 folding 标签

// 一个专门用来打印 AST 的插件
function remarkInspectAst() {
  return (tree) => {
    console.log('--- 完整的 AST 结构 ---');
    console.log(JSON.stringify(tree, null, 2)); // 格式化打印整个树
    console.log('--- AST 结构结束 ---');
  }
}

async function runTest() {
  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkInspectAst) // 在我们自己的插件之前打印 AST
      .use(remarkHexoTagPlugins)
      .use(remarkStringify)
      .process(markdown);
    
    console.log('\n=== 最终处理结果 ===');
    console.log(String(file));
  } catch (error) {
    console.error('处理失败:', error);
  }
}

runTest();