import {
  users,
  translations,
  savedTranslations,
  historyTranslations,
  type User,
  type UpsertUser,
  type Translation,
  type InsertTranslation,
  type SavedTranslation,
  type InsertSavedTranslation,
  type HistoryTranslation,
  type InsertHistoryTranslation,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Translation operations
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  getRecentTranslations(limit?: number): Promise<Translation[]>;
  // Saved translation operations
  saveTranslation(userId: string, translation: InsertSavedTranslation): Promise<SavedTranslation>;
  getSavedTranslations(userId: string): Promise<SavedTranslation[]>;
  deleteSavedTranslation(userId: string, translationId: number): Promise<void>;
  // History translation operations
  saveToHistory(userId: string, translation: InsertHistoryTranslation): Promise<HistoryTranslation>;
  getHistoryTranslations(userId: string, limit?: number): Promise<HistoryTranslation[]>;
  deleteHistoryTranslation(userId: string, translationId: number): Promise<void>;
  clearAllHistory(userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    } catch (error: any) {
      // If it's a unique constraint error on email, try updating by email
      if (error.code === '23505' && error.constraint === 'users_email_unique') {
        console.log('Handling email conflict, updating existing user...');
        const [user] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();
        return user;
      }
      throw error;
    }
  }

  // Translation operations
  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const [translation] = await db
      .insert(translations)
      .values(insertTranslation)
      .returning();
    return translation;
  }

  async getRecentTranslations(limit: number = 10): Promise<Translation[]> {
    return await db
      .select()
      .from(translations)
      .orderBy(translations.createdAt)
      .limit(limit);
  }

  // Saved translation operations
  async saveTranslation(userId: string, translation: InsertSavedTranslation): Promise<SavedTranslation> {
    const [saved] = await db
      .insert(savedTranslations)
      .values({
        userId,
        ...translation,
      })
      .returning();
    return saved;
  }

  async getSavedTranslations(userId: string): Promise<SavedTranslation[]> {
    return await db
      .select()
      .from(savedTranslations)
      .where(eq(savedTranslations.userId, userId))
      .orderBy(savedTranslations.createdAt);
  }

  async deleteSavedTranslation(userId: string, translationId: number): Promise<void> {
    await db
      .delete(savedTranslations)
      .where(eq(savedTranslations.id, translationId));
  }

  // History translation operations
  async saveToHistory(userId: string, translation: InsertHistoryTranslation): Promise<HistoryTranslation> {
    const [saved] = await db
      .insert(historyTranslations)
      .values({
        userId,
        ...translation,
      })
      .returning();
    return saved;
  }

  async getHistoryTranslations(userId: string, limit: number = 50): Promise<HistoryTranslation[]> {
    return await db
      .select()
      .from(historyTranslations)
      .where(eq(historyTranslations.userId, userId))
      .orderBy(historyTranslations.createdAt)
      .limit(limit);
  }

  async deleteHistoryTranslation(userId: string, translationId: number): Promise<void> {
    await db
      .delete(historyTranslations)
      .where(eq(historyTranslations.id, translationId));
  }

  async clearAllHistory(userId: string): Promise<void> {
    await db
      .delete(historyTranslations)
      .where(eq(historyTranslations.userId, userId));
  }

  async createUser(userData: { id: string; email: string; firstName: string; lastName: string }): Promise<User> {
    const [result] = await db
      .insert(users)
      .values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result[0];
  }
}

export const storage = new DatabaseStorage();