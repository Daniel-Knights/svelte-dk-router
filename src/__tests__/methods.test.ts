import {
    setRoutes,
    route,
    push,
    replace,
    setQuery,
    setParams,
    beforeEach,
    hash,
    pathname,
    search,
} from '../router';
import { routeProps, routes, setProps } from '../router/logic';
import { testRoutes } from './static/routes';
import userRoutes from '../routes';

const testObjOne = { test: 'test' };
const testObjTwo = { id: '1', name: 'dan' };

// @ts-ignore
beforeAll(() => setRoutes(userRoutes, process.env.HASH_MODE));

test('setRoutes()', () => expect(routes).toEqual(userRoutes));

test('setRoutes() - Strip invalid properties', () => {
    userRoutes[0]['invalidProperty'] = 'invalidProperty';

    console.warn = jest.fn();

    // @ts-ignore
    setRoutes(userRoutes, process.env.HASH_MODE);

    // @ts-ignore
    expect(routes[0].invalidProperty).toBeUndefined();
});

test('push() - Use window.history.pushState to change route', async () => {
    expect(route).toMatchObject(testRoutes[0]);

    await push('/about');

    expect(route).toMatchObject(testRoutes[1]);

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(pathname).toBe('/about');
    } else {
        expect(hash).toBe('#/about');
    }

    await push('Home');

    expect(route).toMatchObject(testRoutes[0]);

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(pathname).toBe('/');
    } else {
        expect(hash).toBe('#/');
    }

    await push({
        path: '/blog',
        params: testObjTwo,
        query: testObjOne,
    });

    expect(route).toMatchObject(testRoutes[2].children[0]);
    expect(route.params).toMatchObject(testObjTwo);
    expect(route.query).toMatchObject(testObjOne);

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(pathname).toBe('/blog/1/dan');
        expect(search).toBe('?test=test');
    } else {
        expect(hash).toBe('#/blog/1/dan?test=test');
    }
});

test('replace() - Use window.history.replaceState to change route', async () => {
    beforeEach((to, from) => {
        if (!routeProps) return;
        if (routeProps.replaceTest) {
            expect(from).not.toMatchObject(testRoutes[1]);
        }
    });

    await replace('/about');

    expect(route).toMatchObject(testRoutes[1]);

    await replace({
        name: 'Blog',
        params: testObjTwo,
        query: testObjOne,
        props: { replaceTest: true },
    });

    expect(route).toMatchObject(testRoutes[2].children[0]);
    expect(route.params).toMatchObject(testObjTwo);
    expect(route.query).toMatchObject(testObjOne);

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(pathname).toBe('/blog/1/dan');
        expect(search).toBe('?test=test');
    } else {
        expect(hash).toBe('#/blog/1/dan?test=test');
    }
});

test('setQuery() - Set the current query', () => {
    setQuery(testObjOne);

    expect(route.query).toMatchObject(testObjOne);

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(search).toBe('?test=test');
    } else {
        expect(hash.split('?')[1]).toBe('test=test');
    }

    setQuery('test=string-test');

    expect(route.query).toMatchObject({ test: 'string-test' });

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(search).toBe('?test=string-test');
    } else {
        expect(hash.split('?')[1]).toBe('test=string-test');
    }
});

test('setQuery() - Update the current query', () => {
    setQuery({ test: 'test', updated: 'not-updated' });

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(search).toBe('?test=test&updated=not-updated');
    } else {
        expect(hash.split('?')[1]).toBe('test=test&updated=not-updated');
    }

    setQuery({ updated: 'updated' }, true);

    expect(route.query).toMatchObject({ test: 'test', updated: 'updated' });

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(search).toBe('?test=test&updated=updated');
    } else {
        expect(hash.split('?')[1]).toBe('test=test&updated=updated');
    }

    setQuery('updated=string-updated', true);

    expect(route.query).toMatchObject({ test: 'test', updated: 'string-updated' });

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(search).toBe('?test=test&updated=string-updated');
    } else {
        expect(hash.split('?')[1]).toBe('test=test&updated=string-updated');
    }
});

test('setParams() - Set named-params', async () => {
    await push({ path: '/blog', params: testObjTwo });

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(pathname).toBe('/blog/1/dan');
    } else {
        expect(hash).toBe('#/blog/1/dan');
    }

    setParams({ id: '2', name: 'John' });

    expect(route.params).toMatchObject({ id: '2', name: 'John' });

    // @ts-ignore
    if (!process.env.HASH_MODE) {
        expect(pathname).toBe('/blog/2/John');
    } else {
        expect(hash).toBe('#/blog/2/John');
    }
});

test('setProps - Set route-props', () => {
    setProps(testObjOne);

    expect(routeProps).toMatchObject(testObjOne);

    setProps(testObjTwo);

    expect(routeProps).toMatchObject(testObjTwo);
});
