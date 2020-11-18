import type { PassedRoute, RouteWithRegex } from '../static';
import { error, warn, setUrl, formatQuery, currentPath } from '../static';
import { changeRoute, route as currentRoute } from './change';
import { hashHistory, routes, writableRoute } from './state';

let filteredRoute: RouteWithRegex;

const processIdentifier = (identifier: string | PassedRoute): boolean | RouteWithRegex => {
    // Filter route using identifier
    filteredRoute = routes.filter(route => {
        const { name, regex } = route;

        if (typeof identifier === 'string') {
            const pathMatch = identifier.match(/\//) && identifier.match(regex);

            if (pathMatch || name === identifier) {
                return route;
            }
        } else if (identifier.name === name || identifier.path.match(regex)) {
            return route;
        }
    })[0];

    if (!filteredRoute) {
        error('Invalid route');
        return false;
    }

    //  Cleanup query if not passed
    if (!identifier.query) delete filteredRoute.query;

    // Set route object properties
    if (typeof identifier === 'object') {
        const { query, params, meta } = identifier;

        if (query) filteredRoute['query'] = query;
        if (params) filteredRoute['params'] = params;
        if (meta) filteredRoute['meta'] = meta;
    }

    return filteredRoute;
};

// Push to the current history entry
const push = (identifier: string | PassedRoute): void => {
    if (!processIdentifier(identifier)) return;

    changeRoute(filteredRoute);
};

// Replace the current history entry
const replace = (identifier: string | PassedRoute): void => {
    if (!processIdentifier(identifier)) return;

    changeRoute(filteredRoute, true);
};

// Set or update query params
const setQuery = (query: Record<string, string> | string, update = false, replace = true): void => {
    if (!query) return error('A query argument is required');
    if (typeof query !== 'object') {
        return error('Query argument must be an object');
    }

    if (update)
        query = {
            ...currentRoute.query,
            ...(query as Record<string, string>),
        };

    writableRoute.update(routeValue => {
        routeValue['query'] = query;

        return routeValue;
    });

    const path = currentPath(hashHistory) + '?' + formatQuery(query);

    setUrl(replace, path);
};

// Update named-params
const setParams = (params: Record<string, string>, replace = true): void => {
    if (!params) {
        return error('Params are required');
    } else if (!currentRoute.path.includes(':')) {
        return error('Current route has no defined params');
    }

    Object.keys(params).forEach(param => {
        if (!currentRoute.path.includes(':' + param)) {
            warn('Invalid param: "' + param + '"');
        }

        writableRoute.update(routeValue => {
            routeValue.params[param] = params[param];

            return routeValue;
        });
    });

    const pathSections = currentPath(hashHistory).split('/');

    currentRoute.path.split('/').forEach((section, i) => {
        if (!section.includes(':')) return;
        if (!params[section.split(':')[1]]) return;

        pathSections[i] = params[section.split(':')[1]];
    });

    const path = pathSections.join('/') + window.location.search;

    setUrl(replace, path);
};

export { push, replace, setQuery, setParams };
