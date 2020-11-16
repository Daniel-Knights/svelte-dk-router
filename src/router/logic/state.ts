import { writable } from 'svelte/store';
import type { Route, RouteWithRegex } from '../static';
import { error } from '../static';

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

// Route validation
const validateDuplicateRoutes = (routes, route, routeIndex) => {
    routes.forEach((compare, compareIndex) => {
        if (routeIndex === compareIndex) return;

        if (route.name === compare.name) {
            error('The "name" property must be unique, duplicates detected: "' + route.name + '"');
        }

        if (route.path === compare.path) {
            error('The "path" property must be unique, duplicates detected: "' + route.path + '"');
        }
    });
};

// Determine the current route and update route data
const loadState = (): void => {
    if (!routes) return;
    else
        currentRoute =
            routes.filter(singleRoute => {
                const state = window.history.state;
                const path = window.location.pathname;
                const query = new URLSearchParams(window.location.search);

                // Compare route name against state name
                if (state && singleRoute.name === state.name) {
                    queryState(query, singleRoute);
                    paramState(path, singleRoute);
                    return singleRoute;
                }

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
        document.title = currentRoute.title;
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

        validateDuplicateRoutes(userRoutes, userRoute, i);

        // Generate dynamic regex for each route
        const routeRegex = userRoute.path
            .split('/')
            .map((section, i, arr) => {
                if (section.includes(':')) {
                    if (!arr[i - 1].includes(':')) return '.*';
                    else return '';
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
