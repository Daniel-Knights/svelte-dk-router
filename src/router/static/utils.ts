import type { PassedRoute, FormattedRoute, Route } from './types'
import { updateLocationData } from './location'

/** Logs a formatted error with the given-string */
export function error(msg: string): void {
    console.error('Svelte-Router [Error]: ' + msg)
}
/** Logs a formatted warning with the given-string */
export function warn(msg: string): void {
    console.warn('Svelte-Router [Warn]: ' + msg)
}

/**
 * Checks type is 'object' then returns an array of that objects' keys.
 * @returns An empty array if type is not 'object', `Object.keys(obj)` if it is
 */
export function keys(obj: Record<string, unknown> | FormattedRoute): string[] {
    if (typeof obj !== 'object') return []

    return Object.keys(obj)
}

/**
 * Checks type is 'object' then returns an array of that objects' values.
 * @returns An empty array if type is not 'object', `Object.values(obj)` if it is
 */
export function values(obj: Record<string, unknown> | FormattedRoute): unknown[] {
    if (typeof obj !== 'object') return []

    return Object.values(obj)
}

/**
 * Checks type is 'object' then returns an array of that objects' values.
 * @returns An empty array if type is not 'object', `Object.entries(obj)` if it is
 */
export function entries(obj: Record<string, unknown> | FormattedRoute): unknown[] {
    if (typeof obj !== 'object') return []

    return Object.entries(obj)
}

/** Determines if two objects are equal */
export function isEqualObject(
    objOne: Record<string, unknown>,
    objTwo: Record<string, unknown>
): boolean {
    let match = true

    if (!objOne || !objTwo || keys(objOne).length !== keys(objTwo).length) {
        return false
    }

    keys(objOne).forEach(param => {
        if (!objTwo || objTwo[param] !== objOne[param]) {
            match = false
        }
    })

    return match
}

/**
 * Determines if path is hash-based or history-based.
 * @returns The correct path.
 */
export function currentPath(hash: boolean): string {
    return hash ? '/' + window.location.hash.split('?')[0] : window.location.pathname
}

/**
 * Updates the current URL.
 * @param path
 * @param replace - `window.history.replaceState` or `window.history.pushState`.
 * @param hash - Whether to prepend URL with `/#` or not.
 */
export function setUrl(path: string, replace: boolean, hash: boolean): void {
    if (hash && path[1] !== '#') path = '/#' + path

    if (replace) {
        window.history.replaceState(null, '', path)
    } else {
        window.history.pushState(null, '', path)
    }

    updateLocationData()
}

/** Recursively unpacks nested-routes into a single array */
export function flattenRoutes(
    passedRoutes: Route[] | FormattedRoute[]
): FormattedRoute[] {
    let flattened = []

    function flatten(routesToFlatten) {
        routesToFlatten.forEach(route => {
            flattened = [...flattened, route]

            if (route.children) {
                flatten(route.children)
            }
        })
    }

    flatten(passedRoutes)

    return flattened
}

/** Strips any invalid properties and logs a warning for each one */
export function stripInvalidProperties(passedRoutes: Route[] | FormattedRoute[]): void {
    const flattened = flattenRoutes(passedRoutes)
    const validKeys = [
        'name',
        'title',
        'path',
        'component',
        'meta',
        'children',
        'regex',
        'fullRegex',
        'fullPath',
        'rootPath',
        'parent',
        'rootParent',
        'crumbs',
        'depth'
    ]

    flattened.forEach(flattenedRoute => {
        keys(flattenedRoute).forEach(key => {
            if (!validKeys.includes(key)) {
                warn(`Invalid property on route "${flattenedRoute.fullPath}": "${key}"`)

                delete flattenedRoute[key]
            }
        })
    })
}

/**
 * Returns the original passed-path if route is fallback.
 * @param passedRoute - Fallback route.
 * @param passedIdentifier
 */
export function invalidIdentifier(
    passedRoute: PassedRoute,
    passedIdentifier: string | PassedRoute
): string {
    if (passedRoute.path !== '(*)') return

    if (typeof passedIdentifier === 'string' && passedIdentifier.match(/^\//)) {
        return passedIdentifier
    } else if (typeof passedIdentifier === 'object' && passedIdentifier.path) {
        return passedIdentifier.path
    } else {
        return '/'
    }
}

/** Sets query-params to route object on page-load */
export function formatRouteQueryFromString(
    query: string | URLSearchParams,
    route: FormattedRoute
): void {
    query = new URLSearchParams(query)

    query.forEach((value, key) => {
        if (!route.query) route['query'] = {}

        route.query[key] = value
    })
}

/** Sets named-params to route object on page-load */
export function formatParamsFromPath(path: string, route: FormattedRoute): void {
    if (!route.fullPath) return

    route.fullPath.split('/').forEach((param, i) => {
        if (param[0] === ':') {
            // Validate
            if (!path.split('/')[i])
                return error('Missing required param: "' + param.slice(1) + '"')

            if (!route.params) route.params = {}

            route.params[param.split(':')[1]] = path.split('/')[i]
        }
    })
}

/** Formats all path-related properties and set them to each given-route */
export function formatPathProperties(passedRoute: FormattedRoute, path: string): void {
    const { parent } = passedRoute
    // Set path properties
    passedRoute['fullPath'] = path

    if (parent) {
        passedRoute['fullPath'] = parent.fullPath + path
        passedRoute['rootPath'] = parent.rootPath
    } else if (path.split('/')[1]) {
        passedRoute['rootPath'] = '/' + path.split('/')[1]
    } else {
        passedRoute['rootPath'] = '/'
    }
}

/** Generates regex for each provided-route and set them to the `regex` and `fullRegex` properties */
export function formatRouteRegex(passedRoute: FormattedRoute): void {
    const { path, fullPath } = passedRoute

    if (path === '(*)') return

    let regex = path
        .split('/')
        .map((section, i) => {
            if (section[0] === ':') return ''
            else if (i !== 0) return '\\/' + section
        })
        .join('')

    let fullRegex = fullPath
        .split('/')
        .map((section, i) => {
            if (section[0] === ':') {
                // Named-params
                return '\\/(?:[^\\/]+?)'
            } else if (i !== 0) return '\\/' + section
        })
        .join('')

    // Handle base-path
    if (path === '/') regex = ''

    if (fullPath === '/') fullRegex = ''

    passedRoute['regex'] = new RegExp('^' + regex + '\\/?$', 'i')
    passedRoute['fullRegex'] = new RegExp('^' + fullRegex + '\\/?$', 'i')
}

/** Formats query-string for updating the URL */
export function formatQueryFromObject(query: Record<string, string>): string {
    return entries(query)
        .map(([key, value], i, arr) => {
            if (i !== arr.length - 1) {
                return key + '=' + value + '&'
            } else return key + '=' + value
        })
        .join('')
}

/** Replaces predefined params with passed-params for updating the URL */
export function formatPathFromParams(
    path: string,
    params: Record<string, string>
): string {
    if (!path || !params) return

    entries(params).forEach(([key, value]) => {
        if (path.includes('/:')) {
            path = path.replace('/:' + key, '/' + value)
        }
    })

    return path
}

/**
 * Determines if the passed routes are the same.
 * @param routeOne - `FormattedRoute`
 * @param routeTwo - `FormattedRoute`
 * @param identifier - name or path used to navigated
 * @returns `true` if routes match, `false` if not
 */
export function isSameRoute(
    routeOne: FormattedRoute,
    routeTwo: FormattedRoute,
    identifier: string,
    previousIdentifier: string
): boolean {
    const pathMatch = routeOne.fullPath === routeTwo.fullPath && routeOne.path !== '(*)'
    const fallbackMatch =
        routeOne.path === '(*)' &&
        (identifier === window.location.pathname ||
            identifier === window.location.hash.slice(1) ||
            identifier === previousIdentifier)

    let paramMatch = true,
        queryMatch = true

    if (routeOne.params) {
        paramMatch = isEqualObject(routeOne.params, routeTwo.params)
    }

    if (routeOne.query) {
        queryMatch = isEqualObject(routeOne.query, routeTwo.query)
    } else if (!routeOne.query && routeTwo.query) queryMatch = false

    if ((pathMatch || fallbackMatch) && paramMatch && queryMatch) {
        return true
    } else return false
}

/**
 * Loops through all routes and compares against the passed-route.
 * @returns The matched route or a fallback-route (if defined).
 */
export function compareRoutes(
    routes: FormattedRoute[],
    route: PassedRoute
): void | FormattedRoute {
    const { name, path } = route
    let matchedRoute, fallbackRoute

    function matchRoute(passedRoutes) {
        if (!passedRoutes) return

        passedRoutes.forEach(compare => {
            if (matchedRoute) return

            const { regex, fullRegex } = compare

            if (compare.path === '(*)') fallbackRoute = compare

            if (path && (fullRegex || regex)) {
                if (path.match(fullRegex) || path.match(regex)) {
                    return (matchedRoute = compare)
                }
            }

            if (name === compare.name) {
                return (matchedRoute = compare)
            }

            if (compare.children) matchRoute(compare.children)
        })
    }

    matchRoute(routes)

    if (!matchedRoute) return fallbackRoute
    else return matchedRoute
}
