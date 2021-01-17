import App from './App.svelte'
import routes from './routes'
import {
    setRoutes,
    beforeEach,
    afterEach,
    route,
    routeProps,
    push,
    replace
} from './router'

beforeEach(async (to, from) => {
    if (to.name !== 'About' && to.query?.id !== '34tg34') {
        await replace('About')
            .then(route => console.log(route, 'about'))
            .catch(err => {
                console.log(err)
            })
    } else if (to.name !== 'Future') {
        console.log('object')
        await push('/blog', {
            params: { id: '1', name: 'dan' },
            props: 'redirect test',
            query: { id: '34tg34' }
        }).then(route => console.log(route, 'blog'))
    }
    if (to.name === 'About') return false
})

// beforeEach(async (to, from) => {
//     console.log(to.name, 'kjnkjn')
//     switch (to.query?.id) {
//         case '6y5gt3':
//             await push('/', { query: { id: '34tg34' } })
//             break
//     }
// })

setRoutes(routes)

// setTimeout(() => {
//     push('/', {
//         query: { id: '34tg34' }
//     }).then(route => console.log(route))
// }, 1000)

const app = new App({ target: document.body })

export default app
