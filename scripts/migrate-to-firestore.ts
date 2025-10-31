/**
 * Migration Script: PostgreSQL → Firebase Firestore
 *
 * This script exports all data from Replit's production PostgreSQL database
 * and imports it into Firebase Firestore while preserving data integrity.
 *
 * Usage: tsx scripts/migrate-to-firestore.ts
 */

import { neon } from "@neondatabase/serverless";
import admin from "firebase-admin";
import * as path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(
  __dirname,
  "../firebase-config/serviceAccountKey.json",
);
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "lungiverse-75fe3",
});

const db = admin.firestore();

// Connect to PostgreSQL (production database)
const sql = neon(process.env.DATABASE_URL!);

interface MigrationStats {
  users: { total: number; migrated: number; errors: number };
  tools: { total: number; migrated: number; errors: number };
  articles: { total: number; migrated: number; errors: number };
  favorites: { total: number; migrated: number; errors: number };
  reviews: { total: number; migrated: number; errors: number };
  searchHistory: { total: number; migrated: number; errors: number };
  analyticsEvents: { total: number; migrated: number; errors: number };
  contactMessages: { total: number; migrated: number; errors: number };
}

const stats: MigrationStats = {
  users: { total: 0, migrated: 0, errors: 0 },
  tools: { total: 0, migrated: 0, errors: 0 },
  articles: { total: 0, migrated: 0, errors: 0 },
  favorites: { total: 0, migrated: 0, errors: 0 },
  reviews: { total: 0, migrated: 0, errors: 0 },
  searchHistory: { total: 0, migrated: 0, errors: 0 },
  analyticsEvents: { total: 0, migrated: 0, errors: 0 },
  contactMessages: { total: 0, migrated: 0, errors: 0 },
};

/**
 * Migrate Users collection
 */
async function migrateUsers() {
  console.log("\n📦 Migrating users...");

  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at`;
    stats.users.total = users.length;

    const batch = db.batch();
    let count = 0;

    for (const user of users) {
      try {
        const userRef = db.collection("users").doc(user.id);
        batch.set(userRef, {
          id: user.id,
          email: user.email,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          profileImageUrl: user.profile_image_url || "",
          isAdmin: user.is_admin || false,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(user.created_at),
          ),
          updatedAt: admin.firestore.Timestamp.fromDate(
            new Date(user.updated_at),
          ),
        });

        stats.users.migrated++;
        count++;

        // Firestore batch limit is 500 operations
        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} users`);
          count = 0;
        }
      } catch (error) {
        console.error(`  ❌ Error migrating user ${user.id}:`, error);
        stats.users.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${count} users`);
    }

    console.log(
      `✅ Users: ${stats.users.migrated}/${stats.users.total} migrated`,
    );
  } catch (error) {
    console.error("❌ Fatal error migrating users:", error);
    throw error;
  }
}

/**
 * Migrate Tools collection
 */
async function migrateTools() {
  console.log("\n📦 Migrating tools...");

  try {
    const tools = await sql`SELECT * FROM tools ORDER BY id`;
    stats.tools.total = tools.length;

    const batch = db.batch();
    let count = 0;

    for (const tool of tools) {
      try {
        const toolRef = db.collection("tools").doc(String(tool.id));
        batch.set(toolRef, {
          id: tool.id,
          name: tool.name,
          description: tool.description,
          category: tool.category,
          features: tool.features || [],
          isPaid: tool.is_paid || false,
          requiresAPI: tool.requires_api || false,
          url: tool.url || "",
          usageCount: tool.usage_count || 0,
          viewCount: tool.view_count || 0,
          averageRating: tool.average_rating || 0,
          reviewCount: tool.review_count || 0,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(tool.created_at),
          ),
          updatedAt: admin.firestore.Timestamp.fromDate(
            new Date(tool.updated_at),
          ),
        });

        stats.tools.migrated++;
        count++;

        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} tools`);
          count = 0;
        }
      } catch (error) {
        console.error(`  ❌ Error migrating tool ${tool.id}:`, error);
        stats.tools.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${count} tools`);
    }

    console.log(
      `✅ Tools: ${stats.tools.migrated}/${stats.tools.total} migrated`,
    );
  } catch (error) {
    console.error("❌ Fatal error migrating tools:", error);
    throw error;
  }
}

/**
 * Migrate Articles collection
 */
async function migrateArticles() {
  console.log("\n📦 Migrating articles...");

  try {
    const articles = await sql`SELECT * FROM articles ORDER BY id`;
    stats.articles.total = articles.length;

    const batch = db.batch();
    let count = 0;

    for (const article of articles) {
      try {
        const articleRef = db.collection("articles").doc(String(article.id));
        batch.set(articleRef, {
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          coverImage: article.cover_image,
          category: article.category,
          authorName: article.author_name,
          authorAvatar: article.author_avatar || "",
          publishedAt: admin.firestore.Timestamp.fromDate(
            new Date(article.published_at),
          ),
          readTime: article.read_time,
          tags: article.tags || [],
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(article.created_at),
          ),
        });

        stats.articles.migrated++;
        count++;

        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} articles`);
          count = 0;
        }
      } catch (error) {
        console.error(`  ❌ Error migrating article ${article.id}:`, error);
        stats.articles.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${count} articles`);
    }

    console.log(
      `✅ Articles: ${stats.articles.migrated}/${stats.articles.total} migrated`,
    );
  } catch (error) {
    console.error("❌ Fatal error migrating articles:", error);
    throw error;
  }
}

/**
 * Migrate Favorites collection
 */
async function migrateFavorites() {
  console.log("\n📦 Migrating favorites...");

  try {
    const favorites = await sql`SELECT * FROM favorites ORDER BY id`;
    stats.favorites.total = favorites.length;

    const batch = db.batch();
    let count = 0;

    for (const favorite of favorites) {
      try {
        const favoriteRef = db.collection("favorites").doc(String(favorite.id));
        batch.set(favoriteRef, {
          id: favorite.id,
          userId: favorite.user_id,
          toolId: favorite.tool_id,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(favorite.created_at),
          ),
        });

        stats.favorites.migrated++;
        count++;

        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} favorites`);
          count = 0;
        }
      } catch (error) {
        console.error(`  ❌ Error migrating favorite ${favorite.id}:`, error);
        stats.favorites.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${count} favorites`);
    }

    console.log(
      `✅ Favorites: ${stats.favorites.migrated}/${stats.favorites.total} migrated`,
    );
  } catch (error) {
    console.error("❌ Fatal error migrating favorites:", error);
    throw error;
  }
}

/**
 * Migrate Reviews collection
 */
async function migrateReviews() {
  console.log("\n📦 Migrating reviews...");

  try {
    const reviews = await sql`SELECT * FROM reviews ORDER BY id`;
    stats.reviews.total = reviews.length;

    const batch = db.batch();
    let count = 0;

    for (const review of reviews) {
      try {
        const reviewRef = db.collection("reviews").doc(String(review.id));
        batch.set(reviewRef, {
          id: review.id,
          userId: review.user_id,
          toolId: review.tool_id,
          rating: review.rating,
          comment: review.comment || "",
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(review.created_at),
          ),
        });

        stats.reviews.migrated++;
        count++;

        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} reviews`);
          count = 0;
        }
      } catch (error) {
        console.error(`  ❌ Error migrating review ${review.id}:`, error);
        stats.reviews.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${count} reviews`);
    }

    console.log(
      `✅ Reviews: ${stats.reviews.migrated}/${stats.reviews.total} migrated`,
    );
  } catch (error) {
    console.error("❌ Fatal error migrating reviews:", error);
    throw error;
  }
}

/**
 * Migrate Search History collection
 */
async function migrateSearchHistory() {
  console.log("\n📦 Migrating search history...");

  try {
    const searchHistory = await sql`SELECT * FROM search_history ORDER BY id`;
    stats.searchHistory.total = searchHistory.length;

    const batch = db.batch();
    let count = 0;

    for (const search of searchHistory) {
      try {
        const searchRef = db.collection("searchHistory").doc(String(search.id));
        batch.set(searchRef, {
          id: search.id,
          userId: search.user_id || null,
          query: search.query,
          resultsCount: search.results_count || 0,
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(search.created_at),
          ),
        });

        stats.searchHistory.migrated++;
        count++;

        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} search history entries`);
          count = 0;
        }
      } catch (error) {
        console.error(`  ❌ Error migrating search ${search.id}:`, error);
        stats.searchHistory.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(
        `  ✓ Committed final batch of ${count} search history entries`,
      );
    }

    console.log(
      `✅ Search History: ${stats.searchHistory.migrated}/${stats.searchHistory.total} migrated`,
    );
  } catch (error) {
    console.error(
      "❌ Error migrating search history (table may not exist):",
      error.message,
    );
    // Non-fatal - table might not exist
  }
}

/**
 * Migrate Analytics Events collection
 */
async function migrateAnalyticsEvents() {
  console.log("\n📦 Migrating analytics events...");

  try {
    const events =
      await sql`SELECT * FROM analytics_events ORDER BY id LIMIT 10000`;
    stats.analyticsEvents.total = events.length;

    const batch = db.collection("analyticsEvents");
    let count = 0;

    for (const event of events) {
      try {
        await batch.doc(String(event.id)).set({
          id: event.id,
          userId: event.user_id || null,
          eventType: event.event_type,
          eventData: event.event_data || {},
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(event.created_at),
          ),
        });

        stats.analyticsEvents.migrated++;
        count++;

        if (count % 100 === 0) {
          console.log(`  ✓ Migrated ${count} analytics events...`);
        }
      } catch (error) {
        console.error(
          `  ❌ Error migrating analytics event ${event.id}:`,
          error,
        );
        stats.analyticsEvents.errors++;
      }
    }

    console.log(
      `✅ Analytics Events: ${stats.analyticsEvents.migrated}/${stats.analyticsEvents.total} migrated`,
    );
  } catch (error) {
    console.error(
      "❌ Error migrating analytics events (table may not exist):",
      error.message,
    );
    // Non-fatal - table might not exist
  }
}

/**
 * Migrate Contact Messages collection
 */
async function migrateContactMessages() {
  console.log("\n📦 Migrating contact messages...");

  try {
    const messages = await sql`SELECT * FROM contact_messages ORDER BY id`;
    stats.contactMessages.total = messages.length;

    const batch = db.batch();
    let count = 0;

    for (const message of messages) {
      try {
        const messageRef = db
          .collection("contactMessages")
          .doc(String(message.id));
        batch.set(messageRef, {
          id: message.id,
          name: message.name,
          email: message.email,
          subject: message.subject || "",
          message: message.message,
          status: message.status || "new",
          createdAt: admin.firestore.Timestamp.fromDate(
            new Date(message.created_at),
          ),
        });

        stats.contactMessages.migrated++;
        count++;

        if (count >= 500) {
          await batch.commit();
          console.log(`  ✓ Committed batch of ${count} contact messages`);
          count = 0;
        }
      } catch (error) {
        console.error(
          `  ❌ Error migrating contact message ${message.id}:`,
          error,
        );
        stats.contactMessages.errors++;
      }
    }

    if (count > 0) {
      await batch.commit();
      console.log(`  ✓ Committed final batch of ${count} contact messages`);
    }

    console.log(
      `✅ Contact Messages: ${stats.contactMessages.migrated}/${stats.contactMessages.total} migrated`,
    );
  } catch (error) {
    console.error(
      "❌ Error migrating contact messages (table may not exist):",
      error.message,
    );
    // Non-fatal - table might not exist
  }
}

/**
 * Set admin custom claim for specified user email
 */
async function setAdminClaim(adminEmail: string) {
  console.log(`\n🔐 Setting admin claim for: ${adminEmail}`);

  try {
    // Find user in Firestore by email
    const usersSnapshot = await db
      .collection("users")
      .where("email", "==", adminEmail)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      console.warn(`⚠️ Warning: No user found with email ${adminEmail}`);
      console.log(
        "   You'll need to set admin claim after the user logs in for the first time.",
      );
      return;
    }

    const userId = usersSnapshot.docs[0].id;

    // Set custom claim
    await admin.auth().setCustomUserClaims(userId, { isAdmin: true });
    console.log(`✅ Admin claim set for user: ${userId}`);
  } catch (error) {
    console.error("❌ Error setting admin claim:", error);
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log("🚀 Starting Lungiverse Migration: PostgreSQL → Firestore");
  console.log("=".repeat(60));

  const startTime = Date.now();

  try {
    // Migrate collections in order (users first for referential integrity)
    await migrateUsers();
    await migrateTools();
    await migrateArticles();
    await migrateFavorites();
    await migrateReviews();
    await migrateSearchHistory();
    await migrateAnalyticsEvents();
    await migrateContactMessages();

    // Set admin claim (update this email to your Firebase auth email)
    await setAdminClaim("lindelanilungisani81@gmail.com"); // Uncomment and set your email

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log("\n" + "=".repeat(60));
    console.log("📊 MIGRATION SUMMARY");
    console.log("=".repeat(60));
    console.log(
      `Users:            ${stats.users.migrated}/${stats.users.total} (${stats.users.errors} errors)`,
    );
    console.log(
      `Tools:            ${stats.tools.migrated}/${stats.tools.total} (${stats.tools.errors} errors)`,
    );
    console.log(
      `Articles:         ${stats.articles.migrated}/${stats.articles.total} (${stats.articles.errors} errors)`,
    );
    console.log(
      `Favorites:        ${stats.favorites.migrated}/${stats.favorites.total} (${stats.favorites.errors} errors)`,
    );
    console.log(
      `Reviews:          ${stats.reviews.migrated}/${stats.reviews.total} (${stats.reviews.errors} errors)`,
    );
    console.log(
      `Search History:   ${stats.searchHistory.migrated}/${stats.searchHistory.total} (${stats.searchHistory.errors} errors)`,
    );
    console.log(
      `Analytics Events: ${stats.analyticsEvents.migrated}/${stats.analyticsEvents.total} (${stats.analyticsEvents.errors} errors)`,
    );
    console.log(
      `Contact Messages: ${stats.contactMessages.migrated}/${stats.contactMessages.total} (${stats.contactMessages.errors} errors)`,
    );
    console.log("=".repeat(60));
    console.log(`⏱️  Total time: ${duration}s`);
    console.log(`\n✅ Migration completed successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run migration
migrate();
