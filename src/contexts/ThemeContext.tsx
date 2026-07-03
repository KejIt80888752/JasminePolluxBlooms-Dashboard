import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty("--bg", "#1c1320");
      root.style.setProperty("--card", "#2a1d2e");
      root.style.setProperty("--border", "#432f49");
      root.style.setProperty("--text", "#f5eef8");
      root.style.setProperty("--muted", "#b09bb8");
      root.style.setProperty("--input-bg", "#1c1320");
    } else {
      root.style.setProperty("--bg", "#fdf2f8");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--border", "#f3d9e8");
      root.style.setProperty("--text", "#3f1d33");
      root.style.setProperty("--muted", "#8a6b83");
      root.style.setProperty("--input-bg", "#fdf2f8");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme: () => setIsDark(p => !p) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
};
