这里是普通内容

{% btns %}
点击下面的按钮试试：
{% endbtns %}

{% bubble 你好,注解,#ffcccc %}

{% carousel car1,我的旋转木马 %}
![](/img/1.jpg)
![](/img/2.jpg)
{% endcarousel %}

{% checkbox 这是一个选框 %}
{% checkbox checked, 已选中 %}
{% checkbox red checked, 红色样式的已选框 %}

{% radio 这是一个单选框 %}
{% radio checked, 默认选中单选框 %}

{% folding color:red, 折叠标题 %}
这里是折叠内容，支持 **markdown**。
{% endfolding %}

{% bdage '你好,世界' %}

{% bdage 'Node.js,LTS,node.js'||green %}

{% bdage 'GitHub,Follow,github'||'#181717',https://github.com/your-username,关注我吧||style=flat-square %}

单个用户卡片：
{% ghcard volantis-x %}

带参数的仓库卡片：
{% ghcard volantis-x/hexo-theme-volantis, theme=dark %}

卡片组：
{% ghcardgroup %}
{% ghcard user1 %}
{% ghcard user2/repo1 %}
{% endghcardgroup %}

这是一个段落，里面有一个自定义图标 {% icon icon-home,1.5 %}，图标大小为 1.5em。

这是一个块级图片，带有背景色和标题：

{% image /path/to/your/image.jpg, alt=美丽的风景, bg=#f0f0f0, width=80% %}

这是一段文字，其中有一个行内小图 {% inlineimage /path/to/icon.png, height=2em %}，用于点缀。

这是一段带 {% u 下划线 %} 的文字。
这里有一个需要 {% emp 强调的词 %}。
请按 {% kbd Ctrl %} + {% kbd C %} 来复制。
这段文字是 {% del 删除的 %}。

{% issues sites | api=https://my-api/issues %}

{% issues sites/timeline/friends | api=https://api.github.com/repos/user/repo/issues | group=key:a,b,c %}

{% linkgroup %}
{% link Google, https://google.com, https://www.google.com/s2/favicons?domain=google.com %}
{% link Amazon, https://amazon.com, https://www.google.com/s2/favicons?domain=amazon.com %}
{% endlinkgroup %}

### 1. 媒体 (audio, video, videos)

下面是一个音频播放器。

{% audio /music/test.mp3 %}

下面是一个视频组，分两列显示。

{% videos grid,2 %}
{% video /video/movie1.mp4 %}
{% video /video/movie2.mp4 %}
{% endvideos %}

---

### 2. 注释 (nota)

带有注释的文本：{% nota 这是被注释的词,这是对这个词的详细解释 %}

---

### 3. 诗歌 (poem)

一首诗：

{% poem 静夜思,李白 %}
床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。
{% endpoem %}

---

### 4. 进度条 (progress)

进度条：{% progress 75,green,加载中... %}

---

### 5. 参考文献 (referto, referfrom)

在这里我们引用一篇文献{% referto 1, "A. Einstein, B. Podolsky, and N. Rosen, Can Quantum-Mechanical Description of Physical Reality Be Considered Complete?, Phys. Rev. 47, 777 (1935)" %}。

然后在文末列出参考文献来源。

{% referfrom 1, "A. Einstein et al., Phys. Rev. 47, 777", https://journals.aps.org/pr/abstract/10.1103/PhysRev.47.777 %}


{% sitegroup 我的网站收藏 %}
{% site 谷歌, url=https://google.com, screenshot=https://example.com/google.png, avatar=https://example.com/google-icon.png, description=世界上最好的搜索引擎 %}
{% site 百度, url=https://baidu.com, screenshot=https://example.com/baidu.png, description=中国最大的搜索引擎 %}
{% endsitegroup %}

这是一个段落标签：{% p center, 居中的段落文本 %}

这是一个行内标签：{% span red, 红色文本 %}

{% tip warning %}
这是一个警告提示框，支持 **markdown** 语法。
{% endtip %}

{% tip %}
这是一个默认的提示框。
{% endtip %}