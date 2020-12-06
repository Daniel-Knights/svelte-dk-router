<script lang="ts">
    import { onMount } from 'svelte';

    import { route } from '../router';
    import { SView } from '../router';

    // onMount(() => console.log(route));
</script>

<main id="home">
    <h1 id="home-view-rendered">Home</h1>
    <SView />
</main>
