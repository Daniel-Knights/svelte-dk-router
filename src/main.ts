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

// beforeEach(async to => {
//     if (to.name !== 'Future') {
//         await replace('Blog', { params: { id: '1', name: 'dan' } })
//             .then(r => console.log(r, 'sdgasd'))
//             .catch(err => {
//                 console.log(err)
//             })
//     }
// })

// afterEach(async to => {
//     if (to.params?.id !== '1') {
//         await setParams({ id: '1' })
//             .then(r => console.log(r, 'jjjdddd'))
//             .catch(err => console.log(err))
//     }
// })

setRoutes(routes)

const app = new App({ target: document.body })

export default app
