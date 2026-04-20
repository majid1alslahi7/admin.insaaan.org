'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { lightTheme, darkTheme, generateThemeVariables, type Theme } from '@/lib/theme';

const ThemeContext = createContext<{
  theme: Theme;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
} | undefined>(undefined);

export const useTheme = () => {
  const c = useContext(ThemeContext);
  if (!c) throw new Error('useTheme must be used within ThemeProvider');
  return c;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = localStorage.getItem('theme-mode');
    if (s === 'light' || s === 'dark') setMode(s);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = mode === 'dark' ? darkTheme : lightTheme;
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);
    const v = generateThemeVariables(t as any);
    Object.entries(v).forEach(([k, val]) => root.style.setProperty(k, val));
    localStorage.setItem('theme-mode', mode);
  }, [mode, mounted]);

  const toggleTheme = () => setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider
      value={{
        theme: mode === 'dark' ? darkTheme : lightTheme,
        mode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
