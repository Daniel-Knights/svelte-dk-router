import type { FormattedRoute } from '../router/static';
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
    routeChart,
} from '../router';
import { homeRoute, aboutRoute, blogDefaultChildRoute } from './static/routes';
import { cleanupChildren } from './utils';
import routes from '../routes';

const formattedProperties = [
    'name',
    'title',
    'path',
    'component',
    'regex',
    'fullRegex',
    'fullPath',
    'rootPath',
    'crumbs',
    'depth',
];
const testObj = { test: 'test' };
const params = { id: '1', name: 'Dan' };

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE));

test('route - Correct data', async () => {
    expect(route).toMatchObject(homeRoute);

    formattedProperties.forEach(property => {
        expect(route[property]).not.toBeUndefined();
        expect(route[property]).not.toBeNull();
    });

    await push('/about');

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);

    setQuery(testObj);
    expect(route.query).toMatchObject(testObj);

    await push({ path: '/blog', params });

    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject(params);
});

test('routeChart - Correct data', async () => {
    expect(routeChart[2]).toMatchObject(blogDefaultChildRoute);

    Object.values(routeChart).forEach(route => {
        formattedProperties.forEach(property => {
            expect(route[property]).not.toBeUndefined();
            expect(route[property]).not.toBeNull();
        });
    });

    await push('/about');

    Object.values(routeChart).forEach((route: FormattedRoute) => {
        cleanupChildren(route);
    });

    expect(routeChart[1]).toMatchObject(aboutRoute);

    setQuery(testObj);

    Object.values(routeChart).forEach((route: FormattedRoute) => {
        expect(route.query).toMatchObject(testObj);
    });

    await push({ path: '/blog', params });

    expect(routeChart[2]).toMatchObject(blogDefaultChildRoute);

    Object.values(routeChart).forEach((route: FormattedRoute) => {
        expect(route.params).toMatchObject(params);
    });
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
