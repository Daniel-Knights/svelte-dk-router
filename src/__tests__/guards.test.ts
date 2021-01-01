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
                    break
                case '2':
                    expect(from).toMatchObject(testRoutes[2].children[0])
                    expect(to).toMatchObject(testRoutes[1])
                    break
                case '3':
                    expect(from).toMatchObject(testRoutes[2].children[0])
                    expect(to).toMatchObject(testRoutes[0])
                    break
            }

            if (to.name === 'About') {
                await push('/', { query: { stage: '3' } })
            }
        })

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { stage: '1' }
        })
        push('About', { query: { stage: '2' } })
    })
})

describe('afterEach()', () => {
    test('Triggers with correct to/from routes', async () => {
        afterEach(async (to, from) => {
            switch (to.query.stage) {
                case '1':
                    expect(from).toMatchObject(testRoutes[0])
                    expect(to).toMatchObject(testRoutes[2].children[0])
                    break
                case '2':
                    expect(from).toMatchObject(testRoutes[2].children[0])
                    expect(to).toMatchObject(testRoutes[1])
                    break
                case '3':
                    expect(from).toMatchObject(testRoutes[2].children[0])
                    expect(to).toMatchObject(testRoutes[0])
                    break
            }

            if (to.name === 'About') {
                await push('/', { query: { stage: '3' } })
            }
        })

        await push('Blog', {
            params: { id: '1', name: 'dan' },
            query: { stage: '1' }
        })
        push('About', { query: { stage: '2' } })
    })
})

describe('beforeEach() + afterEach()', () => {
    test('Correct props handling', async () => {
        beforeEach((to, from, setProps) => {
            if (to.query.stage === '1') setProps({ test: 'test' })
            if (to.query.stage === '2') setProps('test')
        })

        afterEach((to, from, props) => {
            switch (to.query.stage) {
                case '1':
                    expect(props).toMatchObject({ test: 'test' })
                    expect(routeProps).toMatchObject({ test: 'test' })
                    break
                case '2':
                    expect(props).toBe('test')
                    expect(routeProps).toBe('test')
                    break
            }
        })

        await push('/', { query: { stage: '1' } })
        push('/about', { query: { stage: '2' } })
    })
})
