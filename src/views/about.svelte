<script lang="ts">
    import { onMount } from 'svelte';

    import { route } from '../router';

    onMount(() => {
        console.log(route);
    });
</script>

<main id="about">
    <h1>About</h1>
</main>
