import type { FormattedRoute, PassedRoute, NewRoute } from '../static'
import {
    error,
    setUrl,
    formatQueryFromObject,
    formatPathFromParams,
    invalidIdentifier,
    isSameRoute,
    compareRoutes,
    validatePassedParams
} from '../static'
import { afterCallback, beforeCallback } from './guard'
import { chartState } from './nested'
import { route, routerState, writableRoute } from './state'

/**
 * Contains any props set on navigation through:
 *
 * - `<SLink>`
 * - `push`
 * - `replace`
 * - or `beforeEach`
 */
export let routeProps: unknown

/** Sets provided props if they haven't already been set */
export function setProps(props: unknown): void {
    if (props && routeProps) {
        error('Props can only be set once per navigation')
    } else {
        routeProps = props
    }
}

/** Previous route data */
export const fromRoute = { route: null, identifier: null }

/**
 * Central function responsible for all navigations.
 * @param passedRoute
 * @param replace - (Optional) - Use `window.history.replaceState` instead of `window.history.pushState`.
 * @param identifier - (Optional) - The passed name or path. Used for error-handling.
 * @returns The current route or throws an error.
 */
export async function changeRoute(
    passedRoute: PassedRoute,
    replace?: boolean,
    identifier?: string
): Promise<void | FormattedRoute> {
    routerState.navigating = true

    rateLimit(passedRoute)

    const matchedRoute = compareRoutes(routerState.routes, passedRoute)

    if (!matchedRoute) {
        routerState.navigating = false
        routerState.redirecting = false
        error(`Unknown route: "${identifier}"`)
        throw new Error(`Unknown route: "${identifier}"`)
    }

    const newRoute = setNewRouteData(matchedRoute)
    const { path, query, params, props } = passedRoute

    if (newRoute.path === '(*)') newRoute.path = path

    const paramsResult = validatePassedParams(newRoute.route.fullPath, params)

    if (!paramsResult.valid) {
        routerState.navigating = false
        routerState.redirecting = false
        throw new Error('Missing required param(s):' + paramsResult.errorString)
    }

    // Query handling
    if (query) {
        newRoute.route['query'] = query
        newRoute.path += '?' + formatQueryFromObject(query)
    }

    // Named-params handling
    if (params) {
        newRoute.route['params'] = params
        newRoute.path = formatPathFromParams(newRoute.path, params)
    }

    // Prevent duplicate navigation
    if (
        isSameRoute(
            { ...matchedRoute, params, query },
            route,
            identifier,
            fromRoute.identifier
        ) &&
        !routerState.redirecting
    ) {
        routerState.navigating = false
        return
    } else fromRoute.identifier = identifier

    // Set fromRoute before route is updated
    if (!replace) {
        fromRoute.route = route
    }

    // Props handling
    setProps(null)
    if (props) setProps(props)

    // Before route change navigation guard
    if (beforeCallback) {
        // Ensure latest navigation is at the zeroth index
        routerState.navigationStack.unshift(passedRoute)

        const beforeResult = await beforeCallback(
            newRoute.route,
            fromRoute.route,
            setProps
        )

        const index = routerState.navigationStack.indexOf(passedRoute)

        if (
            beforeResult === false ||
            (!routerState.afterCallbackRunning && index !== 0)
        ) {
            routerState.navigating = false
            routerState.redirecting = false
            routerState.navigationStack = []

            return route
        } else if (routerState.afterCallbackRunning) {
            routerState.navigationStack = []
        }
    }

    writableRoute.set(newRoute.route)
    chartState(newRoute.route)

    // Update page title
    const title = document.getElementsByTagName('title')[0]
    if (newRoute.title && title) {
        title.innerHTML = newRoute.title
    }

    const invalidPath = invalidIdentifier(newRoute.route, identifier)
    if (invalidPath) newRoute.path = invalidPath

    // Update URL/state
    setUrl(newRoute.path, replace, routerState.hashHistory)

    routerState.navigating = false

    if (matchedRoute.path === '(*)') {
        error(`Unknown route: "${identifier}"`)
        throw new Error(`Unknown route: "${identifier}"`)
    }

    // After route change navigation guard
    if (afterCallback) {
        routerState.afterCallbackRunning = true
        await afterCallback(route, fromRoute.route, routeProps)
        routerState.afterCallbackRunning = false
    }

    routerState.redirecting = false

    return route
}

/** Prevents infinite loops by throwing an error */
function rateLimit(passedRoute) {
    routerState.callCount += 1

    const date = new Date()

    if (!routerState.initiationTime) {
        routerState.initiationTime = date.getTime()
    }

    const timeout = date.getTime() > routerState.initiationTime + 10

    if (routerState.callCount > routerState.rateLimit && timeout) {
        routerState.callCount = 0
        routerState.initiationTime = null

        const errorMessage = `Rate-limit exceeded: "${
            passedRoute.name || passedRoute.path
        }". To increase the limit, pass a number to \`setRateLimit()\``

        error(errorMessage)
        throw new Error(errorMessage)
    } else if (routerState.callCount <= routerState.rateLimit && timeout) {
        routerState.callCount = 0
        routerState.initiationTime = null
    }
}

/** Formats and sets new route-data */
function setNewRouteData(routeData: FormattedRoute): NewRoute {
    const hasDefaultChild = routeData.children && !routeData.children[0].path
    const newRoute = { path: '', title: '', route: null }

    if (routeData.title) newRoute.title = routeData.title

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

    newRoute.path = routeData.fullPath
    newRoute.route = { ...routeData }

    // Check for default child
    if (newRoute.route.children) {
        newRoute.route.children.forEach(child => {
            if (child.path !== '') return

            newRoute.route = child
        })
    }

    return newRoute
}
