<script>
    import { writableRoute, changeRoute, routes } from '../logic';
    import { formatPathFromParams, compareRoutes } from '../static';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        replace = undefined;

    let routerActive, href;

    const route = compareRoutes(routes, { name, path });

    href = route ? route.path : null;

    if (href && href.includes(':') && params) {
        href = formatPathFromParams(href, params);
    }

    writableRoute.subscribe(newRoute => {
        if (!newRoute || newRoute.path === '*') return;

        const matches = (path && path.match(newRoute.regex)) || newRoute.name === name;

        routerActive = matches ? true : false;
    });
</script>

<a
    {href}
    on:click|preventDefault={() => changeRoute({ name, path, query, params }, replace)}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</a>
