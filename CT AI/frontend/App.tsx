import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProviders } from '@/providers/AppProviders';
import { RootNavigator } from '@/navigation/RootNavigator';
import { useAppStore } from '@/stores/appStore';

export default function App() {
  const setInitialized = useAppStore((state) => state.setInitialized);
  const setNetworkStatus = useAppStore((state) => state.setNetworkStatus);

  useEffect(() => {
    setNetworkStatus('online');
    setInitialized(true);
  }, [setInitialized, setNetworkStatus]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <AppProviders>
        <StatusBar style="auto" />
        <RootNavigator />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
