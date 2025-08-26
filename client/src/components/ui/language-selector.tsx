import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  description: string;
}

export interface LanguageCategory {
  id: string;
  label: string;
  flag: string;
  description: string;
  options: LanguageOption[];
}

export const LANGUAGE_CATEGORIES: LanguageCategory[] = [
  {
    id: "english",
    label: "English",
    flag: "🇺🇸",
    description: "English variants and styles",
    options: [
      {
        code: "standard_english",
        name: "Standard English",
        flag: "🇺🇸",
        description: "Clear, professional English",
      },
      {
        code: "formal_english",
        name: "Formal English",
        flag: "🇺🇸",
        description: "Formal, clear English",
      },
      {
        code: "gen_z_english",
        name: "Gen Z",
        flag: "🔥",
        description: "Modern slang & abbreviations",
      },
      {
        code: "british_english",
        name: "British",
        flag: "🇬🇧",
        description: "British slang & expressions",
      },
    ]
  },
  {
    id: "spanish",
    label: "Spanish",
    flag: "🇪🇸",
    description: "Spanish language variants",
    options: [
      {
        code: "spanish",
        name: "Spanish",
        flag: "🇪🇸",
        description: "Spanish language",
      },
    ]
  },
  {
    id: "french",
    label: "French",
    flag: "🇫🇷", 
    description: "French language variants",
    options: [
      {
        code: "french",
        name: "French",
        flag: "🇫🇷",
        description: "French language",
      },
    ]
  },
  {
    id: "arabic",
    label: "Arabic",
    flag: "🇸🇦", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "chinese",
    label: "Mandarin Chinese",
    flag: "🇨🇳", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "hindi",
    label: "Hindi",
    flag: "🇮🇳", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "portuguese",
    label: "Portuguese",
    flag: "🇵🇹", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "russian",
    label: "Russian",
    flag: "🇷🇺", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "japanese",
    label: "Japanese",
    flag: "🇯🇵", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "german",
    label: "German",
    flag: "🇩🇪", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "italian",
    label: "Italian",
    flag: "🇮🇹", 
    description: "Coming soon",
    options: [

    ]
  },
  {
    id: "korean",
    label: "Korean",
    flag: "🇰🇷", 
    description: "Coming soon",
    options: [

    ]
  },
];

// Flatten all options for backward compatibility
export const LANGUAGE_OPTIONS: LanguageOption[] = LANGUAGE_CATEGORIES.flatMap(category => category.options);

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  label: string;
  variant?: "source" | "target";
}

export function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  label,
  variant = "source",
}: LanguageSelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  const selectedOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === selectedLanguage) ||
    LANGUAGE_OPTIONS[0];

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="flex flex-col space-y-1 sm:space-y-2 w-full min-w-0 relative">
      <label className="text-xs sm:text-sm lg:text-base font-medium text-muted-foreground slango-text">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full min-w-[120px] sm:min-w-[140px] md:min-w-[160px] justify-between glass-panel border-border hover:border-primary text-foreground slango-glow-hover transition-all duration-300 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 max-w-full"
            style={{ fontFamily: "'Inter', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif" }}
          >
            <div className="flex items-center min-w-0 flex-1 overflow-hidden" style={{ gap: window.innerWidth >= 769 ? '8px' : '4px' }}>
              <span className="text-sm sm:text-base md:text-lg flex-shrink-0" style={{ marginRight: window.innerWidth >= 769 ? '8px' : '4px' }}>{selectedOption.flag}</span>
              <span className={`slango-text text-xs sm:text-sm md:text-base flex-1 text-left ${window.innerWidth < 320 ? 'truncate' : ''}`}>{selectedOption.name}</span>
            </div>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0 opacity-50 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="lang-menu w-[30vw] max-w-[180px] min-w-[160px] min-[769px]:w-64 max-h-[40vh] min-[768px]:max-h-[300px] glass-panel border-border backdrop-blur-16 overflow-y-auto overflow-x-hidden" 
          style={{ 
            fontFamily: "'Inter', 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif",
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: window.innerWidth >= 768 ? '300px' : '40vh'
          }}
          side="bottom"
          align="start"
          sideOffset={8}
          alignOffset={0}
          avoidCollisions={true}
          collisionPadding={8}
          data-selector-variant={variant}
          onCloseAutoFocus={(e: Event) => {
            // Prevent auto-scrolling on mobile that might hide English
            if (window.innerWidth <= 768) {
              e.preventDefault();
              // Ensure scroll starts at top on mobile
              setTimeout(() => {
                const content = e.currentTarget as HTMLElement;
                if (content) {
                  content.scrollTop = 0;
                }
              }, 0);
            }
          }}
        >
          {LANGUAGE_CATEGORIES.map((category, categoryIndex) => (
            <div key={category.id}>
              {/* Category Header - clickable to expand/collapse */}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCategory(category.id);
                }}
                className="flex items-center w-full px-2 py-1.5 text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-300 slango-glow-hover font-semibold rounded-sm min-h-[32px] touch-manipulation"
                style={{ gap: '6px' }}
              >
                <span className="text-sm flex-shrink-0">{category.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold slango-text text-xs leading-tight">{category.label}</div>
                  <div className="text-xs text-muted-foreground truncate slango-text leading-tight">
                    {category.description}
                  </div>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
                ) : (
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-70" />
                )}
              </div>

              {/* Sub-options - only show when expanded */}
              {expandedCategories.has(category.id) && category.options.map((option) => (
                <DropdownMenuItem
                  key={option.code}
                  onClick={() => onLanguageChange(option.code)}
                  className={`text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer transition-all duration-300 slango-glow-hover ml-1 pl-2 min-h-[28px] touch-manipulation ${
                    selectedLanguage === option.code ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <div className="flex items-center w-full gap-1.5 py-0.5">
                    <span className="text-xs flex-shrink-0">{option.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium slango-text text-xs leading-tight truncate">{option.name}</div>
                      <div className="text-xs text-muted-foreground truncate slango-text leading-tight">
                        {option.description}
                      </div>
                    </div>
                    {selectedLanguage === option.code && (
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}

              {categoryIndex < LANGUAGE_CATEGORIES.length - 1 && (
                <DropdownMenuSeparator className="border-border" />
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
