<script>
    import { writableRoute, changeRoute } from '../logic';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined,
        replace = undefined;

    console.log(replace);

    let routerActive;

    writableRoute.subscribe(newRoute => {
        if (newRoute.path === '*') return;
        const matches = (path && path.match(newRoute.regex)) || newRoute.name === name;
        routerActive = matches ? true : false;
    });
</script>

<a
    href="void"
    on:click|preventDefault={() => changeRoute({ name, path, query, params }, replace)}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</a>
