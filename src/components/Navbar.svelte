<script lang="ts">
    import { push, replace, SLink } from '../router';

    let query: Record<string, string> = { id: '1', name: 'dan' };
    let params: Record<string, string> = { id: '1', name: 'dan' };
</script>

<style type="text/scss">
</style>

<header>
    <h1>Svelte Blog</h1>
    <nav>
        <SLink name={'Home'} {query}>Home</SLink>
        <SLink name={'About'}>About</SLink>
        <SLink path={'/blog'} {params}>Blog</SLink>
        <div on:click={() => push('/home')}>Push</div>
        <div on:click={() => replace('/about')}>Replace</div>
    </nav>
</header>
