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
        <SLink name={'Home'} {query} replace={true}>Home</SLink>
        <SLink name={'About'}>About</SLink>
        <SLink path={'/blog'} {params}>Blog</SLink>
        <div on:click={() => push('/')}>Push</div>
        <div
            on:click={() => replace({
                    path: '/blog',
                    params: { id: 'hello', name: 'knsckjsndc' },
                })}>
            Replace
        </div>
    </nav>
</header>
