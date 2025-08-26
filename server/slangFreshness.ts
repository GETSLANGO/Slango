/**
 * Slang Freshness System
 * Ensures translations favor current 2025 slang and avoid outdated terms
 */

export interface SlangTerm {
  term: string;
  aliases: string[];
  status: 'current' | 'fading' | 'deprecated';
  last_seen: string; // ISO date
  source_count_30d: number;
  trend_hits_30d: number;
  age_months: number;
  region: string;
  notes: string;
}

export interface FreshnessMetadata {
  slang_mode: string;
  blocked_terms: string[];
  chosen_term?: string;
  freshness_score?: number;
  context_type?: 'vibe' | 'humor' | 'emotion' | 'status';
}

export interface TranslationResult {
  translation: string;
  context: string;
  metadata?: FreshnessMetadata;
}

// Context-aware slang categorization
const contextSlang = {
  humor: ['dead', 'crying', 'weak', 'killed me', '💀'],
  vibe: ['main character', 'luxury', 'delulu', 'NPC energy', 'clean girl', 'chaotic', 'CEO', 'a vibe'],
  emotion: ['dead', 'crying', 'weak', 'lowkey', 'highkey'],
  status: ['fire', 'hits', 'so good', 'slaps']
};

// "It's giving" allowed complements for vibe contexts only
const itsGivingComplements = [
  'main character', 'luxury', 'delulu', 'NPC energy', 'clean girl', 
  'chaotic', 'CEO', 'mid', 'a vibe'
];

// Seed data for launch - manually curated current vs deprecated terms
const SLANG_TERMS_DB: SlangTerm[] = [
  // Current 2025 terms
  { term: "rizz", aliases: ["rizzed up", "rizzing"], status: "current", last_seen: "2025-08-13", source_count_30d: 1820, trend_hits_30d: 950, age_months: 8, region: "US", notes: "flirting/charisma" },
  { term: "delulu", aliases: ["delusion"], status: "current", last_seen: "2025-08-13", source_count_30d: 1200, trend_hits_30d: 780, age_months: 6, region: "US", notes: "delusional" },
  { term: "brat", aliases: ["brat summer"], status: "current", last_seen: "2025-08-13", source_count_30d: 980, trend_hits_30d: 650, age_months: 4, region: "US", notes: "confident rebellious energy" },
  { term: "gyatt", aliases: ["gyat"], status: "current", last_seen: "2025-08-13", source_count_30d: 890, trend_hits_30d: 520, age_months: 7, region: "US", notes: "expression of surprise/admiration" },
  { term: "IJBOL", aliases: ["ijbol"], status: "current", last_seen: "2025-08-13", source_count_30d: 750, trend_hits_30d: 480, age_months: 5, region: "US", notes: "I just burst out laughing" },
  { term: "mog", aliases: ["mogging"], status: "current", last_seen: "2025-08-13", source_count_30d: 680, trend_hits_30d: 390, age_months: 9, region: "US", notes: "dominate/outshine" },
  { term: "mid", aliases: [], status: "current", last_seen: "2025-08-13", source_count_30d: 1100, trend_hits_30d: 620, age_months: 12, region: "US", notes: "mediocre/average" },
  { term: "let him cook", aliases: ["let them cook"], status: "current", last_seen: "2025-08-13", source_count_30d: 850, trend_hits_30d: 450, age_months: 8, region: "US", notes: "let them do their thing" },
  { term: "dead", aliases: ["ded"], status: "current", last_seen: "2025-08-13", source_count_30d: 1300, trend_hits_30d: 780, age_months: 15, region: "US", notes: "extremely funny" },
  { term: "it's giving", aliases: ["giving"], status: "current", last_seen: "2025-08-13", source_count_30d: 920, trend_hits_30d: 580, age_months: 10, region: "US", notes: "it's giving off vibes of" },
  { term: "aura", aliases: [], status: "current", last_seen: "2025-08-13", source_count_30d: 1400, trend_hits_30d: 820, age_months: 6, region: "US", notes: "presence/energy" },
  { term: "npc", aliases: [], status: "current", last_seen: "2025-08-13", source_count_30d: 760, trend_hits_30d: 420, age_months: 11, region: "US", notes: "someone acting without personality" },
  { term: "slay", aliases: ["slayed"], status: "current", last_seen: "2025-08-13", source_count_30d: 950, trend_hits_30d: 510, age_months: 18, region: "US", notes: "did something amazing" },
  { term: "no cap", aliases: ["no 🧢"], status: "current", last_seen: "2025-08-13", source_count_30d: 1150, trend_hits_30d: 670, age_months: 20, region: "US", notes: "no lie/for real" },
  { term: "bussin", aliases: [], status: "current", last_seen: "2025-08-13", source_count_30d: 680, trend_hits_30d: 380, age_months: 22, region: "US", notes: "really good (usually food)" },
  { term: "periodt", aliases: ["period"], status: "current", last_seen: "2025-08-13", source_count_30d: 590, trend_hits_30d: 320, age_months: 24, region: "US", notes: "end of discussion" },
  { term: "bet", aliases: [], status: "current", last_seen: "2025-08-13", source_count_30d: 1200, trend_hits_30d: 690, age_months: 30, region: "US", notes: "agreed/okay" },
  
  // Fading terms
  { term: "sus", aliases: ["suspicious"], status: "fading", last_seen: "2025-08-10", source_count_30d: 420, trend_hits_30d: 180, age_months: 36, region: "US", notes: "suspicious/questionable" },
  { term: "simp", aliases: ["simping"], status: "fading", last_seen: "2025-08-08", source_count_30d: 350, trend_hits_30d: 150, age_months: 42, region: "US", notes: "overly devoted" },
  
  // Deprecated terms - avoid these
  { term: "high-key", aliases: ["highkey"], status: "deprecated", last_seen: "2025-07-20", source_count_30d: 85, trend_hits_30d: 15, age_months: 48, region: "US", notes: "obviously/really (outdated)" },
  { term: "low-key hilarious", aliases: ["lowkey hilarious"], status: "deprecated", last_seen: "2025-07-15", source_count_30d: 42, trend_hits_30d: 8, age_months: 48, region: "US", notes: "somewhat funny (outdated phrasing)" },
  { term: "cheugy", aliases: [], status: "deprecated", last_seen: "2025-06-30", source_count_30d: 28, trend_hits_30d: 5, age_months: 48, region: "US", notes: "outdated/trying too hard (unless ironic)" },
  { term: "on fleek", aliases: [], status: "deprecated", last_seen: "2025-06-15", source_count_30d: 15, trend_hits_30d: 2, age_months: 96, region: "US", notes: "perfect/on point (very outdated)" },
  { term: "bae", aliases: [], status: "deprecated", last_seen: "2025-05-20", source_count_30d: 32, trend_hits_30d: 6, age_months: 84, region: "US", notes: "romantic partner (outdated when non-ironic)" },
  { term: "fam", aliases: [], status: "deprecated", last_seen: "2025-05-10", source_count_30d: 45, trend_hits_30d: 12, age_months: 72, region: "US", notes: "friends/family (overused, outdated)" },
  { term: "lit", aliases: [], status: "deprecated", last_seen: "2025-04-25", source_count_30d: 38, trend_hits_30d: 8, age_months: 60, region: "US", notes: "exciting/awesome (outdated)" },
  { term: "woke", aliases: [], status: "deprecated", last_seen: "2025-04-10", source_count_30d: 22, trend_hits_30d: 4, age_months: 72, region: "US", notes: "socially aware (now political/outdated in slang)" },
  { term: "it's giving comedy", aliases: ["its giving comedy"], status: "deprecated", last_seen: "2025-04-01", source_count_30d: 5, trend_hits_30d: 1, age_months: 6, region: "US", notes: "unnatural phrase - use humor terms instead" },
  { term: "bussin", aliases: [], status: "deprecated", last_seen: "2025-03-15", source_count_30d: 28, trend_hits_30d: 8, age_months: 24, region: "US", notes: "overused, becoming outdated" }
];

// Weights for freshness scoring
const FRESHNESS_WEIGHTS = {
  w1: 0.3, // last_seen_30d weight
  w2: 0.25, // source_count_30d weight  
  w3: 0.25, // trend_hits_30d weight
  w4: 0.2  // age_months penalty weight
};

const RERANK_PARAMS = {
  alpha: 0.4, // freshness boost
  beta: 0.8   // deprecated penalty
};

/**
 * Calculate freshness score for a term (0-1 scale)
 */
function calculateFreshnessScore(term: SlangTerm): number {
  const daysSinceLastSeen = Math.max(0, (new Date().getTime() - new Date(term.last_seen).getTime()) / (1000 * 60 * 60 * 24));
  const last_seen_score = Math.max(0, 1 - (daysSinceLastSeen / 30)); // decay over 30 days
  
  const source_score = Math.min(1, term.source_count_30d / 1000); // normalize to max 1000
  const trend_score = Math.min(1, term.trend_hits_30d / 500); // normalize to max 500
  const age_penalty = Math.min(1, term.age_months / 60); // penalty increases with age up to 5 years
  
  const score = (
    FRESHNESS_WEIGHTS.w1 * last_seen_score +
    FRESHNESS_WEIGHTS.w2 * source_score +
    FRESHNESS_WEIGHTS.w3 * trend_score -
    FRESHNESS_WEIGHTS.w4 * age_penalty
  );
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Find matching slang terms in text
 */
function findSlangTermsInText(text: string): SlangTerm[] {
  const lowerText = text.toLowerCase();
  const matches: SlangTerm[] = [];
  
  for (const term of SLANG_TERMS_DB) {
    // Check main term
    if (lowerText.includes(term.term.toLowerCase())) {
      matches.push(term);
      continue;
    }
    
    // Check aliases
    for (const alias of term.aliases) {
      if (lowerText.includes(alias.toLowerCase())) {
        matches.push(term);
        break;
      }
    }
  }
  
  return matches;
}

/**
 * Detect context type from input text for appropriate slang selection
 */
function detectContextType(inputText: string): 'vibe' | 'humor' | 'emotion' | 'status' {
  const lowerInput = inputText.toLowerCase().trim();
  
  // Humor indicators
  if (lowerInput.includes('funny') || lowerInput.includes('hilarious') || lowerInput.includes('joke') || 
      lowerInput.includes('laugh') || lowerInput.includes('comedy')) {
    return 'humor';
  }
  
  // Vibe/aesthetic indicators (outfit, look, style, setup, energy)
  if (lowerInput.includes('outfit') || lowerInput.includes('look') || lowerInput.includes('style') ||
      lowerInput.includes('setup') || lowerInput.includes('energy') || lowerInput.includes('vibe') ||
      lowerInput.includes('aesthetic') || lowerInput.includes('main character') || lowerInput.includes('luxury')) {
    return 'vibe';
  }
  
  // Emotion indicators (tired, excited, happy, sad, angry)
  if (lowerInput.includes('tired') || lowerInput.includes('excited') || lowerInput.includes('happy') ||
      lowerInput.includes('sad') || lowerInput.includes('angry') || lowerInput.includes('feeling')) {
    return 'emotion';
  }
  
  // Default to status for quality/evaluation terms (good, bad, great, amazing)
  return 'status';
}

/**
 * Get deprecated terms that should be avoided
 */
function getDeprecatedTerms(): string[] {
  return SLANG_TERMS_DB
    .filter(term => term.status === 'deprecated')
    .flatMap(term => [term.term, ...term.aliases]);
}

/**
 * Get current/trending terms that should be preferred
 */
function getCurrentTerms(): SlangTerm[] {
  return SLANG_TERMS_DB
    .filter(term => term.status === 'current')
    .sort((a, b) => calculateFreshnessScore(b) - calculateFreshnessScore(a));
}

/**
 * Rerank translation candidates based on freshness and context appropriateness
 */
export function rerankByFreshness(
  candidates: { text: string; lmScore: number }[],
  useLatestSlang: boolean = true,
  inputText: string = ''
): { text: string; finalScore: number; metadata: FreshnessMetadata } {
  if (!useLatestSlang || candidates.length === 0) {
    return {
      text: candidates[0]?.text || "",
      finalScore: candidates[0]?.lmScore || 0,
      metadata: { slang_mode: "disabled", blocked_terms: [] }
    };
  }
  
  // Detect context type for appropriate slang selection
  const contextType = detectContextType(inputText);
  console.log(`🎯 Context detected: ${contextType} for input: "${inputText}"`);
  
  const deprecatedTerms = getDeprecatedTerms();
  const blockedTerms: string[] = [];
  
  const scoredCandidates = candidates.map(candidate => {
    const foundTerms = findSlangTermsInText(candidate.text);
    const candidateText = candidate.text.toLowerCase();
    
    let freshnessBoost = 0;
    let deprecatedPenalty = 0;
    let contextPenalty = 0;
    
    // Check for "It's giving" usage rules - much stronger penalties
    if (candidateText.includes("it's giving") || candidateText.includes("its giving")) {
      if (contextType === 'humor' || contextType === 'emotion' || contextType === 'status') {
        // Heavily penalize "It's giving" for non-vibe contexts
        contextPenalty += 2.0;
        blockedTerms.push("it's giving (wrong context)");
        console.log(`❌ BLOCKED "It's giving" for ${contextType} context with heavy penalty`);
      } else if (contextType === 'vibe') {
        // Boost "It's giving" for vibe contexts only
        freshnessBoost += 0.3;
        console.log(`✅ Boosted "It's giving" for vibe context`);
      }
      
      // Specific blocking for "it's giving comedy" and similar unnatural phrases
      if (candidateText.includes("comedy") || candidateText.includes("funny") || candidateText.includes("hilarious")) {
        contextPenalty += 3.0;
        blockedTerms.push("it's giving comedy (unnatural)");
        console.log(`❌ HEAVILY BLOCKED "It's giving comedy" - unnatural phrase`);
      }
    }
    
    // Apply context-specific term preferences
    if (contextType === 'humor') {
      const humorTerms = contextSlang.humor;
      const hasHumorTerm = humorTerms.some(term => candidateText.includes(term));
      if (hasHumorTerm) {
        freshnessBoost += 0.2;
      }
    }
    
    for (const term of foundTerms) {
      const freshnessScore = calculateFreshnessScore(term);
      
      if (term.status === 'deprecated') {
        deprecatedPenalty += RERANK_PARAMS.beta;
        blockedTerms.push(term.term);
      } else if (term.status === 'current') {
        freshnessBoost += RERANK_PARAMS.alpha * freshnessScore;
      }
    }
    
    const finalScore = candidate.lmScore + freshnessBoost - deprecatedPenalty - contextPenalty;
    
    return {
      text: candidate.text,
      lmScore: candidate.lmScore,
      finalScore,
      freshnessBoost,
      deprecatedPenalty,
      blockedTerms,
      foundTerms
    };
  });
  
  // Filter out candidates with deprecated terms unless no alternatives
  const nonDeprecatedCandidates = scoredCandidates.filter(c => c.blockedTerms.length === 0);
  const viableCandidates = nonDeprecatedCandidates.length > 0 ? nonDeprecatedCandidates : scoredCandidates;
  
  // Sort by final score
  viableCandidates.sort((a, b) => b.finalScore - a.finalScore);
  
  const winner = viableCandidates[0];
  const allBlockedTerms = scoredCandidates.flatMap(c => c.blockedTerms);
  
  return {
    text: winner.text,
    finalScore: winner.finalScore,
    metadata: {
      slang_mode: "latest",
      blocked_terms: [...new Set(allBlockedTerms)],
      chosen_term: winner.foundTerms.find(t => t.status === 'current')?.term,
      freshness_score: winner.freshnessBoost,
      context_type: contextType
    }
  };
}

/**
 * Get suggestions for replacing deprecated terms with current alternatives
 */
export function getSuggestedReplacements(deprecatedTerm: string): string[] {
  const deprecated = SLANG_TERMS_DB.find(t => 
    t.term.toLowerCase() === deprecatedTerm.toLowerCase() || 
    t.aliases.some(a => a.toLowerCase() === deprecatedTerm.toLowerCase())
  );
  
  if (!deprecated || deprecated.status !== 'deprecated') {
    return [];
  }
  
  // Return current terms that could be alternatives based on context
  const contextMap: Record<string, string[]> = {
    'high-key': ['honestly', 'fr', 'no cap', 'dead'],
    'low-key hilarious': ['dead', 'IJBOL', 'it\'s sending me'],
    'cheugy': ['mid', 'npc behavior'],
    'on fleek': ['slay', 'it\'s giving', 'periodt'],
    'bae': ['my person', 'bestie'],
    'lit': ['bussin', 'it\'s giving', 'slay'],
    'fam': ['bestie', 'gang'],
    'woke': ['aware', 'conscious']
  };
  
  return contextMap[deprecated.term] || [];
}

/**
 * Enhanced logging for slang usage analytics
 */
export function logSlangUsage(inputText: string, outputText: string, metadata: FreshnessMetadata): void {
  // In a real system, this would log to analytics/database
  // For now, just console log for debugging
  console.log('🎯 Slang Analytics:', {
    timestamp: new Date().toISOString(),
    blocked_terms: metadata.blocked_terms,
    chosen_term: metadata.chosen_term,
    slang_mode: metadata.slang_mode,
    freshness_score: metadata.freshness_score
  });
}