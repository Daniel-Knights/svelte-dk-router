import { readable, writable } from 'svelte/store'
import type { FormattedRoute } from '../static'

/** Track current depth of nested routes */
const writableDepthChart = writable({})

/**
 * Object containing all routes within the current route heirarchy, listed by depth (`1` = root, `2` = child, etc.).
 * @example
 * {
 *   1: {title: "About", path: "/about", children: Array(2), name: "About", component: ƒ, …}
 *   2: {name: "Default About", path: "", children: Array(1), parent: {…}, component: ƒ, …}
 * }
 */
let routeChart: Record<string, FormattedRoute>

writableDepthChart.subscribe(newChart => (routeChart = newChart))

/**
 * Readable Svelte store which triggers on each navigation and returns the current route-heirarchy, listed by depth (`1` = root, `2` = child, etc.).
 * @example
 * routeChartStore.subscribe(newChart => {
 *   if (newChart[1].name === 'Home') {
 *     // Do something...
 *   }
 * })
 */
const routeChartStore = readable({}, set => {
    writableDepthChart.subscribe(newChart => set(newChart))
})

/** Updates the current depth-chart of routes */
const chartState = (route: FormattedRoute): void => {
    const { rootParent, crumbs } = route
    const tempChart = { 1: rootParent }
    let tempDepth = 1

    const filterChildren = passedRoute => {
        if (route.params) {
            passedRoute['params'] = route.params
        }
        if (route.query) {
            passedRoute['query'] = route.query
        }

        // Populate tempChart with matching nested route
        passedRoute.children.forEach(child => {
            if (child.name === crumbs[tempDepth]) {
                tempChart[child.depth] = child
                tempDepth += 1

                if (tempDepth !== route.depth && child.children) {
                    filterChildren(child)
                }
            }
        })
    }

    // Determine if filtering is necessary
    if (route.rootParent) {
        filterChildren(route.rootParent)
    } else {
        tempChart[1] = route
    }

    writableDepthChart.set(tempChart)
}

export { writableDepthChart, routeChart, routeChartStore, chartState }
