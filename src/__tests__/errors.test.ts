import { render, fireEvent } from '@testing-library/svelte'
import {
    push,
    route,
    replace,
    setQuery,
    setParams,
    setRoutes,
    beforeEach,
    routeProps,
    setRateLimit
} from '../router'
import { testRoutes } from './static/routes'
import userRoutes from '../routes'
import SLink from './static/SLink.svelte'

// Reset in last SLink test
const store = Error

beforeAll(() => {
    console.error = jest.fn()
    console.warn = jest.fn()
    Error = jest.fn()
    setRateLimit(100)
})

afterEach(() => jest.resetAllMocks())

it('Prevents duplicate navigation', async () => {
    setRoutes(userRoutes)

    const firstResult = await push('/about')

    expect(firstResult).toMatchObject(testRoutes[1])

    const secondResult = await push('/about')

    expect(secondResult).toBeUndefined()

    const { getByTestId, component } = render(SLink, {
        props: { path: '/about', id: 'yviujnt' }
    })
    const link = getByTestId('yviujnt')

    let eventTriggered

    component.$on('navigation', () => {
        eventTriggered = true
    })

    await fireEvent.click(link)

    expect(eventTriggered).toBeUndefined()
})

describe('setRoutes()', () => {
    it('Logs warning when passed invalid properties', () => {
        userRoutes[0]['invalidProperty'] = 'invalidProperty'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Logs error on missing properties', () => {
        const memoComponent = userRoutes[0].component

        delete userRoutes[0].component

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(1)

        userRoutes[0]['component'] = memoComponent
    })

    it('Logs warning when name includes "/"', () => {
        userRoutes[1].name = '/about'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Logs error on missing children properties', () => {
        const memoPath = userRoutes[1].children[0].children[0].path
        const memoComponent = userRoutes[2].children[1].component

        delete userRoutes[1].children[0].children[0].path
        delete userRoutes[2].children[1].component

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(2)

        userRoutes[1].children[0].children[0]['path'] = memoPath
        userRoutes[2].children[1]['component'] = memoComponent
    })

    it('Logs error on duplicate named-params within a given full-path', () => {
        const memoPathOne = userRoutes[2].children[0].children[0].path

        userRoutes[2].children[0].children[0].path = '/more:hey/:id'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(1)

        userRoutes[2].children[0].children[0].path = memoPathOne
    })

    it('Logs error on duplicate properties', () => {
        const memoPathOne = userRoutes[0].path
        const memoPathTwo = userRoutes[1].path

        userRoutes[0].path = 'Duplicate'
        userRoutes[1].path = 'Duplicate'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(2)

        userRoutes[0].path = memoPathOne
        userRoutes[1].path = memoPathTwo
    })

    it('Logs error on duplicate children properties', () => {
        const memoNameOne = userRoutes[1].children[1].name
        const memoNameTwo = userRoutes[2].children[0].name

        userRoutes[1].children[1].name = 'Duplicate'
        userRoutes[2].children[0].name = 'Duplicate'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(2)

        userRoutes[1].children[1].name = memoNameOne
        userRoutes[2].children[0].name = memoNameTwo
    })
})

describe('push()', () => {
    it('Logs error on unknown route', async () => {
        await push('/unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)

        await push('unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })

    it('Logs/throws error on missing named-params', async () => {
        await push('/blog').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    it('Logs warning on invalid named-params', async () => {
        await push('/blog', {
            params: {
                id: '1',
                name: 'Dan',
                invalid: 'invalid'
            }
        })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Logs/throws error and warning on missing and invalid named-params', async () => {
        await push('/blog', {
            params: {
                id: '1',
                invalid: 'invalid'
            }
        }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })
})

describe('replace()', () => {
    it('Logs/throws error on unknown route', async () => {
        await replace('/unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)

        await replace('unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })

    it('Logs/throws error on missing named-params', async () => {
        await replace('/blog').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    it('Logs error on invalid named-params', async () => {
        await replace('/blog', {
            params: {
                id: '1',
                name: 'Dan',
                invalid: 'invalid'
            }
        })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Logs/throws error and warning on missing and invalid named-params', async () => {
        await replace('/blog', {
            params: {
                id: '1',
                invalid: 'invalid'
            }
        }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })
})

describe('setQuery()', () => {
    it('Logs/throws error when current route is unknown', async () => {
        await push('/unknown').catch(() => '')

        // @ts-ignore
        await setQuery({ test: 'test' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })
})

describe('setParams()', () => {
    it('Logs/throws error when current route is unknown', async () => {
        await push('/unknown').catch(() => '')

        // @ts-ignore
        await setParams({ test: 'test' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    it('Logs/throws error when route has no defined params', async () => {
        await push('/')

        await setParams({ invalid: 'invalid' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    it('Logs/throws error on missing named-params', async () => {
        await push('/blog', { params: { id: '1', name: 'dan' } })

        await setParams({ id: '2' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    it('Logs warning when invalid named-param is passed', async () => {
        await push('/blog', { params: { id: '2', name: 'steve' } })

        await setParams({ id: '3', name: 'John', invalid: 'invalid' })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Logs/throws error and warning on missing/invalid named-params', async () => {
        await push('/blog', { params: { id: '1', name: 'dan' } })

        await setParams({ id: '2', invalid: 'invalid' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })
})

describe('beforeEach()', () => {
    it('Logs/throws error when an infinite loop occurs', async () => {
        setRateLimit(10)

        beforeEach(async () => {
            await push('/')
        })

        await push('/').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)

        // Reset
        setRateLimit(100)
    })

    it('Logs error when attempting to set props more than once per navigation', async () => {
        beforeEach((to, from, setProps) => {
            setProps({ some: 'props' })
            setProps('Some other props')
        })

        await push('/')

        expect(routeProps).toMatchObject({ some: 'props' })
        expect(console.error).toHaveBeenCalledTimes(1)

        // Reset
        beforeEach(() => null)
    })
})

describe('Fallback', () => {
    it('Navigates to fallback when no other routes match', async () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/unknown',
                id: 'fdcgfc'
            }
        })

        const link = getByTestId('fdcgfc')

        await fireEvent.click(link)

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(1)
        expect(route).toMatchObject(testRoutes[3])

        await push('/')

        expect(route).toMatchObject(testRoutes[0])

        await push('/unknown').catch(() => '')

        expect(route).toMatchObject(testRoutes[3])
    })
})

describe('<SLink>', () => {
    it('Logs error when unknown name is passed', () => {
        render(SLink, {
            props: { path: 'Unknown' }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
    })

    it('Logs error when unknown path is passed', () => {
        render(SLink, {
            props: { path: '/unknown' }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
    })

    it('Logs error on missing named-params', () => {
        render(SLink, {
            props: { path: '/blog' }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
    })

    it('Logs warning on invalid named-params', () => {
        render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', name: 'dan', invalid: 'invalid' }
            }
        })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Logs error and warning on missing and invalid named-params', () => {
        render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', invalid: 'invalid' }
            }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    it('Emits correct "navigation" error', async done => {
        Error = store

        const { getByTestId, component } = render(SLink, {
            props: { path: '/unknown', id: 'khvvkhjv' }
        })

        const link = getByTestId('khvvkhjv')

        component.$on('navigation', e => {
            if (e.detail) {
                expect(e.detail.success).toBe(false)
                expect(e.detail.err.message).toBe(`Unknown route: "/unknown"`)
                expect(console.error).toHaveBeenCalledTimes(2)

                done()
            }
        })

        await push('/') // Prevent duplicate navigation error
        await fireEvent.click(link)
    })
})

describe('Promise rejection messages', () => {
    it('push() - Unknown route', done => {
        setRoutes(userRoutes)

        push('/unknown').catch(err => {
            expect(err.message).toBe('Unknown route: "/unknown"')

            done()
        })
    })
    it('push() - Missing params', done => {
        push('/blog').catch(err => {
            expect(err.message).toBe('Missing required param(s): "id" "name"')

            done()
        })
    })
    it('push() - No arguments', done => {
        // @ts-ignore
        push().catch(err => {
            expect(err.message).toBe('"path" or "name" argument required')

            done()
        })
    })

    it('replace() - Unknown route', done => {
        setRoutes(userRoutes)

        replace('/unknown').catch(err => {
            expect(err.message).toBe('Unknown route: "/unknown"')

            done()
        })
    })
    it('replace() - Missing params', done => {
        replace('/blog').catch(err => {
            expect(err.message).toBe('Missing required param(s): "id" "name"')

            done()
        })
    })
    it('replace() - No arguments', done => {
        // @ts-ignore
        replace().catch(err => {
            expect(err.message).toBe('"path" or "name" argument required')

            done()
        })
    })

    it('setQuery() - Unknown route', done => {
        setQuery({ test: 'test' }).catch(err => {
            expect(err.message).toBe('Cannot set query of unknown route')

            done()
        })
    })

    it('setParams() - Unknown route', async done => {
        await replace('/blog', { params: { id: '1', name: 'dan' }, query: { t: 't' } })

        setParams({ id: '2' }).catch(err => {
            expect(err.message).toBe('Missing required param(s): "name"')

            done()
        })
    })
    it('setParams() - Unknown route', async done => {
        await push('/unknown').catch(() => '')

        setParams({ test: 'test' }).catch(err => {
            expect(err.message).toBe('Cannot set params of unknown route')

            done()
        })
    })
    it('setParams() - No defined params', async done => {
        await push('/about')

        setParams({ test: 'test' }).catch(err => {
            expect(err.message).toBe('Current route has no defined params')

            done()
        })
    })

    it('Rate-limit exceeded', async done => {
        setRateLimit(10)

        beforeEach(async () => {
            await push('/')
        })

        push('/').catch(err => {
            expect(err.message).toBe(
                'Rate-limit exceeded: "/". To increase the limit, pass a number to `setRateLimit()`'
            )

            done()
        })

        // Reset
        beforeEach(() => null)
    })
})
