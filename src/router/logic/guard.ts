import type { BeforeEach, AfterEach } from '../static'

let beforeCallback: BeforeEach
let afterCallback: AfterEach

/**
 * Navigation guard which runs *before* each route-change.
 * @param cb - **Arguments:**
 * @param to - Route navigating to
 * @param from - Route navigating from
 * @param context
 * @property `redirect` - Redirects initial navigation to another route
 * @property `setProps` - Sets route-props, accessible through the `routeProps` import and `props` parameter in the `afterEach` callback
 */
function beforeEach(cb: BeforeEach): void {
    beforeCallback = cb
}

/**
 * Navigation guard which runs *after* each route-change.
 * @param cb - **Arguments:**
 * @param to - Route navigated to
 * @param from - Route navigated from
 * @param context
 * @property `redirect` - Redirects initial navigation to another route
 * @property `props` - Current props set through any of the available methods:
 *
 * - `<SLink>`
 * - `push`
 * - `replace`
 * - `beforeEach`.
 */
function afterEach(cb: AfterEach): void {
    afterCallback = cb
}

export { beforeCallback, afterCallback, beforeEach, afterEach }
