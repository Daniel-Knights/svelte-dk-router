import App from './App.svelte'
import routes from './routes'
import { setRoutes, beforeEach, afterEach, push, replace } from './router'

beforeEach(async (to, from, setProps) => {
    // console.log('before', to, from)
    // if (to.path !== '/') {
    // }
    // push('/')
    // push('/about')
})
afterEach(async (to, from, props) => {
    // return false
    // console.log('after', to, from)
    // console.log(routeChart)
    // if (to.name === 'About') {
    // push('/about')
    // push('/')
    // }
})

setRoutes(routes)

const app = new App({ target: document.body })

export default app
