import type { Route, PassedRoute, RouteWithRegex } from '../static';
import { error, warn, validateParams } from '../static';
import { routes, writableRoute } from './state';
import { beforeCallback, afterCallback } from './guard';

// Current route data
let route: Route = null;
// Previous route data
let fromRoute: Route = null;
// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => {
    route = newRoute;
});

const changeRoute = async (passedRoute: PassedRoute, replace?: boolean): Promise<void> => {
    const { name, path, query, params } = passedRoute;
    // Set fromRoute before route is updated
    fromRoute = route;

    if (!name && !path) {
        return error('name or path required');
    }

    let newPath: string,
        newTitle: string,
        newRoute: RouteWithRegex,
        routeExists = false;

    const setNewRouteData = routeData => {
        routeExists = true;
        newPath = routeData.path;
        newRoute = routeData;
        if (routeData.title) newTitle = routeData.title;
    };

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

    if (!routeExists) {
        return error('unknown route');
    }

    // Prevent duplicate route navigation
    if (window.location.pathname.match(newRoute.regex)) return;

    if (!validateParams(newPath, params)) return;

    // Before route change navigation guard
    if (beforeCallback) {
        const beforeResult = await beforeCallback(newRoute, fromRoute);

        if (beforeResult === false) return;
    }

    writableRoute.set(newRoute);

    // Query handling
    if (query) {
        // Set query params to route object
        writableRoute.update(routeValue => {
            routeValue['query'] = query;

            return routeValue;
        });

        // Format and append to newPath
        const formattedQuery = Object.entries(query)
            .map(([key, value], i, arr) => {
                if (i !== arr.length - 1) {
                    return key + '=' + value + '&';
                } else return key + '=' + value;
            })
            .join('');

        newPath += '?' + formattedQuery;
    }

    // Named-params handling
    if (params) {
        // Compare passed params with matched routes' params,
        // format and set to the route object
        Object.keys(params).forEach(passedParam => {
            if (newPath.includes(':' + passedParam)) {
                writableRoute.update(routeValue => {
                    if (!routeValue.params) routeValue['params'] = {};

                    routeValue.params[passedParam] = params[passedParam];

                    return routeValue;
                });
            } else {
                warn('Invalid param: "' + passedParam + '"');
            }

            // Replace named params with passed values
            newPath = newPath.replace(':' + passedParam, params[passedParam]);
        });
    }

    // Update page title
    if (newTitle) document.title = newTitle;

    // Update URL/state
    if (replace) {
        window.history.replaceState({ name: newRoute.name }, '', newPath);
    } else {
        window.history.pushState({ name: newRoute.name }, '', newPath);
    }

    // After route change navigation guard
    if (afterCallback) {
        afterCallback(route, fromRoute);
    }
};

export { route, fromRoute, changeRoute };
