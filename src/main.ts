import App from './App.svelte'
import routes from './routes'
import { setRoutes, beforeEach, afterEach, replace, push } from './router'
import { hash, host, hostname, origin, pathname, href, protocol, search } from './router'
import {
    routeStore,
    routeChartStore,
    routeChart,
    route,
    routeProps
} from './router/logic'

beforeEach(async (to, from, setProps) => {
    if (to.name === 'About') setProps('hello')
})
afterEach(async (to, from, props) => {
    if (props) {
        console.log('after - ', props)
    }
})

setRoutes(routes)

const app = new App({ target: document.body })

export default app
