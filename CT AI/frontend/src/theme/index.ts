import { MD3LightTheme, MD3DarkTheme, type MD3Theme } from 'react-native-paper';

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4F46E5',
    secondary: '#0EA5E9',
    background: '#F3F4F6',
    surface: '#FFFFFF',
    surfaceVariant: '#E5E7EB',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#6366F1',
    secondary: '#38BDF8',
    background: '#0F172A',
    surface: '#111827',
    surfaceVariant: '#1F2937',
  },
};
