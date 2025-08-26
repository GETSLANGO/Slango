/**
 * Web-specific Home Page Component
 * Uses modular components and platform-agnostic core
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../client/src/components/ui/card';
import { Badge } from '../../client/src/components/ui/badge';
import { Globe, Zap, Shield, Users } from 'lucide-react';
import TranslationInterface from '../components/TranslationInterface.jsx';
import { LANGUAGE_CONFIGS } from '../../translator.js';

/**
 * Feature Card Component
 */
const FeatureCard = ({ icon: Icon, title, description, badge }) => (
  <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-all duration-300">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center text-white">
        <Icon className="w-5 h-5 mr-2 text-blue-500" />
        {title}
        {badge && <Badge variant="secondary" className="ml-2">{badge}</Badge>}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

/**
 * Language Support Grid Component
 */
const LanguageSupportGrid = () => {
  const languages = Object.values(LANGUAGE_CONFIGS);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {languages.map((lang) => (
        <div
          key={lang.code}
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center hover:border-gray-600 transition-colors"
        >
          <div className="text-2xl mb-1">{lang.flag}</div>
          <div className="text-white text-sm font-medium">{lang.name}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * Stats Component
 */
const StatsSection = () => {
  const stats = [
    { label: 'Languages Supported', value: Object.keys(LANGUAGE_CONFIGS).length },
    { label: 'Translation Accuracy', value: '95%+' },
    { label: 'Voice Synthesis', value: 'Multi-dialect' },
    { label: 'Response Time', value: '<2s' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="text-center">
          <div className="text-3xl font-bold text-blue-500 mb-2">{stat.value}</div>
          <div className="text-gray-400 text-sm">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

/**
 * Main Home Page Component
 */
export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Globe className="text-blue-500 text-2xl" />
              <div>
                <h1 className="text-xl font-bold text-white tracking-wide">SlangSwap</h1>
                <p className="text-xs text-gray-400">Multilingual Translation Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {Object.keys(LANGUAGE_CONFIGS).length} Languages
              </Badge>
              <Badge variant="outline" className="text-green-400 border-green-400">
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Break Language
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"> Barriers</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            Seamlessly translate between multiple languages and dialects with AI-powered accuracy 
            and authentic voice synthesis. From Gen Z slang to formal Spanish, we've got you covered.
          </p>
          
          {/* Stats */}
          <StatsSection />
        </div>

        {/* Translation Interface */}
        <div className="mb-16">
          <TranslationInterface />
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Globe}
              title="Multi-Language Support"
              description="Support for 7 different languages and dialects including slang variants and formal languages."
              badge="7 Languages"
            />
            <FeatureCard
              icon={Zap}
              title="AI-Powered Translation"
              description="Advanced OpenAI GPT-4o model ensures accurate, contextual translations with cultural nuances."
              badge="GPT-4o"
            />
            <FeatureCard
              icon={Users}
              title="Voice Synthesis"
              description="Authentic pronunciation with dedicated voices for each language using ElevenLabs technology."
              badge="Multi-Voice"
            />
            <FeatureCard
              icon={Shield}
              title="Platform Agnostic"
              description="Modular architecture ready for web, mobile, and cross-platform deployment."
              badge="Scalable"
            />
          </div>
        </div>

        {/* Language Support */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Supported Languages</h2>
          <LanguageSupportGrid />
        </div>

        {/* Technical Features */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Technical Architecture</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Core Engine</h3>
              <p className="text-gray-400 text-sm">Platform-agnostic translation engine in translator.js</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Modular Components</h3>
              <p className="text-gray-400 text-sm">Reusable UI components for web and mobile platforms</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cross-Platform</h3>
              <p className="text-gray-400 text-sm">Ready for web, React Native, and PWA deployment</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;