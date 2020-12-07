import { render, fireEvent } from '@testing-library/svelte';
import { setRoutes, route, push } from '../router';
import { aboutRoute, blogDefaultChildRoute } from './static/routes';
import { cleanupChildren } from './utils';
import SLink from './static/SLink.svelte';
import SView from './static/SView.svelte';
import routes from '../routes';

beforeAll(() => setRoutes(routes));

test('Instantiates components', () => {
    expect(() =>
        render(SLink, {
            props: { name: 'About', routes },
        })
    ).not.toThrow();

    expect(() => render(SView)).not.toThrow();
});

test('SView - Renders correct routes', async () => {
    const { getByTestId } = render(SView, {
        props: { id: 'sview-depth-one' },
    });
    const depthOneView = getByTestId('sview-depth-one');

    expect(depthOneView).not.toBeNull;
    expect(depthOneView.id).toBe('home-view-rendered');

    await push('future');

    const depthOneViewUpdated = getByTestId('sview-depth-one');
    const depthTwoView = document.getElementById('future-view-rendered');

    // Parent-view
    expect(depthOneViewUpdated.id).toBe('about-view-rendered');
    // Nested-view
    expect(depthTwoView).not.toBeNull;
});

test('SLink - Changes route by name', async () => {
    const { getByTestId } = render(SLink, {
        props: { name: 'About', routes, id: '1' },
    });

    const link = getByTestId('1');

    await fireEvent.click(link);

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);
});

test('SLink - Changes route by path', async () => {
    const { getByTestId } = render(SLink, {
        props: { path: '/about', routes, id: '2' },
    });

    const link = getByTestId('2');

    await fireEvent.click(link);

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);
});

test('SLink - Changes route with query, params and meta, defaults to first child', async () => {
    const { getByTestId } = render(SLink, {
        props: {
            path: '/blog',
            params: { id: '1', name: 'dan' },
            query: { test: 'test' },
            meta: { test: 'test' },
            routes,
            id: '3',
        },
    });

    const link = getByTestId('3');

    await fireEvent.click(link);

    expect(route).toMatchObject(blogDefaultChildRoute);
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
    expect(route.meta).toMatchObject({ test: 'test' });
});

test('SLink - Changes route using window.history.replaceState', async () => {
    const { getByTestId } = render(SLink, {
        props: { path: '/about', replace: true, routes, id: '4' },
    });

    const link = getByTestId('4');

    await fireEvent.click(link);

    cleanupChildren(route);
    expect(route).toMatchObject(aboutRoute);
});

test('SLink - Applies router-active class', async () => {
    const { getByTestId } = render(SLink, {
        props: { path: '/', routes, id: '4' },
    });
    render(SLink, {
        props: { path: '/about', routes, id: '5' },
    });

    const homeLink = getByTestId('4');
    const aboutLink = getByTestId('5');

    await fireEvent.click(homeLink);

    expect(homeLink.className).toBe('router-active');
    expect(aboutLink.className).toBe('');

    await fireEvent.click(aboutLink);

    expect(homeLink.className).toBe('');
    expect(aboutLink.className).toBe('router-active');
});
