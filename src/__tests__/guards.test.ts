import { beforeEach, afterEach, push, setRoutes, routeProps } from '../router'
import { testRoutes } from './static/routes'
import routes from '../routes'

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE))

describe('beforeEach()', () => {
    test('Triggers with correct to/from routes', async () => {
        beforeEach(async (to, from) => {
            switch (to.query.stage) {
                case '1':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[2].children[0])

                    await push('About', { query: { stage: '2' } })

                    break
                case '2':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[1])

                    await push('/', { query: { stage: '3' } })

                    break
                case '3':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[0])
                    break
            }
        })

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { stage: '1' }
        })
    })
})

describe('afterEach()', () => {
    test('Triggers with correct to/from routes', async () => {
        afterEach(async (to, from) => {
            switch (to.query.stage) {
                case '4':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[2].children[0])

                    await push('About', { query: { stage: '5' } })

                    break
                case '5':
                    expect(from).toMatchObject(testRoutes[2].children[0])
                    expect(to).toMatchObject(testRoutes[1])

                    await push('/', { query: { stage: '6' } })

                    break
                case '6':
                    expect(from).toMatchObject(testRoutes[1])
                    expect(to).toMatchObject(testRoutes[0])
                    break
            }
        })

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { stage: '4' }
        })
    })
})

describe('beforeEach() + afterEach()', () => {
    test('Correct props handling', async () => {
        beforeEach((to, from, setProps) => {
            if (to.query.stage === '7') setProps({ test: 'test' })
            if (to.query.stage === '8') setProps('test')
        })

        afterEach(async (to, from, props) => {
            switch (to.query.stage) {
                case '7':
                    expect(props).toMatchObject({ test: 'test' })
                    expect(routeProps).toMatchObject({ test: 'test' })

                    await push('/about', { query: { stage: '8' } })

                    break
                case '8':
                    expect(props).toBe('test')
                    expect(routeProps).toBe('test')
                    break
            }
        })

        await push('/', { query: { stage: '7' } })
    })
})
