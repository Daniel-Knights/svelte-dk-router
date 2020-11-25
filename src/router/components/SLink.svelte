<script>
    import { changeRoute, routes, hashHistory, writableDepthChart } from '../logic';
    import { formatPathFromParams, compareRoutes, validatePassedParams } from '../static';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        meta = undefined,
        replace = undefined;

    let routerActive;

    if (hashHistory) path = '/#' + path;

    // Match identifier to set routes
    const route = compareRoutes(routes, { name, path, params }, null);

    if (route) path = route.fullPath;

    // Handle named-params
    if (validatePassedParams(path, params) || !params) {
        path = formatPathFromParams(path, params);
    }

    // Router-active class matching
    writableDepthChart.subscribe(chart => {
        let matches;

        Object.values(chart).forEach(routeValue => {
            if (!routeValue || routeValue.path === '*') return;

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
    class={routerActive ? 'router-active' : ''}>
    <slot />
</a>
