import type { Route, PassedRoute, RouteWithRegex } from '../static';
import { error, setUrl, formatQuery, validatePassedParams, formatPathFromParams } from '../static';
import { routes, writableRoute } from './state';
import { beforeCallback, afterCallback } from './guard';

// Current route data
let route: RouteWithRegex = null;
// Previous route data
let fromRoute: Route = null;
// New route data
let newPath: string, newTitle: string, newRoute: RouteWithRegex;

// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => (route = { ...newRoute }));

const changeRoute = async (passedRoute: PassedRoute, replace?: boolean): Promise<void> => {
    const { name, path, query, params, meta } = passedRoute;

    if (!name && !path) {
        return error('name or path required');
    }

    let routeExists = false;

    const setNewRouteData = routeData => {
        if (routeData.title) newTitle = routeData.title;

        // Cleanup
        if (routeData.query) delete routeData.query;
        if (routeData.params) delete routeData.params;

        routeExists = true;
        newPath = routeData.path;
        newRoute = routeData;

        if (meta) {
            newRoute['meta'] = { ...routeData.meta, ...meta };
        }
    };
    console.log(meta);

    // Set new route data
    routes.forEach(routeData => {
        if (routeExists) return;
        if (name && routeData.name === name) {
            // If route changed by name
            setNewRouteData(routeData);
        } else if (path && path.match(routeData.regex)) {
            // If route changed by path
            setNewRouteData(routeData);
        }
    });

    if (!routeExists) return error('unknown route');

    if (!validatePassedParams(newRoute.path, params)) return;

    // Query handling
    if (query) {
        newRoute['query'] = query;
        newPath += '?' + formatQuery(query);
    }

    // Named-params handling
    if (params) {
        newRoute['params'] = params;
        newPath = formatPathFromParams(newPath, params);
    }

    // Set fromRoute before route is updated
    fromRoute = route;

    // Before route change navigation guard
    if (beforeCallback) {
        const beforeResult = await beforeCallback(newRoute, fromRoute);

        if (beforeResult === false) return;
    }

    await writableRoute.set(newRoute);

    // Update page title
    if (newTitle) {
        document.getElementsByTagName('title')[0].innerHTML = newTitle;
    }

    // Update URL/state
    setUrl(replace, newPath);

    // After route change navigation guard
    if (afterCallback) await afterCallback(route, fromRoute);
};

export { route, fromRoute, changeRoute };
