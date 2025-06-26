// plugins/bubble.js
import { visit } from 'unist-util-visit'

export function remarkBubbleTag() {
  return (tree) => {
    console.log('\n=== Bubble Plugin 开始 ===')
    
    visit(tree, 'text', (node, index, parent) => {
      if (typeof node.value !== 'string') return
      
      const value = node.value
      console.log(`检查文本节点: "${value}"`)
      
      const bubbleRegex = /\{%\s*bubble\s+([^,%]+)\s*,\s*([^,%]+)(?:\s*,\s*([^\s%]+))?\s*%\}/g
      
      if (bubbleRegex.test(value)) {
        console.log('找到 bubble 标签，进行替换')
        
        // 重置正则表达式
        bubbleRegex.lastIndex = 0
        
        const children = []
        let lastIndex = 0
        let match
        
        while ((match = bubbleRegex.exec(value)) !== null) {
          const [fullMatch, content, notation, colorRaw] = match
          const start = match.index
          
          if (start > lastIndex) {
            children.push({ type: 'text', value: value.slice(lastIndex, start) })
          }
          
          const color = colorRaw ? decodeURIComponent(colorRaw) : '#71a4e3'
          const html = `<span class="bubble-content">${content}</span><span class="bubble-notation"><span class="bubble-item" style="background-color:${color};">${notation}</span></span>`
          
          children.push({ type: 'html', value: html })
          lastIndex = start + fullMatch.length
        }
        
        if (lastIndex < value.length) {
          children.push({ type: 'text', value: value.slice(lastIndex) })
        }
        
        if (children.length > 0) {
          parent.children.splice(index, 1, ...children)
        }
      }
    })
    
    console.log('=== Bubble Plugin 结束 ===\n')
  }
}