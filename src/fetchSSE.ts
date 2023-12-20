// @ts-expect-error
import { fetch } from 'react-native-fetch-api';
import { polyfill } from './poly-fills';
import {
  EventSourceParserStream,
  type SSEEvent,
} from './EventSourceParserStream';

polyfill();

export interface FetchSSEParams<EventType = any> {
  shouldParseJsonWhenOnMsg?: boolean;

  onStart?: () => void | Promise<void>;
  onMessage?: (data: SSEEvent<EventType>) => void | Promise<void>;
  onError?: (response?: Response, error?: unknown) => void | Promise<void>;
  onEnd?: () => void | Promise<void>;
}

export async function fetchSSE<EventType>(
  input: URL | RequestInfo,
  init?: RequestInit,
  params: FetchSSEParams<EventType> = {}
) {
  const { onStart, onEnd, onError, onMessage, shouldParseJsonWhenOnMsg } =
    params;

  await onStart?.();
  let response: Response | undefined = undefined;

  try {
    response = await fetch(input, {
      ...init,
      reactNative: { textStreaming: true },
    });

    if (!response?.ok) {
      await onError?.(response);
      return;
    }

    const body = response.body;
    if (!body) return;

    const piped = body.pipeThrough(
      new EventSourceParserStream({ shouldParseJsonWhenOnMsg })
    );

    const reader = piped.getReader();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      onMessage?.(value as SSEEvent<EventType>);
    }
  } catch (e) {
    await onError?.(response, e);
  }

  await onEnd?.();
}
