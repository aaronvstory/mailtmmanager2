import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from './store';

const themes = {
  dark: {
    '--bg-primary': '#121212',
    '--bg-secondary': '#1e1e1e',
    '--text-primary': '#ffffff',
    '--text-secondary': '#e0e0e0',
    '--accent-primary': '#4ade80',
    '--accent-secondary': '#22c55e',
    '--border-color': '#2e2e2e',
    '--hover-bg': '#2e2e2e',
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8f8f8',
    '--text-primary': '#111111',
    '--text-secondary': '#444444',
    '--accent-primary': '#16a34a',
    '--accent-secondary': '#15803d',
    '--border-color': '#e2e2e2',
    '--hover-bg': '#f0f0f0',
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
