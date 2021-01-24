import { render, fireEvent } from '@testing-library/svelte'
import { setRoutes, route, push, afterEach, routeProps } from '../router'
import { testRoutes } from './static/routes'
import SLink from './static/SLink.svelte'
import SView from './static/SView.svelte'
import routes from '../routes'

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE))

describe('<SLink> + <SView>', () => {
    it('Instantiates components', () => {
        expect(() =>
            render(SLink, {
                props: { name: 'About' }
            })
        ).not.toThrow()

        expect(() => render(SView)).not.toThrow()
    })
})

describe('<SView>', () => {
    it('Renders correct routes', async () => {
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
    it('Changes route by name', async () => {
        const { getByTestId } = render(SLink, {
            props: { name: 'Home', id: 'khjb23' }
        })

        const link = getByTestId('khjb23')

        await fireEvent.click(link)

        expect(route).toMatchObject(testRoutes[0])
    })

    it('Changes route by path', async () => {
        const { getByTestId } = render(SLink, {
            props: { path: '/about', id: 'jbj3h4b' }
        })

        const link = getByTestId('jbj3h4b')

        await fireEvent.click(link)

        expect(route).toMatchObject(testRoutes[1])
    })

    it('Changes route with query, params and props, defaults to first child', async () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', name: 'dan' },
                query: { test: 'test' },
                props: { test: 'test' },
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

    it('Changes route using window.history.replaceState', async done => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/',
                id: 'jh454',
                props: { replaceTest: true },
                replace: true
            }
        })
        render(SLink, {
            props: { path: '/about', id: 'enrfjk' }
        })

        const homeLink = getByTestId('jh454')
        const aboutLink = getByTestId('enrfjk')

        afterEach((to, from) => {
            if ((routeProps as Record<string, string>)?.replaceTest) {
                expect(from).not.toMatchObject(testRoutes[1])

                done()
            }
        })

        await fireEvent.click(aboutLink)
        await fireEvent.click(homeLink)

        expect(route).toMatchObject(testRoutes[0])
    })

    it('Emits correct "navigation" event', async done => {
        const { getByTestId, component } = render(SLink, {
            props: { name: 'About', id: 'oinkjn' }
        })

        const link = getByTestId('oinkjn')

        component.$on('navigation', e => {
            if (e.detail) {
                expect(e.detail.success).toBe(true)
                expect(e.detail.route).toMatchObject(testRoutes[1])

                done()
            }
        })

        await fireEvent.click(link)
    })

    it('Applies router-active class and aria-current attribute', async () => {
        const { getByTestId } = render(SLink, {
            props: { path: '/', id: 's0d9' }
        })
        render(SLink, {
            props: { path: '/about', id: '23lk4' }
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

    it('Sets correct href', () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', name: 'dan' },
                query: { test: 'test' },
                id: 'e2d2ed'
            }
        })

        const blogLink = getByTestId('e2d2ed')

        expect(blogLink.getAttribute('href')).toBe('/blog/1/dan?test=test')
    })
})
