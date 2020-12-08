// @ts-ignore
import home from './views/home.svelte';
// @ts-ignore
import about from './views/about.svelte';
// @ts-ignore
import origins from './views/nested/origins.svelte';
// @ts-ignore
import future from './views/nested/future.svelte';
// @ts-ignore
import more from './views/nested/more.svelte';
// @ts-ignore
import blog from './views/blog.svelte';
// @ts-ignore
import fallback from './views/fallback.svelte';

const routes = [
    {
        title: 'Home',
        path: '/',
        component: home,
        test: 'test',
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
                name: 'future',
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
                                name: 'hello',
                                title: 'Even More | About',
                                path: '/even-more',
                                component: more,
                            },
                        ],
                    },
                ],
            },
            {
                title: 'Origins | About',
                path: '/origins',
                component: origins,
                children: [
                    {
                        name: 'Origins | More',
                        title: 'More | About',
                        path: '/more',
                        component: more,
                    },
                ],
            },
        ],
    },
    {
        title: 'Blog',
        path: '/blog/:id/:name',
        component: blog,
        children: [
            {
                title: 'Future | Blog',
                path: '',
                component: future,
                children: [{ name: 'blog more', path: '/more:hey', component: more }],
            },
            {
                name: 'blog origins',
                title: 'Origins | Blog',
                path: '/origins',
                component: origins,
            },
        ],
    },
    // {
    //     name: 'Fallback',
    //     title: '404',
    //     path: '(*)',
    //     component: fallback,
    // },
];

export default routes;
