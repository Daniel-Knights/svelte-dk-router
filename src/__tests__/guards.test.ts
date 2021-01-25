import {
    beforeEach as beforeEachCallback,
    afterEach,
    push,
    setRoutes,
    routeProps,
    replace,
    route,
    setQuery
} from '../router'
import { testRoutes } from './static/routes'
import routes from '../routes'

beforeAll(() => {
    // @ts-ignore
    setRoutes(routes, process.env.HASH_MODE)
})

// Reset callbacks to avoid conflict
beforeEach(() => {
    beforeEachCallback(() => null)
    afterEach(() => null)
})

describe('beforeEach() + afterEach()', () => {
    it('Sets props before navigation and provides them after', async done => {
        let fired

        beforeEachCallback((to, from, setProps) => {
            fired = true

            if (to.query?.id === 'eifunw') setProps({ test: 'test' })
            if (to.query?.id === 'ejwknrf') setProps('test')
        })

        afterEach(async (to, from, props) => {
            switch (to.query?.id) {
                case 'eifunw':
                    expect(props).toMatchObject({ test: 'test' })
                    expect(routeProps).toMatchObject({ test: 'test' })

                    await push('/about', { query: { id: 'ejwknrf' } })

                    break
                case 'ejwknrf':
                    expect(props).toBe('test')
                    expect(routeProps).toBe('test')

                    done()
            }
        })

        await push('/', { query: { id: 'eifunw' } })

        expect(fired).toBe(true)
    })

    it('Redirects without conflict between the two callbacks', async done => {
        beforeEachCallback(async to => {
            if (to.name === 'Future') {
                await replace('/')
            } else if (to.name === 'About') {
                await push('/future')
            }
        })

        afterEach(async to => {
            if (to.name === 'Home') {
                await push('/about')
            } else if (to.name === 'future' && to.query?.id !== '1') {
                await setQuery({ id: '1' })

                done()
            }
        })

        const result = await push('Blog', { params: { id: '1', name: 'dan' } })

        expect(result).toMatchObject(testRoutes[1].children[0])
        // @ts-ignore
        expect(result.query).toMatchObject({ id: '1' })
    })
})

describe('beforeEach()', () => {
    it('Triggers with correct to/from routes', async done => {
        beforeEachCallback(async (to, from) => {
            switch (to.query?.id) {
                case 'cwdwdc':
                    expect(from).toMatchObject(testRoutes[1])
                    expect(to).toMatchObject(testRoutes[2].children[0])

                    await push('About', { query: { id: 't4v3re' } })

                    break
                case 't4v3re':
                    expect(from).toMatchObject(testRoutes[1])
                    expect(to).toMatchObject(testRoutes[1])

                    await push('/', { query: { id: '5brvw' } })

                    break
                case '5brvw':
                    expect(from).toMatchObject(testRoutes[1])
                    expect(to).toMatchObject(testRoutes[0])

                    done()
            }
        })

        // Rebase
        await push('/about')

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { id: 'cwdwdc' }
        })
    })

    it('Redirects with push and replace', async done => {
        beforeEachCallback(async to => {
            if (to.path === '/') {
                await push('About')
            } else if (to.name === 'About') {
                await replace('/blog', { params: { id: '1', name: 'dan' } })

                if (to.query?.end) {
                    done()
                }
            }
        })

        const pushResult = await push('/')
        expect(pushResult).toMatchObject(testRoutes[2].children[0])
        expect(route).toMatchObject(testRoutes[2].children[0])

        const replaceResult = await replace('/about', { query: { end: 'true' } })
        expect(replaceResult).toMatchObject(testRoutes[2].children[0])
        expect(route).toMatchObject(testRoutes[2].children[0])
    })
})

describe('afterEach()', () => {
    it('Triggers with correct to/from routes', async done => {
        afterEach(async (to, from) => {
            switch (to.query?.id) {
                case 'lkwqdm':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[2].children[0])

                    await push('About', { query: { id: 'qwoisjq' } })

                    break
                case 'qwoisjq':
                    expect(from).toMatchObject(testRoutes[2].children[0])
                    expect(to).toMatchObject(testRoutes[1])

                    await push('/', { query: { id: 'wwkrnlk' } })

                    break
                case 'wwkrnlk':
                    expect(from).toMatchObject(testRoutes[1])
                    expect(to).toMatchObject(testRoutes[0])

                    done()
            }
        })

        // Rebase
        await push('/')

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { id: 'lkwqdm' }
        })
    })

    it('Redirects with push and replace', async done => {
        afterEach(async to => {
            if (to.name === 'Future') {
                await replace('/')
            } else if (to.name !== 'About') {
                await push('About')
            }

            done()
        })

        const replaceResult = await replace('Blog', { params: { id: '1', name: 'dan' } })
        expect(replaceResult).toMatchObject(testRoutes[2].children[0])
        expect(route).toMatchObject(testRoutes[1])

        const pushResult = await push('/')
        expect(pushResult).toMatchObject(testRoutes[0])
        expect(route).toMatchObject(testRoutes[1])
    })
})
