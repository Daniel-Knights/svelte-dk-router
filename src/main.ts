import App from './App.svelte';
import routes from './routes';
import { setRoutes, beforeEach, afterEach, replace, push } from './router';

beforeEach((to, from) => {
    console.log(to, ' - before to');
    console.log(from, ' - before from');

    // if (to.path === '/about') {
    //     if (from.name !== 'Blog') {
    //         push({
    //             path: '/blog',
    //             params: { id: 'name', name: 'id' },
    //         });
    //     }

    //     return false;
    // }
});
afterEach((to, from) => {
    console.log(to, ' - after to');
    console.log(from, ' - after from');

    // if (to.path === '/about') push({ path: '/blog', params: { id: 'name', name: 'id' } });
    // if (to.path === '/') replace('/about');
});

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
