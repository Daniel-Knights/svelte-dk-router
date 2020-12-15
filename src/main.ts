import App from './App.svelte';
import routes from './routes';
import { setRoutes, beforeEach, afterEach, replace, push } from './router';
import { hash, host, hostname, origin, pathname, href, protocol, search } from './router';
import {
    routeStore,
    routeChartStore,
    routeChart,
    route,
    routeProps,
} from './router/logic';

const userAuthenticated = false;

// afterEach(async (to, from) => {
//     console.log(routeProps);
// });
// afterEach(async (to, from) => {
//     console.log(routeChart);

//     if (to) console.log('to after - ', to.name);
//     if (from) console.log('from after - ', from.name);

//     if (to.name === 'Future') {
//         await push('/').then(
//             async () =>
//                 await push('/about').then(
//                     async () => await replace('/about').then(async () => replace('/'))
//                 )
//         );
//     }
// });

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
