import {
  pgTable,
  text,
  serial,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(),
  inputText: text("input_text").notNull(),
  outputText: text("output_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedTranslations = pgTable("saved_translations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  inputText: text("input_text").notNull(),
  outputText: text("output_text").notNull(),
  sourceLanguage: varchar("source_language").notNull().default("standard_english"),
  targetLanguage: varchar("target_language").notNull().default("gen_z_english"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTranslationSchema = createInsertSchema(translations).pick({
  inputText: true,
  outputText: true,
}).extend({
  isReversed: z.boolean().optional().default(false),
  sourceLanguage: z.string().optional().default("standard_english"),
  targetLanguage: z.string().optional().default("gen_z_english"),
});

// History translations table for auto-saved translation history
export const historyTranslations = pgTable("history_translations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  inputText: text("input_text").notNull(),
  outputText: text("output_text").notNull(),
  sourceLanguage: varchar("source_language").notNull(),
  targetLanguage: varchar("target_language").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Slang terms table for freshness tracking
export const slangTerms = pgTable("slang_terms", {
  id: serial("id").primaryKey(),
  term: varchar("term").notNull().unique(),
  aliases: jsonb("aliases").$type<string[]>().default([]),
  status: varchar("status").$type<'current' | 'fading' | 'deprecated'>().notNull().default('current'),
  lastSeen: timestamp("last_seen").defaultNow(),
  sourceCount30d: integer("source_count_30d").default(0),
  trendHits30d: integer("trend_hits_30d").default(0),
  ageMonths: integer("age_months").default(0),
  region: varchar("region").default('US'),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSlangTermSchema = createInsertSchema(slangTerms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSavedTranslationSchema = createInsertSchema(savedTranslations).pick({
  inputText: true,
  outputText: true,
  sourceLanguage: true,
  targetLanguage: true,
});

export const insertHistoryTranslationSchema = createInsertSchema(historyTranslations).pick({
  inputText: true,
  outputText: true,
  sourceLanguage: true,
  targetLanguage: true,
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Translation cache table for persistent caching across sessions
export const translationCache = pgTable("translation_cache", {
  id: varchar("id").primaryKey().notNull(), // Hash of input + source + target languages
  inputText: text("input_text").notNull(),
  sourceLanguage: varchar("source_language").notNull(),
  targetLanguage: varchar("target_language").notNull(),
  outputText: text("output_text").notNull(),
  explanation: text("explanation").notNull(),
  bridgeText: text("bridge_text"), // Standard English intermediate step
  qualityScore: integer("quality_score"),
  processingLayers: jsonb("processing_layers").$type<string[]>().notNull(),
  voiceId: varchar("voice_id"), // Associated voice for audio playback
  hitCount: integer("hit_count").default(1).notNull(), // Track cache usage
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type TranslationCache = typeof translationCache.$inferSelect;
export type InsertTranslationCache = typeof translationCache.$inferInsert;
export type InsertTranslation = z.infer<typeof insertTranslationSchema>;
export type Translation = typeof translations.$inferSelect;
export type InsertSavedTranslation = z.infer<typeof insertSavedTranslationSchema>;
export type SavedTranslation = typeof savedTranslations.$inferSelect;
export type InsertHistoryTranslation = z.infer<typeof insertHistoryTranslationSchema>;
export type HistoryTranslation = typeof historyTranslations.$inferSelect;
