import { readable, writable } from 'svelte/store'
import type { FormattedRoute } from '../static'

/**
 * Current state.
 * @property `hashHistory` - Whether hash-mode has been set.
 * @property `routes` - Formatted routes.
 * @property `navigating` - Used to determine if a redirect has been called.
 * @property `navigationStack` - Stack of pending navigations, `0` being the priority. Any navigation after this is cancelled.
 * @property `redirecting` - To prevent `sameRoute` check conflicting with redirects.
 * @property `afterCallbackRunning` - To prevent route cancellation when redirects are stacked through `beforeEach`.
 * @property `rateLimit` - Number of navigations allowed within 10ms of an initial navigation.
 * @property `callCount` - Number of times `changeRoute` has been called. Used to prevent infinite loops.
 * @property `initiationTime` - Time in ms since the first navigation was called. Used to prevent infinite loops.
 */
export const routerState = {
    hashHistory: false,
    routes: [],
    navigating: false,
    navigationStack: [],
    redirecting: false,
    afterCallbackRunning: false
}

/**
 * Object containing all data for the current route.
 * @property `title` - Page-title
 * @property `name` - Routes' name
 * @property `path` - Routes' path
 * @property `component` - Svelte component
 * @property `children` - Nested-routes
 * @property `parent` - Parent-route
 * @property `rootParent` - Ancestor-route
 * @property `crumbs` - Array of route-names within the route-hierarchy
 * @property `depth` - Routes' depth within its route-hierarchy
 * @property `fullPath` - Path joined with any matching ancestor paths
 * @property `rootPath` - Ancestor-routes' path
 * @property `regex` - Generated regex for the routes' path
 * @property `fullRegex` - Generated regex for the routes' full-path
 */
export let route: FormattedRoute = null

/** Reactive route data */
export const writableRoute = writable(null)

/**
 * Readable Svelte store which triggers on each navigation and returns the current route.
 * @example
 * routeStore.subscribe(newRoute => {
 *   breadcrumbNavigation.textContent = newRoute.crumbs.join('/')
 * })
 */
export const routeStore = readable({}, set => {
    writableRoute.subscribe(routeValue => {
        set(routeValue)
    })
})

// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => {
    route = { ...newRoute }
})
