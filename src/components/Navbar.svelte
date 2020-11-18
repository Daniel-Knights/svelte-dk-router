<script lang="ts">
    import { push, replace, SLink, setQuery, setParams, route } from '../router';

    let query: Record<string, string> = { id: '1', name: 'dan' },
        params: Record<string, string> = { id: '1', name: 'dan' };
</script>

<style type="text/scss">
</style>

<header>
    <h1>Svelte Blog</h1>
    <nav>
        <SLink name={'home'} {query} replace={true}>Home</SLink>
        <SLink name={'about'}>About</SLink>
        <SLink path={'/blog'} {params}>Blog</SLink>
        <div on:click={() => push('/')}>Push</div>
        <div
            on:click={() => replace({
                    path: '/blog',
                    params: { id: 'hello', name: 'knsckjsndc' },
                })}>
            Replace
        </div>
        <div
            on:click={() => {
                setQuery({ it: 'definitely works' });
                console.log(route);
            }}>
            Set Query
        </div>
        <div on:click={() => setQuery({ it: 'works' }, true)}>Update Query</div>
        <div on:click={() => setQuery({ definitely: 'works' }, true)}>Update Query</div>
        <div
            on:click={() => {
                setParams({ id: 'steve', name: 'iwjndkjwend' });
                console.log(route);
            }}>
            Set Params
        </div>
    </nav>
</header>
