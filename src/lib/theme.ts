import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from './store';

const themes = {
  dark: {
    '--bg-primary': '#1a1a1a',
    '--bg-secondary': '#2a2a2a',
    '--text-primary': '#ffffff',
    '--text-secondary': '#cccccc',
    '--accent-primary': '#dc143c',
    '--accent-secondary': '#b01030',
    '--border-color': '#404040',
    '--hover-bg': '#333333',
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f8f8f8',
    '--text-primary': '#111111',
    '--text-secondary': '#444444',
    '--accent-primary': '#dc143c',
    '--accent-secondary': '#b01030',
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
