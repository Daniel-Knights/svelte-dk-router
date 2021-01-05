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
    search
} from '../router'
import { routeProps, routes } from '../router/logic'
import { testRoutes } from './static/routes'
import userRoutes from '../routes'

const testObjOne = { test: 'test' }
const testObjTwo = { id: '1', name: 'dan' }

// @ts-ignore
beforeAll(() => setRoutes(userRoutes, process.env.HASH_MODE))

describe('setRoutes()', () => {
    test('Sets correct routes', () => expect(routes).toEqual(userRoutes))

    test('Strips invalid properties', () => {
        userRoutes[0]['invalidProperty'] = 'invalidProperty'

        console.warn = jest.fn()

        // @ts-ignore
        setRoutes(userRoutes, process.env.HASH_MODE)

        // @ts-ignore
        expect(routes[0].invalidProperty).toBeUndefined()
    })
})

describe('push()', () => {
    test('Uses window.history.pushState to change route', async () => {
        expect(route).toMatchObject(testRoutes[0])

        await push('/about')

        expect(route).toMatchObject(testRoutes[1])

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(pathname).toBe('/about')
        } else {
            expect(hash).toBe('#/about')
        }

        await push('Home')

        expect(route).toMatchObject(testRoutes[0])

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(pathname).toBe('/')
        } else {
            expect(hash).toBe('#/')
        }

        await push('/blog', {
            params: testObjTwo,
            query: testObjOne
        })

        expect(route).toMatchObject(testRoutes[2].children[0])
        expect(route.params).toMatchObject(testObjTwo)
        expect(route.query).toMatchObject(testObjOne)

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(pathname).toBe('/blog/1/dan')
            expect(search).toBe('?test=test')
        } else {
            expect(hash).toBe('#/blog/1/dan?test=test')
        }
    })

    test('Returns correct route', async () => {
        await push('/').then(newRoute => {
            expect(newRoute).toMatchObject(testRoutes[0])
        })

        const newRoute = await push('/about')

        expect(newRoute).toMatchObject(testRoutes[1])
    })
})

describe('replace()', () => {
    test('Uses window.history.replaceState to change route', async () => {
        beforeEach((to, from) => {
            if (routeProps && (routeProps as Record<string, string>).replaceTest) {
                expect(from).not.toMatchObject(testRoutes[0])
            }
        })

        await push('/')

        expect(route).toMatchObject(testRoutes[0])

        await replace('Blog', {
            params: testObjTwo,
            query: testObjOne,
            props: { replaceTest: true }
        })

        expect(route).toMatchObject(testRoutes[2].children[0])
        expect(route.params).toMatchObject(testObjTwo)
        expect(route.query).toMatchObject(testObjOne)

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(pathname).toBe('/blog/1/dan')
            expect(search).toBe('?test=test')
        } else {
            expect(hash).toBe('#/blog/1/dan?test=test')
        }
    })

    test('Returns correct route', async () => {
        await replace('future').then(newRoute => {
            expect(newRoute).toMatchObject(testRoutes[1].children[0])
        })

        const newRoute = await replace('/')

        expect(newRoute).toMatchObject(testRoutes[0])
    })
})

describe('setQuery()', () => {
    test('Sets the current query', async () => {
        await setQuery(testObjOne)

        expect(route.query).toMatchObject(testObjOne)

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(search).toBe('?test=test')
        } else {
            expect(hash).toBe('#/?test=test')
        }

        await setQuery({ test: 'different' })

        expect(route.query).toMatchObject({ test: 'different' })

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(search).toBe('?test=different')
        } else {
            expect(hash).toBe('#/?test=different')
        }
    })

    test('Updates the current query', async () => {
        await setQuery({ test: 'test', updated: 'not-updated' })

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(search).toBe('?test=test&updated=not-updated')
        } else {
            expect(hash).toBe('#/?test=test&updated=not-updated')
        }

        await setQuery({ updated: 'updated' }, true)

        expect(route.query).toMatchObject({ test: 'test', updated: 'updated' })

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(search).toBe('?test=test&updated=updated')
        } else {
            expect(hash).toBe('#/?test=test&updated=updated')
        }

        await setQuery({ test: 'test-updated', another: 'one' }, true)

        expect(route.query).toMatchObject({
            test: 'test-updated',
            another: 'one',
            updated: 'updated'
        })

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(search).toBe('?test=test-updated&updated=updated&another=one')
        } else {
            expect(hash).toBe('#/?test=test-updated&updated=updated&another=one')
        }
    })

    test('Returns correct route', async () => {
        await push('About')

        const updatedRoute = await setQuery(testObjOne)

        expect(updatedRoute).toMatchObject({
            ...testRoutes[1],
            query: testObjOne
        })
    })

    test('Push/replace', async () => {
        let fired

        expect(route).not.toMatchObject(testRoutes[0])

        await push('/')

        beforeEach((to, from) => {
            if (to.query && to.query.test === 'test') {
                expect(from).toMatchObject(testRoutes[0])

                fired = true
            }
        })

        await setQuery({ test: 'test' }, false, false)
        await setQuery({ test: 'test 2' })

        expect(fired).toBeTruthy()
    })
})

describe('setParams()', () => {
    test('Sets named-params', async () => {
        await push('/blog', { params: testObjTwo })

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(pathname).toBe('/blog/1/dan')
        } else {
            expect(hash).toBe('#/blog/1/dan')
        }

        await setParams({ id: '2', name: 'John' })

        expect(route.params).toMatchObject({ id: '2', name: 'John' })

        // @ts-ignore
        if (!process.env.HASH_MODE) {
            expect(pathname).toBe('/blog/2/John')
        } else {
            expect(hash).toBe('#/blog/2/John')
        }
    })

    test('Returns correct route', async () => {
        await push('/blog', { params: testObjTwo })

        const updatedRoute = await setParams({ id: '2', name: 'dan' })

        expect(updatedRoute).toMatchObject({
            ...testRoutes[2].children[0],
            params: { id: '2', name: 'dan' }
        })
    })

    test('Push/replace', async () => {
        let fired

        await push('/')

        expect(route).not.toMatchObject(testRoutes[2].children[0])

        await push('/blog', { params: { id: '1', name: 'dan' } })

        beforeEach((to, from) => {
            if (to.params && to.params.name === 'test') {
                expect(from).toMatchObject(testRoutes[2].children[0])

                fired = true
            }
        })

        await setParams({ id: '1', name: 'test' }, false)
        await setParams({ id: '1', name: 'test-2' })

        expect(fired).toBeTruthy()
    })
})
