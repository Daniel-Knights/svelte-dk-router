<script>
    import { writableRoute } from '../logic';

    let component;

    writableRoute.subscribe(newRoute => (component = newRoute.component));
</script>

<svelte:component this={component} />
