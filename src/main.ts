import App from './App.svelte'
import routes from './routes'
import { setRoutes, beforeEach, afterEach, route, routeProps } from './router'

beforeEach((to, from, { setProps, redirect }) => {
    console.log(to.name, 'kjdnkwjdnkwdn')
    // if (to.name === 'Home') {
    //     redirect('/about', { query: { i: 'jnkjnkjn' } })
    //     setProps('wdwd')
    // } else if (to.name === 'About') {
    //     redirect('/')
    setProps('Hello')
    // }
    console.log(routeProps, 'b4')
    // console.log(route, 'b4')
})
afterEach((to, from, { props, redirect }) => {
    if (to.name === 'Home') redirect('Future', { params: { name: 'dan', id: '1' } })
    console.log(route, 'after')
    console.log(props, 'after')
})

setRoutes(routes, true)

const app = new App({ target: document.body })

export default app
