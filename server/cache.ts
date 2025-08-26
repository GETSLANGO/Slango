import Database from 'better-sqlite3';
import { createHash } from 'crypto';
import path from 'path';
import fs from 'fs';

// Cache configuration with defaults
const CACHE_TTL_DAYS = parseInt(process.env.CACHE_TTL_DAYS || '30');
const CACHE_STALE_AFTER_DAYS = parseInt(process.env.CACHE_STALE_AFTER_DAYS || '7');

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dataDir, 'cache.db');
const db = new Database(dbPath);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS translations (
    key TEXT PRIMARY KEY,
    source_text TEXT NOT NULL,
    from_code TEXT NOT NULL,
    to_code TEXT NOT NULL,
    output_text TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL,
    meta_json TEXT
  )
`);

// Create index for faster expiry cleanup
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_expires_at ON translations(expires_at)
`);

// In-memory set to track ongoing background refreshes
const refreshingKeys = new Set<string>();

export interface CacheEntry {
  key: string;
  source_text: string;
  from_code: string;
  to_code: string;
  output_text: string;
  created_at: number;
  expires_at: number;
  meta_json: string;
}

export interface CacheMetadata {
  cached: boolean;
  cache_age_ms?: number;
  cache_key?: string;
}

/**
 * Generate cache key from normalized input
 */
export function generateCacheKey(fromCode: string, toCode: string, inputText: string): string {
  // Normalize text: trim and replace multiple spaces with single space
  const normText = inputText.trim().replace(/\s+/g, ' ');
  
  // Create key from codes and normalized text
  const keyString = `${fromCode}|${toCode}|${normText}`;
  
  // Generate SHA256 hash
  return createHash('sha256').update(keyString).digest('hex');
}

/**
 * Check if input should be cached
 */
export function shouldCache(inputText: string): boolean {
  const trimmed = inputText.trim();
  return trimmed.length > 0 && trimmed.length <= 5000;
}

/**
 * Get cached translation if available and not expired
 */
export function getCachedTranslation(
  fromCode: string,
  toCode: string,
  inputText: string
): { entry: CacheEntry; metadata: CacheMetadata } | null {
  if (!shouldCache(inputText)) {
    return null;
  }

  const key = generateCacheKey(fromCode, toCode, inputText);
  const now = Date.now();

  try {
    const stmt = db.prepare(`
      SELECT * FROM translations 
      WHERE key = ? AND expires_at > ?
    `);
    
    const entry = stmt.get(key, now) as CacheEntry | undefined;
    
    if (!entry) {
      return null;
    }

    const cacheAge = now - entry.created_at;
    const metadata: CacheMetadata = {
      cached: true,
      cache_age_ms: cacheAge,
      cache_key: key.substring(0, 12)
    };

    // Check if entry is stale and needs background refresh
    const staleThreshold = CACHE_STALE_AFTER_DAYS * 24 * 60 * 60 * 1000;
    if (cacheAge > staleThreshold && !refreshingKeys.has(key)) {
      // Mark as refreshing to avoid duplicate background jobs
      refreshingKeys.add(key);
      
      // Fire-and-forget background refresh
      setTimeout(async () => {
        try {
          console.log(`🔄 Background refresh for cache key: ${key.substring(0, 12)}`);
          
          // Import here to avoid circular dependency
          const { bridgeTranslate } = await import('./bridgeTranslation.js');
          const { generateExplanation } = await import('./bridgeTranslation.js');
          const { standardTranslation } = await import('./bridgeTranslation.js');
          
          // Re-generate the translation
          let result: any;
          if (entry.to_code === 'standard_english' || 
              (entry.from_code === 'standard_english' && entry.to_code === 'gen_z_english')) {
            result = await bridgeTranslate(entry.source_text, entry.from_code, entry.to_code, true);
          } else {
            const translation = await standardTranslation(entry.source_text, entry.from_code, entry.to_code);
            result = { translation };
          }

          // Generate fresh explanation
          const explanation = await generateExplanation(
            entry.source_text, 
            result.translation, 
            entry.from_code, 
            entry.to_code
          );

          // Update cache with fresh data
          const freshData = {
            explanation,
            translationMetadata: result.metadata || {},
            model: 'gpt-4o',
            timestamp: Date.now(),
            refreshed: true
          };
          
          setCachedTranslation(entry.from_code, entry.to_code, entry.source_text, result.translation, freshData);
          console.log(`✅ Background refresh completed for key: ${key.substring(0, 12)}`);
          
        } catch (error) {
          console.error('Background refresh error:', error);
        } finally {
          refreshingKeys.delete(key);
        }
      }, 0);
    }

    return { entry, metadata };
  } catch (error) {
    console.error('Cache lookup error:', error);
    return null;
  }
}

/**
 * Store translation result in cache
 */
export function setCachedTranslation(
  fromCode: string,
  toCode: string,
  inputText: string,
  outputText: string,
  metadata?: any
): void {
  if (!shouldCache(inputText) || !outputText.trim()) {
    return;
  }

  const key = generateCacheKey(fromCode, toCode, inputText);
  const now = Date.now();
  const expiresAt = now + (CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO translations 
      (key, source_text, from_code, to_code, output_text, created_at, expires_at, meta_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const metaJson = metadata ? JSON.stringify(metadata) : null;
    
    stmt.run(
      key,
      inputText.trim(),
      fromCode,
      toCode,
      outputText.trim(),
      now,
      expiresAt,
      metaJson
    );

    console.log(`💾 Cached translation: ${key.substring(0, 12)} (TTL: ${CACHE_TTL_DAYS} days)`);
  } catch (error) {
    console.error('Cache store error:', error);
  }
}

/**
 * Invalidate specific cache entry
 */
export function invalidateCacheEntry(
  fromCode: string,
  toCode: string,
  inputText: string
): boolean {
  const key = generateCacheKey(fromCode, toCode, inputText);
  
  try {
    const stmt = db.prepare('DELETE FROM translations WHERE key = ?');
    const result = stmt.run(key);
    
    console.log(`🗑️ Invalidated cache entry: ${key.substring(0, 12)}`);
    return result.changes > 0;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return false;
  }
}

/**
 * Invalidate cache entry by key
 */
export function invalidateCacheByKey(key: string): boolean {
  try {
    const stmt = db.prepare('DELETE FROM translations WHERE key = ?');
    const result = stmt.run(key);
    
    console.log(`🗑️ Invalidated cache by key: ${key.substring(0, 12)}`);
    return result.changes > 0;
  } catch (error) {
    console.error('Cache invalidation error:', error);
    return false;
  }
}

/**
 * Clean up expired cache entries
 */
export function cleanupExpiredEntries(): number {
  try {
    const stmt = db.prepare('DELETE FROM translations WHERE expires_at <= ?');
    const result = stmt.run(Date.now());
    
    if (result.changes > 0) {
      console.log(`🧹 Cleaned up ${result.changes} expired cache entries`);
    }
    
    return result.changes;
  } catch (error) {
    console.error('Cache cleanup error:', error);
    return 0;
  }
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  total: number;
  expired: number;
  stale: number;
  fresh: number;
} {
  try {
    const now = Date.now();
    const staleThreshold = now - (CACHE_STALE_AFTER_DAYS * 24 * 60 * 60 * 1000);

    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM translations');
    const expiredStmt = db.prepare('SELECT COUNT(*) as count FROM translations WHERE expires_at <= ?');
    const staleStmt = db.prepare('SELECT COUNT(*) as count FROM translations WHERE created_at <= ? AND expires_at > ?');
    const freshStmt = db.prepare('SELECT COUNT(*) as count FROM translations WHERE created_at > ? AND expires_at > ?');

    const total = (totalStmt.get() as { count: number }).count;
    const expired = (expiredStmt.get(now) as { count: number }).count;
    const stale = (staleStmt.get(staleThreshold, now) as { count: number }).count;
    const fresh = (freshStmt.get(staleThreshold, now) as { count: number }).count;

    return { total, expired, stale, fresh };
  } catch (error) {
    console.error('Cache stats error:', error);
    return { total: 0, expired: 0, stale: 0, fresh: 0 };
  }
}

// Initialize cleanup on startup
cleanupExpiredEntries();

// Export background refresh tracking for integration
export { refreshingKeys };

console.log(`🗃️ Translation cache initialized (TTL: ${CACHE_TTL_DAYS}d, Stale: ${CACHE_STALE_AFTER_DAYS}d)`);