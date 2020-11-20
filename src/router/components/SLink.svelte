<script>
    import { writableRoute, changeRoute, routes } from '../logic';
    import { formatPathFromParams, compareRoutes } from '../static';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        replace = undefined;

    let routerActive;

    const route = compareRoutes(routes, { name, path, params });

    path = route ? route.path : null;

    if (path && path.includes(':') && params) {
        path = formatPathFromParams(path, params);
    }

    writableRoute.subscribe(newRoute => {
        if (!newRoute || newRoute.path === '*') return;

        const matches = (path && path.match(newRoute.regex)) || newRoute.name === name;

        routerActive = matches ? true : false;
    });
</script>

<a
    href={path}
    on:click|preventDefault={() => changeRoute({ name, path, query, params }, replace)}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</a>
