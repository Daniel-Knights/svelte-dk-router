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

// beforeEach(async to => {})
// afterEach(async to => {})

setRoutes(routes)

const app = new App({ target: document.body })

export default app
