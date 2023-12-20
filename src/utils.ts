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
