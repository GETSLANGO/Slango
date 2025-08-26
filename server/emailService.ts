import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface WelcomeEmailData {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FeedbackEmailData {
  message: string;
  type: string;
  userAgent?: string;
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(userData: WelcomeEmailData): Promise<void> {
  try {
    const { email, firstName } = userData;
    const displayName = firstName ? firstName : 'there';

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to SlangoSwap',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">Welcome to SlangoSwap! 🚀</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-top: 0;">Hey ${displayName}!</h2>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Thanks for signing up! You're officially part of the Slango revolution. 
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              SlangoSwap is your ultimate multilingual slang translator that bridges communication gaps across cultures and generations. Whether you're translating Gen Z slang, formal business language, or international languages, we've got you covered.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What you can do with SlangoSwap:</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Translate between Standard English, Gen Z, Millennial, British, and Formal English</li>
                <li>Convert between multiple international languages (Spanish, French, etc.)</li>
                <li>Get AI-powered explanations for better understanding</li>
                <li>Listen to authentic pronunciation with voice playback</li>
                <li>Save your favorite translations for quick access</li>
                <li>Track your translation history</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.REPLIT_DOMAINS || 'https://your-app.replit.app'}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Translating Now
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; font-size: 16px;">
              Ready to break down language barriers? Log in and start exploring the world of slang translation!
            </p>
            
            <p style="color: #666; line-height: 1.6; font-size: 14px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
              Need help? Just reply to this email and our team will assist you.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© 2025 SlangoSwap. Bridging cultures through language.</p>
          </div>
        </div>
      `
    });
    
    console.log(`Welcome email sent successfully to: ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Don't throw the error to prevent signup failure due to email issues
    // Email sending failures shouldn't block user registration
  }
}

/**
 * Send a notification email to the team when a new user signs up
 */
export async function sendTeamNotification(userData: WelcomeEmailData): Promise<void> {
  try {
    const { email, firstName, lastName } = userData;
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'slango.team.ai@gmail.com',
      subject: 'New SlangoSwap User Signup',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New User Signup Alert 🎉</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${fullName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Signup Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <p style="color: #666;">Another user has joined the SlangoSwap community!</p>
        </div>
      `
    });
    
    console.log('Team notification email sent successfully');
  } catch (error) {
    console.error('Failed to send team notification email:', error);
  }
}

/**
 * Send a contact form message to the team
 */
export async function sendContactEmail(contactData: ContactEmailData): Promise<void> {
  try {
    const { name, email, subject, message } = contactData;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'slango.team.ai@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Contact Form Message 📩</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
            <p style="color: #1565c0; margin: 0; font-size: 14px;">
              💡 Reply directly to this email to respond to ${name} at ${email}
            </p>
          </div>
        </div>
      `,
      replyTo: email
    });
    
    console.log(`Contact form email sent successfully from: ${email}`);
  } catch (error) {
    console.error('Failed to send contact form email:', error);
    throw error;
  }
}

export async function sendFeedbackEmail(feedbackData: FeedbackEmailData): Promise<void> {
  try {
    const { message, type, userAgent } = feedbackData;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'slango.team.ai@gmail.com',
      subject: `Slang Feedback: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">New Slang Feedback 💭</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Type:</strong> ${type.charAt(0).toUpperCase() + type.slice(1)}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>User Agent:</strong> ${userAgent || 'Unknown'}</p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981;">
            <h3 style="color: #333; margin-top: 0;">Feedback Message:</h3>
            <p style="color: #666; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px;">
            <p style="color: #059669; margin: 0; font-size: 14px;">
              💡 This feedback was submitted through the Slango feedback form and can help improve our slang translation accuracy.
            </p>
          </div>
        </div>
      `
    });
    
    console.log(`Feedback email sent successfully for type: ${type}`);
  } catch (error) {
    console.error('Failed to send feedback email:', error);
    throw error;
  }
}