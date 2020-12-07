<script lang="ts">
    import { onMount } from 'svelte';

    import { route } from '../router';
    import { SView } from '../router';

    export let id = undefined;

    // onMount(() => console.log(route));
</script>

<main id="home-view-rendered" data-testid={id}>
    <h1>Home</h1>
    <SView />
</main>
