import App from './App.svelte';
import routes from './routes';
import { setRoutes, beforeEach, afterEach, replace, push } from './router';
import { hash, host, hostname, origin, pathname, href, protocol, search } from './router';

const userAuthenticated = false;

beforeEach(async (to, from) => {
    // console.log('before', from, to, pathname);
    // console.log(to, ' - before to');
    // console.log(from, ' - before from');
});
afterEach(async (to, from) => {
    // console.log(hash, host, hostname, origin, pathname, href, protocol, search);
    // console.log('after', from, to, pathname);
    // console.log(to, ' - after to');
    // if (to.path === '/about') {
    //     console.log(1);
    //     await push({ path: '/blog', params: { id: 'name', name: 'id' } });
    //     console.log(2);
    // }
    // if (to.path === '/') replace('/about');
    // console.log(from, ' - after from');
});

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
