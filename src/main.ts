import App from './App.svelte'
import routes from './routes'
import { setRoutes, beforeEach, afterEach, push } from './router'

beforeEach(async (to, from, setProps) => {
    console.log('before', to, from)
    if (to.name === 'About') {
        push('/about/origins/more')
        return false
    }
})
afterEach(async (to, from, props) => {
    console.log('after', to, from)
    // console.log(routeChart)
    // if (to.name === 'About') {
    //     replace('/')
    //     return false
    // }
})

setRoutes(routes)

const app = new App({ target: document.body })

export default app
