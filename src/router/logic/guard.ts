import type { Guard } from '../static';

let beforeCallback: Guard, afterCallback: Guard;

// Set function to run before each route change
const beforeEach = (cb: Guard): void => {
    beforeCallback = cb;
};

// Set function to run after each route change
const afterEach = (cb: Guard): void => {
    afterCallback = cb;
};

export { beforeCallback, afterCallback, beforeEach, afterEach };
