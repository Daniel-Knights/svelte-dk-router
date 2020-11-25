<script lang="ts">
    import { push, replace, SLink, setQuery, setParams, route } from '../router';

    let query: Record<string, string> = { id: '1', name: 'dan' },
        params: Record<string, string> = { id: '1', name: 'dan' },
        paramsTwo: Record<string, string> = { id: '1' },
        paramsThree: Record<string, string> = { id: '1', name: 'dan', test: 'kajsdkajd' },
        paramsFour: Record<string, string> = { id: '1', test: 'heeloas' },
        meta: Record<string, string> = { test: 'uowjkdwjndlkwjned' };
</script>

<header>
    <h1>Svelte Blog</h1>
    <nav>
        <SLink name={'home'} {query} {meta} replace={true}>Home</SLink>
        <SLink name={'about'}>About</SLink>
        <SLink path={'/blog'} {params} {meta}>Blog</SLink>
        <SLink path={'/blog'} params={paramsTwo} {meta}>Blog - Missing Params</SLink>
        <SLink path={'/blog'} params={paramsThree} {meta}>Blog - Invalid Params</SLink>
        <SLink path={'/blog'} params={paramsFour} {meta}>Blog - Missing + Invalid Params</SLink>
        <div on:click={async () => await push('/')}>Push</div>
        <div
            on:click={async () => {
                await replace({
                    path: '/blog',
                    params: { id: 'hello', name: 'knsckjsndc' },
                    meta: { whaddup: 'its ya boi' },
                });
            }}>
            Replace
        </div>
        <div
            on:click={async () => {
                await replace({ path: '/blog', params: { id: 'hello' } });
            }}>
            Replace - Missing Params
        </div>
        <div
            on:click={async () => {
                await replace({ path: '/blog', params: { id: 'hello', name: 'john', test: 'sa' } });
            }}>
            Replace - Invalid Params
        </div>
        <div
            on:click={async () => {
                await replace({ path: '/blog', params: { id: 'hello', test: 'heasasd' } });
            }}>
            Replace - Missing + Invalid Params
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
