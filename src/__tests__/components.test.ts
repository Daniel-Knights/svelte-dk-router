import { render, fireEvent } from '@testing-library/svelte'
import { setRoutes, route, push, afterEach, routeProps } from '../router'
import { testRoutes } from './static/routes'
import SLink from './static/SLink.svelte'
import SView from './static/SView.svelte'
import routes from '../routes'

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE))

describe('<SLink> + <SView>', () => {
    test('Instantiates components', () => {
        expect(() =>
            render(SLink, {
                props: { name: 'About', routes }
            })
        ).not.toThrow()

        expect(() => render(SView)).not.toThrow()
    })
})

describe('<SView>', () => {
    test('Renders correct routes', async () => {
        // Silence faulty unknown route error
        console.error = () => ''

        const { getByTestId } = render(SView, {
            props: { id: 'sview-depth-one' }
        })
        const depthOneView = getByTestId('sview-depth-one')

        expect(depthOneView).not.toBeNull
        expect(depthOneView.id).toBe('home-view-rendered')

        await push('future')

        const depthOneViewUpdated = getByTestId('sview-depth-one')
        const depthTwoView = document.getElementById('future-view-rendered')

        // Parent-view
        expect(depthOneViewUpdated.id).toBe('about-view-rendered')
        // Nested-view
        expect(depthTwoView).not.toBeNull
    })
})

describe('<SLink>', () => {
    test('Changes route by name', async () => {
        const { getByTestId } = render(SLink, {
            props: { name: 'Home', routes, id: 'khjb23' }
        })

        const link = getByTestId('khjb23')

        await fireEvent.click(link)

        expect(route).toMatchObject(testRoutes[0])
    })

    test('Changes route by path', async () => {
        const { getByTestId } = render(SLink, {
            props: { path: '/about', routes, id: 'jbj3h4b' }
        })

        const link = getByTestId('jbj3h4b')

        await fireEvent.click(link)

        expect(route).toMatchObject(testRoutes[1])
    })

    test('Changes route with query, params and props, defaults to first child', async () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', name: 'dan' },
                query: { test: 'test' },
                props: { test: 'test' },
                routes,
                id: '3g4fa'
            }
        })

        const link = getByTestId('3g4fa')

        await fireEvent.click(link)

        expect(route).toMatchObject(testRoutes[2].children[0])
        expect(route.params).toMatchObject({ id: '1', name: 'dan' })
        expect(route.query).toMatchObject({ test: 'test' })
        expect(routeProps).toMatchObject({ test: 'test' })
    })

    test('Changes route using window.history.replaceState', async () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/',
                routes,
                id: 'jh454',
                props: { replaceTest: true },
                replace: true
            }
        })
        render(SLink, {
            props: { path: '/about', routes, id: 'enrfjk' }
        })

        const homeLink = getByTestId('jh454')
        const aboutLink = getByTestId('enrfjk')

        afterEach((to, from) => {
            if (routeProps && (routeProps as Record<string, string>).replaceTest) {
                expect(from).not.toMatchObject(testRoutes[1])
            }
        })

        await fireEvent.click(aboutLink)
        await fireEvent.click(homeLink)

        expect(route).toMatchObject(testRoutes[0])
    })

    test('Emits correct "navigation" event', async () => {
        const { getByTestId, component } = render(SLink, {
            props: { name: 'About', routes, id: 'oinkjn' }
        })

        const link = getByTestId('oinkjn')

        let fired

        component.$on('navigation', e => {
            if (e.detail) {
                expect(e.detail.success).toBeTruthy()
                expect(e.detail.route).toMatchObject(testRoutes[1])

                fired = true
            }
        })

        await fireEvent.click(link)

        expect(fired).toBeTruthy()
    })

    test('Applies router-active class and aria-current attribute', async () => {
        const { getByTestId } = render(SLink, {
            props: { path: '/', routes, id: 's0d9' }
        })
        render(SLink, {
            props: { path: '/about', routes, id: '23lk4' }
        })

        const homeLink = getByTestId('s0d9')
        const aboutLink = getByTestId('23lk4')

        await fireEvent.click(homeLink)

        expect(homeLink.className).toBe('router-active')
        expect(homeLink.getAttribute('aria-current')).toBe('page')
        expect(aboutLink.className).toBe('')
        expect(aboutLink.getAttribute('aria-current')).toBeNull()

        await fireEvent.click(aboutLink)

        expect(homeLink.className).toBe('')
        expect(homeLink.getAttribute('aria-current')).toBeNull()
        expect(aboutLink.className).toBe('router-active')
        expect(aboutLink.getAttribute('aria-current')).toBe('page')
    })

    test('Sets correct href', () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', name: 'dan' },
                query: { test: 'test' },
                routes,
                id: 'e2d2ed'
            }
        })

        const blogLink = getByTestId('e2d2ed')

        expect(blogLink.getAttribute('href')).toBe('/blog/1/dan?test=test')
    })
})
