import { readable, writable } from 'svelte/store'
import type { FormattedRoute } from '../static'

/**
 * Current state.
 * @property `hashHistory` - boolean
 * @property `routes` - FormattedRoute[]
 * @property `redirecting` - Record<"before" | "after", boolean>
 * @property `route` - FormattedRoute
 */
export const routerState = {
    hashHistory: false,
    routes: [],
    navigating: false,
    redirecting: false
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
 * @property `crumbs` - Array of route-names within the route-heirarchy
 * @property `depth` - Routes' depth within its route-heirarchy
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
