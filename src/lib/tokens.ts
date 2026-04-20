export const tokens = {
  brand: {
    name: "مؤسسة إنسان للأعمال الإنسانية",
    nameAr: "مؤسسة إنسان للأعمال الإنسانية",
    slogan: "معاً نصنع الأمل",
  },
  colors: {
    primary: { 50: '#EBF5FF', 100: '#D6EBFF', 200: '#ADD7FF', 300: '#85C3FF', 400: '#5CAFFF', 500: '#1A5F7A', 600: '#134B62', 700: '#0D374A', 800: '#072332', 900: '#020F1A' },
    secondary: { 50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC', 400: '#4ADE80', 500: '#159C4B', 600: '#117A3A', 700: '#0C5829', 800: '#083618', 900: '#041408' },
    accent: { 50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#97316', 500: '#D4621A', 600: '#B84E14', 700: '#8C3A0E', 800: '#602608', 900: '#341202' },
    neutral: { 50: '#FAFAFA', 100: '#F5F5F5', 200: '#E5E5E5', 300: '#D4D4D4', 400: '#A3A3A3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717', 950: '#0A0A0A' },
    success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6',
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '2.5rem', '3xl': '3rem', '4xl': '4rem' },
  radius: { none: '0', sm: '0.125rem', base: '0.25rem', md: '0.375rem', lg: '0.5rem', xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem', full: '9999px' },
  shadows: { sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)', base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
  transitions: { fast: '150ms', base: '200ms', slow: '300ms', timing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
} as const;

export type Tokens = typeof tokens;
