
// index.js - 最终修正版
import { remarkFoldingPlugin } from './plugins/folding.js';
import { remarkGhcardgroupPlugin } from './plugins/ghcardgroup.js';
import { remarkBtnsPlugin } from './plugins/btns.js';
import { remarkCarouselTag } from './plugins/carousel.js';
import { remarkCheckboxTag, remarkRadioTag } from './plugins/checkbox.js';
import { remarkBdagePlugin } from './plugins/ghbdage.js';
import { remarkGhcardPlugin } from './plugins/ghcard.js';
import { remarkImagePlugin } from './plugins/image.js';
import { remarkBubbleTag } from './plugins/bubble.js';
import { remarkIconPlugin } from './plugins/iconfont.js';
import { remarkInlineImagePlugin } from './plugins/inline-image.js';
import { 
  remarkUPlugin,
  remarkEmpPlugin,
  remarkWavyPlugin,
  remarkDelPlugin,
  remarkKbdPlugin,
  remarkPswPlugin
} from './plugins/inline-labels.js';
import { remarkIssuesPlugin } from './plugins/issues.js';
import { remarkLinkPlugin } from './plugins/link.js';
import { remarkLinkgroupPlugin } from './plugins/link-group.js'; // 注意这里的导入名
import { remarkAudioPlugin, remarkVideoPlugin, remarkVideosPlugin } from './plugins/media.js';
import { remarkNotaPlugin } from './plugins/notation.js'; // 注意这里的导入名
import { remarkPoemPlugin } from './plugins/poem.js';
import { remarkProgressPlugin } from './plugins/progress.js';
import { remarkRefertoPlugin, remarkReferfromPlugin } from './plugins/reference.js';
import { remarkSitecardPlugin, remarkSitegroupPlugin } from './plugins/site.js';
import { remarkPTagPlugin, remarkSpanTagPlugin } from './plugins/span.js';
import { remarkTipPlugin, remarkTipPluginDebug } from './plugins/tip.js';

export default function remarkHexoTagPlugins(options = {}) {
  const processor = this;
  
  const attacher = (tree, file) => {
    file.data = file.data || {};
    file.data.options = options;
    transformer(tree, file);
  }
  
  const transformer = (tree, file) => {
    // ===== 第一阶段：大型块级容器 =====
    remarkSitegroupPlugin(processor)(tree, file);
    remarkPoemPlugin(processor)(tree, file);
    remarkFoldingPlugin(processor)(tree, file);
    remarkGhcardgroupPlugin(processor)(tree, file);
    remarkLinkgroupPlugin(processor)(tree, file);
    remarkVideosPlugin(processor)(tree, file);  // 先处理 videos 容器
    
    // ===== 第二阶段：块级标签 =====
    remarkProgressPlugin(processor)(tree, file);
    remarkTipPlugin()(tree, file);
    remarkCarouselTag()(tree, file);
    remarkIssuesPlugin()(tree, file);
    remarkAudioPlugin()(tree, file);
    remarkVideoPlugin()(tree, file);  // 再处理单独的 video 标签（包括 videos 内的）
    
    // ===== 第三阶段：段落级标签 =====
    remarkCheckboxTag()(tree, file);
    remarkSitecardPlugin()(tree, file);
    remarkRadioTag()(tree, file);
    remarkImagePlugin()(tree, file);
    remarkLinkPlugin(options)(tree, file);
    remarkGhcardPlugin(options)(tree, file);
    remarkBdagePlugin()(tree, file);
    
    // ===== 第四阶段：内联标签 =====
    remarkPTagPlugin()(tree, file);
    remarkSpanTagPlugin()(tree, file);
    remarkBtnsPlugin()(tree, file);
    remarkBubbleTag()(tree, file);
    remarkIconPlugin()(tree, file);
    remarkInlineImagePlugin()(tree, file);
    remarkNotaPlugin()(tree, file);
    remarkRefertoPlugin()(tree, file);
    remarkReferfromPlugin()(tree, file);
    
    // ===== 第五阶段：文本样式标签 =====
    remarkUPlugin()(tree, file);
    remarkEmpPlugin()(tree, file);
    remarkWavyPlugin()(tree, file);
    remarkDelPlugin()(tree, file);
    remarkKbdPlugin()(tree, file);
    remarkPswPlugin()(tree, file);
  };
  
  return attacher;
}