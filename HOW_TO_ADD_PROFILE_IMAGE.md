# 如何添加个人头像图片

## 方法 1: 将图片放到 public 目录（推荐）

1. **找到你的图片文件**（JPG、PNG 或 WebP 格式）

2. **将图片复制到以下目录**：
   ```
   frontend/public/zack-profile.jpg
   ```

3. **支持的图片文件名**（按优先级）：
   - `zack-profile.jpg` （首选）
   - `profile.jpg`
   - `zack.jpg`

4. **推荐图片尺寸**：150x150 像素或更大（会自动调整）

## 方法 2: 使用外部图片 URL

如果你想使用在线图片（如 Imgur、GitHub 等），可以修改代码：

1. 打开 `frontend/app/page.tsx`
2. 找到第 56 行的 `src="/zack-profile.jpg"`
3. 替换为你的图片 URL，例如：
   ```tsx
   src="https://your-image-url.com/image.jpg"
   ```

## 方法 3: 使用 Base64 编码

如果图片很小，也可以直接嵌入到代码中。

## 检查图片是否加载

- 打开浏览器开发者工具（F12）
- 查看 Console 标签，如果有图片加载错误会显示
- 查看 Network 标签，检查图片请求是否成功

## 当前状态

如果图片文件不存在，网站会显示默认的占位符图片。

