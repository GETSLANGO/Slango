#!/usr/bin/env node

/**
 * Test to ensure strict translation-only behavior
 * Tests that "How are you?" gets translated, not responded to conversationally
 */

const BASE_URL = 'http://localhost:5000';

async function testTranslationOnly() {
  console.log('🧪 Testing strict translation-only behavior...\n');

  const testCases = [
    {
      input: "How are you?",
      from: "standard_english",
      to: "gen_z_english",
      expectedType: "translation",
      shouldNotContain: ["I'm crying", "why you gotta", "bestie"]
    },
    {
      input: "Hello, how are you doing today?",
      from: "standard_english", 
      to: "gen_z_english",
      expectedType: "translation",
      shouldNotContain: ["I'm doing great", "thanks for asking"]
    },
    {
      input: "What's up?",
      from: "standard_english",
      to: "gen_z_english", 
      expectedType: "translation",
      shouldNotContain: ["Nothing much", "just chilling"]
    }
  ];

  let allPassed = true;

  for (const testCase of testCases) {
    console.log(`Testing: "${testCase.input}" (${testCase.from} → ${testCase.to})`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputText: testCase.input,
          sourceLanguage: testCase.from,
          targetLanguage: testCase.to
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      const translation = result.translation;
      
      console.log(`  Result: "${translation}"`);
      
      // Check that result is not conversational
      let isConversational = false;
      for (const phrase of testCase.shouldNotContain) {
        if (translation.toLowerCase().includes(phrase.toLowerCase())) {
          console.log(`  ❌ FAIL: Contains conversational phrase "${phrase}"`);
          isConversational = true;
          allPassed = false;
        }
      }
      
      if (!isConversational) {
        console.log(`  ✅ PASS: Correctly translated without conversational response`);
      }
      
    } catch (error) {
      console.log(`  ❌ ERROR: ${error.message}`);
      allPassed = false;
    }
    
    console.log('');
  }

  console.log(allPassed ? '🎉 All tests passed!' : '💥 Some tests failed!');
  process.exit(allPassed ? 0 : 1);
}

// Run the test
testTranslationOnly().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
});