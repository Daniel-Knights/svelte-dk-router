import App from './App.svelte';
import routes from './routes';
import { setRoutes, beforeEach, afterEach } from './router';

beforeEach((to, from) => {
    console.log('before to: ', to);
    console.log('before from: ', from);
});
afterEach((to, from) => {
    console.log('after to: ', to);
    console.log('after from: ', from);
});

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
