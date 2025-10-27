# Production Database Setup Guide

## 🔍 **Why Articles and Tools Don't Show on Your Published Site**

Your **development** database has 26 tools and 5 articles (seeded automatically).
Your **production** database is **EMPTY** - no tools, no articles!

Replit uses **separate databases** for development and production for safety.

---

## ✅ **Solution: Two Options**

### **Option 1: Use the Admin Panel (Recommended)**

This lets you control exactly which tools/articles appear on your live site.

#### **Step 1: Make Yourself an Admin**

1. **In Replit**, click the **Database** tab (left sidebar)
2. **Switch to "Production"** database (top-right dropdown)
3. Click **"Run SQL Query"**
4. **Paste this** (replace with YOUR email):

```sql
UPDATE users SET is_admin = true WHERE email = 'YOUR_EMAIL@gmail.com';
```

5. Click **"Run"**
6. **Verify** by running:

```sql
SELECT id, email, name, is_admin FROM users;
```

#### **Step 2: Add Tools and Articles**

1. **Go to**: https://lungiverse.com/admin
2. **Log in** with your account
3. **Add tools** one by one using the form (or copy from development)
4. **Add articles** one by one using the form

**Tip**: Open your **development site** in another tab to copy tool/article details!

---

### **Option 2: Run Seed Script on Production**

This copies ALL 26 tools and 5 articles to production instantly.

#### **Steps**:

1. **Create a production seed script** at `server/seedProduction.ts`:

```typescript
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../shared/schema";

// Use PRODUCTION database URL
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Import seed data from seed.ts
import { toolsData, articlesData } from "./seed";

async function seedProduction() {
  console.log("🌱 Seeding PRODUCTION database...");
  
  try {
    await db.insert(schema.tools).values(toolsData);
    console.log(`✅ Inserted ${toolsData.length} tools`);
    
    await db.insert(schema.articles).values(articlesData);
    console.log(`✅ Inserted ${articlesData.length} articles`);
    
    console.log("✨ Production database seeded!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

seedProduction();
```

2. **Add to package.json**:

```json
{
  "scripts": {
    "seed:production": "NODE_ENV=production tsx server/seedProduction.ts"
  }
}
```

3. **Run it** in the Shell tab:

```bash
npm run seed:production
```

---

## 🎯 **Recommended Approach**

Use **Option 1** (Admin Panel) if you want to:
- Customize which tools appear on your live site
- Add tools gradually
- Keep development and production separate

Use **Option 2** (Seed Script) if you want to:
- Quickly populate your production site
- Match development exactly
- Get tools/articles live ASAP

---

## 📱 **After Adding Data**

1. **Visit** https://lungiverse.com
2. **Refresh** the page
3. **Tools and articles should now appear!**

---

## ⚠️ **Important Notes**

- **Never delete** the development database - it's separate from production
- **Production changes** won't affect development (and vice versa)
- **Making yourself admin** is safe - you're the owner!
- **Seed data** includes real AI tools like ChatGPT, DALL-E, Midjourney, etc.

---

## 🆘 **Need Help?**

If you run into issues:
1. Check you're connected to the **production** database
2. Verify your admin status with the SQL query above
3. Check browser console for errors (F12)
4. Let me know and I'll help debug!
