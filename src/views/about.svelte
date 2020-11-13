<script lang="ts">
    import { onMount } from 'svelte';

    import { route } from '../router/router';

    onMount(() => {
        console.log(route);
    });
</script>

<style type="text/scss">
</style>

<h1>About</h1>
