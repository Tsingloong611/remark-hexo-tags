// plugins/checkbox.js
import { visit } from 'unist-util-visit'

function buildTagProcessor(inputType = 'checkbox') {
  return () => {
    return (tree) => {
      console.log(`\n=== ${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Plugin 开始 ===`)
      
      visit(tree, 'paragraph', (node, index, parent) => {
        if (node.children?.length === 1 && node.children[0].type === 'text') {
          const text = node.children[0].value
          console.log(`检查段落文本: "${text}"`)
          
          // 处理多行文本中的多个标签
          const lines = text.split('\n').map(line => line.trim()).filter(line => line)
          const newNodes = []
          
          for (const line of lines) {
            const regex = new RegExp(`^\\{%\\s*${inputType}\\s+([^%]+)\\s*%\\}$`)
            const match = line.match(regex)
            
            if (match) {
              console.log(`找到 ${inputType} 标签: ${line}`)
              
              const argsStr = match[1]
              const args = argsStr.split(',').map(s => s.trim())
              
              let cls = ''
              let text = ''
              let checked = false
              
              if (args.length === 1) {
                const arg = args[0]
                if (arg === 'checked') {
                  checked = true
                  text = `默认选中的${inputType === 'checkbox' ? '复选框' : '单选框'}`
                } else if (arg.includes('checked')) {
                  checked = true
                  cls = arg.replace(/\bchecked\b/g, '').trim()
                  text = `选中的${inputType === 'checkbox' ? '复选框' : '单选框'}`
                } else {
                  text = arg
                }
              } else if (args.length >= 2) {
                let firstArg = args[0]
                if (firstArg.includes('checked')) {
                  checked = true
                  cls = firstArg.replace(/\bchecked\b/g, '').trim()
                } else {
                  cls = firstArg
                }
                text = args[1]
              }
              
              const html = `<div class="${inputType}${cls ? ' ' + cls : ''}">
  <input type="${inputType}" ${checked ? 'checked="checked"' : ''} />
  <span>${text}</span>
</div>`
              
              newNodes.push({
                type: 'html',
                value: html
              })
            } else {
              // 不是标签的普通文本
              newNodes.push({
                type: 'paragraph',
                children: [{ type: 'text', value: line }]
              })
            }
          }
          
          if (newNodes.length > 0) {
            parent.children.splice(index, 1, ...newNodes)
          }
        }
      })
      
      console.log(`=== ${inputType.charAt(0).toUpperCase() + inputType.slice(1)} Plugin 结束 ===\n`)
    }
  }
}

export const remarkCheckboxTag = buildTagProcessor('checkbox')
export const remarkRadioTag = buildTagProcessor('radio')
