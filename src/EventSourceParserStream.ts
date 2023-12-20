// @ts-expect-error
import { TextDecoder } from 'text-decoding';
import { TransformStream } from '@stardazed/streams';

export interface SSEEvent<EventType = any> {
  data?: EventType;
  event?: string;
  id?: string;
  retry?: number;
}

function parseSSEEvent(
  sseString: string,
  shouldParseJsonWhenOnMsg = false
): SSEEvent {
  const sseEvent: SSEEvent = {};

  sseString.split('\n').forEach((line) => {
    let [key, ...values] = line.split(':');

    key = key?.trim();

    const value = values.join(':').trim();

    if (key === 'data') {
      sseEvent.data = shouldParseJsonWhenOnMsg ? JSON.parse(value) : value;
    } else if (key === 'event') {
      sseEvent.event = value;
    } else if (key === 'id') {
      sseEvent.id = value;
    } else if (key === 'retry') {
      const retryTime = parseInt(value, 10);
      if (!isNaN(retryTime)) {
        sseEvent.retry = retryTime;
      }
    }
  });

  return sseEvent;
}

const decoder = new TextDecoder();

export class EventSourceParserStream extends TransformStream<
  Uint8Array,
  SSEEvent
> {
  constructor(
    options: { shouldParseJsonWhenOnMsg?: boolean } = {
      shouldParseJsonWhenOnMsg: false,
    }
  ) {
    super({
      transform(chunk, controller) {
        const str = decoder.decode(chunk);
        const event = parseSSEEvent(str, options.shouldParseJsonWhenOnMsg);
        controller.enqueue(event);
      },
    });
  }
}
