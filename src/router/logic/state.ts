import { writable } from 'svelte/store';
import type { Route, RouteWithRegex } from '../static';
import { error, compareRoutes } from '../static';

// Provided routes
let routes: RouteWithRegex[];
let currentRoute: RouteWithRegex;

// Reactive route data
const writableRoute = writable(null);

// Set query params to route object on page-load
const queryState = (query, route) => {
    if (!query) return;
    for (const pair of query.entries()) {
        if (!route.query) route['query'] = {};

        route.query[pair[0]] = pair[1];
    }
};

// Set named params to route object on page-load
const paramState = (path, route) => {
    route.path.split('/').forEach((param, i) => {
        if (param.includes(':')) {
            // Validate
            if (!path.split('/')[i])
                return error('Missing required param: "' + param.slice(1) + '"');

            if (!route.params) route.params = {};

            route.params[param.split(':')[1]] = path.split('/')[i];
        }
    });
};

// Determine the current route and update route data
const loadState = (): void => {
    if (!routes) return;
    else
        currentRoute =
            routes.filter(singleRoute => {
                const path = window.location.pathname;
                const query = new URLSearchParams(window.location.search);

                // Compare route path against URL path
                if (path && path.match(singleRoute.regex)) {
                    queryState(query, singleRoute);
                    paramState(path, singleRoute);

                    return singleRoute;
                }
            })[0] || routes[0];

    writableRoute.set(currentRoute);

    // Update title
    if (currentRoute && currentRoute.title) {
        document.getElementsByTagName('title')[0].innerHTML = currentRoute.title;
    }
};

// Set provided routes
const setRoutes = (userRoutes: Route[]): void => {
    // Validate
    userRoutes.forEach((userRoute, i) => {
        if (!userRoute.name || !userRoute.path || !userRoute.component) {
            return console.error(
                'Svelte-Router [Error]: "name", "path" and "component" are required properties'
            );
        }

        compareRoutes(userRoutes, userRoute, i);

        // Generate dynamic regex for each route
        const routeRegex = userRoute.path
            .split('/')
            .map((section, i, arr) => {
                if (section.includes(':')) {
                    if (!arr[i - 1].includes(':')) return '.*';
                } else if (i !== 0) return '/' + section;
            })
            .join('')
            .slice(1);

        userRoute['regex'] = new RegExp('\\/' + routeRegex + '$');
    });

    routes = userRoutes as RouteWithRegex[];
    loadState();
};

window.addEventListener('popstate', loadState);

export { routes, writableRoute, loadState, setRoutes };
