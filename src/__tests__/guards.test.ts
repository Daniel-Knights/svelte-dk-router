import { beforeEach, afterEach, push, setRoutes, routeProps } from '../router'
import { testRoutes } from './static/routes'
import routes from '../routes'

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE))

describe('beforeEach()', () => {
    test('Triggers with correct to/from routes', async () => {
        beforeEach(async (to, from) => {
            switch (to.query?.id) {
                case 'cwdwdc':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[2].children[0])

                    await push('About', { query: { id: 't4v3re' } })

                    break
                case 't4v3re':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[1])

                    await push('/', { query: { id: '5brvw' } })

                    break
                case '5brvw':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[0])
            }
        })

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { id: 'cwdwdc' }
        })
    })
})

describe('afterEach()', () => {
    test('Triggers with correct to/from routes', async () => {
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
            }
        })

        // Rebase
        await push('/')

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { id: 'lkwqdm' }
        })
    })
})

describe('beforeEach() + afterEach()', () => {
    test('Correct props handling', async () => {
        beforeEach((to, from, setProps) => {
            if (to.query.id === 'eifunw') setProps({ test: 'test' })
            if (to.query.id === 'ejwknrf') setProps('test')
        })

        afterEach(async (to, from, props) => {
            switch (to.query.id) {
                case 'eifunw':
                    expect(props).toMatchObject({ test: 'test' })
                    expect(routeProps).toMatchObject({ test: 'test' })

                    await push('/about', { query: { id: 'ejwknrf' } })

                    break
                case 'ejwknrf':
                    expect(props).toBe('test')
                    expect(routeProps).toBe('test')
                    break
            }
        })

        await push('/', { query: { id: 'eifunw' } })
    })
})
