// plugins/carousel.js
import { visit } from 'unist-util-visit'

export function remarkCarouselTag() {
  return (tree) => {
    console.log('\n=== Carousel Plugin 开始 ===')
    
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!node.children || node.children.length === 0) return
      
      // 检查是否包含 carousel 标签
      let hasCarouselStart = false
      let hasCarouselEnd = false
      let carouselData = null
      
      // 检查第一个文本节点是否包含开始标签
      if (node.children[0]?.type === 'text') {
        const firstText = node.children[0].value.trim()
        const startMatch = firstText.match(/^\{%\s*carousel\s+([^,%\s]+)\s*(?:,\s*([^%]*?))?\s*%}/)
        if (startMatch) {
          hasCarouselStart = true
          carouselData = {
            id: startMatch[1],
            name: startMatch[2] || 'carousel'
          }
        }
      }
      
      // 检查最后一个文本节点是否包含结束标签
      const lastChild = node.children[node.children.length - 1]
      if (lastChild?.type === 'text') {
        const lastText = lastChild.value.trim()
        if (lastText.endsWith('{% endcarousel %}')) {
          hasCarouselEnd = true
        }
      }
      
      // 如果同时包含开始和结束标签，处理整个节点
      if (hasCarouselStart && hasCarouselEnd && carouselData) {
        console.log('找到完整的 carousel 块，开始处理')
        
        // 收集图片
        const images = []
        for (const child of node.children) {
          if (child.type === 'image') {
            images.push(`<img src="${child.url}" alt="${child.alt || ''}">`)
          }
        }
        
        // 生成 HTML
        const html = `<div id='${carouselData.id}' class='carousel'>
  <div id="${carouselData.id}-drag-container" class="drag-container">
    <div id="${carouselData.id}-spin-container" class="spin-container">
      ${images.join('\n      ')}
      <p>${carouselData.name}</p>
    </div>
    <div id="${carouselData.id}-carousel-ground" class="carousel-ground"></div>
  </div>
</div>
<script type="text/javascript">carouselinit('${carouselData.id}');</script>`
        
        // 替换整个段落
        parent.children.splice(index, 1, {
          type: 'html',
          value: html
        })
        
        console.log(`Carousel ${carouselData.id} 处理完成`)
      }
    })
    
    console.log('=== Carousel Plugin 结束 ===\n')
  }
}