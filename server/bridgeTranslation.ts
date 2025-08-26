import OpenAI from "openai";
import { rerankByFreshness, logSlangUsage, type FreshnessMetadata } from "./slangFreshness";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Comprehensive abbreviation expansion dictionary
const abbreviationMap: Record<string, string> = {
  'tbh': 'to be honest',
  'idc': "I don't care",
  'fr': 'for real',
  'ngl': 'not gonna lie',
  'imo': 'in my opinion',
  'irl': 'in real life',
  'omg': 'oh my god',
  'brb': 'be right back',
  'btw': 'by the way',
  'smh': 'shaking my head',
  'lmk': 'let me know',
  'fyi': 'for your information',
  'ikr': "I know, right?",
  'tbf': 'to be fair',
  'rn': 'right now',
  'bff': 'best friend',
  'ily': 'I love you',
  'wbu': 'what about you?',
  'afaik': 'as far as I know',
  'asap': 'as soon as possible',
  'atm': 'at the moment',
  'bday': 'birthday',
  'b/c': 'because',
  'cya': 'see you',
  'dm': 'direct message',
  'ftw': 'for the win',
  'gg': 'good game',
  'gr8': 'great',
  'hbu': 'how about you?',
  'hmu': 'hit me up',
  'idk': "I don't know",
  'jk': 'just kidding',
  'l8r': 'later',
  'nvm': 'never mind',
  'np': 'no problem',
  'oof': 'that is unfortunate',
  'plz': 'please',
  'rofl': 'rolling on the floor laughing',
  'sup': 'what is up?',
  'thx': 'thanks',
  'ttyl': 'talk to you later',
  'w/e': 'whatever',
  'wth': 'what the heck',
  'wyd': 'what are you doing?',
  'yo': 'hey',
  'yolo': 'you only live once',
  'bbl': 'be back later',
  'bc': 'because',
  'cu': 'see you',
  'gf': 'girlfriend',
  'bf': 'boyfriend',
  'nsfw': 'not safe for work',
  'tmi': 'too much information',
  'wb': 'welcome back',
  'afaict': 'as far as I can tell',
  'bfn': 'bye for now',
  'ftl': 'for the loss',
  'icymi': 'in case you missed it',
  'imho': 'in my humble opinion',
  'lmao': 'laughing hard',
  'lol': 'laughing out loud',
  'nm': 'not much',
  'omw': 'on my way',
  'smth': 'something',
  'tldr': 'too long; did not read',
  'ty': 'thank you',
  'yw': 'you are welcome',
  'xoxo': 'hugs and kisses',
  'idgaf': "I don't care at all",
  'bruh': 'seriously?',
  'goat': 'greatest of all time',
  'salty': 'upset',
  'cap': 'lie',
  'no cap': 'no lie',
  'capping': 'lying',
  'big cap': 'huge lie',
  'slaps': 'sounds amazing',
  'fire': 'really good',
  'hits different': 'feels unique',
  'vibe': 'feeling',
  'ghosted': 'ignored',
  'sus': 'suspicious',
  'lowkey': 'a little',
  'highkey': 'definitely',
  'deadass': 'seriously',
  'finna': 'going to',
  'bet': 'okay',
  'on god': 'seriously',
  'bussin': 'tastes amazing',
  'situationship': 'friends with benefits'
};

// Whitelist of allowed contractions in Standard English output
const allowedContractions = new Set([
  "I'm", "you're", "he's", "she's", "it's", "we're", "they're",
  "I've", "you've", "we've", "they've",
  "I'll", "you'll", "he'll", "she'll", "it'll", "we'll", "they'll",
  "I'd", "you'd", "he'd", "she'd", "it'd", "we'd", "they'd",
  "isn't", "aren't", "wasn't", "weren't",
  "don't", "doesn't", "didn't",
  "haven't", "hasn't", "hadn't",
  "won't", "wouldn't", "shouldn't", "couldn't", "mightn't", "mustn't",
  "that's", "there's", "here's",
  "that'll", "there'll", "here'll",
  "that'd", "there'd", "here'd",
  "let's", "o'clock",
  "who's", "what's", "where's", "when's", "why's", "how's",
  "who'll", "what'll", "where'll", "when'll",
  "who'd", "what'd", "where'd", "when'd", "why'd", "how'd",
  "who've", "what've", "where've", "when've", "why've", "how've"
]);

// Function to restore whitelisted contractions in text
function restoreWhitelistedContractions(text: string): string {
  let result = text;
  
  // Map of expanded forms back to whitelisted contractions
  const contractionRestorations: Record<string, string> = {
    'I am': "I'm",
    'you are': "you're", 
    'he is': "he's",
    'she is': "she's",
    'it is': "it's",
    'we are': "we're",
    'they are': "they're",
    'I have': "I've",
    'you have': "you've",
    'we have': "we've", 
    'they have': "they've",
    'I will': "I'll",
    'you will': "you'll",
    'he will': "he'll",
    'she will': "she'll",
    'it will': "it'll",
    'we will': "we'll",
    'they will': "they'll",
    'I would': "I'd",
    'you would': "you'd",
    'he would': "he'd",
    'she would': "she'd",
    'it would': "it'd",
    'we would': "we'd",
    'they would': "they'd",
    'is not': "isn't",
    'are not': "aren't",
    'was not': "wasn't",
    'were not': "weren't",
    'do not': "don't",
    'does not': "doesn't",
    'did not': "didn't",
    'have not': "haven't",
    'has not': "hasn't",
    'had not': "hadn't",
    'will not': "won't",
    'would not': "wouldn't",
    'should not': "shouldn't",
    'could not': "couldn't",
    'might not': "mightn't",
    'must not': "mustn't",
    'that is': "that's",
    'there is': "there's",
    'here is': "here's",
    'that will': "that'll",
    'there will': "there'll",
    'here will': "here'll",
    'that would': "that'd",
    'there would': "there'd",
    'here would': "here'd",
    'let us': "let's",
    'who is': "who's",
    'what is': "what's",
    'where is': "where's",
    'when is': "when's",
    'why is': "why's",
    'how is': "how's",
    'who will': "who'll",
    'what will': "what'll",
    'where will': "where'll",
    'when will': "when'll",
    'who would': "who'd",
    'what would': "what'd",
    'where would': "where'd",
    'when would': "when'd",
    'why would': "why'd",
    'how would': "how'd",
    'who have': "who've",
    'what have': "what've",
    'where have': "where've",
    'when have': "when've",
    'why have': "why've",
    'how have': "how've"
  };
  
  // Replace expanded forms with contractions, being careful about word boundaries
  for (const [expanded, contracted] of Object.entries(contractionRestorations)) {
    const regex = new RegExp(`\\b${expanded}\\b`, 'gi');
    result = result.replace(regex, contracted);
  }
  
  return result;
}

// Function to fix cap mappings in post-processing
function fixCapMappings(text: string): string {
  let result = text;
  
  // Replace exaggeration-based translations with lie-based ones for cap terms
  const capMappings: Record<string, string> = {
    'exaggeration': 'lie',
    'without exaggeration': 'no lie',
    'stop exaggerating': 'stop lying',
    'an exaggeration': 'a lie',
    'that is an exaggeration': 'that is a lie',
    "that's an exaggeration": "that's a lie",
    'no exaggeration': 'no lie',
    'not exaggerating': 'not lying'
  };
  
  for (const [wrong, correct] of Object.entries(capMappings)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    result = result.replace(regex, correct);
  }
  
  return result;
}

// Function to fix situationship mappings in post-processing
function fixSituationshipMappings(text: string): string {
  let result = text;
  
  // Replace problematic situationship translations with correct ones
  const situationshipMappings: Record<string, string> = {
    'complicated relationship': 'friends with benefits',
    'undefined relationship': 'friends with benefits',
    'unclear relationship': 'friends with benefits',
    'ambiguous relationship': 'friends with benefits',
    'informal relationship': 'friends with benefits',
    'casual relationship': 'friends with benefits'
  };
  
  for (const [wrong, correct] of Object.entries(situationshipMappings)) {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    result = result.replace(regex, correct);
  }
  
  return result;
}

export async function bridgeToStandardEnglish(inputText: string): Promise<string> {
  try {
    const allowedContractionsList = Array.from(allowedContractions).join('", "');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Normalize this input to precise, formal American English.
The input may contain slang, abbreviations, contractions, and misspellings.

CRITICAL CONTRACTION WHITELIST - PRESERVE THESE EXACTLY:
${allowedContractionsList}

CRITICAL "CAP" TRANSLATION RULES (MANDATORY):
- "cap" / "that's cap" / "it's cap" → MUST use "lie" / "that's a lie" 
- "no cap" → MUST use "no lie" / "I'm serious" / "for real" 
- "capping" / "you're capping" → MUST use "lying" / "you're lying"
- "big cap" → MUST use "huge lie" / "total lie"
- FORBIDDEN: Never use "exaggeration" / "exaggerating" for cap terms
- Only use "exaggeration" if source explicitly means exaggerate/overhype/dramatic

CRITICAL "SITUATIONSHIP" TRANSLATION RULES (MANDATORY):
- "situationship" → MUST use "friends with benefits"
- FORBIDDEN: Never use "complicated relationship", "undefined relationship", "unclear relationship"

TRANSFORMATION RULES:
1. PRESERVE whitelisted contractions exactly as they appear in the whitelist above
2. EXPAND all non-whitelisted contractions (e.g., "can't" → "cannot", "won't" → "will not")  
3. EXPAND all abbreviations (e.g., "fr" → "for real", "idk" → "I do not know")
4. TRANSLATE slang terms (follow cap rules above, "deadass" → "seriously")
5. FIX spelling and grammar mistakes
6. TRANSLATE from other languages to American English if needed

EXAMPLES:
- "don't" → "don't" (whitelisted, keep it)
- "can't" → "cannot" (not whitelisted, expand it)  
- "they're" → "they're" (whitelisted, keep it)
- "theyre" → "they're" (fix spelling to whitelisted form)
- "fr" → "for real" (abbreviation, expand it)
- "that's cap" → "that's a lie" (slang, use lie not exaggeration)
- "no cap" → "no lie" (slang, use lie form)

OUTPUT REQUIREMENTS:
- Keep original meaning and intent intact
- Output only the normalized text, no explanations
- Make it sound natural but completely professional
- Use proper capitalization and punctuation`
        },
        {
          role: "user",
          content: inputText
        }
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    if (!response.choices[0]?.message?.content) {
      throw new Error("No content in OpenAI response");
    }

    const normalizedText = response.choices[0].message.content.trim();
    console.log(`📄 Normalized text: "${normalizedText}"`);
    
    // Apply post-processing to restore whitelisted contractions
    let finalText = restoreWhitelistedContractions(normalizedText);
    
    // Post-processing: Fix cap mappings if OpenAI used "exaggeration"
    finalText = fixCapMappings(finalText);
    
    // Post-processing: Fix situationship mappings if OpenAI used wrong terms
    finalText = fixSituationshipMappings(finalText);
    console.log(`✨ Final text with all fixes applied: "${finalText}"`);
    
    return finalText;
  } catch (error) {
    console.error("OpenAI bridge translation error:", error);
    return inputText;
  }
}

/**
 * Expands abbreviations using the comprehensive dictionary
 */
function expandAbbreviations(text: string): string {
  const normalizedInput = text
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '');

  const words = normalizedInput.split(' ');
  const translatedWords = words.map(word => abbreviationMap[word] || word);
  const fullTranslation = translatedWords.join(' ');

  // Return expanded text if any abbreviations were found
  if (fullTranslation !== normalizedInput) {
    return capitalizeFirstLetter(fullTranslation);
  }

  return text; // No abbreviations found
}

/**
 * Uses OpenAI to convert slang to clean Standard English (only when no abbreviations match)
 */
async function convertToStandardEnglish(
  inputText: string,
  sourceLanguage: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a language converter that transforms ${sourceLanguage} text into clean, natural American English. 

          GREETING RULES (PRIORITY):
          - For greetings, use natural, everyday phrases real Americans use:
            - "What's up?", "How's it going?", "How are you doing?", "How's everything?", "What's going on?"
          - NEVER use uncommon or poetic words like "aura", "atmosphere", "presence", etc.
          - Keep greetings simple, conversational, and natural - no word-for-word translations
          - Focus on how people actually speak in everyday conversation

          General Rules:
          - Output must sound like natural American English with zero slang or shorthand
          - Remove ALL informal language, abbreviations, and slang terms
          - Keep the same meaning but make it sound professional and clear
          - No explanations, just return the converted text
          - Never include abbreviations like "tbh", "ngl", "fr" in the output`
        },
        {
          role: "user",
          content: inputText
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    return response.choices[0].message.content?.trim() || inputText;
  } catch (error) {
    console.error("OpenAI bridge translation error:", error);
    return inputText; // Return original if OpenAI fails
  }
}

/**
 * Generates natural explanation for translations
 */
export async function generateExplanation(
  inputText: string, 
  outputText: string, 
  sourceLanguage: string, 
  targetLanguage: string
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a translation explanation engine. Explain what the translated text means without being conversational.

CRITICAL RULES:
- Start with "Basically they're saying..." or "They're trying to say..."
- Provide explanations, not conversations
- Focus on linguistic meaning, not social responses
- Give a natural, short paraphrase of the whole sentence in everyday spoken English (without slang)
- Clear definitions of any complex or shortened terms (like "fr" or "btw")
- Max 3 lines total
- Written in a friendly, casual tone — no academic or robotic phrases
- Use natural, simple American English - no slang in your explanation
- Format definitions like: "fire" means really good, "fr" means for real

Example:
Input: "That's so fire, I'm hyped about it fr!"
Output: "That is cool and they are super excited about it"
Explanation: "Basically they're saying that is cool and they are super excited about it. 'Fire' means really good and 'fr' means for real."`
        },
        {
          role: "user",
          content: `Input: "${inputText}"
Output: "${outputText}"
Source: ${sourceLanguage}
Target: ${targetLanguage}`
        }
      ],
      temperature: 0.3,
      max_tokens: 150
    });

    return response.choices[0].message.content?.trim() || "";
  } catch (error) {
    console.error("Explanation generation error:", error);
    return "";
  }
}

/**
 * Converts Standard English to Gen Z slang with freshness metadata
 */
async function standardToGenZWithMetadata(inputText: string, useLatestSlang: boolean = true): Promise<{ translation: string; metadata?: FreshnessMetadata }> {
  const normalized = inputText.trim().toLowerCase().replace(/[.,!?;:]/g, '');
  console.log(`🧠 Translating to Gen Z slang: "${normalized}"`);

  // Apply "have to"/"need to" → "gotta" normalization rule first
  const gottaNormalized = normalized
    .replace(/\bhave to\b/g, 'gotta')
    .replace(/\bneed to\b/g, 'gotta')
    .replace(/\bhad to\b/g, 'had to')  // Keep "had to" as is for past tense
    .replace(/\bneeded to\b/g, 'needed to'); // Keep "needed to" as is for past tense
  
  if (gottaNormalized !== normalized) {
    console.log(`🔄 Applied gotta normalization: "${normalized}" → "${gottaNormalized}"`);
  }

  const slangMap: Record<string, string> = {
    // Greetings and conversational openers - natural Gen Z style
    'hello': 'yo',
    'hi': 'yo',
    'hey': 'yo',
    'hi there': 'yooo',
    'hello there': 'wasup',
    'good morning': 'morning',
    'good afternoon': 'wasup',
    'good evening': 'yo',
    'how are you': 'how u doin',
    'how are you doing': 'what\'s good',
    'how\'s it going': 'wasup',
    'what\'s up': 'wsp',
    'what is up': 'wsp',
    'how\'s everything': 'what\'s good',
    'how are things': 'what\'s good',
    'what\'s going on': 'what\'s good',
    'how have you been': 'how u been',
    'hello how are you': 'yo what\'s good',
    'hi how are you': 'yo how u doin',
    'hey how are you': 'yo what\'s good',
    'hey what\'s up': 'yo wsp',
    'hi what\'s up': 'yo wsp',
    // Food-related expressions - natural Gen Z conversation style
    'where do you want to eat': 'yo what u tryna eat',
    'where do you wanna eat': 'yo what u tryna eat',
    'where should we eat': 'yo what u tryna eat',
    'where do you want to eat tonight': 'yo what u tryna eat',
    'where do you wanna eat tonight': 'yo what u tryna eat',
    'what do you want to eat': 'what u tryna eat',
    'what do you wanna eat': 'what u tryna eat',
    'do you want to eat': 'u down to eat',
    'do you wanna eat': 'u down to eat',
    'want to grab food': 'u down for some food',
    'wanna grab food': 'u down for some food',
    'want to get food': 'u down for some food',
    'wanna get food': 'u down for some food',
    'do you want to grab dinner': 'yo u down for dinner',
    'do you wanna grab dinner': 'yo u down for dinner',
    'want to grab dinner': 'u down for dinner',
    'wanna grab dinner': 'u down for dinner',
    'do you want to grab pizza': 'yo u down for pizza',
    'do you wanna grab pizza': 'yo u down for pizza',
    'want to grab pizza': 'u down for pizza',
    'wanna grab pizza': 'u down for pizza',
    'do you want to grab pizza later': 'wanna go grab sm pizza later',
    'do you wanna grab pizza later': 'wanna go grab sm pizza later',
    'want to eat later': 'u tryna eat later',
    'wanna eat later': 'u tryna eat later',
    'should we eat': 'u down to eat',
    'lets eat': 'u down to eat',
    'let\'s eat': 'u down to eat',
    'are you hungry': 'u hungry',
    'i\'m hungry': 'im hungry fr',
    'im hungry': 'im hungry fr',
    // Sleep-related expressions - authentic Gen Z style
    'i\'m going to sleep': 'imma gts',
    'im going to sleep': 'imma gts',
    'i\'m going to sleep now': 'imma gts rn',
    'im going to sleep now': 'imma gts rn',
    'i want to sleep': 'boutta gts',
    'want to sleep': 'boutta gts',
    'i need to sleep': 'boutta gts',
    'need to sleep': 'boutta gts',
    'time to sleep': 'gts time',
    'going to bed': 'gts',
    'i\'m tired': 'im dead',
    'good night': 'gn',
    'goodnight': 'gn',
    // Common expressions
    'i dont believe you': 'cap',
    'to be honest': 'tbh',
    'for real': 'fr',
    'thats amazing': 'thats fire',
    'im very tired': 'im dead',
    'i am very tired': 'im dead',
    'i agree': 'fr',
    'im excited': 'im hyped',
    'this is great': 'this slaps',
    'i like her outfit': 'her fit is fire',
    'this party was really fun': 'that party was lit',
    'im not joking': 'no cap',
    'i dont care': 'idc',
    'right now': 'rn',
    'in my opinion': 'imo',
    'i\'m confused': 'i\'m lost fr',
    'that\'s really good': 'that\'s fire',
    'this is awesome': 'this is fire',
    'i\'m going to sleep': 'bout to sleep, i\'m dead',
    'that\'s impressive': 'that hits different',
    'this food tastes amazing': 'this food is bussin',
    'i gotta study': 'gotta study',
    'i gotta study for my exam tomorrow': 'gotta hit the books for my exam tmrw',
    'i gotta go': 'gotta bounce',
    'i gotta work': 'gotta grind',
    'we gotta leave': 'we gotta dip',
    'that\'s cool': 'that\'s fire',
    'i\'m tired': 'i\'m dead',
    'seriously': 'deadass',
    'okay': 'bet',
    'going to': 'finna',
    'suspicious': 'sus',
    'a little': 'lowkey',
    'definitely': 'highkey'
  };

  // Check for exact matches first (using gotta-normalized version)
  if (slangMap[gottaNormalized]) {
    const slang = slangMap[gottaNormalized];
    console.log(`✅ Used shortcut slang map: "${slang}"`);
    return { translation: slang };
  }

  // Generate multiple candidates and apply freshness reranking
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Transform the given text into current 2025 Gen Z slang while preserving the EXACT original meaning:

GREETING RULES (PRIORITY - HANDLE FIRST):
- For greetings and conversational openers, use natural texting language:
  - "hi", "hello", "hey" → "yo"
  - "what's up" → "wsp" or "wasup"
  - "how are you" → "how u doin" or "what's good"
  - "how's it going" → "wasup"
  - "how's everything" → "what's good"
- Keep output short, casual, and authentic to Gen Z texting
- Avoid word-for-word translations for greetings
- Use popular openers: "yo", "wasup", "what's good", "wsp", "how u doin", "sup fam", "yooo"

FOOD TRANSLATION RULES (CRITICAL):
- For CHOICE QUESTIONS ("Where do you want to eat...?"), use: "yo what u tryna eat {time?}"
- For INVITATIONS with specific food/time ("grab pizza later"), keep food + time: "wanna go grab sm {food} {time?}" or "yo, down for {food} {time?}"
- Use casual contractions: "u", "sm" (some), "gn" (good night) when natural
- Do NOT introduce abstract nouns like "aura" or "atmosphere" - keep it food/plan specific
- Keep punctuation and casing casual (no title case)
- Examples:
  - "Where do you wanna eat tonight?" → "yo what u tryna eat"
  - "Do you want to grab pizza later?" → "wanna go grab sm pizza later"
  - "Want some food?" → "u down for sm food"

SLEEP TRANSLATION RULES (CRITICAL):
- NEVER use outdated sleep idioms like "catch some Z's", "hit the hay", "knock out"
- Always use authentic Gen Z abbreviations and short forms:
  - "I'm going to sleep now" → "imma gts rn"
  - "I want to sleep" → "boutta gts"
  - "Good night" → "gn"
- Use "gts" (go to sleep) as the primary sleep abbreviation
- Keep it short and authentic to real Gen Z texting patterns

NORMALIZATION RULES (APPLY FIRST):
- "have to" / "need to" → "gotta" (already applied in preprocessing)
- Input text may already contain "gotta" from normalization

MEANING PRESERVATION RULES (CRITICAL - HIGHEST PRIORITY):
- Keep the same core message, actions, and intent as the original
- Don't drift into different topics or add unrelated content
- Maintain specific details (who, what, when, where, why)
- Only change the style/language, never the substance
- The translation must clearly reflect the original intent
- If original says "study for exam", translation must mention studying and exam
- If original mentions specific actions, keep those exact actions in slang form

TRANSLATION RULES (CRITICAL):
- You are a translation engine. Output ONLY the translated text.
- Do NOT respond to questions or greetings conversationally
- Do NOT answer questions - translate them into the target style
- Transform the input linguistically, never provide conversational responses

Current trending terms to prefer: 'dead', 'crying', 'weak', 'rizz', 'delulu', 'brat', 'IJBOL', 'aura', 'slay', 'fire', 'hits different'.

AVOID outdated: 'high-key', 'low-key hilarious', 'cheugy', 'on fleek', 'bae', 'fam', 'lit', 'bussin'.

EXAMPLES:
Input: "I need to study for my exam tomorrow."
❌ WRONG (changes meaning): "Gotta ace that, it's gonna hit different."
✅ CORRECT (same meaning + slang): "Gotta grind for my exam tmrw."

Input: "How are you?"
❌ WRONG (conversational response): "I'm crying, why you gotta ask like that 💀"
✅ CORRECT (translation): "How you been?" or "Wasp?" or "What's good?"

Input: "Hello, how are you doing today?"
❌ WRONG (conversational response): "Hey bestie, I'm doing great thanks for asking!"
✅ CORRECT (translation): "Yo, how you doin' today?"

CRITICAL RULES:
- You are a translation engine, not a conversational AI
- Provide 3 different translation options separated by '|||'
- Each option must preserve the exact original meaning
- NEVER respond to questions - only translate them
- NEVER have conversations - only translate text
- Use current 2025 slang only
- No emojis or conversational responses
- Keep it natural but meaning-accurate
- Transform greetings/questions to slang equivalents, don't answer them`
        },
        {
          role: "user",
          content: gottaNormalized
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    });

    const rawResponse = response.choices[0].message.content?.trim() || inputText;
    const candidates = rawResponse.split('|||').map(text => text.trim()).filter(Boolean);
    
    // If we only got one candidate, add some basic alternatives
    if (candidates.length === 1) {
      candidates.push(inputText); // fallback to original
    }
    
    // Score candidates with LM confidence (simplified as length-based for now)
    const scoredCandidates = candidates.map(text => ({
      text,
      lmScore: Math.min(1, text.length / 50) // Simple scoring, could be improved
    }));

    // Apply freshness reranking with context awareness
    const result = rerankByFreshness(scoredCandidates, useLatestSlang, inputText);
    
    // Log slang usage for analytics
    logSlangUsage(inputText, result.text, result.metadata);
    
    console.log(`🎯 Freshness reranking applied: score=${result.finalScore.toFixed(2)}, blocked=${result.metadata.blocked_terms.join(', ')}, chosen=${result.metadata.chosen_term || 'none'}`);
    
    return { translation: result.text, metadata: result.metadata };
  } catch (error) {
    console.error("OpenAI Gen Z translation error:", error);
    return { translation: inputText };
  }
}

/**
 * Legacy function for backward compatibility
 */
export async function standardToGenZ(inputText: string): Promise<string> {
  const result = await standardToGenZWithMetadata(inputText, true);
  return result.translation;
}

/**
 * Transform Standard English to Formal English
 */
export async function transformToFormalEnglish(inputText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Transform the given text into formal, professional English while preserving the EXACT original meaning.

MEANING PRESERVATION RULES (CRITICAL - HIGHEST PRIORITY):
- Keep the same core message, actions, and intent as the original
- Don't drift into different topics or add unrelated content
- Maintain specific details (who, what, when, where, why)
- Only change the style/language, never the substance
- The translation must clearly reflect the original intent
- Transform informal language to formal while keeping exact meaning

FORMAL STYLE RULES:
- Use precise, professional language
- Avoid contractions (use "do not" instead of "don't")
- Use complete sentences with proper grammar
- Remove casual expressions
- Maintain original meaning while elevating tone
- Do NOT add prefixes or explanations, just return the formal version`
        },
        {
          role: "user",
          content: inputText
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    return response.choices[0].message.content?.trim() || inputText;
  } catch (error) {
    console.error("Formal English transformation error:", error);
    return inputText;
  }
}


/**
 * Transform Standard English to British English
 */
export async function transformToBritishEnglish(inputText: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Transform the given text into British English while preserving the EXACT original meaning.

MEANING PRESERVATION RULES (CRITICAL - HIGHEST PRIORITY):
- Keep the same core message, actions, and intent as the original
- Don't drift into different topics or add unrelated content
- Maintain specific details (who, what, when, where, why)
- Only change the style/language, never the substance
- The translation must clearly reflect the original intent
- Transform vocabulary and expressions to British style while keeping exact meaning

USE BRITISH VOCABULARY & EXPRESSIONS:
- "Brilliant" instead of "great"
- "Cheers" for "thanks"
- "Mate" for "friend"
- "Proper" for "really"
- "Blimey" for surprise
- "Bloody" as emphasis
- "Rubbish" for "garbage"
- "Mental" for "crazy"
- "Gutted" for "disappointed"
- "Chuffed" for "pleased"
- British spellings: colour, favour, realise, etc.

STYLE RULES:
- Use British vocabulary and spelling
- Include appropriate British slang
- Keep the original meaning exactly
- Sound naturally British, not forced
- Do NOT add prefixes or explanations`
        },
        {
          role: "user",
          content: inputText
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content?.trim() || inputText;
  } catch (error) {
    console.error("British English transformation error:", error);
    return inputText;
  }
}

/**
 * Main translation function that handles the complete bridge translation process
 * FIXED: Now properly handles all language transformations with consistent normalization
 */
export async function bridgeTranslate(
  inputText: string,
  sourceLanguage: string,
  targetLanguage: string,
  useLatestSlang: boolean = true
): Promise<{ translation: string; metadata?: FreshnessMetadata }> {
  console.log(`🚀 bridgeTranslate called: "${inputText}" from ${sourceLanguage} to ${targetLanguage}`);
  
  // STEP 0: Handle specific problematic translations early
  const normalizedInput = inputText.toLowerCase().trim();
  if (normalizedInput === 'situationship' && sourceLanguage === 'gen_z_english' && targetLanguage === 'millennial_english') {
    console.log('🎯 Direct mapping: situationship → friends with benefits');
    return { translation: 'friends with benefits' };
  }
  
  // STEP 1: Always normalize to Standard English first (unless source is already standard_english)
  let standardText = inputText;
  if (sourceLanguage !== 'standard_english') {
    console.log('📝 Normalizing to Standard English first...');
    standardText = await bridgeToStandardEnglish(inputText);
    console.log(`📄 Normalized text: "${standardText}"`);
  }
  
  // STEP 2: If target is Standard English, return the normalized text
  if (targetLanguage === 'standard_english') {
    console.log('✅ Target is Standard English, returning normalized text');
    return { translation: standardText };
  }
  
  // STEP 3: Transform from Standard English to target language/style
  console.log(`🎯 Transforming Standard English to ${targetLanguage}`);
  
  if (targetLanguage === 'gen_z_english') {
    console.log('🔥 Using standardToGenZ with freshness system');
    const result = await standardToGenZWithMetadata(standardText, useLatestSlang);
    return result;
  } else if (targetLanguage === 'formal_english') {
    console.log('📋 Using formal English transformation');
    const translation = await transformToFormalEnglish(standardText);
    return { translation };
  } else if (targetLanguage === 'british_english') {
    console.log('🇬🇧 Using British English transformation');
    const translation = await transformToBritishEnglish(standardText);
    return { translation };
  } else {
    // For foreign languages (Spanish, French), use standard translation
    console.log('🌍 Using standard OpenAI translation for foreign language');
    const translation = await standardTranslation(standardText, 'standard_english', targetLanguage);
    return { translation };
  }
}

/**
 * Standard OpenAI translation for all language pairs (non-Gen Z)
 */
export async function standardTranslation(
  inputText: string,
  sourceLanguage: string,
  targetLanguage: string,
  context?: string
): Promise<string> {
  try {
    // Language mapping for cleaner prompts
    const languageNames: Record<string, string> = {
      'standard_english': 'Standard English',
      'formal_english': 'Formal English',
      'gen_z_english': 'Gen Z English',
      'british_english': 'British English',
      'spanish': 'Spanish',
      'french': 'French'
    };

    const sourceName = languageNames[sourceLanguage] || sourceLanguage;
    const targetName = languageNames[targetLanguage] || targetLanguage;

    let systemPrompt = `Translate the following text from ${sourceName} to ${targetName} while preserving the EXACT original meaning.

MEANING PRESERVATION RULES (CRITICAL - HIGHEST PRIORITY):
- Keep the same core message, actions, and intent as the original
- Don't drift into different topics or add unrelated content
- Maintain specific details (who, what, when, where, why)
- Only change the style/language, never the substance
- The translation must clearly reflect the original intent without drifting from the core message

IMPORTANT RULES:
- Provide ONLY the direct translation, no additional text
- Do NOT add prefixes like "Translation:" or "Here is the translation:"
- Do NOT add explanations or commentary
- Make the translation natural and fluent in the target language
- Maintain the original tone and meaning exactly`;

    // Add context-specific instructions if provided
    if (context && context !== 'general') {
      const contextInstructions: Record<string, string> = {
        'casual': 'Use a casual, friendly tone appropriate for informal conversations.',
        'formal': 'Use formal, professional language appropriate for business or academic contexts.',
        'technical': 'Use precise, technical language appropriate for professional or academic contexts.',
        'creative': 'Use creative, expressive language that captures the artistic or literary nature of the text.'
      };
      
      if (contextInstructions[context]) {
        systemPrompt += `\n- ${contextInstructions[context]}`;
      }
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: inputText
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    return response.choices[0].message.content?.trim() || inputText;
  } catch (error) {
    console.error("Standard translation error:", error);
    return inputText;
  }
}

/**
 * Utility function to capitalize first letter
 */
function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}