# 部署到新 GitHub 项目的指南

## 📋 步骤

### 1. 在 GitHub 上创建新仓库

1. 登录 GitHub
2. 点击右上角的 **"+"** → **"New repository"**
3. 填写仓库信息：
   - **Repository name**: 例如 `my-personal-website`
   - **Description**: 可选
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已有代码）
4. 点击 **"Create repository"**

### 2. 准备本地代码

确保所有更改已提交：

```bash
# 检查当前状态
git status

# 如果有未提交的更改，先提交
git add -A
git commit -m "Remove MySQL database, use local file-based storage"
```

### 3. 添加新的远程仓库

```bash
# 查看当前远程仓库
git remote -v

# 添加新的远程仓库（替换 YOUR_USERNAME 和 YOUR_REPO_NAME）
git remote add new-origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 或者如果你想替换现有的 origin
# git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### 4. 推送到新仓库

```bash
# 推送到新仓库
git push new-origin main

# 或者如果替换了 origin
# git push origin main
```

### 5. 在 Netlify 中设置新站点

1. 登录 Netlify 控制台
2. 点击 **"Add new site"** → **"Import an existing project"**
3. 选择 **"Deploy with GitHub"**
4. 选择你刚创建的新仓库
5. Netlify 会自动检测 `netlify.toml` 配置

### 6. 设置环境变量（可选）

在 Netlify 的 **Site settings** → **Environment variables** 中：

- `JWT_SECRET`: 一个安全的随机字符串（用于 JWT 签名）

**注意**：不再需要数据库相关的环境变量！

### 7. 部署

Netlify 会自动开始部署。等待构建完成即可。

## ✅ 完成后的检查清单

- [ ] 代码已推送到新的 GitHub 仓库
- [ ] Netlify 已连接到新仓库
- [ ] 构建成功
- [ ] 网站可以正常访问
- [ ] 可以使用默认凭据登录 admin 面板：
  - 用户名: `admin`
  - 密码: `admin123`

## 🔐 安全提示

1. **更改默认密码**：部署后，立即通过 admin 面板更改默认密码
2. **保护 admin.json**：确保 `frontend/data/admin.json` 在 `.gitignore` 中（已配置）
3. **JWT_SECRET**：在生产环境中设置一个强随机的 `JWT_SECRET`

## 📝 注意事项

- `frontend/data/admin.json` 文件包含敏感信息，已在 `.gitignore` 中
- 首次部署时，系统会自动创建默认的 admin 账户
- 内容存储在 `frontend/data/content.json` 中，可以通过 admin 面板编辑

