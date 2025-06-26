// plugins/btns.js
import { visit } from 'unist-util-visit'

export function remarkBtnsPlugin() {
  return function transformer(tree) {
    console.log('\n=== Btns Plugin 开始 ===')
    
    visit(tree, 'text', (node, index, parent) => {
      if (typeof node.value !== 'string') return
      
      const value = node.value
      console.log(`检查文本节点: "${value.replace(/\n/g, '\\n')}"`)
      
      if (/{%\s*btns\s*%}|{%\s*endbtns\s*%}/.test(value)) {
        console.log('找到 btns 标签，进行替换')
        
        const newNodes = []
        const parts = value.split(/({%\s*btns\s*%}|{%\s*endbtns\s*%})/)
        
        for (let part of parts) {
          if (part.match(/{%\s*btns\s*%}/)) {
            newNodes.push({
              type: 'html',
              value: '<div class="btns">'
            })
          } else if (part.match(/{%\s*endbtns\s*%}/)) {
            newNodes.push({
              type: 'html',
              value: '</div>'
            })
          } else if (part) {
            newNodes.push({
              type: 'text',
              value: part
            })
          }
        }
        
        parent.children.splice(index, 1, ...newNodes)
      }
    })
    
    console.log('=== Btns Plugin 结束 ===\n')
  }
}