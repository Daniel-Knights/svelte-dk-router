<script>
    import { writableRoute, changeRoute } from '../logic';

    export let name = undefined,
        path = undefined,
        query = undefined,
        params = undefined;

    let routerActive;

    writableRoute.subscribe(newRoute => {
        if (newRoute.path === '*') return;
        const matches = (path && path.match(newRoute.regex)) || newRoute.name === name;
        routerActive = matches ? true : false;
    });
</script>

<div
    on:click={() => changeRoute({ name, path, query, params })}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</div>
