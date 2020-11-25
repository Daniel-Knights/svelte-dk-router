import { writable } from 'svelte/store';
import type { Route, FormattedRoute } from '../static';
import { error, currentPath, compareRoutes } from '../static';
import { afterCallback, beforeCallback } from './guard';
import { chartState } from './nested';

// Reactive route data
const writableRoute = writable(null);

// Provided routes
let routes: FormattedRoute[];
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
    route.fullPath.split('/').forEach((param, i) => {
        if (param.split('')[0] === ':') {
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

    let currentRoute: FormattedRoute;

    if (!routes) return;
    else {
        const filterRoutes = (passedRoutes, rootParent?) => {
            passedRoutes.forEach(singleRoute => {
                if (currentRoute) return;

                const { regex, fullRegex, children, rootParent: ancestor } = singleRoute;

                // Compare route path against URL path
                if (path && (path.match(fullRegex) || path.match(regex))) {
                    queryState(query, singleRoute);

                    if (!rootParent) {
                        paramState(path, singleRoute);
                    } else {
                        paramState(path, rootParent);
                    }

                    currentRoute = singleRoute;
                } else if (children) {
                    // Recursively filter through child routes
                    filterRoutes(children, ancestor);
                }
            });
        };

        filterRoutes(routes);
    }

    if (beforeCallback) await beforeCallback(currentRoute, null);
    await writableRoute.set(currentRoute);
    await chartState(currentRoute);
    if (afterCallback) await afterCallback(currentRoute, null);

    // Update title
    if (currentRoute && currentRoute.title) {
        document.getElementsByTagName('title')[0].innerHTML = currentRoute.title;
    }
};

// Set provided routes
const setRoutes = (userRoutes: Route[], hashMode = false): void => {
    const depth = 1;

    if (hashMode) hashHistory = true;

    // Validate and format
    const formatRoutes = (passedRoutes, parent?: FormattedRoute) => {
        passedRoutes.forEach((userRoute, i) => {
            const { name, path, component } = userRoute;

            if (!path || !component) {
                return error('"path" and "component" are required properties');
            }

            // Set formatted path as route name if no name supplied
            if (!name) {
                userRoute['name'] = path === '/' ? 'home' : path.split('/')[1];
            }

            // Set path properties
            userRoute['fullPath'] = path;

            if (hashMode && path !== '*') {
                userRoute.path = '/#' + path;
                userRoute['fullPath'] = parent ? parent.fullPath + path : userRoute.path;
                userRoute['rootPath'] = parent
                    ? parent.rootPath
                    : '/#/' + path.split('/')[1];
            } else if (parent) {
                userRoute['fullPath'] = parent.fullPath + path;
                userRoute['rootPath'] = parent.rootPath;
            } else if (path.split('/')[1]) {
                userRoute['rootPath'] = '/' + path.split('/')[1];
            }

            // Set parent properties
            if (parent) {
                userRoute['parent'] = parent;

                if (parent.rootParent) {
                    userRoute['rootParent'] = parent.rootParent;
                } else userRoute['rootParent'] = parent;
            }

            // Array of path-sections to trace origins
            if (!userRoute.parent) {
                userRoute['trace'] = [userRoute.name];
            } else {
                userRoute['trace'] = [...userRoute.parent.trace, userRoute.name];
            }

            // Generate dynamic regex for each route
            let regex = userRoute.path
                .split('/')
                .map((section, i) => {
                    if (section.split('')[0] === ':') return '';
                    else if (i !== 0) return '\\/' + section;
                })
                .join('');

            let fullRegex = userRoute.fullPath
                .split('/')
                .map((section, i) => {
                    if (section.split('')[0] === ':') {
                        // Named-params
                        return '\\/(?:[^\\/]+?)';
                    } else if (i !== 0) return '\\/' + section;
                })
                .join('');

            // Handle base-path
            if (userRoute.path === '/') regex = '';
            else if (userRoute.path === '/#/') regex = '\\/#';

            if (userRoute.fullPath === '/') fullRegex = '';
            else if (userRoute.fullPath === '/#/') fullRegex = '\\/#';

            if (userRoute.path !== '(*)') {
                userRoute['regex'] = new RegExp('^' + regex + '\\/?$', 'i');
                userRoute['fullRegex'] = new RegExp('^' + fullRegex + '\\/?$', 'i');
            }

            // Set depth of route/nested-route
            if (userRoute.parent) {
                userRoute['depth'] = userRoute.parent.depth + 1;
            } else {
                userRoute['depth'] = depth;
            }

            compareRoutes(passedRoutes, userRoute, i);

            if (userRoute.children) {
                // Recursively format children
                formatRoutes(userRoute.children, userRoute);
            }
        });
    };

    formatRoutes(userRoutes, null);

    routes = userRoutes as FormattedRoute[];
    loadState();
};

window.addEventListener('popstate', loadState);

export { routes, writableRoute, hashHistory, loadState, setRoutes };
