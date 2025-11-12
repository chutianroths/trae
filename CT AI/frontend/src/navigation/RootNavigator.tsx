import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/screens/HomeScreen';
import { ModuleLibraryScreen } from '@/screens/ModuleLibraryScreen';
import { PromptLibraryScreen } from '@/screens/PromptLibraryScreen';

export type RootStackParamList = {
  Home: undefined;
  ModuleLibrary: undefined;
  PromptLibrary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ModuleLibrary"
        component={ModuleLibraryScreen}
        options={{ title: '模块库' }}
      />
      <Stack.Screen
        name="PromptLibrary"
        component={PromptLibraryScreen}
        options={{ title: '提示词库' }}
      />
    </Stack.Navigator>
  );
}
