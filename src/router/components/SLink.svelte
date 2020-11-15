<script lang="ts">
    import { writableRoute, changeRoute } from '../logic';

    export let name: string = undefined,
        path: string = undefined,
        query: Record<string, string> = undefined,
        params: Record<string, string> = undefined;

    let routerActive: boolean;

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
