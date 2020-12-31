import type { FormattedRoute } from '../router/static'
import {
    route,
    hash,
    host,
    hostname,
    origin,
    pathname,
    href,
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

test('route - Correct data', async () => {
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

test('routeChart - Correct data', async () => {
    expect(routeChart[2]).toMatchObject(testRoutes[2].children[0])

    Object.values(routeChart).forEach(route => {
        formattedProperties.forEach(property => {
            expect(route[property]).not.toBeUndefined()
            expect(route[property]).not.toBeNull()
        })
    })

    await push('/about')

    expect(routeChart[1]).toMatchObject(testRoutes[1])

    setQuery(testObjOne)

    Object.values(routeChart).forEach((route: FormattedRoute) => {
        expect(route.query).toMatchObject(testObjOne)
    })

    await push('/blog', { params: testObjTwo })

    expect(routeChart[2]).toMatchObject(testRoutes[2].children[0])

    Object.values(routeChart).forEach((route: FormattedRoute) => {
        expect(route.params).toMatchObject(testObjTwo)
    })
})

test('routeStore - Correct data', async () => {
    let currentRoute

    routeStore.subscribe((newRoute: FormattedRoute) => {
        currentRoute = newRoute
    })

    await push('/')

    expect(currentRoute).toMatchObject(testRoutes[0])

    await push('/about')

    expect(currentRoute).toMatchObject(testRoutes[1])
})

test('routeChartStore - Correct data', async () => {
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

test('routeProps - Correct data', async () => {
    await push('/', { props: testObjOne })

    expect(routeProps).toMatchObject(testObjOne)

    await push('/about', { props: testObjTwo })

    expect(routeProps).toMatchObject(testObjTwo)
})

test('Correct window.location properties', async () => {
    await push('/about')

    expect(hash).toBe(window.location.hash)
    expect(host).toBe(window.location.host)
    expect(hostname).toBe(window.location.hostname)
    expect(origin).toBe(window.location.origin)
    expect(pathname).toBe(window.location.pathname)
    expect(href).toBe(window.location.href)
    expect(protocol).toBe(window.location.protocol)

    setQuery({ test: 'test' })
    expect(search).toBe(window.location.search)
})
