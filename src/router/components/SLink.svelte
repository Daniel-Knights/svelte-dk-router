<script lang="ts">
    import { writableRoute, changeRoute } from '../internal';

    export let name: string = undefined,
        path: string = undefined,
        query: Record<string, string> = undefined,
        params: Record<string, string> = undefined;

    let routerActive: boolean;

    writableRoute.subscribe(newRoute => {
        if (newRoute.path.split('/:')[0] === path || newRoute.name === name) {
            routerActive = true;
        } else {
            routerActive = false;
        }
    });
</script>

<div
    on:click={() => changeRoute({ name, path, query, params })}
    class={routerActive ? 'router-active' : ''}>
    <slot />
</div>
