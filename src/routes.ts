import home from './views/home.svelte';
import about from './views/about.svelte';
import blog from './views/blog.svelte';

const routes = [
    {
        name: 'Home',
        title: 'Home',
        path: '/home',
        component: home,
    },
    {
        name: 'About',
        title: 'About',
        path: '/about',
        component: about,
    },
    {
        name: 'Blog',
        title: 'Blog',
        path: '/blog',
        component: blog,
    },
];

export default routes;
