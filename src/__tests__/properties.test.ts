import {
    route,
    hash,
    host,
    hostname,
    origin,
    pathname,
    href,
    protocol,
    search,
    setRoutes,
    push,
    setQuery,
} from '../router';
import { homeRoute, aboutRoute, blogDefaultChildRoute } from './static/routes';
import { cleanupChildren } from './utils';
import routes from '../routes';

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE));

test('route - Correct data', async () => {
    expect(route).toMatchObject(homeRoute);

    await push({ path: '/about', meta: { test: 'test' } });

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);
    expect(route.meta).toMatchObject({ test: 'test' });

    setQuery({ test: 'test' });
    expect(route.query).toMatchObject({ test: 'test' });

    await push({ path: '/blog', params: { id: '1', name: 'Dan' } });

    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'Dan' });
});

test('Correct window.location properties', async () => {
    await push('/about');

    expect(hash).toBe(window.location.hash);
    expect(host).toBe(window.location.host);
    expect(hostname).toBe(window.location.hostname);
    expect(origin).toBe(window.location.origin);
    expect(pathname).toBe(window.location.pathname);
    expect(href).toBe(window.location.href);
    expect(protocol).toBe(window.location.protocol);

    setQuery({ test: 'test' });
    expect(search).toBe(window.location.search);
});
