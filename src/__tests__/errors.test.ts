import { render } from '@testing-library/svelte';
import { push, replace, setQuery, setParams, setRoutes } from '../router';
import SLink from './static/SLink.svelte';
import userRoutes from '../routes';

beforeAll(() => {
    console.error = jest.fn();
    console.warn = jest.fn();
});

afterEach(() => jest.resetAllMocks());

test('setRoutes() - Logs warning when passed invalid properties', () => {
    userRoutes[0]['invalidProperty'] = 'invalidProperty';

    // @ts-ignore
    setRoutes(userRoutes, process.env.HASH_MODE);

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('setRoutes() - Logs error on missing properties', () => {
    const memoComponent = userRoutes[0].component;

    delete userRoutes[0].component;

    // @ts-ignore
    setRoutes(userRoutes, process.env.HASH_MODE);

    expect(console.error).toHaveBeenCalledTimes(1);

    userRoutes[0]['component'] = memoComponent;
});

test('setRoutes() - Logs error on missing children properties', () => {
    const memoPath = userRoutes[1].children[0].children[0].path;
    const memoComponent = userRoutes[2].children[1].component;

    delete userRoutes[1].children[0].children[0].path;
    delete userRoutes[2].children[1].component;

    // @ts-ignore
    setRoutes(userRoutes, process.env.HASH_MODE);

    expect(console.error).toHaveBeenCalledTimes(2);

    userRoutes[1].children[0].children[0]['path'] = memoPath;
    userRoutes[2].children[1]['component'] = memoComponent;
});

test('setRoutes() - Logs error on duplicate properties', () => {
    const memoPathOne = userRoutes[0].path;
    const memoPathTwo = userRoutes[1].path;

    userRoutes[0].path = 'Duplicate';
    userRoutes[1].path = 'Duplicate';

    // @ts-ignore
    setRoutes(userRoutes, process.env.HASH_MODE);

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
    setRoutes(userRoutes, process.env.HASH_MODE);

    expect(console.error).toHaveBeenCalledTimes(2);

    userRoutes[1].children[1].name = memoNameOne;
    userRoutes[2].children[0].name = memoNameTwo;
});

test('push() - Logs error on unknown route', async () => {
    await push('/unknown');

    expect(console.error).toHaveBeenCalledTimes(1);

    await push({ name: 'unknown' });

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('push() - Logs error on missing named-params', async () => {
    await push('/blog');

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('push() - Logs warning on invalid named-params', async () => {
    await push({
        path: '/blog',
        params: {
            id: '1',
            name: 'Dan',
            invalid: 'invalid',
        },
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('push() - Logs error and warning on missing and invalid named-params', async () => {
    await push({
        path: '/blog',
        params: {
            id: '1',
            invalid: 'invalid',
        },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('replace() - Logs error on unknown route', async () => {
    await replace('/unknown');

    expect(console.error).toHaveBeenCalledTimes(1);

    await replace({ name: 'unknown' });

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('replace() - Logs error on missing named-params', async () => {
    await replace('/blog');

    expect(console.error).toHaveBeenCalledTimes(2);
});

test('replace() - Logs error on invalid named-params', async () => {
    await replace({
        path: '/blog',
        params: {
            id: '1',
            name: 'Dan',
            invalid: 'invalid',
        },
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('replace() - Logs error and warning on missing and invalid named-params', async () => {
    await replace({
        path: '/blog',
        params: {
            id: '1',
            invalid: 'invalid',
        },
    });

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledTimes(1);
});

test('setQuery - Logs error when no argument passed', () => {
    // @ts-ignore
    setQuery();

    expect(console.error).toHaveBeenCalledTimes(1);
});

test('setQuery - Logs error when anything not an object or string is passed', () => {
    // @ts-ignore
    setQuery(2);
    // @ts-ignore
    setQuery(() => '');
    // @ts-ignore
    setQuery(true);

    expect(console.error).toHaveBeenCalledTimes(3);
});

test('setParams - Logs error when no argument passed', () => {
    // @ts-ignore
    setParams();

    expect(console.error).toHaveBeenCalledTimes(1);
});

test('setParams - Logs error when route has no defined params', async () => {
    await push('/');

    setParams({ invalid: 'invalid' });

    expect(console.error).toHaveBeenCalledTimes(1);
});

test('setParams - Logs warning when invalid named-param is passed', async () => {
    await push({ path: '/blog', params: { id: '1', name: 'Dan' } });

    setParams({ invalid: 'invalid' });

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
