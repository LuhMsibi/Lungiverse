# Lungiverse Admin Guide

Complete guide for managing your AI tools platform through the admin interface.

---

## 📋 Table of Contents

1. [Accessing the Admin Panel](#accessing-the-admin-panel)
2. [Adding New AI Tools](#adding-new-ai-tools)
3. [Adding Articles](#adding-articles)
4. [Managing Users](#managing-users)
5. [Viewing Analytics](#viewing-analytics)

---

## 🔐 Accessing the Admin Panel

### Step 1: Set Yourself as Admin

**On your production site (after deployment):**

1. Sign in with your Google account or email/password
2. Open the Firebase Console: https://console.firebase.google.com/project/lungiverse-75fe3/firestore/data
3. Go to **Firestore Database** → **users** collection
4. Find your user document (search by your email)
5. Click **Edit** → Add a new field:
   - Field name: `isAdmin`
   - Type: `boolean`
   - Value: `true`
6. Click **Save**

**Or run this in Firebase Console (Functions tab):**

```javascript
const admin = require('firebase-admin');
const db = admin.firestore();

// Replace with your email
const email = 'your-email@example.com';

db.collection('users')
  .where('email', '==', email)
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      doc.ref.update({ isAdmin: true });
      console.log('Admin access granted!');
    });
  });
```

### Step 2: Access Admin Panel

1. Go to: `https://lungiverse.com/admin` (or `http://localhost:5000/admin` for local)
2. You'll see the admin dashboard with tools and articles management

---

## 🛠️ Adding New AI Tools

### Using the Admin Interface

1. **Navigate to Admin Panel**: Go to `/admin`
2. **Click "Add New Tool"** button
3. **Fill in the form:**

```
Tool Name: DALL-E 3
Description: Advanced AI image generation from OpenAI with improved prompt understanding
Category: Image AI (select from dropdown)
Features: (Add one at a time)
  - High-resolution image generation
  - Natural language prompts
  - Style variations
  - Image editing capabilities
Is Paid?: ✅ Yes
Requires API?: ✅ Yes
Website URL: https://openai.com/dall-e-3
```

4. **Click "Create Tool"**

### Manual Method (via Firebase Console)

1. Go to Firestore Database
2. Click **"users"** collection → **"tools"** collection
3. Click **"Add document"**
4. **Use auto-ID** or enter custom ID
5. Add these fields:

```javascript
{
  "id": 27,  // next available number
  "name": "DALL-E 3",
  "description": "Advanced AI image generation from OpenAI",
  "category": "Image AI",
  "features": ["High-resolution images", "Natural language prompts"],
  "isPaid": true,
  "requiresAPI": true,
  "url": "https://openai.com/dall-e-3",
  "viewCount": 0,
  "usageCount": 0,
  "averageRating": 0,
  "reviewCount": 0,
  "createdAt": <Firestore Timestamp>,
  "updatedAt": <Firestore Timestamp>
}
```

---

## 📝 Adding Articles

### Article Structure

Articles support **Markdown** and **HTML** for rich formatting.

### Step 1: Prepare Your Article Content

**Example Article:**

```markdown
# How to Choose the Right AI Tool for Your Business

![AI Tools Comparison](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200)

## Introduction

In 2025, the AI tools landscape has exploded with hundreds of options. Choosing the right tool for your business can be overwhelming. This guide will help you make an informed decision.

## Key Considerations

### 1. Define Your Use Case

Before selecting an AI tool, clearly identify your needs:

- **Content Creation**: Use tools like Jasper AI or Copy.ai
- **Image Generation**: Consider DALL-E 3 or Midjourney
- **Code Assistance**: GitHub Copilot or Cursor
- **Data Analysis**: Claude or GPT-4

### 2. Budget Planning

AI tools range from free to enterprise-level pricing:

| Tool Category | Average Cost | Best For |
|--------------|--------------|----------|
| Text AI | $20-50/month | Small businesses |
| Image AI | $10-30/month | Freelancers |
| Code AI | $10-20/month | Developers |

### 3. Integration Requirements

Check if the tool integrates with your existing stack:

- API availability
- Plugin support
- Webhook capabilities

## Conclusion

The best AI tool is one that matches your specific needs and budget. Start with free trials before committing.

---

**About the Author**: Lungisani, founder of Lungiverse
```

### Step 2: Add Article via Admin Panel

1. **Navigate to**: `/admin`
2. **Click "Add New Article"**
3. **Fill in the form:**

```
Title: How to Choose the Right AI Tool for Your Business
Slug: choosing-right-ai-tool-2025
Excerpt: A comprehensive guide to selecting the perfect AI tool for your business needs in 2025
Content: [Paste your Markdown/HTML content]
Category: Guides
Author Name: Lungisani
Author Avatar URL: [Optional - leave blank or use image URL]
Tags: AI Tools, Business, Guide, Decision Making
Cover Image: https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200
Read Time: 8 min read
```

4. **Click "Publish Article"**

### Adding Images to Articles

**Option 1: Use Unsplash (Free Stock Photos)**

```markdown
![Alt Text](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop)
```

**Option 2: Upload to Firebase Storage**

1. Go to Firebase Console → **Storage**
2. Click **Upload file**
3. Upload your image
4. Click the image → **Get download URL**
5. Use the URL in your article:

```markdown
![My Custom Image](https://firebasestorage.googleapis.com/v0/b/lungiverse-75fe3.appspot.com/o/articles%2Fmy-image.jpg?alt=media&token=xxx)
```

**Option 3: Use HTML for More Control**

```html
<div class="my-8">
  <img 
    src="https://images.unsplash.com/photo-1677442136019-21780ecad995" 
    alt="AI Tools Dashboard" 
    class="rounded-lg shadow-lg w-full"
  />
  <p class="text-sm text-center text-muted-foreground mt-2">
    Modern AI tools dashboard interface
  </p>
</div>
```

### Step 3: Manual Method (Firestore)

```javascript
{
  "id": 6,  // next available number
  "title": "How to Choose the Right AI Tool",
  "slug": "choosing-right-ai-tool-2025",
  "excerpt": "A comprehensive guide to selecting...",
  "content": "<p>Your HTML or Markdown content here...</p>",
  "coverImage": "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  "category": "Guides",
  "author": {
    "name": "Lungisani",
    "avatar": ""
  },
  "publishedAt": "2025-01-15T10:00:00.000Z",
  "readTime": "8 min read",
  "tags": ["AI Tools", "Business", "Guide"],
  "createdAt": <Firestore Timestamp>
}
```

---

## 👥 Managing Users

### Promote User to Admin

**Method 1: Firebase Console**

1. Go to **Firestore** → **users** collection
2. Find the user by email
3. Edit document → Add field `isAdmin: true`

**Method 2: Firebase Functions (Bulk)**

```javascript
const admin = require('firebase-admin');
const db = admin.firestore();

async function makeAdmin(email) {
  const snapshot = await db.collection('users')
    .where('email', '==', email)
    .get();
    
  snapshot.forEach(doc => {
    doc.ref.update({ isAdmin: true });
  });
}

makeAdmin('user@example.com');
```

### View All Users

1. Go to **Firebase Console** → **Authentication**
2. See all registered users
3. Click user → **Disable account** if needed

---

## 📊 Viewing Analytics

### Tool Analytics

**View in Admin Panel:**

1. Go to `/admin`
2. See **Top Tools** section showing:
   - View count
   - Usage count
   - Average rating
   - Review count

**View in Firestore:**

1. Go to **Firestore** → **tools** collection
2. Sort by `viewCount` or `usageCount`

### Article Analytics

Check article performance:

```
- Total views (coming soon)
- Read time average
- Popular tags
```

---

## 🎨 Article Formatting Tips

### Use Headings for Structure

```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection (H3)
```

### Add Code Blocks

```markdown
\```javascript
const tool = {
  name: "ChatGPT",
  category: "Text AI"
};
\```
```

### Create Lists

```markdown
**Unordered:**
- Item 1
- Item 2

**Ordered:**
1. First
2. Second
```

### Add Blockquotes

```markdown
> "AI is the new electricity" - Andrew Ng
```

### Insert Tables

```markdown
| Tool | Category | Price |
|------|----------|-------|
| ChatGPT | Text AI | $20/mo |
| DALL-E 3 | Image AI | $30/mo |
```

---

## 🚀 Quick Reference Examples

### Example Tool Entry

**Product Hunt Style:**

```
Name: Cursor
Description: The AI-first code editor that writes, edits, and understands your codebase
Category: Code AI
Features:
  - AI pair programming
  - Codebase-aware chat
  - Multi-file editing
  - Terminal integration
Is Paid: Yes ($20/month)
Requires API: No
URL: https://cursor.sh
```

### Example Article Entry

**Tutorial Style:**

```
Title: Building Your First AI App in 2025
Slug: building-first-ai-app-2025
Excerpt: Step-by-step guide to creating your first AI-powered application
Category: Tutorials
Author: Lungisani
Tags: Tutorial, AI, Development, Beginners
Read Time: 12 min read
Cover Image: https://images.unsplash.com/photo-1555949963-ff9fe0c870eb

Content:
# Building Your First AI App in 2025

## What You'll Build
A simple chatbot using OpenAI's API...

[Full content with code examples and screenshots]
```

---

## ⚠️ Important Notes

1. **Always preview articles** before publishing
2. **Use high-quality images** (1200x600px recommended for cover images)
3. **Keep slugs URL-friendly** (lowercase, hyphens only)
4. **Test links** before publishing
5. **Back up Firestore** regularly via Firebase Console

---

## 🆘 Need Help?

- **Firebase Console**: https://console.firebase.google.com/project/lungiverse-75fe3
- **Markdown Guide**: https://www.markdownguide.org
- **Unsplash (Free Images)**: https://unsplash.com
- **HTML Reference**: https://developer.mozilla.org/en-US/docs/Web/HTML

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
