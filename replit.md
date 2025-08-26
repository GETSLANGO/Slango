# Slango - Multilingual Translation Platform

## Overview
Slango is a full-stack web application designed to translate standard English text into various slang and formal language styles, including Gen Z slang, Millennial slang, British English, Formal English, Spanish, and French, utilizing OpenAI's GPT-4o model. The platform aims to bridge communication gaps by providing authentic, contextual translations and clear, teacher-like explanations of slang terms. It features a modern React frontend with Tailwind CSS, a Node.js/Express backend, and PostgreSQL database integration. Slango is built with a focus on modularity and platform-agnostic architecture, enabling seamless expansion to mobile and other environments. Its vision is to become a comprehensive, universally accessible translation tool for nuanced language styles.

## User Preferences
Preferred communication style: Simple, everyday language.

## Recent Changes (August 21, 2025)
- **Animated Loading Indicator**: Implemented responsive animated loading dots ("Translating...") with staggered animations and 120ms flicker prevention delay for smooth UX during API calls
- **"Gotta" Normalization Rule**: Added preprocessing rule in Gen Z translation pipeline that automatically converts "have to"/"need to" → "gotta" while preserving past tense forms ("had to"/"needed to" remain unchanged). This ensures consistent Gen Z slang patterns regardless of input variations.
- **Button State Management**: All action buttons (Copy, Share, Save, Audio) are now properly disabled during loading states with accessibility attributes
- **Translation Caching System**: Implemented server-side SQLite caching with 30-day TTL and 7-day stale-while-revalidate for reduced API costs and latency
- **Cache Management**: Added cache control query parameters (?cache=refresh, ?cache=skip) and admin endpoints for invalidation and statistics
- **Background Refresh**: Automatic background revalidation of stale cache entries without blocking user requests
- **Enhanced Meaning Preservation (Critical Update)**: Strengthened all translation prompts with "CRITICAL - HIGHEST PRIORITY" rules to prevent meaning drift. Updated Gen Z, Millennial, British, Formal English, and general translation functions with explicit examples of correct vs incorrect translations.
- **Translation Accuracy**: Added explicit requirements to maintain core message, actions, and intent without drifting into different topics. Example: "I need to study for my exam tomorrow" → "Gotta grind for my exam tmrw" (correct) vs "Gotta ace that, it's gonna hit different" (wrong - changes meaning)
- **Strict Translation-Only Behavior (Critical Fix)**: Eliminated all conversational/chat behavior from translation system. Fixed issue where "How are you?" was responded to conversationally ("I'm crying, why you gotta ask like that 💀") instead of being translated ("how you been"). Added validation to detect and prevent conversational responses. All inputs now receive proper translations, never conversational replies.
- **Style vs Substance**: Emphasized that only language/style should change, never the substance of the original message
- **Feedback Form Implementation**: Replaced "Recent Translations" block with feedback input card featuring email integration
- **Email Integration**: All feedback submissions now send emails to slango.team.ai@gmail.com using the same Resend service as Contact Us

## System Architecture
### Core Architecture (Platform-Agnostic)
- **Translation Engine**: `server/bridgeTranslation.ts` houses the central business logic, designed for consistent normalization and transformation.
- **Bridge Layer Architecture**: Employs a consistent three-step process: 1) Normalize to Standard English, 2) Transform to target style/language, 3) Generate natural explanations.
- **Language Configurations**: Supports 7+ language types with dedicated OpenAI prompts for each transformation (Gen Z, Formal, Millennial, British, Spanish, French).
- **Normalization System**: All non-Standard English inputs are first normalized via `bridgeToStandardEnglish()` to ensure consistent processing.
- **Context Explanations**: Natural explanations starting with "Basically they're saying..." that include slang definitions and simple American English.
- **Translation-Only Enforcement**: Strict validation prevents conversational responses. System translates all inputs (including greetings/questions) rather than responding to them. API rejects chat-like fields and enforces translation-only behavior.
- **Error Handling**: Comprehensive retry mechanisms and graceful degradation.
- **Caching**: SQLite-based server-side caching with 30-day TTL, 7-day stale-while-revalidate, and background refresh. Includes cache control parameters and admin endpoints for management. Reduces API costs and improves response times from seconds to <10ms for cached results.

### Web Architecture (`web-ui/`)
- **Framework**: React 18 with TypeScript.
- **Build Tool**: Vite.
- **UI Library**: Shadcn/ui components with Radix UI primitives.
- **Styling**: Tailwind CSS with custom CSS variables and a futuristic metallic silver-blue gradient aesthetic, including glass morphism effects and dark/light mode toggle.
- **State Management**: TanStack Query (React Query) for server state.
- **Routing**: Wouter.
- **Form Handling**: React Hook Form with Zod validation.
- **UI/UX Decisions**: Tesla/X.com inspired minimalist design, repositioned language selectors directly above text areas for clarity, horizontal side-by-side layout for all screen sizes, and consistent typography.

### Mobile Architecture (`app-ui/`)
- **Framework**: React Native (ready for deployment).
- **Components**: Platform-optimized UI components using React Native primitives.
- **Navigation**: React Navigation.
- **Audio**: Expo Audio / React Native Sound integration.
- **Storage**: AsyncStorage with platform abstraction.
- **Layout**: Optimized for mobile with proper button sizes, readable fonts, and responsive design.

### Shared Utilities (`utils/`)
- **HTTP Client Factory**: Abstracts platform-specific HTTP implementations.
- **Storage Abstraction**: Provides unified storage access.
- **Audio Management**: Manages audio playback across platforms.
- **Platform Detection**: Automatically detects platform capabilities.

### Backend Architecture
- **Runtime**: Node.js with Express.js.
- **Language**: TypeScript with ES modules.
- **API Pattern**: RESTful API design.
- **Middleware**: Custom logging and error handling.

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production).
- **ORM**: Drizzle ORM with Drizzle Kit for migrations.
- **Development Storage**: In-memory storage for development.
- **Connection**: Neon Database serverless driver for PostgreSQL.

### Feature Specifications
- **Bidirectional Translation**: Supports translation both to and from slang/formal languages.
- **Audio Playback**: Features Gen Z-friendly voice settings, enhanced voice pronunciation guides, and a dual voice system for distinct branding.
- **Explanations**: Provides concise, 2-3 sentence, simple teacher-like explanations for slang terms, applied universally across all languages.
- **Multi-language Support**: Includes Gen Z, Millennial, British, Formal English, Spanish, and French, with dedicated voices.
- **Authentication**: Integrates Clerk authentication for user management, saved translations, and history.
- **Saved Translations & History**: Allows authenticated users to save translations and automatically records all translations in a history.
- **Speech-to-Text**: Voice input functionality via Web Speech API.
- **Landing Page**: Professional landing page showcasing Slango's capabilities.
- **Pronunciation Tips**: Dynamically reflects selected language and tone.
- **Audio Playback Speed Control**: Adjustable playback speed (0.5x to 1.5x).

## External Dependencies
- **OpenAI API**: For GPT-4o model, handling core translation logic and stylistic transformations.
- **ElevenLabs API**: For high-quality, dedicated voice synthesis for each language variant.
- **Clerk**: For user authentication, including email/password registration, login, and user management.
- **Resend API**: For automated welcome emails to new user signups.
- **PostgreSQL**: Primary database for persistent data storage (user data, saved translations, history, caching).
- **Neon Database**: Serverless driver for PostgreSQL connectivity.
- **Shadcn/ui**: Component library for UI elements.
- **Radix UI**: Low-level accessible UI primitives.
- **Tailwind CSS**: For utility-first styling.
- **Lucide React**: Icon library.
- **Wouter**: Lightweight routing library.
- **TanStack Query**: For server state management in React.
- **React Hook Form & Zod**: For form handling and validation.
- **Web Speech API**: For speech-to-text functionality.