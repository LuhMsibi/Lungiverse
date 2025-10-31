# Firestore Data Model for Lungiverse

## Collections Structure

### 1. **users** Collection
```
users/{userId}
  - id: string (from Replit Auth, will be Firebase UID)
  - email: string
  - firstName: string
  - lastName: string
  - profileImageUrl: string
  - isAdmin: boolean
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 2. **tools** Collection
```
tools/{toolId}
  - id: number (preserved from PostgreSQL)
  - name: string
  - description: string
  - category: string
  - features: array<string>
  - isPaid: boolean
  - requiresAPI: boolean
  - url: string
  - usageCount: number
  - viewCount: number
  - averageRating: number
  - reviewCount: number
  - createdAt: timestamp
  - updatedAt: timestamp
```

### 3. **articles** Collection
```
articles/{articleId}
  - id: number (preserved from PostgreSQL)
  - title: string
  - slug: string (used for URL routing)
  - excerpt: string
  - content: string (HTML/Markdown)
  - coverImage: string (URL)
  - category: string
  - authorName: string
  - authorAvatar: string
  - publishedAt: timestamp
  - readTime: string
  - tags: array<string>
  - createdAt: timestamp
```

### 4. **favorites** Collection
```
favorites/{favoriteId}
  - id: number (preserved from PostgreSQL)
  - userId: string (reference to users)
  - toolId: number (reference to tools)
  - createdAt: timestamp
```

**Indexes:**
- Composite index: userId, toolId (for uniqueness and queries)

### 5. **reviews** Collection
```
reviews/{reviewId}
  - id: number (preserved from PostgreSQL)
  - userId: string (reference to users)
  - toolId: number (reference to tools)
  - rating: number (1-5)
  - comment: string
  - createdAt: timestamp
```

**Indexes:**
- Composite index: toolId, createdAt (for listing tool reviews)
- Composite index: userId, toolId (for user's review per tool)

### 6. **searchHistory** Collection
```
searchHistory/{searchId}
  - id: number (preserved from PostgreSQL)
  - userId: string (reference to users, nullable)
  - query: string
  - resultsCount: number
  - createdAt: timestamp
```

### 7. **analyticsEvents** Collection
```
analyticsEvents/{eventId}
  - id: number (preserved from PostgreSQL)
  - userId: string (nullable)
  - eventType: string
  - eventData: map (JSON object)
  - createdAt: timestamp
```

### 8. **contactMessages** Collection
```
contactMessages/{messageId}
  - id: number (preserved from PostgreSQL)
  - name: string
  - email: string
  - subject: string
  - message: string
  - status: string
  - createdAt: timestamp
```

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection - users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Tools collection - public read, admin write
    match /tools/{toolId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.isAdmin == true;
    }
    
    // Articles collection - public read, admin write
    match /articles/{articleId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.isAdmin == true;
    }
    
    // Favorites - users can manage their own
    match /favorites/{favoriteId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && 
                      resource.data.userId == request.auth.uid;
    }
    
    // Reviews - users can manage their own
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                              resource.data.userId == request.auth.uid;
    }
    
    // Search history - users can read/write their own
    match /searchHistory/{searchId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // Analytics - server-side only
    match /analyticsEvents/{eventId} {
      allow read: if request.auth != null && 
                    request.auth.token.isAdmin == true;
      allow write: if false; // Server-side only via Admin SDK
    }
    
    // Contact messages - admin only
    match /contactMessages/{messageId} {
      allow read, write: if request.auth != null && 
                           request.auth.token.isAdmin == true;
    }
  }
}
```

## Migration Notes

1. **Preserve IDs**: Keep original PostgreSQL IDs as document IDs (converted to strings for Firestore)
2. **Timestamps**: Convert PostgreSQL timestamps to Firestore Timestamp objects
3. **Arrays**: PostgreSQL JSONB arrays map directly to Firestore arrays
4. **References**: Use document IDs for relationships (no joins in Firestore)
5. **Admin Custom Claims**: Set `isAdmin: true` custom claim for admin user via Firebase Admin SDK
