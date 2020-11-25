<script>
    import { writableRoute, changeRoute, routes, hashHistory } from '../logic';
    import { formatPathFromParams, compareRoutes } from '../static';

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
    path = formatPathFromParams(path, params);

    // Router-active class matching
    writableRoute.subscribe(newRoute => {
        if (!newRoute || newRoute.path === '*') return;

        const matches =
            (path && path.match(newRoute.fullRegex)) || (name && name === newRoute.name);

        routerActive = matches ? true : false;
    });
</script>

<a
    href={path}
    on:click|preventDefault={() => changeRoute({ name, path, query, params, meta }, replace)}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</a>
