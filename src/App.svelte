<script>
    import Navbar from './components/Navbar.svelte';
    import { routeStore, SView } from './router';

    let crumbs = [];

    routeStore.subscribe(newRoute => {
        if (!newRoute) return;

        crumbs = newRoute.crumbs;
    });
</script>

<div id="crumbs">
    {#each crumbs as crumb (crumb)}/ {crumb}&nbsp;{/each}
</div>

<Navbar />
<SView />
