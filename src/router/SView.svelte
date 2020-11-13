<script lang="ts">
    import { writableRoute } from './state';

    let component: any;

    writableRoute.subscribe(newRoute => (component = newRoute ? newRoute.component : null));
</script>

<svelte:component this={component} />
