# Netlify Environment Variables Configuration

## 🔐 Required Environment Variables

Copy these variables to your Netlify dashboard:
**Site settings** → **Environment variables** → **Add variable**

---

### Database Configuration

```
DB_HOST = crossover.proxy.rlwy.net
```
*(Replace with your actual database host if using a different provider)*

```
DB_PORT = 3306
```
*(Replace with your actual database port, e.g., Railway TCP proxy port)*

```
DB_USER = root
```
*(Replace with your actual database username)*

```
DB_PASSWORD = your_actual_password
```
*(Replace with your actual database password)*

```
DB_NAME = railway
```
*(Replace with your actual database name)*

---

### JWT Secret

```
JWT_SECRET = XspyUMA7PNPRcCHpdis7AWoIllMW1cFHpihKlBRwWWs=
```

**⚠️ Important:** This is a generated secure random string. You can use it or generate a new one using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📝 How to Add Variables in Netlify

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **Add variable** for each variable above
4. Enter the **Key** (e.g., `DB_HOST`)
5. Enter the **Value** (e.g., `crossover.proxy.rlwy.net`)
6. Select the **Scopes** (usually select "All scopes" for production)
7. Click **Save**

---

## ✅ Verification Checklist

After adding all variables, verify:
- [ ] All 6 environment variables are added
- [ ] Values are correct (no typos)
- [ ] JWT_SECRET is a secure random string
- [ ] Database credentials match your database provider
- [ ] Variables are set for "Production" scope (or "All scopes")

---

## 🔄 After Adding Variables

1. **Redeploy** your site (Netlify will automatically redeploy when you add variables)
2. Or manually trigger a deploy: **Deploys** → **Trigger deploy** → **Deploy site**
3. Check build logs to ensure no environment variable errors
4. Test your site and admin panel functionality

---

## 🚨 Security Notes

- Never commit `.env` files to GitHub
- Never share your JWT_SECRET publicly
- Use different JWT_SECRET for production and development
- Regularly rotate database passwords
- Keep your Netlify dashboard secure with 2FA



