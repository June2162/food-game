# 山海关乡土美食科普小游戏

这是一个用于大学生“三下乡”实践展示的 HTML5 + JavaScript 乡土美食科普小游戏，主题为秦皇岛山海关本地小吃宣传。

## 功能

- 美食闯关：桲椤叶饼、山海关冰糕、花生糕三个独立关卡
- 每关 4-5 个制作步骤
- 选错后弹出纠错提示
- 选对后弹出食材科普和民俗故事
- 通关后解锁地图点位高亮
- 美食地图支持纯浏览模式，未通关也可查看门店信息
- 移动端竖屏适配
- 无广告、无登录、无付费功能

## 文件结构

```text
qinhuangdao_food_game/
  index.html        页面结构
  style.css         国风移动端样式
  data.js           美食、关卡、门店、地图点位数据
  app.js            游戏交互逻辑
  assets/
    images/         替换实拍照片的位置
    audio/          可选音效位置
  docs/
    wechat-publish-guide.md
```

## 如何本地打开

最简单方式：双击 `index.html`，用浏览器打开。

推荐方式：在 VS Code 中安装 Live Server 插件，然后右键 `index.html`，选择 `Open with Live Server`。

## 文案在哪里改

主要改这里：

```text
data.js
```

可替换内容包括：

- 小吃介绍
- 制作步骤
- 错误提示
- 食材科普
- 本地民俗故事
- 门店名称
- 门店地址
- 营业时间
- 特色点评
- 地图点位位置

## 图片在哪里换

把图片放进：

```text
assets/images/
```

例如：

```text
assets/images/boluoye-store.jpg
```

然后在 `data.js` 中找到：

```js
photo: ''
```

改成：

```js
photo: './assets/images/boluoye-store.jpg'
```

## 地图底图怎么换

当前地图是 CSS 绘制的简易区位图，不依赖第三方地图。

如果后续想换成真实手绘底图，可以在 `style.css` 的 `.simple-map` 中添加背景图：

```css
background-image: url('./assets/images/map-bg.jpg');
background-size: cover;
background-position: center;
```

然后根据图片调整 `data.js` 里的点位：

```js
mapPosition: { x: 28, y: 54 }
```

`x` 是从左到右百分比，`y` 是从上到下百分比。

## 二维码怎么生成

### 方式一：部署后生成二维码

把项目发布到任意 H5 静态托管平台后，复制访问链接，到任意二维码生成工具生成二维码即可。

常见平台：

- GitHub Pages
- Gitee Pages
- Netlify
- Vercel
- 微信云托管静态网站

### 方式二：微信公众平台二维码

如果发布为微信小程序或小游戏，提交审核通过后，微信后台会提供体验二维码和正式访问二维码。

### 方式三：线下本地演示二维码

如果只是校内或社区同 Wi-Fi 演示，可以用电脑局域网 IP 生成二维码，例如：

```text
http://电脑IP:端口号
```

但这种方式要求手机和电脑在同一网络下，不适合长期张贴。
