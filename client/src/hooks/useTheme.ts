import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("slango-theme") as Theme) || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const setThemeAndStore = (theme: Theme) => {
    localStorage.setItem("slango-theme", theme);
    setTheme(theme);
  };

  const toggleTheme = () => {
    setThemeAndStore(theme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    setTheme: setThemeAndStore,
    toggleTheme,
  };
}