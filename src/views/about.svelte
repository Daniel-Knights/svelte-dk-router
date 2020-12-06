<script lang="ts">
    import { onMount } from 'svelte';

    import { route, SView, SLink } from '../router';

    // onMount(() => {
    //     console.log(route);
    // });
</script>

<main id="about">
    <h1>About</h1>
    <SLink path={'/about/origins/more'}>MORE Link</SLink>
    <SView />
</main>
