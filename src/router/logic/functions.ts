import type { PassedRoute, FormattedRoute } from '../static'
import { error, invalidIdentifier, compareRoutes } from '../static'
import { changeRoute, route as currentRoute } from './change'
import { routes } from './state'

/**
 * Same function used by `push` and `replace` with a 'switch' for whether to use `window.history.pushState` or `window.history.replaceState`.
 * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
 * @param replace - Use window.history.pushState or window.history.replaceState.
 * @returns The current route or throws an error.
 */
const pushOrReplace = async (
    routeData: PassedRoute,
    replace: boolean
): Promise<void | FormattedRoute> => {
    const { identifier } = routeData

    if (!identifier) {
        error("'path' or 'name' argument required")
        throw new Error("'path' or 'name' argument required")
    }

    let errorString

    if (typeof identifier === 'string') {
        errorString = identifier

        if (identifier[0] === '/') {
            routeData.path = identifier
        } else {
            routeData.name = identifier
        }
    }

    if (typeof identifier === 'object') {
        const { path, name } = identifier

        if (!name && !path) {
            error("'path' or 'name' argument required")
            throw new Error("'path' or 'name' argument required")
        }

        errorString = path || name
    }

    const filteredRoute = compareRoutes(routes, routeData)
    const { params, query, props } = routeData

    if (!filteredRoute) {
        error(`Unknown route: "${errorString}"`)
        throw new Error(`Unknown route: "${errorString}"`)
    }

    const returnedRoute = await changeRoute(
        { ...filteredRoute, params, query, props },
        replace,
        invalidIdentifier(filteredRoute, identifier)
    )

    if (filteredRoute.path === '(*)') {
        error(`Unknown route: "${errorString}"`)
        throw new Error(`Unknown route: "${errorString}"`)
    }

    return returnedRoute
}

/**
 * Uses `window.history.pushState` to update the current history entry. Returns a promise.
 * @param identifier - Name or path.
 * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
 * @returns The current route or throws an error.
 * @example
 * await push('/', { query: { id: '1' } })
 *   .then(route => '')
 *   .catch(err => '')
 */
const push = (
    identifier: string,
    routeData?: PassedRoute
): Promise<void | FormattedRoute> => {
    return pushOrReplace({ identifier, ...routeData }, false)
}

/**
 * Uses window.history.replaceState to update the current history entry. Returns a promise.
 * @param identifier - Name or path.
 * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
 * @returns The current route or throws an error.
 * @example
 * await replace('/', { query: { id: '1' } })
 *   .then(route => '')
 *   .catch(err => '')
 */
const replace = (
    identifier: string,
    routeData?: PassedRoute
): Promise<void | FormattedRoute> => {
    return pushOrReplace({ identifier, ...routeData }, true)
}

/**
 * Set or update query-params. Returns a promise.
 * @param query - Any valid key/value pairs.
 * @param update - (Optional, defaults to `false`) - Update or overwrite existing query.
 * @param replace - (Optional, defaults to `true`) - Use window.history.pushState or window.history.replaceState.
 * @returns The current route or throws an error.
 * @example
 * await setQuery({ id: '1' })
 *   .then(route => '')
 *   .catch(err => '')
 */
const setQuery = async (
    query: Record<string, string>,
    update = false,
    replace = true
): Promise<FormattedRoute | void> => {
    if (currentRoute.path === '(*)' || (!currentRoute.path && currentRoute.depth === 1)) {
        error('Cannot set query of unknown route')
        throw new Error('Cannot set query of unknown route')
    }

    let formattedQuery = { ...query }

    if (update) {
        formattedQuery = {
            ...currentRoute.query,
            ...formattedQuery
        }
    }

    return changeRoute({ ...currentRoute, query: formattedQuery }, replace)
}

/**
 * Set named-params. Returns a promise.
 * @param params - Any predefined key/value pairs.
 * @param replace - (Optional, defaults to `true`) - Use window.history.pushState or window.history.replaceState.
 * @returns The current route or throws an error.
 * @example
 * await setParams({ name: 'dan' })
 *   .then(route => '')
 *   .catch(err => '')
 */
const setParams = async (
    params: Record<string, string>,
    replace = true
): Promise<FormattedRoute | void> => {
    if (currentRoute.path === '(*)' || !currentRoute.fullPath) {
        error('Cannot set params of unknown route')
        throw new Error('Cannot set params of unknown route')
    }
    if (!currentRoute.fullPath.includes('/:')) {
        error('Current route has no defined params')
        throw new Error('Current route has no defined params')
    }

    return changeRoute({ ...currentRoute, params }, replace)
}

export { push, replace, setQuery, setParams }
