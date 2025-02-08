import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { themeAtom } from './store';

const themes = {
  dark: {
    '--bg-primary': '#09090b',
    '--bg-secondary': '#18181b',
    '--text-primary': '#fafafa',
    '--text-secondary': '#a1a1aa',
    '--accent-primary': '#22c55e',
    '--accent-secondary': '#16a34a',
    '--border-color': '#27272a',
    '--hover-bg': '#27272a',
  },
  light: {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#fafafa',
    '--text-primary': '#18181b',
    '--text-secondary': '#71717a',
    '--accent-primary': '#22c55e',
    '--accent-secondary': '#16a34a',
    '--border-color': '#e4e4e7',
    '--hover-bg': '#f4f4f5',
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
