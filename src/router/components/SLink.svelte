<script>
    import { createEventDispatcher } from 'svelte'
    import { changeRoute, writableDepthChart, routerState } from '../logic'
    import {
        error,
        isEqualObject,
        compareRoutes,
        formatPathFromParams,
        validatePassedParams,
        formatQueryFromObject
    } from '../static'

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        props = undefined,
        replace = undefined

    const dispatch = createEventDispatcher()
    const identifier = name || path

    let routerActive

    // Match identifier to set-routes
    const route = compareRoutes(routerState.routes, { name, path, params })

    if (route) {
        if (route.path === '(*)') {
            error(`Unknown route "${identifier}"`)
        } else {
            name = route.name
            path = route.fullPath
        }
    } else error(`Unknown route "${identifier}"`)

    // Handle named-params
    if (validatePassedParams(path, params).valid && params) {
        path = formatPathFromParams(path, params)
    }

    if (query) {
        path += '?' + formatQueryFromObject(query)
    }

    const routeData = { name, path, params, query, props }

    // Router-active class matching
    writableDepthChart.subscribe(chart => {
        if (!route) return

        const chartRoute = chart[route.depth]

        if (!chartRoute || chartRoute.path === '(*)') {
            return (routerActive = false)
        }

        const paramMatch = params ? isEqualObject(params, chartRoute.params) : true

        if (chartRoute.name === name && paramMatch) {
            routerActive = true
        } else routerActive = false
    })
</script>

<a
    href={path}
    on:click|preventDefault={() => {
        changeRoute(routeData, replace, identifier)
            .then(result => {
                if (!result) return

                dispatch('navigation', { success: true, route: result })
            })
            .catch(err => {
                dispatch('navigation', { success: false, err })
            })
    }}
    class={routerActive ? 'router-active' : ''}
    aria-current={routerActive ? 'page' : null}
    {...$$restProps}
>
    <slot />
</a>
