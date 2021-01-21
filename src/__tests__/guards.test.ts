import {
    beforeEach,
    afterEach,
    push,
    setRoutes,
    routeProps,
    replace,
    route
} from '../router'
import { testRoutes } from './static/routes'
import routes from '../routes'

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE))

describe('beforeEach()', () => {
    it('Triggers with correct to/from routes', async () => {
        let fired

        beforeEach(async (to, from) => {
            fired = true

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

        expect(fired).toBeTruthy()
    })

    it('Redirects with push and replace', async () => {
        let fired

        beforeEach(async to => {
            fired = true

            if (to.path === '/') {
                await push('About')
            } else if (to.name === 'About') {
                await replace('/blog', { params: { id: '1', name: 'dan' } })
            }
        })

        const pushResult = await push('/')
        expect(pushResult).toMatchObject(testRoutes[2].children[0])
        expect(route).toMatchObject(testRoutes[2].children[0])

        expect(fired).toBeTruthy()

        const replaceResult = await replace('/about')
        expect(replaceResult).toMatchObject(testRoutes[2].children[0])
        expect(route).toMatchObject(testRoutes[2].children[0])

        expect(fired).toBeTruthy()
    })
})

describe('afterEach()', () => {
    it('Triggers with correct to/from routes', async () => {
        let fired

        afterEach(async (to, from) => {
            fired = true

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

        expect(fired).toBeTruthy()
    })

    it('Redirects with push and replace', async () => {
        let fired

        afterEach(async to => {
            fired = true
            console.log('to')
            if (to.name === 'Future') {
                await replace('/')
            } else if (to.name !== 'About') {
                await push('About')
            }
        })

        const replaceResult = await replace('Blog', { params: { id: '1', name: 'dan' } })
        expect(replaceResult).toMatchObject(testRoutes[2].children[0])
        // expect(route).toMatchObject(testRoutes[1])

        expect(fired).toBeTruthy()

        const pushResult = await push('/')
        // expect(pushResult).toMatchObject(testRoutes[0])
        // expect(route).toMatchObject(testRoutes[1])

        expect(fired).toBeTruthy()
    })
})

describe('beforeEach() + afterEach()', () => {
    it('Sets props before navigation and provides them after', async () => {
        let beforeFired
        let afterFired

        beforeEach((to, from, setProps) => {
            beforeFired = true

            if (to.query?.id === 'eifunw') setProps({ test: 'test' })
            if (to.query?.id === 'ejwknrf') setProps('test')
        })

        afterEach(async (to, from, props) => {
            afterFired = true

            switch (to.query?.id) {
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

        expect(beforeFired).toBeTruthy()
        expect(afterFired).toBeTruthy()
    })
})
