<script lang="ts">
    import { writableRoute } from './router';

    let component;

    writableRoute.subscribe(newRoute => (component = newRoute ? newRoute.component : null));
</script>

<svelte:component this={component} />
