import { readable, writable } from 'svelte/store'
import type { FormattedRoute } from '../static'

// Track current depth of nested routes
const writableDepthChart = writable({})

// Exported static chart object
let routeChart

writableDepthChart.subscribe(newChart => (routeChart = newChart))

// Exported readable chart-store
const routeChartStore = readable({}, set => {
    writableDepthChart.subscribe(newChart => set(newChart))
})

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
