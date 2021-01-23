import App from './App.svelte'
import routes from './routes'
import {
    setRoutes,
    beforeEach,
    afterEach,
    route,
    routeProps,
    push,
    replace,
    setParams,
    setQuery
} from './router'

beforeEach(async to => {
    if (to.path === '/') {
        await push('About')
    } else if (to.name === 'About') {
        // await replace('/blog', { params: { id: '1', name: 'dan' } })
        // await replace('/blog', { params: { id: '2', name: 'dan' } })
    }
    // await push('/')
    console.log(to.query)
    if (to.query && to.query.id !== '1') setQuery({ id: '1' })
})

afterEach(async to => {
    if (to.name === 'Future' && to.params?.id !== '2') {
        await setParams({ id: '2', name: 'dan' })
            .then(t => console.log(t))
            .catch(err => console.log(err))
    }
})

setRoutes(routes)
async function t() {
    const pushResult = await push('/')

    // console.log(pushResult, route)

    const replaceResult = await replace('/about')
    await replace('/about')
    await replace('/about')
    // console.log(replaceResult, route)
}

setTimeout(() => {
    t()
})

const app = new App({ target: document.body })

export default app
