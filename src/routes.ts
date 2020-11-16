import home from './views/home.svelte';
import about from './views/about.svelte';
import blog from './views/blog.svelte';
import fallback from './views/fallback.svelte';

const routes = [
    {
        name: 'Home',
        title: 'Home',
        path: '/',
        component: home,
        meta: {
            name: 'hello',
        },
    },
    {
        title: 'About',
        path: '/about',
        component: about,
    },
    {
        title: 'Blog',
        path: '/blog/:id/:name',
        component: blog,
    },
    {
        name: 'Fallback',
        title: '404',
        path: '*',
        component: fallback,
    },
];

export default routes;
