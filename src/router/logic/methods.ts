import { PassedRoute, FormattedRoute, compareRoutes } from '../static';
import {
    error,
    setUrl,
    formatQueryFromObject,
    currentPath,
    validatePassedParams,
    invalidIdentifier,
} from '../static';
import { changeRoute, route as currentRoute } from './change';
import { writableDepthChart } from './nested';
import { hashHistory, routes, writableRoute } from './state';

let routeProps;

const processIdentifier = (identifier: string | PassedRoute): void | PassedRoute => {
    if (!identifier) return error('Path or name argument required');

    if (typeof identifier === 'string') {
        if (identifier[0] === '/') {
            identifier = { path: identifier };
        } else {
            identifier = { name: identifier };
        }
    }

    if (typeof identifier === 'object') {
        const { props } = identifier;

        if (props) setProps(props);
    }

    const filteredRoute = compareRoutes(routes, identifier);
    const { name, path, params, query } = identifier;

    if (!filteredRoute || (filteredRoute && filteredRoute.path === '(*)')) {
        return error(`Unknown route: "${name || path}"`);
    }

    return { ...filteredRoute, params, query };
};

// Push to the current history entry
const push = async (identifier: string | PassedRoute): Promise<void | FormattedRoute> => {
    const filteredRoute = processIdentifier(identifier);

    if (!filteredRoute) return Promise.reject();

    return await changeRoute(filteredRoute, false);
};

// Replace the current history entry
const replace = async (
    identifier: string | PassedRoute
): Promise<void | FormattedRoute> => {
    const filteredRoute = processIdentifier(identifier);

    if (!filteredRoute) return Promise.reject();

    return await changeRoute(filteredRoute, true);
};

// Set or update query params
const setQuery = (
    query: Record<string, string> | string,
    update = false,
    replace = true
): FormattedRoute | void => {
    if (!query) return error('A query argument is required');
    if (typeof query !== 'object' && typeof query !== 'string') {
        return error('Query argument must be of type object or string');
    }

    let formattedQuery = {};

    if (typeof query === 'string') {
        query
            .slice(0)
            .split('&')
            .forEach(pair => {
                formattedQuery[pair.split('=')[0]] = pair.split('=')[1];
            });
    } else if (typeof query === 'object') {
        formattedQuery = { ...query };
    }

    if (update)
        formattedQuery = {
            ...currentRoute.query,
            ...formattedQuery,
        };

    writableRoute.update(routeValue => {
        return { ...routeValue, query: formattedQuery };
    });
    writableDepthChart.update((chart: Record<string, FormattedRoute>) => {
        Object.entries(chart).forEach(([key, routeValue]) => {
            chart[key] = { ...routeValue, query: formattedQuery };
        });

        return chart;
    });

    const path = currentPath(hashHistory) + '?' + formatQueryFromObject(formattedQuery);

    setUrl(path, replace, hashHistory);

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
    if (currentRoute.params) {
        Object.entries(currentRoute.params).forEach(([key, value]) => {
            if (!params[key]) params[key] = value;
        });
    }

    writableRoute.update(routeValue => {
        return { ...routeValue, params };
    });

    writableDepthChart.update((chart: Record<string, FormattedRoute>) => {
        Object.entries(chart).forEach(([key, routeValue]) => {
            chart[key] = { ...routeValue, params };
        });

        return chart;
    });

    const pathSections = currentPath(hashHistory).split('/');

    currentRoute.fullPath.split('/').forEach((section, i) => {
        if (section[0] !== ':') return;
        if (!params[section.split(':')[1]]) return;

        if (hashHistory) i++;

        pathSections[i] = params[section.split(':')[1]];
    });

    if (currentRoute.query) {
        query = hashHistory
            ? '?' + window.location.hash.split('?')[1]
            : window.location.search;
    }

    const path = pathSections.join('/') + query;

    setUrl(path, replace, hashHistory);

    return currentRoute;
};

// eslint-disable-next-line
const setProps = (props: any): void => {
    routeProps = props;
};

export { push, replace, setQuery, setParams, routeProps, setProps };
