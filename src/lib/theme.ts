import { tokens } from './tokens';

export const lightTheme = {
  name: 'light' as const,
  colors: {
    background: {
      primary: '#FFFFFF',
      secondary: tokens.colors.neutral[50],
      tertiary: tokens.colors.neutral[100],
      inverted: tokens.colors.neutral[900],
    },
    text: {
      primary: tokens.colors.neutral[900],
      secondary: tokens.colors.neutral[600],
      muted: tokens.colors.neutral[500],
    },
    border: {
      light: tokens.colors.neutral[200],
      base: tokens.colors.neutral[300],
    },
    brand: {
      primary: tokens.colors.primary[500],
      secondary: tokens.colors.secondary[500],
      accent: tokens.colors.accent[500],
    },
  },
  gradients: {
    hero: 'linear-gradient(135deg, ' + tokens.colors.primary[600] + ' 0%, ' + tokens.colors.secondary[600] + ' 100%)',
  },
} as const;

export const darkTheme = {
  name: 'dark' as const,
  colors: {
    background: {
      primary: tokens.colors.neutral[900],
      secondary: tokens.colors.neutral[800],
      tertiary: tokens.colors.neutral[700],
      inverted: '#FFFFFF',
    },
    text: {
      primary: tokens.colors.neutral[50],
      secondary: tokens.colors.neutral[300],
      muted: tokens.colors.neutral[400],
    },
    border: {
      light: tokens.colors.neutral[700],
      base: tokens.colors.neutral[600],
    },
    brand: {
      primary: tokens.colors.primary[300],
      secondary: tokens.colors.secondary[300],
      accent: tokens.colors.accent[300],
    },
  },
  gradients: {
    hero: 'linear-gradient(135deg, ' + tokens.colors.primary[500] + ' 0%, ' + tokens.colors.secondary[500] + ' 100%)',
  },
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeMode = 'light' | 'dark';

export function getTheme(mode: ThemeMode): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}

export function generateThemeVariables(theme: Theme): Record<string, string> {
  const flatten = (obj: any, prefix = '--'): Record<string, string> => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      const varName = prefix + key;
      if (value && typeof value === 'object') {
        return { ...acc, ...flatten(value, varName + '-') };
      }
      return { ...acc, [varName]: value as string };
    }, {});
  };
  return flatten(theme);
}
