
import { Request, Response } from 'express';
import { requireAuth } from '../../clerkAuth.js';
import { storage } from '../../storage';

export async function POST(req: Request & { auth?: { userId: string } }, res: Response) {
  try {
    console.log('Save translation request received');
    console.log('Headers:', Object.keys(req.headers));
    console.log('Body keys:', Object.keys(req.body || {}));
    
    // Apply authentication middleware
    await new Promise<void>((resolve, reject) => {
      requireAuth(req, res, (err?: any) => {
        if (err) {
          console.error('Authentication middleware failed:', err);
          reject(err);
        } else {
          console.log('Authentication middleware passed');
          resolve();
        }
      });
    });

    const { inputText, outputText, sourceLanguage, targetLanguage } = req.body;
    const userId = req.auth!.userId;
    
    console.log('Authenticated user ID:', userId);

    if (!inputText || !outputText) {
      return res.status(400).json({ 
        error: "Both inputText and outputText are required" 
      });
    }

    const savedTranslation = await storage.saveTranslation(userId, {
      inputText,
      outputText,
      sourceLanguage: sourceLanguage || "standard_english",
      targetLanguage: targetLanguage || "gen_z_english",
    });

    console.log('Translation saved successfully:', savedTranslation.id);
    res.json(savedTranslation);
  } catch (error) {
    console.error("Error saving translation:", error);
    res.status(500).json({ 
      error: "Failed to save translation" 
    });
  }
}

// Export as default for compatibility
export default POST;
