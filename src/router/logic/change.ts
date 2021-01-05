import type { PassedRoute, FormattedRoute } from '../static'
import {
    error,
    invalidIdentifier,
    compareRoutes,
    setUrl,
    formatQueryFromObject,
    formatPathFromParams,
    isSameRoute,
    validatePassedParams
} from '../static'
import { routes, hashHistory, writableRoute, routeProps, setProps } from './state'
import { beforeCallback, afterCallback } from './guard'
import { chartState } from './nested'

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
let route: FormattedRoute = null

/** Previous route data */
let fromRoute: FormattedRoute = null,
    previousIdentifier: string
// New route data
let newPath: string, newTitle: string, newRoute: FormattedRoute

// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => {
    route = { ...newRoute }
})

/** Formats and sets new route-data */
const setNewRouteData = (routeData: FormattedRoute): void => {
    const hasDefaultChild = routeData.children && !routeData.children[0].path

    if (routeData.title) newTitle = routeData.title

    // Cleanup
    if (routeData.query) {
        delete routeData.query

        if (hasDefaultChild) {
            delete routeData.children[0].query
        }
    }
    if (routeData.params) {
        delete routeData.params

        if (hasDefaultChild) {
            delete routeData.children[0].params
        }
    }

    newPath = routeData.fullPath
    newRoute = routeData

    // Check for default child
    if (newRoute.children) {
        newRoute.children.forEach(child => {
            if (child.path === '') {
                newRoute = child
            }
        })
    }
}

/**
 * Central function responsible for all navigations.
 * @param passedRoute
 * @param replace - (Optional) - Use `window.history.replaceState` instead of `window.history.pushState`.
 * @param identifier - (Optional) - The passed name or path. Used for error-handling.
 * @returns The current route or throws an error.
 */
const changeRoute = async (
    passedRoute: PassedRoute,
    replace?: boolean,
    identifier?: string
): Promise<void | FormattedRoute> => {
    const { path, query, params, props } = passedRoute
    const matchedRoute = compareRoutes(routes, passedRoute)

    if (!matchedRoute) {
        error(`Unknown route: "${identifier}"`)
        throw new Error(`Unknown route: "${identifier}"`)
    }

    setNewRouteData(matchedRoute)

    if (newPath === '(*)') newPath = path

    const paramsResult = validatePassedParams(newRoute.fullPath, params)

    if (!paramsResult.valid) {
        throw new Error(
            ('Missing required param(s):' + paramsResult.errorString) as string
        )
    }

    // Query handling
    if (query) {
        newRoute['query'] = query
        newPath += '?' + formatQueryFromObject(query)
    }

    // Named-params handling
    if (params) {
        newRoute['params'] = params
        newPath = formatPathFromParams(newPath, params)
    }

    // Prevent duplicate navigation
    if (
        isSameRoute(
            { ...matchedRoute, params, query },
            route,
            identifier,
            previousIdentifier
        )
    ) {
        return
    } else previousIdentifier = identifier

    // Set fromRoute before route is updated
    if (!replace) fromRoute = route

    // Props handling
    setProps(null)
    if (props) setProps(props)

    // Before route change navigation guard
    if (beforeCallback) {
        const beforeResult = await beforeCallback(newRoute, fromRoute, setProps)

        if (beforeResult === false) return
    }

    writableRoute.set(newRoute)
    chartState(newRoute)

    // Update page title
    const title = document.getElementsByTagName('title')[0]
    if (newTitle && title) {
        title.innerHTML = newTitle
    }

    const invalidPath = invalidIdentifier(newRoute, identifier)
    if (invalidPath) newPath = invalidPath

    // Update URL/state
    setUrl(newPath, replace, hashHistory)

    // After route change navigation guard
    if (afterCallback) afterCallback(route, fromRoute, routeProps)

    if (matchedRoute.path === '(*)') {
        error(`Unknown route: "${identifier}"`)
        throw new Error(`Unknown route: "${identifier}"`)
    }

    return route
}

export { route, fromRoute, changeRoute }
