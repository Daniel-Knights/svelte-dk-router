import type { Route, FormattedRoute } from './types'
import { error, warn, flattenRoutes } from './utils'

/**
 * Flatten routes and ensure there are no duplicate names, full-paths or named-params (within a given full-path).
 * @param routes
 */
const validateRoutes = (routes: Route[] | FormattedRoute[]): void => {
    const flattened = flattenRoutes(routes)
    let namedParams = {}

    flattened.forEach((routeOne, indexOne) => {
        routeOne.fullPath.split('/').forEach(section => {
            if (section[0] === ':') {
                if (namedParams[section.slice(1)]) {
                    error(
                        'Named-params must be unique within a given routes full-path. Duplicates detected: "' +
                            section +
                            '"'
                    )
                } else {
                    namedParams[section.slice(1)] = true
                }
            }
        })

        namedParams = {}

        flattened.forEach((routeTwo, indexTwo) => {
            if (indexOne === indexTwo) return

            if (routeOne.name === routeTwo.name) {
                error(
                    'The "name" property must be unique. Duplicates detected: "' +
                        routeOne.name +
                        '"'
                )
            }

            if (
                routeOne.fullPath === routeTwo.fullPath &&
                routeOne.parent !== routeTwo &&
                routeTwo.parent !== routeOne
            ) {
                error(
                    'Paths must be unique. Duplicates detected: "' +
                        routeOne.fullPath +
                        '"'
                )
            }
        })
    })
}

/**
 * Check for invalid passed-params (params which haven't been defined), and missing required-params.
 * @param path
 * @param params
 * @param silenceError - Prevent missing-param error from being logged/thrown.
 * @returns An error-string for `changeRoute` to throw or a boolean indicating the params are valid.
 */
const validatePassedParams = (
    path: string,
    params: Record<string, string>,
    silenceError = false
): Record<string, boolean | string> => {
    let errorString = ''

    // Validate required params
    if (path) {
        path.split('/').forEach((section, i) => {
            if (i === 0 || section[0] !== ':') return

            section = section.split(':')[1]

            if (!params || !params[section]) {
                errorString += ` "${section}"`
            }
        })
    }

    if (params) {
        // Compare passed params with path params
        Object.keys(params).forEach(passedParam => {
            if (!path || !path.includes('/:' + passedParam)) {
                warn('Invalid param: "' + passedParam + '"')

                // Cleanup
                delete params[passedParam]
            }
        })
    }

    if (errorString && !silenceError) {
        error('Missing required param(s):' + errorString)

        return { errorString }
    }

    return { valid: true }
}

export { validateRoutes, validatePassedParams }
