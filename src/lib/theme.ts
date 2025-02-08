import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from './store';

const themes = {
  dark: {
    '--bg-primary': '#0f172a',
    '--bg-secondary': '#1e293b',
    '--text-primary': '#f8fafc',
    '--text-secondary': '#94a3b8',
    '--accent-primary': '#3b82f6',
    '--accent-secondary': '#2563eb',
    '--border-color': '#334155',
    '--hover-bg': '#334155',
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8fafc',
    '--text-primary': '#0f172a',
    '--text-secondary': '#64748b',
    '--accent-primary': '#3b82f6',
    '--accent-secondary': '#2563eb',
    '--border-color': '#e2e8f0',
    '--hover-bg': '#f1f5f9',
  },
} as const;

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[theme];

    // Apply theme class for Tailwind dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply CSS variables
    Object.entries(themeColors).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Update color-scheme meta
    root.style.setProperty('color-scheme', theme);
  }, [theme]);

  return { theme, setTheme, themes };
}
