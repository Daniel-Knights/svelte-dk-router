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
import routes from '../routes';
import { homeRoute, aboutRoute } from './static/routes';
import { cleanupChildren } from './utils';

beforeAll(() => setRoutes(routes));

test('Valid route', async () => {
    expect(route).toMatchObject(homeRoute);

    await push('/about');

    cleanupChildren();
    expect(route).toMatchObject(aboutRoute);
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
