import App from './App.svelte';
import routes from './routes';
import { setRoutes } from './router/router';

setRoutes(routes);

const app = new App({ target: document.body });

export default app;
