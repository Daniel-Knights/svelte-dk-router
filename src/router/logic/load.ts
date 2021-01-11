import type { FormattedRoute } from '../static'
import {
    currentPath,
    formatRouteQueryFromString,
    formatParamsFromPath,
    error
} from '../static'
import { afterContext, beforeContext, redirecting } from './router'
import { afterCallback, beforeCallback } from './guard'
import { routerState, writableRoute } from './state'
import { chartState } from './nested'

/**
 * Determine the current route and update route data on page-load.
 * @returns `void` or logs an error if the route is unknown.
 */
export async function loadState(): Promise<void> {
    let currentRoute: FormattedRoute
    let path = currentPath(routerState.hashHistory)

    function filterRoutes(passedRoutes, query) {
        passedRoutes.forEach(singleRoute => {
            if (currentRoute) return

            const { fullRegex, children } = singleRoute

            // Compare route path against URL path
            if (path && path.match(fullRegex)) {
                formatRouteQueryFromString(query, singleRoute)
                formatParamsFromPath(path, singleRoute)

                currentRoute = singleRoute
            } else if (children) {
                // Recursively filter through child routes
                filterRoutes(children, query)
            }
        })
    }

    function handleNestedBasePath() {
        currentRoute.children.forEach(child => {
            if (child.path === '') {
                if (currentRoute.params) {
                    child['params'] = currentRoute.params
                }

                if (currentRoute.query) {
                    child['query'] = currentRoute.query
                }

                currentRoute = child
            }
        })
    }

    if (path[1] === '#') path = path.slice(2)

    if (!routerState.routes) return
    else {
        const query = window.location.search || window.location.hash.split('?')[1]

        filterRoutes(routerState.routes, query)
    }

    // Determine if route has nested base-path and set properties if so
    if (!currentRoute) return error('Unknown route')
    else if (currentRoute && currentRoute.children) {
        handleNestedBasePath()
    }

    if (beforeCallback && !redirecting.state) {
        const beforeResult = await beforeCallback(currentRoute, null, beforeContext)

        if (beforeResult === false) return
    } else if (redirecting.state) {
        redirecting.state = false
        return
    }

    writableRoute.set(currentRoute)
    chartState(currentRoute)

    // Update title
    const title = document.getElementsByTagName('title')[0]

    if (currentRoute && currentRoute.title && title) {
        title.innerHTML = currentRoute.title
    }

    if (afterCallback && !redirecting.state) {
        afterCallback(currentRoute, null, afterContext)
    } else {
        redirecting.state = false
    }
}

window.addEventListener('popstate', loadState)
