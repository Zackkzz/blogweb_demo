# Netlify 环境变量配置表格

## ✅ 必需的环境变量

请在 Netlify 控制台的 **Site settings** → **Environment variables** 中添加以下所有变量：

| 序号 | 变量名 | 变量值示例 | 说明 | 是否必需 |
|------|--------|-----------|------|---------|
| 1 | `DB_HOST` | `crossover.proxy.rlwy.net` | 数据库服务器主机地址<br>（如果使用 Railway，通常是这个地址） | ✅ 必需 |
| 2 | `DB_PORT` | `3306` 或 `44546` | 数据库端口号<br>（Railway TCP 代理端口或标准 MySQL 端口） | ✅ 必需 |
| 3 | `DB_USER` | `root` | 数据库用户名 | ✅ 必需 |
| 4 | `DB_PASSWORD` | `你的实际密码` | 数据库密码<br>（请使用你的实际数据库密码） | ✅ 必需 |
| 5 | `DB_NAME` | `railway` 或 `your_database_name` | 数据库名称 | ✅ 必需 |
| 6 | `JWT_SECRET` | `XspyUMA7PNPRcCHpdis7AWoIllMW1cFHpihKlBRwWWs=` | JWT 认证密钥<br>（已为你生成，可直接使用） | ✅ 必需 |

---

## 📝 详细配置说明

### 数据库配置（变量 1-5）

如果你使用的是 **Railway** 数据库：
- `DB_HOST`: 通常是 `crossover.proxy.rlwy.net` 或你的 Railway 数据库主机
- `DB_PORT`: Railway TCP 代理端口（在你的 Railway 项目设置中查看）
- `DB_USER`: 你的 MySQL 用户名
- `DB_PASSWORD`: 你的 MySQL 密码
- `DB_NAME`: 你的数据库名称

如果你使用的是其他数据库服务（如 PlanetScale、Supabase 等）：
- 请根据你的数据库提供商提供的连接信息填写

### JWT 密钥（变量 6）

- `JWT_SECRET`: 用于用户认证和会话管理
- 已为你生成一个安全的随机字符串
- **重要**：请妥善保管，不要泄露

---

## 🔧 在 Netlify 中添加变量的步骤

1. 登录 Netlify 控制台
2. 选择你的站点
3. 点击 **Site settings**（站点设置）
4. 在左侧菜单中找到 **Environment variables**（环境变量）
5. 点击 **Add variable**（添加变量）
6. 对于每个变量：
   - 在 **Key** 字段输入变量名（如 `DB_HOST`）
   - 在 **Value** 字段输入变量值
   - 在 **Scopes** 中选择 **All scopes**（所有作用域）或 **Production**（生产环境）
   - 点击 **Save**（保存）
7. 重复步骤 5-6，添加所有 6 个变量

---

## ⚠️ 重要提示

1. **所有 6 个变量都必须添加**，缺少任何一个都会导致部署失败或功能异常
2. **变量值要准确**：请仔细检查你的数据库连接信息，确保没有拼写错误
3. **安全性**：
   - 不要在代码中硬编码这些值
   - 不要在公开的地方分享这些值
   - 定期更换密码和密钥
4. **作用域设置**：
   - 建议选择 **All scopes** 以确保在所有环境（生产、预览等）中都能使用
   - 或者分别为不同环境设置不同的值

---

## ✅ 验证清单

添加完所有变量后，请确认：

- [ ] 已添加 `DB_HOST`
- [ ] 已添加 `DB_PORT`
- [ ] 已添加 `DB_USER`
- [ ] 已添加 `DB_PASSWORD`
- [ ] 已添加 `DB_NAME`
- [ ] 已添加 `JWT_SECRET`
- [ ] 所有变量值都已正确填写
- [ ] 变量作用域已正确设置

---

## 🔄 添加变量后的操作

1. **自动重新部署**：Netlify 会在你添加环境变量后自动触发重新部署
2. **手动触发**：如果没有自动部署，可以手动点击 **Deploys** → **Trigger deploy** → **Deploy site**
3. **检查构建日志**：在 **Deploys** 页面查看构建日志，确认没有环境变量相关的错误

---

## 🆘 如果遇到问题

如果部署后仍然出现数据库连接错误：

1. **检查变量名**：确保变量名完全匹配（区分大小写）
2. **检查变量值**：确保没有多余的空格或特殊字符
3. **检查数据库访问**：确保你的数据库允许从 Netlify 的 IP 地址访问
4. **查看构建日志**：在 Netlify 的 Deploys 页面查看详细的错误信息

