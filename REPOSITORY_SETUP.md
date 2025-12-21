# 仓库设置指南

## 目标
1. 将当前仓库 `blog_noDB` 设为私有（包含真实账号密码）
2. 创建一个新的公开仓库用于展示项目（使用默认账号密码）

## 步骤 1: 将当前仓库设为私有

1. 访问 GitHub: https://github.com/LinghuCh0ng/blog_noDB
2. 点击仓库右上角的 **Settings**（设置）
3. 在左侧菜单中找到 **General**（常规）
4. 滚动到页面底部的 **Danger Zone**（危险区域）
5. 点击 **Change repository visibility**（更改仓库可见性）
6. 选择 **Make private**（设为私有）
7. 按照提示确认操作

## 步骤 2: 创建新的公开仓库

1. 访问 GitHub: https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `blog_noDB_public` (或你喜欢的名字)
   - **Description**: Personal blog website project
   - **Visibility**: 选择 **Public**（公开）
   - **不要**勾选 "Initialize this repository with a README"
3. 点击 **Create repository**

## 步骤 3: 推送代码到新仓库

在项目目录下执行以下命令：

```bash
# 添加新的远程仓库
git remote add public-origin https://github.com/LinghuCh0ng/blog_noDB_public.git

# 推送代码到新仓库
git push public-origin main
```

## 当前状态

- ✅ `admin.json` 已恢复为默认值（admin/admin123）
- ✅ 登录页面已恢复默认提示信息
- ✅ 代码已准备好推送到公开仓库

## 注意事项

- 当前仓库 `blog_noDB` 仍包含你的真实账号密码，请尽快设为私有
- 新仓库将使用默认账号密码，适合公开展示
- `admin.json` 文件已在 `.gitignore` 中，不会被推送到仓库

