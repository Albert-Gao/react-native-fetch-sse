import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import { fetchSSE } from 'react-native-fetch-sse';

export default function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    fetchSSE('', { method: 'POST' });
    setResult(1);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
