import type { FormattedRoute } from '../router/static'

const cleanupChildren = (route: FormattedRoute): FormattedRoute => {
    if (!route) return
    if (!route.children) return

    route.children.forEach(child => {
        delete child.parent
        delete child.rootParent
    })
}

const cleanupChart = (
    chart: Record<string, FormattedRoute>,
    exclude = []
): Record<string, FormattedRoute> => {
    chart = { ...chart }

    Object.values(chart).forEach((route: FormattedRoute) => {
        if (exclude.includes(route.name) || !route.children) {
            route = { ...route }
        } else {
            route = cleanupChildren(route)
        }
    })

    return chart
}

export { cleanupChildren, cleanupChart }
