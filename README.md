# svelte-dk-router

> A lightweight router for Svelte

## Installation

```bash
npm i svelte-dk-router
```

## Usage

First set your routes:

```js
import { setRoutes } from 'svelte-dk-router';
import home from './views/home.svelte';
import about from './views/about.svelte';
import blog from './views/blog.svelte';
import fallback from './views/fallback.svelte';

const routes = [
    {
        title: 'Home',
        path: '/',
        component: home,
        meta: {
            name: 'dan',
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

setRoutes(routes);
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
        query = { id: '1', name: 'dan' };
</script>

<SLink name={'home'}>Home</SLink>
<SLink path={'/about'} {query}>Home</SLink>
<SLink path={'/blog'} {params}>Home</SLink>
```

and don't forget to set your rollup config to handle SPA's with `-s`:

```
"scripts": {
    ...
    "start": "sirv public -s",
}
```

## API

#### `setRoutes(routes: array[object(s)] [, hashMode: boolean])`

Set your routes and optionally set to `hashMode` (prepends all routes with `/#`).
If no `name` is set for a route, an all-lowercase name is generated based off the root path.

#### `<SView />`

The main view for your routes.

#### `<SLink name={string} path={string} {query} {params}>Slot</SLink>`

Link to each route. `name` _or_ `path` are required, optional `query` and `params` (if defined).

#### `route`

An object containing all information on the current route.

#### `push(identifier: string | object)`

Programmatically changes the route using `window.history.pushState()`.

#### `replace(identifier: string | object)`

Programmatically changes the route using `window.history.replaceState()`.

#### `beforeEach(async: optional (to, from) => {})`

Navigation guard to run _before_ each route. Optionally asynchronous.
`to` contains all data for the route navigating to, `from` all data of the current route.

**Note:** Duplicate route navigation **does not throw an error**, it's up to you to prevent infinite loops.

#### `afterEach(async: optional (to, from) => {})`

Navigation guard to run _after_ each route. Optionally asynchronous.
`to` contains all data for the route navigated to, `from` all data of the previous route.

**Note:** Duplicate route navigation **does not throw an error**, it's up to you to prevent infinite loops.

#### `setQuery(query: object [, update: boolean [, replace: boolean]]): current route`

Programmatically set query params. If `update` is set to `true`, replaces/adds to existing query.
Defaults to `window.history.replaceState`, if `replace` is set to false, uses `window.history.pushState` instead.

Returns the updated route data.

#### `setParams(params: object [, replace: boolean]): current route`

Programmatically update named-params. Params must be correctly defined for the current route.
Defaults to `window.history.replaceState`, if `replace` is set to false, uses `window.history.pushState` instead.

Returns the updated route data.

## TODO

-   Nested routes

Contributions welcome.
