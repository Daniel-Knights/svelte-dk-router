import type { PassedRoute, FormattedRoute } from './types';
import { updateLocationData } from '../logic/properties';

const error = (msg: string): void => {
    console.error('Svelte-Router [Error]: ' + msg);
};
const warn = (msg: string): void => {
    console.warn('Svelte-Router [Warn]: ' + msg);
};

// Hash path or history path
const currentPath = (hash: boolean): string => {
    return hash ? '/' + window.location.hash.split('?')[0] : window.location.pathname;
};

const setUrl = (replace: boolean, path: string): void => {
    if (replace) {
        window.history.replaceState(null, '', path);
    } else {
        window.history.pushState(null, '', path);
    }

    updateLocationData();
};

// Set query params to route object on page-load
const queryState = (query: URLSearchParams, route: FormattedRoute): void => {
    if (!query) return;

    query.forEach((value, key) => {
        if (!route.query) route['query'] = {};

        route.query[key] = value;
    });
};

// Set named params to route object on page-load
const paramState = (path: string, route: FormattedRoute): void => {
    if (!route.fullPath) return;

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

const formatPaths = (
    passedRoute: FormattedRoute,
    path: string,
    hashMode: boolean
): void => {
    const { parent } = passedRoute;
    // Set path properties
    passedRoute['fullPath'] = path;

    if (hashMode && path !== '(*)') {
        passedRoute.path = '/#' + path;
        passedRoute['fullPath'] = parent ? parent.fullPath + path : passedRoute.path;
        passedRoute['rootPath'] = parent ? parent.rootPath : '/#/' + path.split('/')[1];
    } else if (parent) {
        passedRoute['fullPath'] = parent.fullPath + path;
        passedRoute['rootPath'] = parent.rootPath;
    } else if (path.split('/')[1]) {
        passedRoute['rootPath'] = '/' + path.split('/')[1];
    }
};

const formatRegex = (passedRoute: FormattedRoute): void => {
    let regex = passedRoute.path
        .split('/')
        .map((section, i) => {
            if (section.split('')[0] === ':') return '';
            else if (i !== 0) return '\\/' + section;
        })
        .join('');

    let fullRegex = passedRoute.fullPath
        .split('/')
        .map((section, i) => {
            if (section.split('')[0] === ':') {
                // Named-params
                return '\\/(?:[^\\/]+?)';
            } else if (i !== 0) return '\\/' + section;
        })
        .join('');

    // Handle base-path
    if (passedRoute.path === '/') regex = '';
    else if (passedRoute.path === '/#/') regex = '\\/#';

    if (passedRoute.fullPath === '/') fullRegex = '';
    else if (passedRoute.fullPath === '/#/') fullRegex = '\\/#';

    if (passedRoute.path !== '(*)') {
        passedRoute['regex'] = new RegExp('^' + regex + '\\/?$', 'i');
        passedRoute['fullRegex'] = new RegExp('^' + fullRegex + '\\/?$', 'i');
    }
};

const formatQuery = (query: Record<string, string>): string => {
    const formattedQuery = Object.entries(query)
        .map(([key, value], i, arr) => {
            if (i !== arr.length - 1) {
                return key + '=' + value + '&';
            } else return key + '=' + value;
        })
        .join('');

    return formattedQuery;
};

const formatPathFromParams = (path: string, params: Record<string, string>): string => {
    if (!path || !params) return;

    Object.entries(params).forEach(([key, value]) => {
        if (path.includes('/:')) {
            path = path.replace('/:' + key, '/' + value);
        }
    });

    return path;
};

const compareRoutes = (
    routes: FormattedRoute[],
    route: PassedRoute
): void | FormattedRoute => {
    const { name, path } = route;
    let matchedRoute, fallbackRoute;

    const matchRoute = passedRoutes => {
        if (!passedRoutes) return;

        passedRoutes.forEach(compare => {
            if (matchedRoute) return;

            const { regex, fullRegex } = compare;

            if (compare.path === '(*)') fallbackRoute = compare;

            if (path && (fullRegex || regex))
                if (path.match(fullRegex) || path.match(regex)) {
                    return (matchedRoute = compare);
                }

            if (name === compare.name) {
                return (matchedRoute = compare);
            }

            if (compare.children) matchRoute(compare.children);
        });
    };

    matchRoute(routes);

    if (!matchedRoute) return fallbackRoute;
    else return matchedRoute;
};

export {
    error,
    warn,
    currentPath,
    setUrl,
    queryState,
    paramState,
    formatPaths,
    formatRegex,
    formatQuery,
    formatPathFromParams,
    compareRoutes,
};
