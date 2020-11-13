<script lang="ts">
    import Link from '../router/Link.svelte';

    let query: Record<string, string> = { id: '1', name: 'dan' };
    let params: Record<string, string> = { id: '1', name: 'dan' };
</script>

<style type="text/scss">
</style>

<header>
    <h1>Svelte Blog</h1>
    <nav>
        <Link name={'Home'} {query}>Home</Link>
        <Link name={'About'}>About</Link>
        <Link name={'Blog'} {params}>Blog</Link>
    </nav>
</header>
