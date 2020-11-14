import App from './App.svelte';
import routes from './routes';
import { setRoutes, beforeEach, afterEach, replace, push } from './router';

beforeEach((to, from) => {
    console.log(to, ' - before to');
    console.log(from, ' - before from');
});
afterEach((to, from) => {
    console.log(to, ' - after to');
    console.log(from, ' - after from');
});

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
