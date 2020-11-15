<script>
    import { writableRoute } from '../logic';

    let component;

    writableRoute.subscribe(newRoute => (component = newRoute ? newRoute.component : null));
</script>

<svelte:component this={component} />
