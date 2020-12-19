<script>
    import { push, replace, SLink, setQuery, setParams, routeProps } from '../router';

    let query = { id: '1', name: 'dan' },
        params = { id: '1', name: 'dan' },
        paramsTwo = { id: '1' },
        paramsThree = { id: '1', name: 'dan', test: 'kajsdkajd' },
        paramsFour = { id: '1', test: 'heeloas' },
        props = { random: 'uowjkdwjndlkwjned' };
</script>

<header>
    <h1>Svelte Blog</h1>
    <nav>
        <SLink
            name={'Home'}
            {query}
            {props}
            replace={true}
            on:navigation={result => {
                console.log(result);
                console.log(routeProps);
            }}>
            Home
        </SLink>
        <SLink name={'About'}>About</SLink>
        <SLink name={'Future'} {params} {props}>Blog</SLink>
        <SLink path={'/blog'} params={paramsTwo} {props}>Blog - Missing Params</SLink>
        <SLink path={'/blog'} params={paramsThree} {props}>Blog - Invalid Params</SLink>
        <SLink path={'/blog'} params={paramsFour} {props}>
            Blog - Missing + Invalid Params
        </SLink>
        <SLink path={'/sadcasdc'}>Unknown Route</SLink>
        <div on:click={async () => await push('/')}>Push</div>
        <div on:click={async () => await push('/about/future')}>Push Future</div>
        <div on:click={async () => await push('/sdvdvczcxv')}>
            Push Unknown Route by path
        </div>
        <div on:click={async () => await push('/sdvdvczcxv')}>
            Push Unknown Route by path
        </div>
        <div on:click={async () => await push('sdvdvczcxv')}>
            Push Unknown Route by name
        </div>
        <div on:click={async () => await push('sdvdvczcxv')}>
            Push Unknown Route by name
        </div>
        <div
            on:click={async () => {
                await replace('/blog/hello/dan', {
                    params: { id: 'hello', name: 'knsckjsndc' },
                    props: { whaddup: 'its ya boi' },
                });
            }}>
            Replace
        </div>
        <div
            on:click={async () => {
                await replace('/blog', { params: { id: 'hello' } });
            }}>
            Replace - Missing Params
        </div>
        <div
            on:click={async () => {
                await replace('/blog', {
                    params: { id: 'hello', name: 'john', test: 'sa' },
                });
            }}>
            Replace - Invalid Params
        </div>
        <div
            on:click={async () => {
                await replace('/blog', { params: { id: 'hello', test: 'heasasd' } });
            }}>
            Replace - Missing + Invalid Params
        </div>
        <div
            on:click={async () => {
                const route = await setQuery({ it: 'definitely works' }, false, false);
                console.log(route);
            }}>
            Set Query
        </div>
        <div on:click={() => setQuery(54, true)}>Invalid query</div>
        <div on:click={() => setQuery({ definitely: 'works' }, true)}>Update Query</div>
        <div
            on:click={async () => {
                const route = await setParams({ id: 'steve', name: 'iwjndkjwend' });
                console.log(route);
            }}>
            Set Params
        </div>
        <div
            on:click={async () => {
                const route = await setParams({
                    id: 'steve',
                    name: 'iwjndkjwend',
                    test: 'asdasd',
                });
                console.log(route);
            }}>
            Set Params - Invalid params
        </div>
    </nav>
</header>
