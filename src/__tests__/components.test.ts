import { render, fireEvent } from '@testing-library/svelte';
import { setRoutes, route, push } from '../router';
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

test('SView renders correct routes', async () => {
    const { findByText } = render(SView);
    const home = await findByText('Home');

    expect(home.id).toBe('home-view-rendered');
});

test('Changes route by name', async () => {
    const { getByTestId } = render(SLink, {
        props: { name: 'About', routes, id: '1' },
    });

    const link = getByTestId('1');

    await fireEvent.click(link);

    expect(route.name).toBe('About');
});

test('Changes route by path', async () => {
    const { getByTestId } = render(SLink, {
        props: { path: '/about', routes, id: '2' },
    });

    const link = getByTestId('2');

    await fireEvent.click(link);

    expect(route.name).toBe('About');
});

test('Changes route with query, params and meta, defaults to first child', async () => {
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

    expect(route.name).toBe('Future');
    expect(route.params).toMatchObject({ id: '1', name: 'dan' });
    expect(route.query).toMatchObject({ test: 'test' });
    expect(route.meta).toMatchObject({ test: 'test' });
});

test('Changes route using window.history.replaceState', async () => {
    const { getByTestId } = render(SLink, {
        props: { path: '/about', replace: true, routes, id: '4' },
    });

    const link = getByTestId('4');

    await fireEvent.click(link);

    expect(route.name).toBe('About');
});

test('Applies router-active class', async () => {
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
