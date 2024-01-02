// @ts-expect-error
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions';

export const polyfill = () => {
  const { TextDecoder, TextEncoder } = require('text-decoding');
  const { ReadableStream, TransformStream } = require('@stardazed/streams');

  polyfillGlobal('TextDecoder', () => TextDecoder);
  polyfillGlobal('TextEncoder', () => TextEncoder);
  polyfillGlobal('ReadableStream', () => ReadableStream);
  polyfillGlobal('TransformStream', () => TransformStream);
};
