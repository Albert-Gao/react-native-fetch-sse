const AsyncFunction = (async () => {}).constructor;

export function isAsync(fn: any) {
  return fn instanceof AsyncFunction;
}

export async function runAsyncLikeFunction({
  func,
  params,
}: {
  func: any;
  params?: any;
}) {
  if (isAsync(func)) {
    await func(params);
  } else {
    func(params);
  }
}

export function isResponseJson(response: Response) {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  return isJson;
}

export class StreamError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);

    this.status = status;
    this.statusText = statusText;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function isStreamError(err: any): err is StreamError {
  return err && err instanceof StreamError;
}
