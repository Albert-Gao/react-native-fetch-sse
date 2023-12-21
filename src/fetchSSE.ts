// @ts-expect-error
import { fetch } from 'react-native-fetch-api';
import { polyfill } from './poly-fills';
import { type SSEEvent } from './EventSourceParserStream';
import { consumeStream } from './streams';
import { StreamError } from './StreamError';

polyfill();

export interface FetchSSEParams<EventType = any> {
  shouldParseJsonWhenOnMsg?: boolean;

  onStart?: () => void | Promise<void>;
  onMessage?: (data: SSEEvent<EventType>) => void | Promise<void>;
  onError?: (
    error?: unknown,
    meta?: { status: number; statusText: string }
  ) => void | Promise<void>;
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
  }: FetchSSEParams<EventType> = {}
) {
  await onStart?.();

  try {
    const response = await fetch(input, {
      ...init,
      reactNative: { textStreaming: true },
    });

    const stream = consumeStream(response!, shouldParseJsonWhenOnMsg);

    const reader = stream.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      onMessage?.(value as SSEEvent<EventType>);
    }
  } catch (err) {
    const isStreamError = err instanceof StreamError;

    if (isStreamError) {
      await onError?.(err, { status: err.status, statusText: err.statusText });
      return;
    }

    await onError?.(err);
  }

  await onEnd?.();
}
