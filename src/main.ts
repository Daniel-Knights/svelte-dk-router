import App from './App.svelte'
import routes from './routes'
import { setRoutes, beforeEach, afterEach } from './router'

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
