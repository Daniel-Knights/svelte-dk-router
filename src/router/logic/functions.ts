import type { Route, PassedRoute, FormattedRoute } from '../static'
import {
    warn,
    validateRoutes,
    formatRouteRegex,
    formatPathProperties,
    stripInvalidProperties
} from '../static'
import { error } from '../static'
import { changeRoute } from './router'
import { loadState } from './load'
import { route, routerState } from './state'

/**
 * Sets a provided array of routes.
 * @param userRoutes
 * @param hashMode - (Optional, defaults to `false` (history-mode)).
 */
export function setRoutes(userRoutes: Route[], hashMode = false): void {
    if (hashMode) routerState.hashHistory = true

    function formatRoutes(passedRoutes, parent?: FormattedRoute, depth?) {
        passedRoutes.forEach(userRoute => {
            const { name, path, component } = userRoute

            if (path === undefined || !component) {
                return error('"path" and "component" are required properties')
            }

            if (name && name.includes('/')) {
                warn(
                    `Route-names which include "/" could interfere with route-matching: "${name}"`
                )
            }

            // Set component name as route name if none supplied
            if (!name) {
                userRoute['name'] = component.name
            }

            // Set parent properties
            if (parent) {
                userRoute['parent'] = parent

                if (parent.rootParent) {
                    userRoute['rootParent'] = parent.rootParent
                } else userRoute['rootParent'] = parent
            }

            // Array of route names to trace origins
            if (!userRoute.parent) {
                userRoute['crumbs'] = [userRoute.name]
            } else {
                userRoute['crumbs'] = [...userRoute.parent.crumbs, userRoute.name]
            }

            // Set depth of route/nested-route
            if (userRoute.parent) {
                userRoute['depth'] = userRoute.parent.depth + 1
            } else {
                userRoute['depth'] = depth
            }

            // Set path properties
            formatPathProperties(userRoute, path)

            // Generate dynamic regex for each route
            formatRouteRegex(userRoute)

            if (userRoute.children) {
                // Recursively format children
                formatRoutes(userRoute.children, userRoute)
            }
        })
    }

    const depth = 1

    formatRoutes(userRoutes, null, depth)
    stripInvalidProperties(userRoutes)
    validateRoutes(userRoutes)

    routerState.routes = userRoutes

    loadState()
}

/**
 * Same function used by `push` and `replace` with a 'switch' for whether to use `window.history.pushState` or `window.history.replaceState`.
 * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
 * @param replace - Use window.history.pushState or window.history.replaceState.
 * @returns The current route or throws an error.
 */
async function pushOrReplace(
    routeData: PassedRoute,
    replace: boolean
): Promise<void | FormattedRoute> {
    const { identifier } = routeData

    if (!identifier) {
        error('"path" or "name" argument required')
        throw new Error('"path" or "name" argument required')
    }

    if (identifier[0] === '/') {
        routeData.path = identifier
    } else {
        routeData.name = identifier
    }

    if (routerState.navigating) routerState.redirecting = true

    return changeRoute(routeData, replace, identifier)
}

/**
 * Uses `window.history.pushState` to update the current history entry. Returns a promise.
 * @param identifier - Name or path.
 * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
 * @returns The current route or throws an error.
 * @example
 * await push('/', { query: { id: '1' } })
 *   .then(route => ...)
 *   .catch(err => ...)
 */
export function push(
    identifier: string,
    routeData?: PassedRoute
): Promise<void | FormattedRoute> {
    return pushOrReplace({ identifier, ...routeData }, false)
}

/**
 * Uses window.history.replaceState to update the current history entry. Returns a promise.
 * @param identifier - Name or path.
 * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
 * @returns The current route or throws an error.
 * @example
 * await replace('/', { query: { id: '1' } })
 *   .then(route => ...)
 *   .catch(err => ...)
 */
export function replace(
    identifier: string,
    routeData?: PassedRoute
): Promise<void | FormattedRoute> {
    return pushOrReplace({ identifier, ...routeData }, true)
}

/**
 * Set or update query-params. Returns a promise.
 * @param query - Object of any valid key/value pairs.
 * @param update - (Optional, defaults to `false`) - Update or overwrite existing query.
 * @param replace - (Optional, defaults to `true`) - Use window.history.pushState or window.history.replaceState.
 * @returns The current route or throws an error.
 * @example
 * await setQuery({ id: '1' })
 *   .then(route => ...)
 *   .catch(err => ...)
 */
export async function setQuery(
    query: Record<string, string>,
    update = false,
    replace = true
): Promise<void | FormattedRoute> {
    if (route.path === '(*)' || (!route.path && route.depth === 1)) {
        error('Cannot set query of unknown route')
        throw new Error('Cannot set query of unknown route')
    }

    let formattedQuery = { ...query }

    if (update) {
        formattedQuery = {
            ...route.query,
            ...formattedQuery
        }
    }

    if (routerState.navigating) routerState.redirecting = true

    return changeRoute({ ...route, query: formattedQuery }, replace)
}

/**
 * Set named-params. Returns a promise.
 * @param params - Any predefined key/value pairs.
 * @param replace - (Optional, defaults to `true`) - Use window.history.pushState or window.history.replaceState.
 * @returns The current route or throws an error.
 * @example
 * await setParams({ name: 'dan' })
 *   .then(route => ...)
 *   .catch(err => ...)
 */
export async function setParams(
    params: Record<string, string>,
    replace = true
): Promise<void | FormattedRoute> {
    if (route.path === '(*)' || !route.fullPath) {
        error('Cannot set params of unknown route')
        throw new Error('Cannot set params of unknown route')
    }
    if (!route.fullPath.includes('/:')) {
        error('Current route has no defined params')
        throw new Error('Current route has no defined params')
    }

    if (routerState.navigating) routerState.redirecting = true

    return changeRoute({ ...route, params }, replace)
}
