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

// beforeEach(async (to, from) => {
// });
// afterEach(async (to, from) => {
// });

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
