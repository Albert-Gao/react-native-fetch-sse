# react-native-fetch-sse

consume text-stream response with standard fetch, works with any custom server and OpenAI API.

- Implemented using native `fetch()`, so you can pass headers, different Http methods, `AbortController`, etc.
- minimal implementation, great for web only projects also
- works on React Native / Web
- included all polyfills (only for Native, web doesn't need them)

## Installation

```sh
npm install react-native-fetch-sse
```

## Usage

```js
import { fetchSSE } from 'react-native-fetch-sse';

// in a onPress() handler

const onPress = async () => {
  fetchSSE(
    '/chat-stream',
    {
      method: 'POST',
      headers: {
        Authorization: 'my-token',
      },
    },
    {
      onStart() {
        console.log('it starts');
      },

      onMessage(data) {
        console.log('receiving event', data);
      },

      onError(error, { status, statusText }) {
        console.log('error', error);
        console.log('http status code', status);
        console.log('http statusText', statusText);
      },

      onEnd() {
        console.log('the stream finished');
      },

      // if you are streaming done JSON,
      // set this to true will receive the object instead of a string
      shouldParseJsonWhenOnMsg: true,
    },
  );
};
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Inspired by

- [Azure/fetch-event-source](https://github.com/Azure/fetch-event-source)
- [Vercel/AI](https://github.com/vercel/ai)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
