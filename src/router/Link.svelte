<script lang="ts">
    import { writableRoute, changeRoute } from './router';
    import type { Query } from './types';

    export let name: string = undefined,
        path: string = undefined,
        query: Query = undefined;

    let routerActive;

    writableRoute.subscribe(newRoute => {
        if (newRoute.path === path || newRoute.name === name) {
            routerActive = true;
        } else {
            routerActive = false;
        }
    });
</script>

<div on:click={() => changeRoute(name, path, query)} class={routerActive ? 'router-active' : ''}>
    <slot />
</div>
