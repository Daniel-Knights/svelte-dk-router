import {
    error,
    setUrl,
    formatQuery,
    currentPath,
    PassedRoute,
    FormattedRoute,
    validatePassedParams,
} from '../static';
import { changeRoute, route as currentRoute } from './change';
import { hashHistory, routes, writableRoute } from './state';

const processIdentifier = (identifier: string | PassedRoute): FormattedRoute => {
    let filteredRoute;

    // Filter route using identifier
    const filterRoutes = passedRoutes => {
        passedRoutes.forEach(route => {
            if (filteredRoute) return;

            const { name, regex, fullRegex } = route;

            if (typeof identifier === 'string') {
                const isPath = identifier.match(/\//);

                if (isPath && hashHistory) identifier = '/#' + identifier;

                if (identifier.match(fullRegex)) {
                    filteredRoute = route;
                } else if (name === identifier) {
                    filteredRoute = route;
                } else if (identifier.match(regex)) {
                    filteredRoute = route;
                }
            } else if (typeof identifier === 'object') {
                let { path } = identifier;

                if (hashHistory) path = '/#' + path;

                if (path && path.match(fullRegex)) {
                    filteredRoute = route;
                } else if (identifier.name === name) {
                    filteredRoute = route;
                } else if (path && path.match(regex)) {
                    filteredRoute = route;
                }
            }

            if (route.children && !filteredRoute) {
                filterRoutes(route.children);
            }
        });
    };

    filterRoutes(routes);

    if (!filteredRoute) error('Invalid route');

    //  Cleanup
    delete filteredRoute.query;
    delete filteredRoute.params;

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
const push = async (identifier: string | PassedRoute): Promise<void> => {
    const filteredRoute = processIdentifier(identifier);

    if (!filteredRoute) return;

    await changeRoute(filteredRoute);
};

// Replace the current history entry
const replace = async (identifier: string | PassedRoute): Promise<void> => {
    const filteredRoute = processIdentifier(identifier);

    if (!filteredRoute) return;

    await changeRoute(filteredRoute, true);
};

// Set or update query params
const setQuery = (
    query: Record<string, string>,
    update = false,
    replace = true
): FormattedRoute | void => {
    if (!query) return error('A query argument is required');
    if (typeof query !== 'object') {
        return error('Query argument must be an object');
    }

    if (update)
        query = {
            ...currentRoute.query,
            ...query,
        };

    writableRoute.update(routeValue => {
        return { ...routeValue, query };
    });

    const path = currentPath(hashHistory) + '?' + formatQuery(query);

    setUrl(replace, path);

    return currentRoute;
};

// Update named-params
const setParams = (
    params: Record<string, string>,
    replace = true
): FormattedRoute | void => {
    if (!params) {
        return error('Params are required');
    } else if (!currentRoute.fullPath.includes('/:')) {
        return error('Current route has no defined params');
    }

    let query = '';

    validatePassedParams(currentRoute.fullPath, params, true);

    // Remove invalid params
    Object.keys(params).forEach(param => {
        if (currentRoute.params && !currentRoute.params[param]) {
            delete params[param];
        }
    });

    // Include existing params
    Object.entries(currentRoute.params).forEach(([key, value]) => {
        if (!params[key]) params[key] = value;
    });

    writableRoute.update(routeValue => {
        return { ...routeValue, params };
    });

    const pathSections = currentPath(hashHistory).split('/');

    currentRoute.fullPath.split('/').forEach((section, i) => {
        if (section.split('')[0] !== ':') return;
        if (!params[section.split(':')[1]]) return;

        pathSections[i] = params[section.split(':')[1]];
    });

    if (currentRoute.query) {
        query = hashHistory
            ? '?' + window.location.hash.split('?')[1]
            : window.location.search;
    }

    const path = pathSections.join('/') + query;

    setUrl(replace, path);

    return currentRoute;
};

export { push, replace, setQuery, setParams };
