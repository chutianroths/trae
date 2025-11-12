import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Text } from 'react-native-paper';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import { useAppStore } from '@/stores/appStore';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const HomeScreen = memo(() => {
  const networkStatus = useAppStore((state) => state.networkStatus);
  const setNetworkStatus = useAppStore((state) => state.setNetworkStatus);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <ScreenContainer>
      <Text variant="headlineLarge" style={styles.heading}>
        CT AI 控制台
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        欢迎使用智能图像链式编辑应用。请从左侧导航进入各功能模块。
      </Text>
      <Button
        mode="contained"
        onPress={() => setNetworkStatus(networkStatus === 'online' ? 'offline' : 'online')}
        style={styles.button}
      >
        当前网络：
        {networkStatus === 'online' ? '在线' : networkStatus === 'offline' ? '离线' : '检测中'}
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('ModuleLibrary')}
      >
        查看模块库
      </Button>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => navigation.navigate('PromptLibrary')}
      >
        浏览提示词
      </Button>
    </ScreenContainer>
  );
});

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  heading: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 24,
    color: '#6B7280',
  },
  button: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});
