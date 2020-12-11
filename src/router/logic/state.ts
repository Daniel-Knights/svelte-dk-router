import { writable, readable } from 'svelte/store';
import type { Route, FormattedRoute } from '../static';
import {
    error,
    currentPath,
    formatRouteQueryFromString,
    formatParamsFromPath,
    formatPathProperties,
    formatRouteRegex,
    validateRoutes,
    stripInvalidProperties,
} from '../static';
import { afterCallback, beforeCallback } from './guard';
import { chartState } from './nested';

// Reactive route data
const writableRoute = writable(null);

// Readable route-store
const routeStore = readable({}, set => {
    writableRoute.subscribe(routeValue => {
        set(routeValue);
    });
});

// Provided routes
let routes: FormattedRoute[];
let hashHistory;

// Set provided routes
const setRoutes = (userRoutes: Route[], hashMode = false): void => {
    const depth = 1;

    if (hashMode) hashHistory = true;

    // Validate and format
    const formatRoutes = (passedRoutes, parent?: FormattedRoute) => {
        passedRoutes.forEach(userRoute => {
            const { name, path, component } = userRoute;

            if (path === undefined || !component) {
                return error('"path" and "component" are required properties');
            }

            // Set component name as route name if none supplied
            if (!name) {
                userRoute['name'] = component.name;
            }

            // Set parent properties
            if (parent) {
                userRoute['parent'] = parent;

                if (parent.rootParent) {
                    userRoute['rootParent'] = parent.rootParent;
                } else userRoute['rootParent'] = parent;
            }

            // Array of route names to trace origins
            if (!userRoute.parent) {
                userRoute['crumbs'] = [userRoute.name];
            } else {
                userRoute['crumbs'] = [...userRoute.parent.crumbs, userRoute.name];
            }

            // Set depth of route/nested-route
            if (userRoute.parent) {
                userRoute['depth'] = userRoute.parent.depth + 1;
            } else {
                userRoute['depth'] = depth;
            }

            // Set path properties
            formatPathProperties(userRoute, path);

            // Generate dynamic regex for each route
            formatRouteRegex(userRoute);

            if (userRoute.children) {
                // Recursively format children
                formatRoutes(userRoute.children, userRoute);
            }
        });
    };

    formatRoutes(userRoutes, null);
    stripInvalidProperties(userRoutes);
    validateRoutes(userRoutes);

    routes = userRoutes as FormattedRoute[];

    loadState();
};

// Determine the current route and update route data on page-load
const loadState = async (): Promise<void | FormattedRoute> => {
    const query = window.location.search || window.location.hash.split('?')[1];
    let path = currentPath(hashHistory);
    let currentRoute: FormattedRoute;

    if (path[1] === '#') path = path.slice(2);

    if (!routes) return;
    else {
        const filterRoutes = passedRoutes => {
            passedRoutes.forEach(singleRoute => {
                if (currentRoute) return;

                const { fullRegex, children } = singleRoute;

                // Compare route path against URL path
                if (path && path.match(fullRegex)) {
                    formatRouteQueryFromString(query, singleRoute);
                    formatParamsFromPath(path, singleRoute);

                    currentRoute = singleRoute;
                } else if (children) {
                    // Recursively filter through child routes
                    filterRoutes(children);
                }
            });
        };

        filterRoutes(routes);
    }

    // Determine if route has nested base-path
    if (currentRoute && currentRoute.children) {
        currentRoute.children.forEach(child => {
            if (child.path === '') {
                if (currentRoute.params) {
                    child['params'] = currentRoute.params;
                }

                if (currentRoute.query) {
                    child['query'] = currentRoute.query;
                }

                currentRoute = child;
            }
        });
    }

    if (!currentRoute) return error('Unknown route');

    if (beforeCallback) {
        const beforeResult = await beforeCallback(currentRoute, null);

        if (beforeResult === false) return;
    }

    writableRoute.set(currentRoute);
    chartState(currentRoute);

    // Update title
    const title = document.getElementsByTagName('title')[0];

    if (currentRoute && currentRoute.title && title) {
        title.innerHTML = currentRoute.title;
    }

    if (afterCallback) {
        await afterCallback(currentRoute, null);
    }

    return currentRoute;
};

window.addEventListener('popstate', loadState);

export { routes, writableRoute, routeStore, hashHistory, setRoutes };
