// Voice configuration system for different slang types and languages
// Each style/language gets its own dedicated voice for consistent branding
const VOICE_CONFIG = {
  "gen_z_english": {
    id: "3XOBzXhnDY98yeWQ3GdM", // Youthful male voice for Gen Z slang
    name: "Gen Z English Voice",
    description: "Youthful, energetic voice for Gen Z slang translations"
  },
  "standard_english": {
    id: "1t1EeRixsJrKbiF1zwM6", // Professional voice for Standard English
    name: "Standard English Voice", 
    description: "Clear, professional voice for Standard English translations"
  },
  "millennial_english": {
    id: "pNInz6obpgDQGcFmaJgB", // Casual, relatable voice for Millennial slang
    name: "Millennial English Voice",
    description: "Casual, relatable voice for Millennial slang translations"
  },
  "british_english": {
    id: "N2lVS1w4EtoT3dr4eOWO", // British accent voice
    name: "British English Voice",
    description: "Authentic British accent for British slang translations"
  },

  "spanish": {
    id: "EXAVITQu4vr4xnSDxMaL", // Spanish voice
    name: "Spanish Voice",
    description: "Native Spanish voice for Spanish translations"
  },
  "french": {
    id: "CYw3kZ02Hs0563khs1Fj", // French voice
    name: "French Voice",
    description: "Native French voice for French translations"
  },
  "formal_english": {
    id: "1t1EeRixsJrKbiF1zwM6", // Professional voice for Formal English (same as standard)
    name: "Formal English Voice",
    description: "Professional, authoritative voice for formal English translations"
  }
};

export async function generateCustomVoice(text: string, voiceType: string = "gen_z_english"): Promise<Buffer> {
  try {
    // Get the dedicated voice for this voice type
    const voiceConfig = VOICE_CONFIG[voiceType as keyof typeof VOICE_CONFIG];
    if (!voiceConfig) {
      throw new Error(`Voice configuration not found for voice type: ${voiceType}`);
    }

    // Preprocess text for more natural speech
    const processedText = preprocessTextForSpeech(text);
    
    // Use direct fetch API to call ElevenLabs with the dedicated voice
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
      body: JSON.stringify({
        text: processedText,
        model_id: "eleven_turbo_v2", // Latest high-quality model
        voice_settings: {
          stability: 0.65, // Slightly more natural variation for Gen Z casualness
          similarity_boost: 0.8, // Good voice character consistency
          style: 0.4, // More emotion and personality for engaging delivery
          use_speaker_boost: true, // Enhance clarity and warmth
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ElevenLabs API error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }

    // Convert response to buffer
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("ElevenLabs voice generation error:", error);
    console.error("API Key present:", !!process.env.ELEVENLABS_API_KEY);
    throw new Error("Failed to generate voice audio");
  }
}

// Function to get voice configuration for a specific voice type
export function getVoiceConfig(voiceType: string = "gen_z_english") {
  const config = VOICE_CONFIG[voiceType as keyof typeof VOICE_CONFIG];
  if (!config) {
    throw new Error(`Voice configuration not found for voice type: ${voiceType}`);
  }
  return config;
}

// Function to determine voice type based on translation context
export function determineVoiceType(targetLanguage: string): string {
  // Use the voice that matches the target language/slang type
  return targetLanguage || "gen_z_english";
}

// Function to add new voice configurations for future language types
export function addVoiceConfig(voiceType: string, voiceId: string, name: string, description: string) {
  // This function can be used in the future to dynamically add new voice configurations
  // For now, we'll keep it simple and add them directly to the VOICE_CONFIG object
  console.log(`Future expansion: Adding voice config for ${voiceType}: ${name} (${voiceId})`);
}

function preprocessTextForSpeech(text: string): string {
  return text
    // Expand common Gen Z abbreviations for natural pronunciation
    .replace(/\bfr\b/gi, "for real")
    .replace(/\bngl\b/gi, "not gonna lie")
    .replace(/\btbh\b/gi, "to be honest")
    .replace(/\bidk\b/gi, "I don't know")
    .replace(/\bomg\b/gi, "oh my god")
    .replace(/\blowkey\b/gi, "low key")
    .replace(/\bhighkey\b/gi, "high key")
    .replace(/\bno cap\b/gi, "no cap")
    .replace(/\bfacts\b/gi, "facts")
    .replace(/\bbussin\b/gi, "bussin'")
    .replace(/\bvibin\b/gi, "vibing")
    .replace(/\bcapping\b/gi, "capping")
    .replace(/\bsalty\b/gi, "salty")
    .replace(/\bsus\b/gi, "sus")
    .replace(/\bbased\b/gi, "based")
    .replace(/\bcringe\b/gi, "cringe")
    .replace(/\bhella\b/gi, "hella")
    .replace(/\bdeadass\b/gi, "dead ass")
    .replace(/\bperiod\b/gi, "period")
    .replace(/\bslay\b/gi, "slay")
    .replace(/\bstan\b/gi, "stan")
    .replace(/\bflex\b/gi, "flex")
    .replace(/\bvibe\b/gi, "vibe")
    .replace(/\bslaps\b/gi, "slaps")
    .replace(/\bhits different\b/gi, "hits different")
    .replace(/\bbet\b/gi, "bet")
    .replace(/\blit\b/gi, "lit")
    .replace(/\bfam\b/gi, "fam")
    .replace(/\bbruh\b/gi, "bruh")
    
    // Remove emojis for cleaner speech
    .replace(/💀/g, "")
    .replace(/🔥/g, "")
    .replace(/💯/g, "")
    .replace(/✨/g, "")
    .replace(/😭/g, "")
    .replace(/😎/g, "")
    .replace(/🤔/g, "")
    .replace(/👀/g, "")
    .replace(/🙄/g, "")
    .replace(/🤡/g, "")
    .replace(/👑/g, "")
    .replace(/💅/g, "")
    .replace(/🥶/g, "")
    .replace(/😤/g, "")
    .replace(/🤮/g, "")
    
    // Add natural pauses and emphasis for better conversational flow
    .replace(/\.\s+/g, ". ")
    .replace(/,\s+/g, ", ")
    .replace(/!\s+/g, "! ")
    .replace(/\?\s+/g, "? ")
    .replace(/\bbut\s/gi, "but, ")  // Add slight pause before "but"
    .replace(/\bso\s/gi, "so, ")    // Add slight pause before "so" 
    .replace(/\band\s/gi, "and ")   // Natural conjunction flow
    .replace(/\byou know\b/gi, "you know,") // Add pause after "you know"
    .replace(/\blike\s/gi, "like, ") // Natural Gen Z speech pattern
    
    // Clean up extra spaces
    .replace(/\s+/g, " ")
    .trim();
}

// Function to get available ElevenLabs voices
export async function getAvailableVoices() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.status}`);
    }

    const data = await response.json();
    return data.voices.map((voice: any) => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category,
      description: voice.description,
    }));
  } catch (error) {
    console.error("Failed to fetch ElevenLabs voices:", error);
    return [];
  }
}