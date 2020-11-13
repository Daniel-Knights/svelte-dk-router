import type { Callback } from './types';

export let beforeCallback, afterCallback;

export const push = (): void => {
    console.log('object');
};
export const replace = (): void => {
    console.log('object');
};
export const beforeEach = (cb: Callback): void => {
    beforeCallback = cb;
};
export const afterEach = (cb: Callback): void => {
    afterCallback = cb;
};
