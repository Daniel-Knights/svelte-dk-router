import App from './App.svelte';
import routes from './routes';
import { setRoutes, beforeEach, afterEach, replace, push } from './router';
import { hash, host, hostname, origin, pathname, href, protocol, search } from './router';

const userAuthenticated = false;

beforeEach(async (to, from) => {
    console.log('before', from, to, pathname);
    // console.log(to, ' - before to');
    // console.log(from, ' - before from');
    if (!userAuthenticated && to.path === '/#/about') await replace('/');
});
afterEach(async (to, from) => {
    console.log('after', from, to, pathname);
    // console.log(to, ' - after to');
    // if (to.path === '/about') push({ path: '/blog', params: { id: 'name', name: 'id' } });
    // if (to.path === '/') await replace('/about');
    // console.log(from, ' - after from');
});

setRoutes(routes, true);

const app = new App({ target: document.body });

export default app;
