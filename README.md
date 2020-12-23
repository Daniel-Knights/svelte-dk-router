# svelte-dk-router

[![npm](https://img.shields.io/npm/v/svelte-dk-router.svg)](https://www.npmjs.com/package/svelte-dk-router)
[![svelte](https://img.shields.io/badge/svelte-3.x-red)](https://svelte.dev/)

> An efficient, easy-to-use router for Svelte

-   [Installation](#installation)
-   [Quick Start](#quick-start)
-   [API](#api)
    -   [setRoutes](#setroutes)
    -   [SView](#sview)
    -   [SLink](#slink)
    -   [route](#route)
    -   [routeStore](#routestore)
    -   [routeChart](#routechart)
    -   [routeChartStore](#routechartstore)
    -   [routeProps](#routeprops)
    -   [push](#push)
    -   [replace](#replace)
    -   [beforeEach](#beforeeach)
    -   [afterEach](#aftereach)
    -   [setQuery](#setquery)
    -   [setParams](#setparams)
    -   [location properties](#location-properties)
    -   [router-active](#router-active)

## Installation

```bash
npm i svelte-dk-router
```

## Quick Start

First set your routes:

```js
import { setRoutes } from 'svelte-dk-router';
import home from './views/home.svelte';
import about from './views/about.svelte';
import origins from './views/nested/origins.svelte';
import future from './views/nested/future.svelte';
import more from './views/nested/more.svelte';
import blog from './views/blog.svelte';
import fallback from './views/fallback.svelte';

const routes = [
    {
        name: 'Home',
        // Update page title
        title: 'Home',
        path: '/',
        component: home,
        meta: {
            name: 'dan',
        },
    },
    {
        // If no name passed,
        // defaults to components' name
        title: 'About',
        path: '/about',
        component: about,
        children: [
            {
                name: 'Default About',
                // Pass an empty path to display a default child
                path: '',
                component: future,
                children: [
                    {
                        title: 'More | About',
                        // Full-path: /about/more
                        path: '/more',
                        component: more,
                    },
                ],
            },
            {
                title: 'Origins | About',
                path: '/origins',
                component: origins,
                children: [
                    {
                        name: 'More About',
                        title: 'More | About',
                        // Full-path: /about/origins/more
                        path: '/more',
                        component: more,
                    },
                ],
            },
        ],
    },
    {
        title: 'Blog',
        // Named-params are specified with a colon
        path: '/blog/:id/:name',
        component: blog,
    },
    // Define your fallback last
    // Must have a path of '(*)'
    {
        name: 'Fallback',
        title: '404',
        path: '(*)',
        component: fallback,
    },
];

setRoutes(routes);
// Or, for hash-based routing:
setRoutes(routes, true);
```

Then, use the view component:

```js
<script>
    import { SView } from 'svelte-dk-router';
</script>

<SView />
```

Links to navigate:

```js
<script>
    import { SLink } from 'svelte-dk-router';

    let params = { id: '1', name: 'dan' },
        query = { id: '1', name: 'dan' },
        props = { some: 'extra information' };
</script>

<SLink name={'Home'}>Home</SLink>
// Using props allows you to pass any data to the next page
<SLink path={'/about'} {query} {props}>About</SLink>
<SLink path={'/blog'} {params} replace={true}>Blog</SLink>
// Navigate to a nested route
<SLink name={'More About'}>More Info</SLink>
// Full paths are also supported
<SLink path={'/about/origins/more'}>More Info</SLink>
```

Lastly, don't forget to set your Rollup config to handle SPA's with `-s`:

```json
"scripts": {
    ...
    "start": "sirv public -s",
}
```

## API

**NOTE:** All navigations are asynchronous.

#### <a id="setroutes"></a>`setRoutes(routes: array[object], hashMode?: boolean)`

Set your routes and optionally set to `hashMode` (prepends all routes with `/#`).

If no `name` is set for a route, the components' name is used instead.

#### <a id="sview"></a>`<SView />`

The main view for your routes.

You can nest any number of views within your set components.

#### <a id="slink"></a>`<SLink />`

Link to each route. `name` _or_ `path` are required, optional `query`, `params` (if defined), `props` and `replace`.

Dispatches a `navigation` event which returns the route being navigated to.

`replace` defaults to `false`, meaning `pushState` is used instead of `replaceState`.

**Example:**

```js
<SLink
    name={string}
    path={string}
    query={object}
    params={object}
    props={object}
    replace={boolean}
    on:navigation={newRoute => /* ... */}
>
    Slot for any link content
</SLink>
```

#### `route`

An object containing all information on the current route.

**Example:**

```js
{
    component: class Home,
    // An array of route-names matching the current path
    crumbs: ["Home"],
    // Current route-depth
    depth: 1,
    fullPath: "/",
    fullRegex: /^\/?$/i,
    meta: { name: "dan" },
    name: "Home",
    path: "/",
    query: { id: "1" },
    regex: /^\/?$/i,
    rootPath: "/",
    title: "Home"
}
```

#### `routeStore`

A readable Svelte store which, through the `.subscribe` method, returns the current route whenever it's updated.

#### `routeChart`

An object containing a chart of all routes from the parent-route, down to the current route.

**Example:**

```bash
// Navigating to '/about' displays the default child route
1: {title: "About", path: "/about", children: Array(2), name: "About", component: ƒ, …}
2: {name: "Default About", path: "", children: Array(1), parent: {…}, component: ƒ, …}
```

#### `routeChartStore`

A readable Svelte store which, through the `.subscribe` method, returns the current route-chart whenever it's updated.

#### `routeProps`

A variable containing any data passed as props through `<SLink />`, `push()` or `replace()`.

Resets to `null` on route change.

#### <a id="push"></a>`push(identifier: string, routeData?: object): current route`

Programmatically changes the route using `window.history.pushState()`.

`identifier` has to be the name _or_ path of a route.

Returns a promise which can be chained:

```js
await push('/')
    .then(newRoute =>  /* Resolved */)
    .catch(err =>  /* Rejected */);
```

Available properties you can pass:

```js
await push('Blog', {
    params: { id: '1', name: 'dan' },
    query: { postTitle: 'how-to-use-svelte-dk-router' },
    props: { post: blogPost },
});
```

#### <a id="replace"></a>`replace(identifier: string, routeData?: object): current route`

The same as `push()`, except, uses `window.history.replaceState()` instead.

#### <a id="beforeeach"></a>`beforeEach((to, from) => {})`

Navigation guard to run _before_ each route.

`to` contains all data for the route navigating to, `from` all data of the current route.

**Note:** Duplicate route navigation **does not throw an error**, it's up to you to prevent infinite loops.

**Note:** Set your navigation-guards _before_ you call `setRoutes`, else, they won't run on page-load.

#### <a id="aftereach"></a>`afterEach((to, from) => {})`

Navigation guard to run _after_ each route.

`to` contains all data for the route navigated to, `from` all data of the previous route.

**Note:** Duplicate route navigation **does not throw an error**, it's up to you to prevent infinite loops.

**Note:** Set your navigation-guards _before_ you call `setRoutes`, else, they won't run on page-load.

#### <a id="setquery"></a>`setQuery(query: object, update?: boolean, replace?: boolean): current route`

Programmatically set query params. If `update` is set to `true`, replaces/adds to existing query.

Defaults to `window.history.replaceState`, if `replace` is set to false, uses `window.history.pushState` instead.

Returns a promise which resolves with the updated route data.

**Example:**

```js
await setQuery({ new: 'query' })
    .then(updatedRoute => /* Resolved */)
    .catch(err => /* Rejected */);
```

#### <a id="setparams"></a>`setParams(params: object, replace?: boolean): current route`

Programmatically update named-params. Params must be correctly defined for the current route.

Defaults to `window.history.replaceState`, if `replace` is set to false, uses `window.history.pushState` instead.

Returns a promise which resolves with the updated route data.

**Example:**

```js
await setParams({ id: '2' })
    .then(updatedRoute => /* Resolved */)
    .catch(err => /* Rejected */);
```

#### `location` properties

You can also import variables for each property of `window.location`:

```js
import {
    hash,
    host,
    hostname,
    origin,
    pathname,
    href,
    protocol,
    search,
} from 'svelte-dk-router';
```

These variables update on each route change, ensuring simplicity and parity throughout your application.

#### `.router-active`

Any `<SLink />` which matches the current-route/exists in the current-route heirarchy, has the class `router-active` applied.

In the spirit of a11y, the attribute `aria-current="page"` is also set using this method.

---

Contributions welcome.
