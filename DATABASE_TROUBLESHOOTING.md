# 数据库连接问题排查指南

## 🔍 常见错误及解决方案

### 错误 1: "Database environment not configured"
**原因**：环境变量未设置或设置不正确

**解决方案**：
1. 登录 Netlify 控制台
2. 进入 **Site settings** → **Environment variables**
3. 确认以下变量都已设置：
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`

### 错误 2: "Cannot connect to database server"
**原因**：无法连接到数据库服务器

**可能的原因**：
1. 数据库主机地址错误
2. 数据库端口错误
3. 数据库服务器不允许从 Netlify 的 IP 地址访问
4. 防火墙阻止连接

**解决方案**：
1. **检查数据库主机和端口**：
   - 如果使用 Railway，确保使用正确的 TCP 代理地址和端口
   - 如果使用其他服务，检查连接字符串

2. **允许外部连接**：
   - Railway：默认允许外部连接
   - 其他 MySQL 服务：确保允许从任何 IP 访问（或添加 Netlify 的 IP 范围）

3. **检查防火墙设置**：
   - 确保数据库端口（通常是 3306）没有被阻止

### 错误 3: "Database authentication failed"
**原因**：数据库用户名或密码错误

**解决方案**：
1. 检查 `DB_USER` 和 `DB_PASSWORD` 环境变量
2. 确保没有多余的空格或特殊字符
3. 尝试在本地使用相同的凭据连接数据库

### 错误 4: "Database not found"
**原因**：数据库名称错误或数据库不存在

**解决方案**：
1. 检查 `DB_NAME` 环境变量
2. 确认数据库已创建
3. 如果使用 Railway，数据库名称通常是 `railway`

### 错误 5: "Table 'zack' doesn't exist"
**原因**：数据库表未创建

**解决方案**：
- 登录 API 现在会自动创建表（如果不存在）
- 如果仍然失败，可以手动运行 SQL：
  ```sql
  CREATE TABLE IF NOT EXISTS zack (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE
  );
  ```

## 🔧 测试数据库连接

### 方法 1: 使用 MySQL 客户端
```bash
mysql -h YOUR_DB_HOST -P YOUR_DB_PORT -u YOUR_DB_USER -p YOUR_DB_NAME
```

### 方法 2: 检查 Netlify 函数日志
1. 进入 Netlify 控制台
2. 点击 **Functions** 或 **Deploys**
3. 查看最新的函数日志
4. 查找数据库连接相关的错误信息

### 方法 3: 使用 Railway 控制台
如果使用 Railway：
1. 登录 Railway 控制台
2. 检查数据库服务的状态
3. 查看连接信息（Variables 标签）
4. 确认 TCP 代理已启用

## 📝 环境变量检查清单

在 Netlify 中确认以下变量：

- [ ] `DB_HOST` - 数据库主机地址（例如：`crossover.proxy.rlwy.net`）
- [ ] `DB_PORT` - 数据库端口（例如：`3306` 或 Railway TCP 代理端口）
- [ ] `DB_USER` - 数据库用户名（例如：`root`）
- [ ] `DB_PASSWORD` - 数据库密码
- [ ] `DB_NAME` - 数据库名称（例如：`railway`）
- [ ] `JWT_SECRET` - JWT 密钥

## 🚨 重要提示

1. **环境变量区分大小写**：确保变量名完全匹配
2. **不要有空格**：变量值前后不要有多余的空格
3. **重新部署**：修改环境变量后，需要重新部署站点
4. **检查作用域**：确保变量设置为 "All scopes" 或 "Production"

## 🔄 重新部署步骤

1. 在 Netlify 中修改环境变量
2. 进入 **Deploys** 页面
3. 点击 **Trigger deploy** → **Deploy site**
4. 等待部署完成
5. 再次尝试登录

## 📞 获取帮助

如果问题仍然存在：
1. 检查 Netlify 函数日志中的详细错误信息
2. 确认数据库服务正在运行
3. 验证网络连接和防火墙设置
4. 联系数据库服务提供商的支持团队

