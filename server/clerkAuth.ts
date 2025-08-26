import { Request, Response, NextFunction } from 'express';
import { createClerkClient, verifyToken } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Extend Request interface to include auth
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
      };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    
    if (!secretKey) {
      console.warn('Clerk secret key not found, authentication disabled');
      return res.status(401).json({ error: 'Authentication not configured' });
    }

    const authHeader = req.headers.authorization;
    console.log('Auth header received:', authHeader ? 'Bearer token present' : 'No auth header');
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('No Bearer token found in Authorization header:', authHeader);
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.substring(7);
    
    if (!token || token.trim() === '') {
      console.log('Empty token provided');
      return res.status(401).json({ error: 'Empty authentication token' });
    }

    console.log('Attempting to verify token... (length:', token.length, ')');
    
    // Verify the JWT token
    const payload = await verifyToken(token, {
      secretKey,
    });

    console.log('Token verified successfully, payload:', { sub: payload.sub, sid: payload.sid });

    if (!payload.sub) {
      console.log('No subject found in token payload');
      return res.status(401).json({ error: 'Invalid token: no user ID' });
    }

    // Add auth info to request
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid || '',
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    const authHeader = req.headers.authorization;
    
    if (secretKey && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const payload = await verifyToken(token, { secretKey });
        if (payload.sub) {
          req.auth = {
            userId: payload.sub,
            sessionId: payload.sid || '',
          };
        }
      } catch (error) {
        // Token invalid, but don't fail the request
        console.warn('Optional auth failed:', error);
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue without auth
  }
}

// Helper to get current user
export async function getCurrentUser(userId: string) {
  try {
    const secretKey = process.env.CLERK_SECRET_KEY;
    if (!secretKey) return null;
    
    return await clerkClient.users.getUser(userId);
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}