import type { PassedRoute, FormattedRoute } from '../static'
import {
    setUrl,
    formatQueryFromObject,
    validatePassedParams,
    formatPathFromParams
} from '../static'
import { hashHistory, routes, writableRoute, routeProps, setProps } from './state'
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
let fromRoute: FormattedRoute = null
// New route data
let newPath: string, newTitle: string, newRoute: FormattedRoute

// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => {
    route = { ...newRoute }
})

/**
 * Central function responsible for all navigations.
 * @param passedRoute
 * @param replace - (Optional) - Use `window.history.replaceState` instead of `window.history.pushState`.
 * @param passedPath - (Optional) - Use a set path instead of the given-routes' path.
 * @returns The current route or throws an error.
 */
const changeRoute = async (
    passedRoute: PassedRoute,
    replace?: boolean,
    passedPath?: string
): Promise<void | FormattedRoute> => {
    const { name, path, query, params, props } = passedRoute
    let fullPath

    if (passedRoute['fullPath']) {
        fullPath = passedRoute['fullPath']
    }

    let routeExists = false

    const setNewRouteData = routeData => {
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

        routeExists = true
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

    // Set new route data
    const matchRoute = passedRoutes => {
        passedRoutes.forEach(routeData => {
            if (routeExists) return
            if (name && routeData.name === name) {
                // If route changed by name
                setNewRouteData(routeData)
            } else if (fullPath && fullPath.match(routeData.fullRegex)) {
                // If route changed by path
                setNewRouteData(routeData)
            } else if (routeData.children) {
                // Recursively filter child routes
                matchRoute(routeData.children)
            }

            if (!newRoute) {
                if (path && path.match(routeData.regex)) {
                    // If route changed by path
                    setNewRouteData(routeData)
                }
            }
        })
    }

    matchRoute(routes)

    if (!routeExists) return

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

    if (newTitle && title) title.innerHTML = newTitle

    if (passedPath) newPath = passedPath

    // Update URL/state
    setUrl(newPath, replace, hashHistory)

    // After route change navigation guard
    if (afterCallback) afterCallback(route, fromRoute, routeProps)

    return route
}

export { route, fromRoute, changeRoute }
