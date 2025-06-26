# remark-hexo-tags

A Remark plugin that converts Hexo tag syntax to HTML for use in Astro projects.

## Installation

```bash
npm install remark-hexo-tags
```

## Usage

### In Astro (astro.config.mjs)

```javascript
import { defineConfig } from 'astro/config';
import remarkHexoTags from 'remark-hexo-tags';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkHexoTags],
  },
});
```

### Import Styles

```javascript
// In your main CSS file or component
import 'remark-hexo-tags/styles';
```

### Import Required Assets (if needed)

```javascript
// For carousel functionality
import 'remark-hexo-tags/assets/carousel-touch.js';

// For issues functionality  
import 'remark-hexo-tags/assets/issues.js';
```

## Supported Tags

### Content Tags
- `{% btns %}...{% endbtns %}` - Button groups
- `{% bubble text,note,color %}` - Bubble annotations
- `{% folding title %}...{% endfolding %}` - Collapsible content

### Media Tags
- `{% audio src %}` - Audio player
- `{% video src %}` - Video player
- `{% videos grid,2 %}...{% endvideos %}` - Video grid
- `{% carousel id,title %}...{% endcarousel %}` - Image carousel

### Form Elements
- `{% checkbox text %}` - Checkbox
- `{% radio text %}` - Radio button

### Cards and Links
- `{% ghcard username %}` - GitHub user card
- `{% link title,url,icon %}` - Link card
- `{% site title,url=...,screenshot=... %}` - Site card

### Text Formatting
- `{% u text %}` - Underline
- `{% emp text %}` - Emphasis
- `{% kbd key %}` - Keyboard key
- `{% del text %}` - Deleted text

### And many more...

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build assets
npm run build
```

## License

MIT