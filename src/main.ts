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

beforeEach(async (to, from) => {
    // console.log('before', from, to, pathname);
    // console.log(from, ' - before from');
    // console.log(routeChart);
    // console.log(route);
    // console.log(routeChart);

    if (to.name === 'About') {
        // console.log(1);
        // console.log(2);
        // const promise = new Promise((resolve, reject) => {
        //     setTimeout(() => resolve('done!'), 1000);
        // });
        // const result = await promise;
        // push('/');
        // console.log(4);
        // console.log(5);
    }
});
afterEach(async (to, from) => {
    // console.log(hash, host, hostname, origin, pathname, href, protocol, search);
    // console.log('after', from, to, pathname);
    // if (to.path === '/about') {
    //     console.log(1);
    //     await push({ path: '/blog', params: { id: 'name', name: 'id' } });
    //     console.log(2);
    // }
    // if (to.path === '/') replace({ props: { t: '/about' } });
    // console.log(from, ' - after from');
    // console.log(route);
    // console.log(routeChart);
    console.log(routeProps);
});

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
