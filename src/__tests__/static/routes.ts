// @ts-ignore
import home from '../../views/home.svelte';
// @ts-ignore
import about from '../../views/about.svelte';
// @ts-ignore
import blog from '../../views/blog.svelte';
// @ts-ignore
import future from '../../views/nested/future.svelte';
// @ts-ignore
import origins from '../../views/nested/origins.svelte';
// @ts-ignore
import more from '../../views/nested/more.svelte';
// @ts-ignore
import fallback from '../../views/fallback.svelte';

const homeRoute = {
    title: 'Home',
    path: '/',
    component: home,
    meta: {
        name: 'hello',
    },
    name: 'Home',
    trace: ['Home'],
    depth: 1,
    fullPath: '/',
    regex: /^\/?$/i,
    fullRegex: /^\/?$/i,
};

const aboutRoute = {
    title: 'About',
    path: '/about',
    component: about,
    name: 'About',
    children: [
        {
            title: 'Future | About',
            name: 'future',
            path: '/future',
            component: future,
            children: [],
            parent: {},
            rootParent: {},
            trace: ['About', 'future'],
            depth: 2,
            fullPath: '/about/future',
            rootPath: '/about',
            regex: /^\/future\/?$/i,
            fullRegex: /^\/about\/future\/?$/i,
        },
        {
            title: 'Origins | About',
            name: 'Origins',
            path: '/origins',
            component: origins,
            children: [],
            parent: {},
            rootParent: {},
            trace: ['About', 'Origins'],
            depth: 2,
            fullPath: '/about/origins',
            rootPath: '/about',
            regex: /^\/origins\/?$/i,
            fullRegex: /^\/about\/origins\/?$/i,
        },
    ],
    trace: ['About'],
    depth: 1,
    fullPath: '/about',
    rootPath: '/about',
    regex: /^\/about\/?$/i,
    fullRegex: /^\/about\/?$/i,
};

const blogDefaultChildRoute = {
    title: 'Future | Blog',
    name: 'Future',
    path: '',
    component: future,
    children: [
        {
            name: 'blog more',
            path: '/more:hey',
            component: more,
            trace: ['Blog', 'Future', 'blog more'],
            depth: 3,
            fullPath: '/blog/:id/:name/more:hey',
            rootPath: '/blog',
            regex: /^\/more:hey\/?$/i,
            fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/more:hey\/?$/i,
        },
    ],
    parent: {},
    rootParent: {},
    trace: ['Blog', 'Future'],
    depth: 2,
    fullPath: '/blog/:id/:name',
    rootPath: '/blog',
    regex: /^\/?$/i,
    fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/?$/i,
};

const routesWithMissingProperties = [
    {
        title: 'Home',
        path: '/',
        meta: {
            name: 'hello',
        },
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
                path: '/origins',
                name: 'blog origins',
                title: 'Origins | Blog',
                component: origins,
            },
        ],
    },
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
    },
];

const childrenWithMissingProperties = [
    {
        title: 'Home',
        path: '/',
        component: home,
        meta: {
            name: 'hello',
        },
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
                component: origins,
            },
        ],
    },
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
    },
];

const routesWithDuplicateProperties = [
    {
        name: 'Duplicate',
        title: 'Home',
        component: home,
        path: '/',
        meta: {
            name: 'hello',
        },
    },
    {
        name: 'Duplicate',
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
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
    },
];

const childrenWithDuplicateProperties = [
    {
        title: 'Home',
        component: home,
        path: '/',
        meta: {
            name: 'hello',
        },
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
                children: [{ name: 'blog more', path: '/duplicate', component: more }],
            },
            {
                name: 'blog origins',
                title: 'Origins | Blog',
                path: '/duplicate',
                component: origins,
            },
        ],
    },
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
    },
];

export {
    homeRoute,
    aboutRoute,
    blogDefaultChildRoute,
    routesWithMissingProperties,
    childrenWithMissingProperties,
    routesWithDuplicateProperties,
    childrenWithDuplicateProperties,
};
