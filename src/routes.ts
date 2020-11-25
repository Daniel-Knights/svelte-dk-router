import home from './views/home.svelte';
import about from './views/about.svelte';
import origins from './views/nested/origins.svelte';
import future from './views/nested/future.svelte';
import more from './views/nested/more.svelte';
import blog from './views/blog.svelte';
import fallback from './views/fallback.svelte';

const routes = [
    {
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
        children: [
            {
                title: 'Future | About',
                path: '/future',
                component: future,
                children: [
                    {
                        title: 'More | About',
                        path: '/more',
                        component: more,
                        children: [
                            {
                                title: 'Even More | About',
                                path: '/even-more',
                                component: more,
                            },
                        ],
                    },
                ],
            },
            { title: 'Origins | About', path: '/origins', component: origins },
        ],
    },
    {
        title: 'Blog',
        path: '/blog/:id/:name',
        component: blog,
        children: [
            {
                name: 'blog future',
                title: 'Future | Blog',
                path: '/future',
                component: future,
                children: [{ name: 'blog more', path: '/more', component: more }],
            },
            { title: 'Origins | Blog', path: '/origins', component: origins },
        ],
    },
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
    },
];

export default routes;
