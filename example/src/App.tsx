import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import { fetchSSE } from 'react-native-fetch-sse';

export default function App() {
  const [result, setResult] = React.useState('');

  const onSubmit = () => {
    fetchSSE(
      'http://localhost:8090/v1/chat-stream',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Content': 'application/json',
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: 'hi' }] }),
      },
      {
        onMessage(data: any) {
          console.log(data);
          setResult((v) => {
            return data.data.content ? v + data.data.content : v;
          });
        },
        onError(error, meta) {
          console.log('err', error, meta);
        },
        onEnd() {
          console.log('end');
        },
        shouldParseJsonWhenOnMsg: true,
      },
    );
  };

  return (
    <View style={styles.container}>
      <Text>Result:</Text>
      <Text>{result}</Text>
      <Button title="Submit" onPress={onSubmit} />
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
