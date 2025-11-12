import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ScreenContainerProps extends PropsWithChildren {
  padded?: boolean;
}

export function ScreenContainer({ children, padded = true }: ScreenContainerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        padded && styles.padded,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  padded: {
    padding: 16,
  },
});
