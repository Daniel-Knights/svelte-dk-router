// @ts-ignore
import home from '../../views/home.svelte'
// @ts-ignore
import about from '../../views/about.svelte'
// @ts-ignore
import blog from '../../views/blog.svelte'
// @ts-ignore
import future from '../../views/nested/future.svelte'
// @ts-ignore
import origins from '../../views/nested/origins.svelte'
// @ts-ignore
import more from '../../views/nested/more.svelte'
// @ts-ignore
import fallback from '../../views/fallback.svelte'

const testRoutes = [
    {
        title: 'Home',
        path: '/',
        component: home,
        meta: {
            name: 'hello'
        },
        name: 'Home',
        crumbs: ['Home'],
        depth: 1,
        fullPath: '/',
        regex: /^\/?$/i,
        fullRegex: /^\/?$/i
    },
    {
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
                                crumbs: ['About', 'future', 'More', 'hello'],
                                depth: 4,
                                fullPath: '/about/future/more/even-more',
                                rootPath: '/about',
                                regex: /^\/even-more\/?$/i,
                                fullRegex: /^\/about\/future\/more\/even-more\/?$/i
                            }
                        ],
                        parent: {},
                        rootParent: {},
                        crumbs: ['About', 'future', 'More'],
                        depth: 3,
                        fullPath: '/about/future/more',
                        rootPath: '/about',
                        regex: /^\/more\/?$/i,
                        fullRegex: /^\/about\/future\/more\/?$/i
                    }
                ],
                parent: {},
                rootParent: {},
                crumbs: ['About', 'future'],
                depth: 2,
                fullPath: '/about/future',
                rootPath: '/about',
                regex: /^\/future\/?$/i,
                fullRegex: /^\/about\/future\/?$/i
            },
            {
                title: 'Origins | About',
                name: 'Origins',
                path: '/origins',
                component: origins,
                children: [
                    {
                        name: 'Origins | More',
                        title: 'More | About',
                        path: '/more',
                        component: more,
                        parent: {},
                        rootParent: {},
                        crumbs: ['About', 'Origins', 'Origins | More'],
                        depth: 3,
                        fullPath: '/about/origins/more',
                        rootPath: '/about',
                        regex: /^\/more\/?$/i,
                        fullRegex: /^\/about\/origins\/more\/?$/i
                    }
                ],
                parent: {},
                rootParent: {},
                crumbs: ['About', 'Origins'],
                depth: 2,
                fullPath: '/about/origins',
                rootPath: '/about',
                regex: /^\/origins\/?$/i,
                fullRegex: /^\/about\/origins\/?$/i
            }
        ],
        crumbs: ['About'],
        depth: 1,
        fullPath: '/about',
        rootPath: '/about',
        regex: /^\/about\/?$/i,
        fullRegex: /^\/about\/?$/i
    },
    {
        title: 'Blog',
        path: '/blog',
        component: blog,
        name: 'Blog',
        children: [
            {
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
                        fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/more:hey\/?$/i
                    }
                ],
                parent: {},
                rootParent: {},
                crumbs: ['Blog', 'Future'],
                depth: 2,
                fullPath: '/blog/:id/:name',
                rootPath: '/blog',
                regex: /^\/?$/i,
                fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/?$/i
            }
        ],
        crumbs: ['Blog'],
        depth: 1,
        fullPath: '/blog',
        rootPath: '/blog',
        regex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/?$/i,
        fullRegex: /^\/blog\/(?:[^/]+?)\/(?:[^/]+?)\/?$/i
    },
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
        crumbs: ['Fallback'],
        depth: 1,
        fullPath: '(*)',
        rootPath: '/'
    }
]

export { testRoutes }
