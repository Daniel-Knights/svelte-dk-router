import type { BeforeEach, AfterEach } from '../static'

let beforeCallback: BeforeEach, afterCallback: AfterEach

// Set function to run before each route change
const beforeEach = (cb: BeforeEach): void => {
    beforeCallback = cb
}

// Set function to run after each route change
const afterEach = (cb: AfterEach): void => {
    afterCallback = cb
}

export { beforeCallback, afterCallback, beforeEach, afterEach }
