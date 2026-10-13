/**
 * VetTech OS — Strict Triple-State Async Pattern
 * Every data-driven UI primitive must natively handle:
 * 1. Loading (Animated skeleton state)
 * 2. Empty (Actionable, clear empty state)
 * 3. Ready (Typed data presentation)
 * Plus Idle and Error states for complete clinical safety.
 */

export type AsyncStatus = 'idle' | 'loading' | 'empty' | 'ready' | 'error';

export type AsyncState<T> =
  | { readonly status: 'idle'; readonly data?: never; readonly error?: never }
  | { readonly status: 'loading'; readonly data?: T; readonly error?: never }
  | { readonly status: 'empty'; readonly data?: never; readonly error?: never }
  | { readonly status: 'ready'; readonly data: T; readonly error?: never }
  | { readonly status: 'error'; readonly data?: never; readonly error: Error | string };

export const AsyncStateFactory = {
  idle: <T>(): AsyncState<T> => ({ status: 'idle' }),
  loading: <T>(placeholder?: T): AsyncState<T> => ({ status: 'loading', data: placeholder }),
  empty: <T>(): AsyncState<T> => ({ status: 'empty' }),
  ready: <T>(data: T): AsyncState<T> => ({ status: 'ready', data }),
  error: <T>(error: Error | string): AsyncState<T> => ({ status: 'error', error }),
};

export function isReady<T>(state: AsyncState<T>): state is { status: 'ready'; data: T } {
  return state.status === 'ready';
}

export function isLoading<T>(state: AsyncState<T>): state is { status: 'loading'; data?: T } {
  return state.status === 'loading';
}

export function isEmpty<T>(state: AsyncState<T>): state is { status: 'empty' } {
  return state.status === 'empty';
}

export function isError<T>(state: AsyncState<T>): state is { status: 'error'; error: Error | string } {
  return state.status === 'error';
}
