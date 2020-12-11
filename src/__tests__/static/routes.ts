// @ts-ignore
import home from '../../views/home.svelte';
// @ts-ignore
import about from '../../views/about.svelte';
// @ts-ignore
import future from '../../views/nested/future.svelte';
// @ts-ignore
import origins from '../../views/nested/origins.svelte';
// @ts-ignore
import more from '../../views/nested/more.svelte';

const homeRoute = {
    title: 'Home',
    path: '/',
    component: home,
    meta: {
        name: 'hello',
    },
    name: 'Home',
    crumbs: ['Home'],
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
            crumbs: ['About', 'future'],
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
            crumbs: ['About', 'Origins'],
            depth: 2,
            fullPath: '/about/origins',
            rootPath: '/about',
            regex: /^\/origins\/?$/i,
            fullRegex: /^\/about\/origins\/?$/i,
        },
    ],
    crumbs: ['About'],
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
            crumbs: ['Blog', 'Future', 'blog more'],
            depth: 3,
            fullPath: '/blog/:id/:name/more:hey',
            rootPath: '/blog',
            regex: /^\/more:hey\/?$/i,
            fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/more:hey\/?$/i,
        },
    ],
    parent: {},
    rootParent: {},
    crumbs: ['Blog', 'Future'],
    depth: 2,
    fullPath: '/blog/:id/:name',
    rootPath: '/blog',
    regex: /^\/?$/i,
    fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/?$/i,
};

export { homeRoute, aboutRoute, blogDefaultChildRoute };
