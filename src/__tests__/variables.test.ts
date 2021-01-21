import type { FormattedRoute } from '../router/static'
import { values } from '../router/static'
import {
    route,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
    setRoutes,
    push,
    setQuery,
    routeChart,
    routeStore,
    routeChartStore,
    routeProps
} from '../router'
import { testRoutes } from './static/routes'
import routes from '../routes'

const formattedProperties = [
    'name',
    'title',
    'path',
    'component',
    'regex',
    'fullRegex',
    'fullPath',
    'rootPath',
    'crumbs',
    'depth'
]
const testObjOne = { test: 'test' }
const testObjTwo = { id: '1', name: 'Dan' }

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE))

describe('route', () => {
    it('Contains correct data', async () => {
        expect(route).toMatchObject(testRoutes[0])

        formattedProperties.forEach(property => {
            expect(route[property]).not.toBeUndefined()
            expect(route[property]).not.toBeNull()
        })

        await push('/about')

        expect(route).toMatchObject(testRoutes[1])

        setQuery(testObjOne)
        expect(route.query).toMatchObject(testObjOne)

        await push('/blog', { params: testObjTwo })

        expect(route).toMatchObject(testRoutes[2].children[0])
        expect(route.params).toMatchObject(testObjTwo)
    })
})

describe('routeChart', () => {
    it('Contains correct data', async () => {
        expect(routeChart[2]).toMatchObject(testRoutes[2].children[0])

        values(routeChart).forEach(route => {
            formattedProperties.forEach(property => {
                expect(route[property]).not.toBeUndefined()
                expect(route[property]).not.toBeNull()
            })
        })

        await push('/about')

        expect(routeChart[1]).toMatchObject(testRoutes[1])

        setQuery(testObjOne)

        values(routeChart).forEach((route: FormattedRoute) => {
            expect(route.query).toMatchObject(testObjOne)
        })

        await push('/blog', { params: testObjTwo })

        expect(routeChart[2]).toMatchObject(testRoutes[2].children[0])

        values(routeChart).forEach((route: FormattedRoute) => {
            expect(route.params).toMatchObject(testObjTwo)
        })
    })
})

describe('routeStore', () => {
    it('Contains correct data', async () => {
        let currentRoute

        routeStore.subscribe(newRoute => {
            currentRoute = newRoute
        })

        await push('/')

        expect(currentRoute).toMatchObject(testRoutes[0])

        await push('/about')

        expect(currentRoute).toMatchObject(testRoutes[1])
    })
})

describe('routeChartStore', () => {
    it('Contains correct data', async () => {
        let currentChart

        routeChartStore.subscribe((newChart: Record<string, FormattedRoute>) => {
            currentChart = newChart
        })

        await push('/')

        expect(currentChart[1]).toMatchObject(testRoutes[0])

        await push('/about/origins/more')

        expect(currentChart[1]).toMatchObject(testRoutes[1])
        expect(currentChart[2]).toMatchObject(testRoutes[1].children[1])
        expect(currentChart[3]).toMatchObject(testRoutes[1].children[1].children[0])
    })
})

describe('routeProps', () => {
    it('Contains correct data', async () => {
        await push('/', { props: testObjOne })

        expect(routeProps).toMatchObject(testObjOne)

        await push('/about', { props: testObjTwo })

        expect(routeProps).toMatchObject(testObjTwo)
    })
})

describe('window.location', () => {
    it('Contains correct location properties', async () => {
        await push('/')

        expect(hash).toBe(window.location.hash)
        expect(host).toBe(window.location.host)
        expect(hostname).toBe(window.location.hostname)
        expect(href).toBe(window.location.href)
        expect(origin).toBe(window.location.origin)
        expect(pathname).toBe(window.location.pathname)
        expect(port).toBe(window.location.port)
        expect(protocol).toBe(window.location.protocol)

        await setQuery({ test: 'test' })
        expect(search).toBe(window.location.search)

        await push('/blog', { params: { id: '1', name: 'dan' } })

        // @ts-ignore
        if (process.env.HASH_MODE) {
            expect(hash).toBe('#/blog/1/dan')
        } else expect(hash).toBe('')

        expect(host).toBe('localhost')
        expect(hostname).toBe('localhost')

        // @ts-ignore
        if (process.env.HASH_MODE) {
            expect(href).toBe('http://localhost/#/blog/1/dan')
        } else expect(href).toBe('http://localhost/blog/1/dan')

        expect(origin).toBe('http://localhost')

        // @ts-ignore
        if (process.env.HASH_MODE) {
            expect(pathname).toBe('/')
        } else expect(pathname).toBe('/blog/1/dan')

        expect(port).toBe('')
        expect(protocol).toBe('http:')

        await setQuery({ test: 'another-test' })
        // @ts-ignore
        if (process.env.HASH_MODE) {
            expect(search).toBe('')
        } else expect(search).toBe('?test=another-test')
    })
})
