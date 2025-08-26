# SlangSwap - Modular Translation Platform

A platform-agnostic, multilingual translation application with modular architecture designed for seamless deployment across web, mobile, and future platforms.

## Architecture Overview

### Core Philosophy
- **Platform Agnostic**: Single codebase logic that works everywhere
- **Modular Design**: Strict separation of concerns
- **Zero Duplication**: Shared logic across all platforms
- **Global Scale Ready**: Built for multilingual, multi-region deployment

### Folder Structure

```
📁 /
├── 📄 translator.js           # Core translation engine (platform-agnostic)
├── 📁 web-ui/                 # Web-specific components
│   ├── 📁 components/         # React web components
│   └── 📁 pages/             # Web pages
├── 📁 app-ui/                 # Mobile-specific components  
│   ├── 📁 components/         # React Native components
│   └── 📁 screens/           # Mobile screens
├── 📁 utils/                  # Shared utilities
│   ├── 📄 api-client.js       # HTTP client factory
│   ├── 📄 storage.js          # Storage abstraction
│   ├── 📄 audio.js            # Audio management
│   └── 📄 platform-detector.js # Platform detection
├── 📁 assets/                 # Platform-agnostic assets
│   ├── 📁 voices/             # Voice configuration
│   └── 📁 images/             # Shared images
└── 📁 client/                 # Legacy web implementation
```

## Core Features

### Translation Engine (`translator.js`)
- **7 Language Support**: Standard English, Gen Z, Millennial, British, Australian, Spanish, French
- **Voice Integration**: Dedicated ElevenLabs voices for each language
- **State Management**: Platform-agnostic state handling
- **Error Handling**: Comprehensive retry and error recovery

### Platform Support
- **Web**: React with Vite, full browser support
- **Mobile**: React Native ready components
- **PWA**: Service worker support for offline functionality
- **Future**: Electron, Tauri, or any JavaScript environment

### Voice System
- **Multi-Voice Architecture**: Unique voice per language/dialect
- **Dynamic Switching**: Voice changes based on target language
- **Platform Abstraction**: Web Audio API, React Native Audio, etc.
- **Authentic Pronunciation**: Native speaker voices for each language

## Quick Start

### Web Development
```bash
npm install
npm run dev
```

### Mobile Development (React Native)
```bash
# Set up React Native environment
npx react-native init SlangSwapMobile
cd SlangSwapMobile

# Copy core files
cp ../translator.js ./src/
cp -r ../utils ./src/
cp -r ../app-ui ./src/
```

### Core Integration
```javascript
import TranslationService from './translator.js';
import { createHttpClient } from './utils/api-client.js';
import { AudioManager } from './utils/audio.js';

// Initialize for any platform
const service = new TranslationService({
  httpClient: createHttpClient('web') // or 'react-native'
});

// Use anywhere
await service.translate('Hello world', 'standard_english', 'gen_z_english');
```

## Development Guidelines

### Adding New Languages
1. Update `LANGUAGE_CONFIGS` in `translator.js`
2. Add voice configuration with ElevenLabs voice ID
3. Update server translation prompts in `server/routes.ts`
4. Test across all platforms

### Platform-Specific Features
- Place in respective `web-ui/` or `app-ui/` folders
- Use shared utilities from `utils/`
- Import core logic from `translator.js`
- Never duplicate business logic

### Mobile Deployment Checklist
- [ ] Copy `translator.js` to React Native project
- [ ] Copy `utils/` folder
- [ ] Copy `app-ui/` components
- [ ] Configure platform-specific HTTP client
- [ ] Set up React Native audio library
- [ ] Configure API endpoints
- [ ] Test voice functionality
- [ ] Set up error tracking

## API Configuration

### Web Environment
```javascript
const httpClient = createHttpClient('web', {
  baseURL: '', // Same domain
  timeout: 10000
});
```

### Mobile Environment
```javascript
const httpClient = createHttpClient('react-native', {
  baseURL: 'https://your-api-domain.com',
  timeout: 15000
});
```

### Voice Configuration
Each language has dedicated voice settings:
```javascript
{
  voiceId: '1t1EeRixsJrKbiF1zwM6',
  voiceSettings: {
    stability: 0.75,
    similarity_boost: 0.8,
    style: 0.2,
    use_speaker_boost: true
  }
}
```

## Deployment Strategies

### Web Deployment
- Static hosting (Vercel, Netlify)
- Docker containerization
- CDN integration
- Progressive Web App

### Mobile Deployment
- React Native CLI
- Expo managed workflow
- App Store / Google Play
- CodePush for updates

### Global Scale
- Multi-region API deployment
- CDN for assets and audio
- Localized voice servers
- Regional compliance

## Technology Stack

### Core
- **Translation**: OpenAI GPT-4o
- **Voice**: ElevenLabs API
- **State**: Custom platform-agnostic state manager

### Web
- **Framework**: React 18 + Vite
- **UI**: Tailwind CSS + Shadcn/UI
- **HTTP**: Fetch API
- **Audio**: Web Audio API + HTML5 Audio
- **Storage**: localStorage/sessionStorage

### Mobile (Ready)
- **Framework**: React Native
- **HTTP**: Axios/Fetch
- **Audio**: Expo Audio / React Native Sound
- **Storage**: AsyncStorage
- **Navigation**: React Navigation

## Performance Optimizations

### Core Engine
- Request retry with exponential backoff
- Translation caching
- Voice audio caching
- Lazy loading of language configs

### Web Optimizations
- Code splitting by route
- Audio preloading
- Service worker caching
- Bundle optimization

### Mobile Optimizations
- Native module bridging
- Audio session management
- Background processing
- Memory management

## Security Considerations

### API Security
- Rate limiting
- Request validation
- API key rotation
- CORS configuration

### Data Protection
- No PII storage in browser
- Secure API communication
- Voice data encryption
- GDPR compliance ready

## Future Roadmap

### Phase 1: Mobile Release
- [ ] React Native app development
- [ ] App store deployment
- [ ] Push notifications
- [ ] Offline functionality

### Phase 2: Advanced Features
- [ ] Camera translation (OCR)
- [ ] Voice input recognition
- [ ] Real-time conversation mode
- [ ] Custom voice training

### Phase 3: Global Expansion
- [ ] Additional language support
- [ ] Regional voice variants
- [ ] Cultural context adaptation
- [ ] Enterprise API

## Contributing

### Development Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Copy environment variables
4. Start development server: `npm run dev`

### Code Standards
- Platform-agnostic core logic
- Modular component design
- Comprehensive error handling
- TypeScript for type safety
- ESLint + Prettier formatting

### Testing Strategy
- Unit tests for core engine
- Integration tests for API calls
- Platform-specific UI tests
- Voice functionality testing
- Cross-platform compatibility

## Support

For technical support or deployment assistance:
- **Documentation**: Check `/docs` folder
- **Issues**: GitHub Issues
- **Community**: Discord server
- **Enterprise**: Contact team

---

Built with ❤️ for global communication