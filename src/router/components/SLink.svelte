<script>
    import { createEventDispatcher } from 'svelte';
    import { routes, changeRoute, writableDepthChart } from '../logic';
    import {
        formatPathFromParams,
        compareRoutes,
        validatePassedParams,
        error,
        formatQueryFromObject,
    } from '../static';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        props = undefined,
        replace = undefined;

    const dispatch = createEventDispatcher();

    let routerActive;

    // Match identifier to set routes
    const route = compareRoutes(routes, { name, path, params });

    if (route) {
        if (route.path === '(*)') {
            error(`Unknown route "${name || path}"`);
        }

        name = route.name;
        path = route.path !== '(*)' ? route.fullPath : path;
    }

    if (!route) error(`Unknown route "${name || path}"`);

    // Handle named-params
    if (validatePassedParams(path, params) && params) {
        path = formatPathFromParams(path, params);
    }

    if (query) {
        path += '?' + formatQueryFromObject(query);
    }

    // Router-active class matching
    writableDepthChart.subscribe(chart => {
        if (!route) return;

        const chartRoute = chart[route.depth];

        if (!chartRoute || chartRoute.path === '(*)') {
            return (routerActive = false);
        }

        const paramMatch = JSON.stringify(params) === JSON.stringify(chartRoute.params);

        if (chartRoute.name === name && paramMatch) {
            routerActive = true;
        } else routerActive = false;
    });
</script>

<a
    href={path}
    on:click|preventDefault={async () => {
        const result = await changeRoute({ name, path, params, query, props }, replace);

        dispatch('navigation', result);
    }}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</a>
