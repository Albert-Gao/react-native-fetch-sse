import { StreamError } from './utils';
import { EventSourceParserStream } from './EventSourceParserStream';

export function createEmptyReadableStream(): ReadableStream {
  return new ReadableStream({
    start(controller) {
      controller.close();
    },
  });
}

/** this function triggers an error with errorMessage */
function errorStream(errMsg: string) {
  return new ReadableStream({
    start(controller) {
      controller.error(new Error(errMsg));
    },
  });
}

/** this function consumes the error stream (error message that sends as a SSE event)  */
function errorEventStream(response: Response) {
  const reader = response.body?.getReader();

  return new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.error(new Error(`Response error: no reader found`));
        return;
      }

      const { done, value } = await reader.read();

      if (!done) {
        const errorText = new TextDecoder().decode(value);
        controller.error(
          new StreamError(errorText, response.status, response.statusText)
        );
      }
    },
  });
}

/** this function handles the 200 and non-200 cases, and make it all returns a stream */
export function consumeStream(
  response: Response,
  shouldParseJsonWhenOnMsg: boolean
) {
  if (!response) {
    return errorStream('Response error: No response');
  }

  if (!response.ok && !response.body) {
    return errorStream('Response error: No response body');
  }

  if (!response.ok) {
    return errorEventStream(response);
  }

  if (!response.body) {
    return createEmptyReadableStream();
  }

  return response.body.pipeThrough(
    new EventSourceParserStream({ shouldParseJsonWhenOnMsg })
  );
}
