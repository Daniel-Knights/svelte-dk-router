import { writable } from 'svelte/store';
import type { Route, RouteWithRegex } from '../static';
import { error, currentPath, compareRoutes } from '../static';
import { afterCallback, beforeCallback } from './guard';

// Reactive route data
const writableRoute = writable(null);

// Provided routes
let routes: RouteWithRegex[];
let hashHistory;

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
const loadState = async (): Promise<void> => {
    const path = currentPath(hashHistory);
    const query = new URLSearchParams(window.location.search);

    let currentRoute: RouteWithRegex;

    if (!routes) return;
    else {
        currentRoute = routes.filter(singleRoute => {
            // Compare route path against URL path
            if (path && path.match(singleRoute.regex)) {
                queryState(query, singleRoute);
                paramState(path, singleRoute);

                return singleRoute;
            }
        })[0];
    }

    if (beforeCallback) await beforeCallback(currentRoute, null);
    await writableRoute.set(currentRoute);
    if (afterCallback) await afterCallback(currentRoute, null);

    // Update title
    if (currentRoute && currentRoute.title) {
        document.getElementsByTagName('title')[0].innerHTML = currentRoute.title;
    }
};

// Set provided routes
const setRoutes = (userRoutes: Route[], hashMode = false): void => {
    if (hashMode) hashHistory = true;

    // Validate and format
    userRoutes.forEach((userRoute, i) => {
        const { name, path, component } = userRoute;

        if (!path || !component) {
            return error('"path" and "component" are required properties');
        }

        // Set formatted path as route name if no name supplied
        if (!name) {
            userRoute['name'] = path === '/' ? 'home' : path.split('/')[1];
        }

        // Generate dynamic regex for each route
        let routeRegex = path
            .split('/')
            .map((section, i) => {
                if (section === '*') return '.*'; // Fallback
                if (section.includes(':')) {
                    // Named-params
                    return '\\/(?:[^\\/]+?)';
                } else if (i !== 0) return '\\/' + section;
            })
            .join('');

        if (hashHistory) {
            routeRegex = '\\/#' + routeRegex;
            userRoute.path = '/#' + path;
        }

        userRoute['regex'] = new RegExp('^' + routeRegex + '\\/?$', 'i');
        userRoute['rootPath'] = hashHistory ? '/#/' + path.split('/')[1] : '/' + path.split('/')[1];

        compareRoutes(userRoutes, userRoute, i);
    });

    routes = userRoutes as RouteWithRegex[];
    loadState();
};

window.addEventListener('popstate', loadState);

export { routes, writableRoute, hashHistory, loadState, setRoutes };
