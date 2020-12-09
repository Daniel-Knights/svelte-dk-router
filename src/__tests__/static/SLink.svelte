<script>
    import { changeRoute, writableDepthChart } from '../../router/logic';
    import {
        error,
        formatPathFromParams,
        compareRoutes,
        validatePassedParams,
    } from '../../router/static';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        meta = undefined,
        replace = undefined,
        routes = undefined,
        id = undefined;

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

    // Router-active class matching
    writableDepthChart.subscribe(chart => {
        let matches;

        Object.values(chart).forEach(routeValue => {
            if (!routeValue || routeValue.path === '(*)') return;

            const pathMatch = path && path.match(routeValue.fullRegex);
            const nameMatch = name && name === routeValue.name;

            if (pathMatch || nameMatch) {
                matches = true;
            }
        });

        routerActive = matches ? true : false;
    });
</script>

<a
    href={path}
    on:click|preventDefault={() => {
        changeRoute({ name, path, query, params, meta }, replace);
    }}
    class={routerActive ? 'router-active' : ''}
    data-testid={id}>
    <slot />
</a>
