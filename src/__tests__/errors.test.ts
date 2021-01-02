import { render, fireEvent } from '@testing-library/svelte'
import {
    push,
    replace,
    setQuery,
    setParams,
    setRoutes,
    route,
    beforeEach
} from '../router'
import { testRoutes } from './static/routes'
import userRoutes from '../routes'
import SLink from './static/SLink.svelte'

const store = Error

beforeAll(() => {
    console.error = jest.fn()
    console.warn = jest.fn()
    Error = jest.fn()
})

afterAll(() => (Error = store))

afterEach(() => jest.resetAllMocks())

describe('setRoutes()', () => {
    test('Logs warning when passed invalid properties', () => {
        userRoutes[0]['invalidProperty'] = 'invalidProperty'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    test('Logs error on missing properties', () => {
        const memoComponent = userRoutes[0].component

        delete userRoutes[0].component

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(1)

        userRoutes[0]['component'] = memoComponent
    })

    test('Logs warning when name includes "/"', () => {
        userRoutes[1].name = '/about'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    test('Logs error on missing children properties', () => {
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

    test('Logs error on duplicate named-params within a given full-path', () => {
        const memoPathOne = userRoutes[2].children[0].children[0].path

        userRoutes[2].children[0].children[0].path = '/more:hey/:id'

        // @ts-ignore
        setRoutes(userRoutes)

        expect(console.error).toHaveBeenCalledTimes(1)

        userRoutes[2].children[0].children[0].path = memoPathOne
    })

    test('Logs error on duplicate properties', () => {
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

    test('Logs error on duplicate children properties', () => {
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
    test('Logs error on unknown route', async () => {
        await push('/unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)

        await push('unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })

    test('Logs/throws error on missing named-params', async () => {
        await push('/blog').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    test('Logs warning on invalid named-params', async () => {
        await push('/blog', {
            params: {
                id: '1',
                name: 'Dan',
                invalid: 'invalid'
            }
        })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    test('Logs/throws error and warning on missing and invalid named-params', async () => {
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
    test('Logs/throws error on unknown route', async () => {
        await replace('/unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)

        await replace('unknown').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })

    test('Logs/throws error on missing named-params', async () => {
        await replace('/blog').catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    test('Logs error on invalid named-params', async () => {
        await replace('/blog', {
            params: {
                id: '1',
                name: 'Dan',
                invalid: 'invalid'
            }
        })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    test('Logs/throws error and warning on missing and invalid named-params', async () => {
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
    test('Logs/throws error when current route is unknown', async () => {
        await push('/unknown').catch(() => '')

        // @ts-ignore
        await setQuery({ test: 'test' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })
})

describe('setParams()', () => {
    test('Logs/throws error when current route is unknown', async () => {
        await push('/unknown').catch(() => '')

        // @ts-ignore
        await setParams({ test: 'test' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(2)
        expect(Error).toHaveBeenCalledTimes(2)
    })

    test('Logs/throws error when route has no defined params', async () => {
        await push('/')

        await setParams({ invalid: 'invalid' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    test('Logs/throws error on missing named-params', async () => {
        await push('/blog', { params: { id: '1', name: 'Dan' } })

        await setParams({ id: '2' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })

    test('Logs warning when invalid named-param is passed', async () => {
        await push('/blog', { params: { id: '1', name: 'Dan' } })

        await setParams({ id: '2', name: 'Steve', invalid: 'invalid' })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    test('Logs/throws error and warning on missing/invalid named-params', async () => {
        await push('/blog', { params: { id: '1', name: 'Dan' } })

        await setParams({ id: '2', invalid: 'invalid' }).catch(() => '')

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledTimes(1)
        expect(Error).toHaveBeenCalledTimes(1)
    })
})

describe('<SLink>', () => {
    test('Logs error when unknown name is passed', () => {
        render(SLink, {
            props: { path: 'Unknown', routes: userRoutes }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
    })

    test('Logs error when unknown path is passed', () => {
        render(SLink, {
            props: { path: '/unknown', routes: userRoutes }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
    })

    test('Logs error on missing named-params', () => {
        render(SLink, {
            props: { path: '/blog', routes: userRoutes }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
    })

    test('Logs warning on invalid named-params', () => {
        render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', name: 'dan', invalid: 'invalid' },
                routes: userRoutes
            }
        })

        expect(console.warn).toHaveBeenCalledTimes(1)
    })

    test('Logs error and warning on missing and invalid named-params', () => {
        render(SLink, {
            props: {
                path: '/blog',
                params: { id: '1', invalid: 'invalid' },
                routes: userRoutes
            }
        })

        expect(console.error).toHaveBeenCalledTimes(1)
        expect(console.warn).toHaveBeenCalledTimes(1)
    })
})

describe('beforeEach()', () => {
    test('Logs error when attempting to set props more than once per navigation', async () => {
        beforeEach((to, from, setProps) => {
            setProps({ some: 'props' })
            setProps('Some other props')
        })

        await push('/')

        expect(console.error).toHaveBeenCalledTimes(1)
    })
})

describe('Fallback', () => {
    test('Navigates to fallback when no other routes match', async () => {
        const { getByTestId } = render(SLink, {
            props: {
                path: '/unknown',
                routes: userRoutes,
                id: 'fdcgfc'
            }
        })

        const link = getByTestId('fdcgfc')

        await fireEvent.click(link)

        expect(route).toMatchObject(testRoutes[3])

        await push('/')

        expect(route).toMatchObject(testRoutes[0])

        await push('/unknown').catch(() => '')

        expect(route).toMatchObject(testRoutes[3])
    })
})

describe('Promise rejections', () => {
    test('Correct error messages', async () => {
        Error = store

        push('/unknown').catch(err =>
            expect(err.message).toBe('Unknown route: "/unknown"')
        )
        push('/blog').catch(err =>
            expect(err.message).toBe('Missing required param(s): "id" "name"')
        )
        // @ts-ignore
        push().catch(err =>
            expect(err.message).toBe("'path' or 'name' argument required")
        )

        replace('/unknown').catch(err =>
            expect(err.message).toBe('Unknown route: "/unknown"')
        )
        replace('/blog').catch(err =>
            expect(err.message).toBe('Missing required param(s): "id" "name"')
        )
        // @ts-ignore
        replace().catch(err =>
            expect(err.message).toBe("'path' or 'name' argument required")
        )

        setQuery({ test: 'test' }).catch(err =>
            expect(err.message).toBe('Cannot set query of unknown route')
        )

        await replace('/blog', { params: { id: '1', name: 'dan' } })

        setParams({ id: '2' }).catch(err =>
            expect(err.message).toBe('Missing required param(s): "name"')
        )

        await push('/unknown').catch(() => '')

        setParams({ test: 'test' }).catch(err =>
            expect(err.message).toBe('Cannot set params of unknown route')
        )

        await push('/about')

        setParams({ test: 'test' }).catch(err =>
            expect(err.message).toBe('Current route has no defined params')
        )
    })
})
