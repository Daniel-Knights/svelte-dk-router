import { render, fireEvent } from '@testing-library/svelte';
import { push, replace, setQuery, setParams, setRoutes, route } from '../router';
import { testRoutes } from './static/routes';
import userRoutes from '../routes';
import SLink from './static/SLink.svelte';

const store = Error;

beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
    // eslint-disable-next-line
    Error = jest.fn();
});

// eslint-disable-next-line
afterAll(() => (Error = store));

afterEach(() => jest.resetAllMocks());

test('setRoutes() - Logs warning when passed invalid properties', () => {
    userRoutes[0]['invalidProperty'] = 'invalidProperty';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('setRoutes() - Logs error on missing properties', () => {
    const memoComponent = userRoutes[0].component;

    delete userRoutes[0].component;

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalledTimes(1);

    userRoutes[0]['component'] = memoComponent;
});

test('setRoutes() - Logs warning when name includes "/"', () => {
    userRoutes[1].name = '/about';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('setRoutes() - Logs error on missing children properties', () => {
    const memoPath = userRoutes[1].children[0].children[0].path;
    const memoComponent = userRoutes[2].children[1].component;

    delete userRoutes[1].children[0].children[0].path;
    delete userRoutes[2].children[1].component;

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalledTimes(2);

    userRoutes[1].children[0].children[0]['path'] = memoPath;
    userRoutes[2].children[1]['component'] = memoComponent;
});

test('setRoutes() - Logs error on duplicate named-params within a given full-path', () => {
    const memoPathOne = userRoutes[2].children[0].children[0].path;

    userRoutes[2].children[0].children[0].path = '/more:hey/:id';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalledTimes(1);

    userRoutes[2].children[0].children[0].path = memoPathOne;
});

test('setRoutes() - Logs error on duplicate properties', () => {
    const memoPathOne = userRoutes[0].path;
    const memoPathTwo = userRoutes[1].path;

    userRoutes[0].path = 'Duplicate';
    userRoutes[1].path = 'Duplicate';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalledTimes(2);

    userRoutes[0].path = memoPathOne;
    userRoutes[1].path = memoPathTwo;
});

test('setRoutes() - Logs error on duplicate children properties', () => {
    const memoNameOne = userRoutes[1].children[1].name;
    const memoNameTwo = userRoutes[2].children[0].name;

    userRoutes[1].children[1].name = 'Duplicate';
    userRoutes[2].children[0].name = 'Duplicate';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalledTimes(2);

    userRoutes[1].children[1].name = memoNameOne;
    userRoutes[2].children[0].name = memoNameTwo;
});

test('push() - Logs error on unknown route', async () => {
    await push('/unknown').catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(Error).toHaveBeenCalledTimes(1);

    await push('unknown').catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(Error).toHaveBeenCalledTimes(2);
});

test('push() - Logs error on missing named-params', async () => {
    await push('/blog');

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('push() - Logs warning on invalid named-params', async () => {
    await push('/blog', {
        params: {
            id: '1',
            name: 'Dan',
            invalid: 'invalid',
        },
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('push() - Logs error and warning on missing and invalid named-params', async () => {
    await push('/blog', {
        params: {
            id: '1',
            invalid: 'invalid',
        },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('replace() - Logs error on unknown route', async () => {
    await replace('/unknown').catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(Error).toHaveBeenCalledTimes(1);

    await replace('unknown').catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(Error).toHaveBeenCalledTimes(2);
});

test('replace() - Logs error on missing named-params', async () => {
    await replace('/blog');

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('replace() - Logs error on invalid named-params', async () => {
    await replace('/blog', {
        params: {
            id: '1',
            name: 'Dan',
            invalid: 'invalid',
        },
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('replace() - Logs error and warning on missing and invalid named-params', async () => {
    await replace('/blog', {
        params: {
            id: '1',
            invalid: 'invalid',
        },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('setQuery() - Throws error when no argument passed', async () => {
    // @ts-ignore
    await setQuery().catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(Error).toHaveBeenCalledTimes(1);
});

test('setQuery() - Throws error when anything not an object is passed', async () => {
    // @ts-ignore
    await setQuery('string').catch(() => '');
    // @ts-ignore
    await setQuery(2).catch(() => '');
    // @ts-ignore
    await setQuery(() => '').catch(() => '');
    // @ts-ignore
    await setQuery(true).catch(() => '');
    // @ts-ignore
    await setQuery(null).catch(() => '');
    // @ts-ignore
    await setQuery(undefined).catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(6);
    expect(Error).toHaveBeenCalledTimes(6);
});

test('setQuery() - Throws error when current route is unknown', async () => {
    await push('/unknown').catch(() => '');

    // @ts-ignore
    await setQuery({ test: 'test' }).catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(Error).toHaveBeenCalledTimes(2);
});

test('setParams() - Throws error when no argument passed', async () => {
    // @ts-ignore
    await setParams().catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(Error).toHaveBeenCalledTimes(1);
});

test('setParams() - Throws error when current route is unknown', async () => {
    await push('/unknown').catch(() => '');

    // @ts-ignore
    await setParams({ test: 'test' }).catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(Error).toHaveBeenCalledTimes(2);
});

test('setParams() - Throws error when route has no defined params', async () => {
    await push('/');

    await setParams({ invalid: 'invalid' }).catch(() => '');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(Error).toHaveBeenCalledTimes(1);
});

test('setParams() - Logs warning when invalid named-param is passed', async () => {
    await push('/blog', { params: { id: '1', name: 'Dan' } });

    await setParams({ invalid: 'invalid' });

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('SLink - Logs error when unknown name is passed', async () => {
    render(SLink, {
        props: { path: 'Unknown', routes: userRoutes },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
});

test('SLink - Logs error when unknown path is passed', async () => {
    render(SLink, {
        props: { path: '/unknown', routes: userRoutes },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
});

test('SLink - Logs error on missing named-params', async () => {
    render(SLink, {
        props: { path: '/blog', routes: userRoutes },
    });

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('SLink - Logs warning on invalid named-params', async () => {
    render(SLink, {
        props: {
            path: '/blog',
            params: { id: '1', name: 'dan', invalid: 'invalid' },
            routes: userRoutes,
        },
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('SLink - Logs error and warning on missing and invalid named-params', async () => {
    render(SLink, {
        props: {
            path: '/blog',
            params: { id: '1', invalid: 'invalid' },
            routes: userRoutes,
        },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('fallback - Renders when no other routes match', async () => {
    const { getByTestId } = render(SLink, {
        props: {
            path: '/unknown',
            routes: userRoutes,
            id: 'fdcgfc',
        },
    });

    const link = getByTestId('fdcgfc');

    await fireEvent.click(link);

    expect(route).toMatchObject(testRoutes[3]);

    await push('/');

    expect(route).toMatchObject(testRoutes[0]);

    await push('/unknown').catch(() => {
        expect(route).toMatchObject(testRoutes[3]);
    });
});
