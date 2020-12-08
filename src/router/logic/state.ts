import { writable } from 'svelte/store';
import type { Route, FormattedRoute } from '../static';
import {
    error,
    currentPath,
    queryState,
    paramState,
    formatPaths,
    formatRegex,
    validateRoutes,
    stripInvalidProperties,
} from '../static';
import { afterCallback, beforeCallback } from './guard';
import { chartState } from './nested';

// Reactive route data
const writableRoute = writable(null);

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
                userRoute['trace'] = [userRoute.name];
            } else {
                userRoute['trace'] = [...userRoute.parent.trace, userRoute.name];
            }

            // Set depth of route/nested-route
            if (userRoute.parent) {
                userRoute['depth'] = userRoute.parent.depth + 1;
            } else {
                userRoute['depth'] = depth;
            }

            // Set path properties
            formatPaths(userRoute, path, hashMode);

            // Generate dynamic regex for each route
            formatRegex(userRoute);

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
const loadState = async (): Promise<void> => {
    const path = currentPath(hashHistory);
    const query = new URLSearchParams(
        window.location.search || window.location.hash.split('?')[1]
    );

    let currentRoute: FormattedRoute;

    if (!routes) return;
    else {
        const filterRoutes = passedRoutes => {
            passedRoutes.forEach(singleRoute => {
                if (currentRoute) return;

                const { fullRegex, children } = singleRoute;

                // Compare route path against URL path
                if (path && path.match(fullRegex)) {
                    queryState(query, singleRoute);
                    paramState(path, singleRoute);

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
            if (child.path === '' || child.path === '/#') {
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

    if (beforeCallback) await beforeCallback(currentRoute, null);
    await writableRoute.set(currentRoute);
    await chartState(currentRoute);
    if (afterCallback) await afterCallback(currentRoute, null);

    // Update title
    const title = document.getElementsByTagName('title')[0];

    if (currentRoute && currentRoute.title && title) {
        title.innerHTML = currentRoute.title;
    }
};

window.addEventListener('popstate', loadState);

export { routes, writableRoute, hashHistory, setRoutes };
