// @ts-expect-error
import { fetch } from 'react-native-fetch-api';
import { polyfill } from './poly-fills.native';
import { consumeStream } from './streams';
import { isResponseJson, isStreamError } from './utils';
import { type SSEEvent } from './EventSourceParserStream';

polyfill();

export interface FetchSSEParams<EventType = any> {
  shouldParseJsonWhenOnMsg?: boolean;

  onStart?: () => void | Promise<void>;
  onMessage?: (data: SSEEvent<EventType>) => void;
  onError?: (
    error?: unknown,
    meta?: { status: number; statusText: string },
  ) => void;
  onEnd?: () => void | Promise<void>;
}

export async function fetchSSE<EventType>(
  input: URL | RequestInfo,
  init?: RequestInit,
  {
    onStart,
    onEnd,
    onError,
    onMessage,
    shouldParseJsonWhenOnMsg = false,
  }: FetchSSEParams<EventType> = {},
) {
  await onStart?.();

  try {
    const response = await fetch(input, {
      ...init,
      reactNative: { textStreaming: true },
    });

    if (!response.ok! && isResponseJson(response)) {
      const text = await response.text();

      onError?.(new Error(text), {
        status: response.status,
        statusText: response.statusText,
      });

      return;
    }

    const stream = consumeStream(response!, shouldParseJsonWhenOnMsg);

    let result: ReadableStreamReadResult<SSEEvent<EventType>> | null = null;

    while (!(result = await stream.getReader().read()).done) {
      onMessage?.(result.value);
    }

    // while (true) {
    //   const { value, done } = await reader.read();
    //   if (done) break;

    //   onMessage?.(value as SSEEvent<EventType>);
    // }
  } catch (err) {
    if (isStreamError(err)) {
      onError?.(err, { status: err.status, statusText: err.statusText });
      return;
    }

    onError?.(err);
  } finally {
    await onEnd?.();
  }
}
