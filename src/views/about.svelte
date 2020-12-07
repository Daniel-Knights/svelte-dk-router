<script lang="ts">
    import { onMount } from 'svelte';

    import { route, SView, SLink } from '../router';

    export let id = undefined;

    // onMount(() => {
    //     console.log(route);
    // });
</script>

<main id="about-view-rendered" data-testid={id}>
    <h1>About</h1>
    <SLink path={'/about/origins/more'}>MORE Link</SLink>
    <SView />
</main>
