<script lang="ts">
    import { writableRoute } from '../logic';

    export let nothing;
    console.log(nothing);

    let component: any;

    writableRoute.subscribe(newRoute => (component = newRoute ? newRoute.component : null));
</script>

<svelte:component this={component} />
