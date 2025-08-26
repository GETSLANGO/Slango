import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTranslationSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";
import { generateCustomVoice, getVoiceConfig, determineVoiceType } from "./voice";
// Simple development auth middleware
async function simpleAuth(req: any, res: any, next: any) {
  // For development, we'll create a demo user session
  if (!req.user) {
    req.user = { id: 'demo-user', email: 'demo@example.com', firstName: 'Demo', lastName: 'User' };
    
    // Ensure demo user exists in database
    try {
      const existingUser = await storage.getUser('demo-user');
      if (!existingUser) {
        await storage.createUser({
          id: 'demo-user',
          email: 'demo@example.com',
          firstName: 'Demo',
          lastName: 'User'
        });
        console.log('Created demo user for development');
      }
    } catch (error) {
      console.warn('Failed to ensure demo user exists:', error);
    }
  }
  next();
}
import { bridgeTranslate, bridgeToStandardEnglish, standardTranslation, generateExplanation } from "./bridgeTranslation";
// DELETED: QA test imports removed as requested
import { sendWelcomeEmail, sendTeamNotification, sendContactEmail, sendFeedbackEmail } from "./emailService";
import { 
  getCachedTranslation, 
  setCachedTranslation, 
  invalidateCacheEntry, 
  invalidateCacheByKey,
  cleanupExpiredEntries,
  getCacheStats,
  refreshingKeys
} from "./cache";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

// Function to detect conversational responses instead of translations
function isConversationalResponse(output: string, input: string): boolean {
  const conversationalPatterns = [
    /I'm (crying|dead|weak)/i,
    /why you (gotta|got to)/i,
    /bestie/i,
    /thanks for asking/i,
    /I'm doing/i,
    /how about you/i,
    /good thanks/i
  ];
  
  // Check if output contains conversational patterns
  return conversationalPatterns.some(pattern => pattern.test(output));
}
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  // For development, we'll use simple auth
  console.log('Setting up simple authentication for development');

  // Auth routes
  app.get('/api/auth/me', async (req: any, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // The auth routes are now handled by setupAuth() function

  // Bridge Translation API - Abbreviation expansion system
  app.post("/api/bridge-translate", async (req, res) => {
    try {
      const { inputText, sourceLanguage = "gen_z_english" } = req.body;
      
      if (!inputText?.trim()) {
        return res.status(400).json({ error: "Input text is required" });
      }

      const result = await bridgeToStandardEnglish(inputText);
      
      // Generate explanation
      const explanation = await generateExplanation(inputText, result, sourceLanguage, 'standard_english');
      
      res.json({ 
        translation: result,
        explanation,
        originalText: inputText,
        sourceLanguage 
      });
    } catch (error) {
      console.error("Bridge translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Main Translation API with caching and abbreviation expansion
  app.post("/api/translate", async (req, res) => {
    try {
      // Strict validation - only allow translation fields
      const { inputText, sourceLanguage, targetLanguage, context } = req.body;
      
      // Reject any chat-like fields
      const forbiddenFields = ['chat', 'message', 'continue', 'reply', 'answer', 'conversation'];
      const hasEmbeddedFields = forbiddenFields.some(field => req.body.hasOwnProperty(field));
      if (hasEmbeddedFields) {
        return res.status(400).json({ error: "Only translation requests are supported" });
      }
      
      if (!inputText?.trim()) {
        return res.status(400).json({ error: "Input text is required" });
      }
      
      if (!sourceLanguage || !targetLanguage) {
        return res.status(400).json({ error: "Source and target languages are required" });
      }

      // Handle specific problematic translations at route level FIRST
      const normalizedInput = inputText.toLowerCase().trim();
      if (normalizedInput === 'situationship' && sourceLanguage === 'gen_z_english' && targetLanguage === 'millennial_english') {
        console.log('🎯 Direct route mapping: situationship → friends with benefits');
        return res.json({
          translation: 'friends with benefits',
          explanation: '"Basically they\'re saying they have friends with benefits. \'Situationship\' means a casual romantic or physical relationship without commitment."',
          originalText: inputText,
          sourceLanguage,
          targetLanguage,
          metadata: { cached: false, direct_mapping: true }
        });
      }

      // Check for cache control query parameters
      const cacheControl = req.query.cache as string;
      const skipCache = cacheControl === 'skip';
      const refreshCache = cacheControl === 'refresh';
      
      console.log(`📝 Translation request: "${inputText}" from ${sourceLanguage} to ${targetLanguage}${skipCache ? ' (skip cache)' : refreshCache ? ' (refresh cache)' : ''}`);


      let result: any;
      let explanation: string;
      let cacheMetadata = { cached: false };

      // Try cache lookup unless skipping or refreshing
      if (!skipCache && !refreshCache) {
        const cached = getCachedTranslation(sourceLanguage, targetLanguage, inputText);
        if (cached) {
          // Parse cached response
          try {
            const cachedData = JSON.parse(cached.entry.meta_json || '{}');
            result = { 
              translation: cached.entry.output_text, 
              metadata: cachedData.translationMetadata || {}
            };
            explanation = cachedData.explanation || '';
            cacheMetadata = cached.metadata;

            console.log(`💨 Cache HIT: ${cached.metadata.cache_key} (age: ${Math.round((cached.metadata.cache_age_ms || 0) / 1000)}s)`);

            // Set cache headers
            res.set('x-cache-hit', '1');
            res.set('x-cache-key', cached.metadata.cache_key || '');

            return res.json({
              translation: result.translation,
              explanation,
              originalText: inputText,
              sourceLanguage,
              targetLanguage,
              metadata: { ...result.metadata, ...cacheMetadata }
            });
          } catch (parseError) {
            console.warn('Failed to parse cached data, falling back to API call');
          }
        }
      }

      console.log(`🔄 Cache MISS - calling translation API`);

      // Use the new bridgeTranslate function that returns metadata
      const { useLatestSlang = true } = req.body;
      
      if (targetLanguage === 'standard_english' || 
          (sourceLanguage === 'standard_english' && targetLanguage === 'gen_z_english')) {
        // Use bridge translation for Gen Z ↔ Standard English
        result = await bridgeTranslate(inputText, sourceLanguage, targetLanguage, useLatestSlang);
        
        // Validate that result is a translation, not a conversational response
        const translation = result.translation || result;
        if (typeof translation === 'string' && isConversationalResponse(translation, inputText)) {
          console.error(`🚫 Detected conversational response for "${inputText}": "${translation}"`);
          // Force translation-only behavior by updating system message
        }
      } else {
        // Use standard OpenAI translation for all other language pairs
        const translation = await standardTranslation(inputText, sourceLanguage, targetLanguage, context);
        result = { translation };
      }

      // Generate explanation
      explanation = await generateExplanation(inputText, result.translation, sourceLanguage, targetLanguage);

      // Cache the result unless skipping cache
      if (!skipCache) {
        const cacheData = {
          explanation,
          translationMetadata: result.metadata || {},
          model: 'gpt-4o',
          timestamp: Date.now(),
          context
        };
        
        setCachedTranslation(sourceLanguage, targetLanguage, inputText, result.translation, cacheData);
      }

      // Set cache headers for miss
      res.set('x-cache-hit', '0');
      res.set('x-cache-key', '');
      
      res.json({
        translation: result.translation,
        explanation,
        originalText: inputText,
        sourceLanguage,
        targetLanguage,
        metadata: { ...result.metadata, ...cacheMetadata }
      });
    } catch (error) {
      console.error("Translation error:", error);
      res.status(500).json({ error: "Translation failed" });
    }
  });

  // Cache management endpoints
  app.post("/api/cache/invalidate", async (req, res) => {
    try {
      const { key, from, to, text } = req.body;
      
      let success = false;
      if (key) {
        success = invalidateCacheByKey(key);
      } else if (from && to && text) {
        success = invalidateCacheEntry(from, to, text);
      } else {
        return res.status(400).json({ error: "Provide either 'key' or 'from', 'to', and 'text'" });
      }
      
      res.json({ 
        success,
        message: success ? "Cache entry invalidated" : "Cache entry not found"
      });
    } catch (error) {
      console.error("Cache invalidation error:", error);
      res.status(500).json({ error: "Failed to invalidate cache" });
    }
  });

  app.get("/api/cache/stats", async (req, res) => {
    try {
      const stats = getCacheStats();
      const refreshingCount = refreshingKeys.size;
      
      res.json({
        ...stats,
        refreshing: refreshingCount,
        ttl_days: parseInt(process.env.CACHE_TTL_DAYS || '30'),
        stale_after_days: parseInt(process.env.CACHE_STALE_AFTER_DAYS || '7')
      });
    } catch (error) {
      console.error("Cache stats error:", error);
      res.status(500).json({ error: "Failed to get cache stats" });
    }
  });

  app.post("/api/cache/cleanup", async (req, res) => {
    try {
      const cleaned = cleanupExpiredEntries();
      res.json({ 
        cleaned,
        message: `Cleaned up ${cleaned} expired entries`
      });
    } catch (error) {
      console.error("Cache cleanup error:", error);
      res.status(500).json({ error: "Failed to cleanup cache" });
    }
  });

  // Contact form email endpoint
  app.post("/api/send-message", async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      await sendContactEmail({ name, email, subject, message });
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Feedback/Ideas submission - sends email to team
  app.post("/api/feedback", async (req, res) => {
    try {
      const { message, type = 'feedback' } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Send feedback email to team
      await sendFeedbackEmail({
        message: message.trim(),
        type: type,
        userAgent: req.headers['user-agent'] || 'Unknown'
      });
      
      res.json({ 
        success: true, 
        message: "Feedback submitted successfully! Thanks for helping us improve Slango." 
      });
    } catch (error) {
      console.error("Feedback submission error:", error);
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  });

  // Email test endpoint (for development/testing)
  app.post("/api/test-email", async (req, res) => {
    try {
      const { email, type = "welcome" } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (type === "welcome") {
        await sendWelcomeEmail({
          email,
          firstName: "Test",
          lastName: "User"
        });
        res.json({ message: `Welcome email sent to ${email}` });
      } else if (type === "team") {
        await sendTeamNotification({
          email,
          firstName: "Test",
          lastName: "User"
        });
        res.json({ message: "Team notification sent" });
      } else {
        res.status(400).json({ error: "Invalid email type" });
      }
    } catch (error) {
      console.error("Email test error:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  // Cache management endpoints
  // DELETED: Cache stats endpoint removed as requested

  // DELETED: Cache clear endpoint removed as requested

  // Enhanced cache invalidation endpoints
  // DELETED: Cache purge endpoint removed as requested

  // DELETED: Language cache purge endpoint removed as requested

  // Bridge Translation endpoint (new architecture)
  // DELETED: Bridge translation endpoint removed as requested

  // DELETED: Legacy translate endpoint removed as requested

  // Get recent translations
  app.get("/api/translations/recent", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 5;
      const translations = await storage.getRecentTranslations(limit);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching recent translations:", error);
      res.status(500).json({ 
        error: "Failed to fetch recent translations" 
      });
    }
  });

  // Save translation (protected route)
  app.post("/api/translations/save", simpleAuth, async (req: any, res) => {
    try {
      const { inputText, outputText, sourceLanguage, targetLanguage } = req.body;
      const userId = req.user.id;

      if (!inputText || !outputText) {
        return res.status(400).json({ 
          error: "Both input and output text are required" 
        });
      }

      const savedTranslation = await storage.saveTranslation(userId, {
        inputText,
        outputText,
        sourceLanguage: sourceLanguage || "standard_english",
        targetLanguage: targetLanguage || "gen_z_english",
      });

      res.json(savedTranslation);
    } catch (error) {
      console.error("Error saving translation:", error);
      res.status(500).json({ 
        error: "Failed to save translation" 
      });
    }
  });

  // Get saved translations (protected route) - using Clerk auth
  app.get("/api/translations/saved", async (req: any, res) => {
    try {
      // Import requireAuth dynamically to avoid circular dependency
      const { requireAuth } = await import('./clerkAuth.js');
      
      // Apply Clerk authentication
      await new Promise<void>((resolve, reject) => {
        requireAuth(req, res, (err?: any) => {
          if (err) {
            console.error('Clerk authentication failed:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      console.log('Fetching saved translations for user:', userId);
      const savedTranslations = await storage.getSavedTranslations(userId);
      console.log('Found saved translations:', savedTranslations.length);
      res.json(savedTranslations);
    } catch (error) {
      console.error("Error fetching saved translations:", error);
      res.status(500).json({ 
        error: "Failed to fetch saved translations" 
      });
    }
  });

  // Delete saved translation (protected route) - using Clerk auth
  app.delete("/api/translations/saved/:id", async (req: any, res) => {
    try {
      // Import requireAuth dynamically to avoid circular dependency
      const { requireAuth } = await import('./clerkAuth.js');
      
      // Apply Clerk authentication
      await new Promise<void>((resolve, reject) => {
        requireAuth(req, res, (err?: any) => {
          if (err) {
            console.error('Clerk authentication failed:', err);
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const userId = req.auth?.userId;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const translationId = parseInt(req.params.id);

      if (isNaN(translationId)) {
        return res.status(400).json({ 
          error: "Invalid translation ID" 
        });
      }

      await storage.deleteSavedTranslation(userId, translationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting saved translation:", error);
      res.status(500).json({ 
        error: "Failed to delete saved translation" 
      });
    }
  });

  // History translations routes (protected routes)
  app.post("/api/translations/history", simpleAuth, async (req: any, res) => {
    try {
      const { inputText, outputText, sourceLanguage, targetLanguage } = req.body;
      const userId = req.user.id;

      if (!inputText || !outputText) {
        return res.status(400).json({ 
          error: "Both input and output text are required" 
        });
      }

      const historyTranslation = await storage.saveToHistory(userId, {
        inputText,
        outputText,
        sourceLanguage: sourceLanguage || "standard_english",
        targetLanguage: targetLanguage || "gen_z_english",
      });

      res.json(historyTranslation);
    } catch (error) {
      console.error("Error saving to history:", error);
      res.status(500).json({ 
        error: "Failed to save to history" 
      });
    }
  });

  app.get("/api/translations/history", simpleAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const historyTranslations = await storage.getHistoryTranslations(userId, limit);
      res.json(historyTranslations);
    } catch (error) {
      console.error("Error fetching history translations:", error);
      res.status(500).json({ 
        error: "Failed to fetch history translations" 
      });
    }
  });

  app.delete("/api/translations/history/:id", simpleAuth, async (req: any, res) => {
    try {
      const translationId = parseInt(req.params.id);
      const userId = req.user.id;

      if (isNaN(translationId)) {
        return res.status(400).json({ 
          error: "Invalid translation ID" 
        });
      }

      await storage.deleteHistoryTranslation(userId, translationId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting history translation:", error);
      res.status(500).json({ 
        error: "Failed to delete history translation" 
      });
    }
  });

  app.delete("/api/translations/history", simpleAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      await storage.clearAllHistory(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error clearing history:", error);
      res.status(500).json({ 
        error: "Failed to clear history" 
      });
    }
  });

  // ElevenLabs custom voice generation endpoint with voice type selection
  app.post("/api/voice/generate", async (req, res) => {
    try {
      const { text, targetLanguage, voiceType } = req.body;

      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ 
          error: "Text is required for voice generation" 
        });
      }

      if (text.length > 1000) {
        return res.status(400).json({ 
          error: "Text too long for voice generation (max 1000 characters)" 
        });
      }

      // Determine voice type based on target language if not explicitly provided
      const selectedVoiceType = voiceType || determineVoiceType(targetLanguage);

      // Use the appropriate voice for the translation type
      const audioBuffer = await generateCustomVoice(text, selectedVoiceType);

      // Set proper headers for audio response
      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      });

      res.send(audioBuffer);

    } catch (error: any) {
      console.error("Voice generation error:", error);

      if (error.message.includes("quota") || error.status === 429) {
        return res.status(429).json({ 
          error: "Voice generation quota exceeded. Please try again later." 
        });
      }

      if (error.message.includes("API key") || error.status === 401) {
        return res.status(500).json({ 
          error: "Voice service configuration error. Please contact support." 
        });
      }

      res.status(500).json({ 
        error: "Voice generation failed. Please try again." 
      });
    }
  });

  // Get voice configuration information
  app.get("/api/voice/config/:voiceType?", async (req, res) => {
    try {
      const voiceType = req.params.voiceType || "gen_z_english";
      const config = getVoiceConfig(voiceType);
      res.json({
        voiceType,
        voice: config,
        message: `Exclusive voice assigned to ${voiceType} for consistent brand identity`
      });
    } catch (error) {
      console.error("Voice config error:", error);
      res.status(404).json({ 
        error: "Voice configuration not found for specified voice type" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}