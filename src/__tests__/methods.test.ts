import {
    setRoutes,
    route,
    push,
    replace,
    setQuery,
    setParams,
    beforeEach,
} from '../router';
import { routes } from '../router/logic';
import { homeRoute, aboutRoute, blogDefaultChildRoute } from './static/routes';
import { cleanupChildren } from './utils';
import userRoutes from '../routes';

beforeAll(() => setRoutes(userRoutes));

test('setRoutes()', () => expect(routes).toEqual(userRoutes));

test('setRoutes() - Strip invalid properties', () => {
    userRoutes[0]['invalidProperty'] = 'invalidProperty';

    console.warn = jest.fn();

    setRoutes(userRoutes);

    // @ts-ignore
    expect(routes[0].invalidProperty).toBeUndefined();
});

test('push() - Use window.history.pushState to change route', async () => {
    expect(route).toMatchObject(homeRoute);

    await push('/about');

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);
    expect(window.location.pathname).toBe('/about');

    await push('Home');

    expect(route).toMatchObject(homeRoute);
    expect(window.location.pathname).toBe('/');

    await push({
        path: '/blog',
        params: { id: '1', name: 'dan' },
        query: { test: 'test' },
    });

    cleanupChildren(route);
    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
    expect(window.location.pathname).toBe('/blog/1/dan');
    expect(window.location.search).toBe('?test=test');
});

test('replace() - Use window.history.replaceState to change route', async () => {
    beforeEach((to, from) => {
        if (!to.meta) return;
        if (to.meta.replaceTest) {
            expect(from).not.toMatchObject(aboutRoute);
        }
    });

    await replace('/about');

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);

    await replace({
        name: 'Blog',
        params: { id: '1', name: 'dan' },
        query: { test: 'test' },
        meta: { replaceTest: true },
    });

    cleanupChildren(route);
    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
    expect(window.location.pathname).toBe('/blog/1/dan');
    expect(window.location.search).toBe('?test=test');
});

test('setQuery() - Set the current query', () => {
    setQuery({ test: 'test' });

    expect(route.query).toMatchObject({ test: 'test' });
    expect(window.location.search).toBe('?test=test');

    setQuery('test=string-test');

    expect(route.query).toMatchObject({ test: 'string-test' });
    expect(window.location.search).toBe('?test=string-test');
});

test('setQuery() - Update the current query', () => {
    setQuery({ test: 'test', updated: 'not-updated' });

    expect(window.location.search).toBe('?test=test&updated=not-updated');

    setQuery({ updated: 'updated' }, true);

    expect(route.query).toMatchObject({ test: 'test', updated: 'updated' });
    expect(window.location.search).toBe('?test=test&updated=updated');

    setQuery('updated=string-updated', true);

    expect(route.query).toMatchObject({ test: 'test', updated: 'string-updated' });
    expect(window.location.search).toBe('?test=test&updated=string-updated');
});

test('setParams() - Set named-params', async () => {
    await push({ path: '/blog', params: { id: '1', name: 'dan' } });

    expect(window.location.pathname).toBe('/blog/1/dan');

    setParams({ id: '2', name: 'John' });

    expect(window.location.pathname).toBe('/blog/2/John');
    expect(route.params).toMatchObject({ id: '2', name: 'John' });
});
