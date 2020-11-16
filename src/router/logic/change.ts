import type { Route, PassedRoute, RouteWithRegex } from '../static';
import { error, validatePassedParams } from '../static';
import { hashHistory, routes, writableRoute } from './state';
import { beforeCallback, afterCallback } from './guard';
import { formatPathFromParams, currentPath } from '../static/utils';

// Current route data
let route: Route = null;
// Previous route data
let fromRoute: Route = null;
// New route data
let newPath: string, newTitle: string, newRoute: RouteWithRegex;

// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => (route = newRoute));

const formatQuery = query => {
    // Set query params to route object
    writableRoute.update(routeValue => {
        if (query) routeValue['query'] = query;
        else delete routeValue.query;

        return routeValue;
    });

    if (!query) return;

    // Format and append to newPath
    const formattedQuery = Object.entries(query)
        .map(([key, value], i, arr) => {
            if (i !== arr.length - 1) {
                return key + '=' + value + '&';
            } else return key + '=' + value;
        })
        .join('');

    newPath += '?' + formattedQuery;
};

const formatParams = params => {
    writableRoute.update(routeValue => {
        routeValue['params'] = params;

        return routeValue;
    });

    // Replace named params with passed values
    newPath = formatPathFromParams(newPath, params);
};

const changeRoute = async (passedRoute: PassedRoute, replace?: boolean): Promise<void> => {
    const { name, path, query, params } = passedRoute;

    // Set fromRoute before route is updated
    fromRoute = route;

    if (!name && !path) {
        return error('name or path required');
    }

    let routeExists = false;

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

    if (!routeExists) return error('unknown route');

    // Prevent duplicate route navigation
    if (currentPath(hashHistory).match(newRoute.regex)) return;

    if (!validatePassedParams(newRoute.path, params)) return;

    // Before route change navigation guard
    if (beforeCallback) {
        const beforeResult = await beforeCallback(newRoute, fromRoute);

        if (beforeResult === false) return;
    }

    writableRoute.set(newRoute);

    // Query handling
    formatQuery(query);

    // Named-params handling
    if (params) formatParams(params);

    // Update page title
    if (newTitle) {
        document.getElementsByTagName('title')[0].innerHTML = newTitle;
    }

    // Update URL/state
    if (replace) {
        window.history.replaceState(null, '', newPath);
    } else {
        window.history.pushState(null, '', newPath);
    }

    // After route change navigation guard
    if (afterCallback) {
        afterCallback(route, fromRoute);
    }
};

export { route, fromRoute, changeRoute };
