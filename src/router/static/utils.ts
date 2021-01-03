import type { PassedRoute, FormattedRoute, Route } from './types'
import { updateLocationData } from '../logic/properties'

/** Logs a formatted error with the given-string */
const error = (msg: string): void => {
    console.error('Svelte-Router [Error]: ' + msg)
}
/** Logs a formatted warning with the given-string */
const warn = (msg: string): void => {
    console.warn('Svelte-Router [Warn]: ' + msg)
}

/**
 * Determines if path is hash-based or history-based.
 * @returns The correct path.
 */
const currentPath = (hash: boolean): string => {
    return hash ? '/' + window.location.hash.split('?')[0] : window.location.pathname
}

/**
 * Updates the current URL.
 * @param path
 * @param replace - `window.history.replaceState` or `window.history.pushState`.
 * @param hash - Whether to prepend URL with `/#` or not.
 */
const setUrl = (path: string, replace: boolean, hash: boolean): void => {
    if (hash && path[1] !== '#') path = '/#' + path

    if (replace) {
        window.history.replaceState(null, '', path)
    } else {
        window.history.pushState(null, '', path)
    }

    updateLocationData()
}

/** Recursively unpacks nested-routes into a single array */
const flattenRoutes = (passedRoutes: Route[] | FormattedRoute[]): FormattedRoute[] => {
    let flattened = []

    const flatten = routesToFlatten => {
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
const stripInvalidProperties = (passedRoutes: Route[] | FormattedRoute[]): void => {
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
        Object.keys(flattenedRoute).forEach(key => {
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
const invalidIdentifier = (
    passedRoute: PassedRoute,
    passedIdentifier: string | PassedRoute
): string => {
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
const formatRouteQueryFromString = (
    query: string | URLSearchParams,
    route: FormattedRoute
): void => {
    query = new URLSearchParams(query)

    query.forEach((value, key) => {
        if (!route.query) route['query'] = {}

        route.query[key] = value
    })
}

/** Sets named-params to route object on page-load */
const formatParamsFromPath = (path: string, route: FormattedRoute): void => {
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
const formatPathProperties = (passedRoute: FormattedRoute, path: string): void => {
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
const formatRouteRegex = (passedRoute: FormattedRoute): void => {
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
const formatQueryFromObject = (query: Record<string, string>): string => {
    const formattedQuery = Object.entries(query)
        .map(([key, value], i, arr) => {
            if (i !== arr.length - 1) {
                return key + '=' + value + '&'
            } else return key + '=' + value
        })
        .join('')

    return formattedQuery
}

/** Replaces predefined params with passed-params for updating the URL */
const formatPathFromParams = (path: string, params: Record<string, string>): string => {
    if (!path || !params) return

    Object.entries(params).forEach(([key, value]) => {
        if (path.includes('/:')) {
            path = path.replace('/:' + key, '/' + value)
        }
    })

    return path
}

/**
 * Loops through all routes and compares against the passed-route.
 * @returns The matched route or a fallback-route (if defined).
 */
const compareRoutes = (
    routes: FormattedRoute[],
    route: PassedRoute
): void | FormattedRoute => {
    const { name, path } = route
    let matchedRoute, fallbackRoute

    const matchRoute = passedRoutes => {
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

export {
    error,
    warn,
    currentPath,
    setUrl,
    flattenRoutes,
    stripInvalidProperties,
    invalidIdentifier,
    formatRouteQueryFromString,
    formatParamsFromPath,
    formatPathProperties,
    formatRouteRegex,
    formatQueryFromObject,
    formatPathFromParams,
    compareRoutes
}
