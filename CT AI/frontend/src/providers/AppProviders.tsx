import { PropsWithChildren, useMemo } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme } from '@/theme';

export function AppProviders({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();

  const paperTheme = useMemo(
    () => (colorScheme === 'dark' ? darkTheme : lightTheme),
    [colorScheme],
  );
  const navigationTheme = useMemo(
    () => (colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    [colorScheme],
  );

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
