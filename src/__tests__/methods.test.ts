import { setRoutes, route, push, replace, setQuery } from '../router';
import { routes, setParams } from '../router/logic';
import { homeRoute, aboutRoute, blogDefaultChildRoute } from './static/routes';
import { cleanupChildren } from './utils';
import userRoutes from '../routes';

beforeAll(() => setRoutes(userRoutes));

test('Set routes', () => expect(routes).toEqual(userRoutes));

test('Use window.history.pushState to change route', async () => {
    expect(route).toMatchObject(homeRoute);

    await push('/about');

    cleanupChildren();
    expect(route).toMatchObject(aboutRoute);

    await push('Home');

    expect(route).toMatchObject(homeRoute);

    await push({
        path: '/blog',
        params: { id: '1', name: 'dan' },
        query: { test: 'test' },
    });

    cleanupChildren();
    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
});

test('Use window.history.replaceState to change route', async () => {
    await replace('/about');

    cleanupChildren();
    expect(route).toMatchObject(aboutRoute);

    await replace({
        name: 'Blog',
        params: { id: '1', name: 'dan' },
        query: { test: 'test' },
    });

    cleanupChildren();
    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
});

test('Set the current query', () => {
    setQuery({ test: 'test' });

    expect(route.query).toMatchObject({ test: 'test' });
});

test('Update the current query', () => {
    setQuery({ test: 'test', updated: 'not updated' });
    setQuery({ updated: 'updated' }, true);

    expect(route.query).toMatchObject({ test: 'test', updated: 'updated' });
});

test('Set named-params', async () => {
    await push({ path: '/blog', params: { id: '1', name: 'dan' } });

    setParams({ id: '2', name: 'John' });

    expect(route.params).toMatchObject({ id: '2', name: 'John' });
});
