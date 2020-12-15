import type { PassedRoute, FormattedRoute, Route } from './types';
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

const setUrl = (path: string, replace: boolean, hash: boolean): void => {
    if (hash && path[1] !== '#') path = '/#' + path;

    if (replace) {
        window.history.replaceState(null, '', path);
    } else {
        window.history.pushState(null, '', path);
    }

    updateLocationData();
};

const flattenRoutes = (passedRoutes: Route[] | FormattedRoute[]): FormattedRoute[] => {
    let flattened = [];

    const flatten = routesToFlatten => {
        routesToFlatten.forEach(route => {
            flattened = [...flattened, route];

            if (route.children) {
                flatten(route.children);
            }
        });
    };

    flatten(passedRoutes);

    return flattened;
};

const stripInvalidProperties = (passedRoutes: Route[] | FormattedRoute[]): void => {
    const flattened = flattenRoutes(passedRoutes);
    const validKeys = [
        'name',
        'title',
        'path',
        'component',
        'meta',
        'children',
        'regex',
        'fullRegex',
        'fullPath',
        'rootPath',
        'parent',
        'rootParent',
        'crumbs',
        'depth',
    ];

    flattened.forEach(flattenedRoute => {
        Object.keys(flattenedRoute).forEach(key => {
            if (!validKeys.includes(key)) {
                warn(`Invalid property on route "${flattenedRoute.fullPath}": ${key}`);
                delete flattenedRoute[key];
            }
        });
    });
};

// Return original path if route is invalid
const invalidIdentifier = (
    passedRoute: PassedRoute,
    passedIdentifier: string | PassedRoute
): string => {
    if (passedRoute.path !== '(*)') return;

    if (typeof passedIdentifier === 'string' && passedIdentifier.match(/^\//)) {
        return passedIdentifier;
    } else if (typeof passedIdentifier === 'object' && passedIdentifier.path) {
        return passedIdentifier.path;
    } else {
        return '/';
    }
};

// Set query params to route object on page-load
const formatRouteQueryFromString = (
    query: string | URLSearchParams,
    route: FormattedRoute
): void => {
    query = new URLSearchParams(query);

    query.forEach((value, key) => {
        if (!route.query) route['query'] = {};

        route.query[key] = value;
    });
};

// Set named params to route object on page-load
const formatParamsFromPath = (path: string, route: FormattedRoute): void => {
    if (!route.fullPath) return;

    route.fullPath.split('/').forEach((param, i) => {
        if (param[0] === ':') {
            // Validate
            if (!path.split('/')[i])
                return error('Missing required param: "' + param.slice(1) + '"');

            if (!route.params) route.params = {};

            route.params[param.split(':')[1]] = path.split('/')[i];
        }
    });
};

const formatPathProperties = (passedRoute: FormattedRoute, path: string): void => {
    const { parent } = passedRoute;
    // Set path properties
    passedRoute['fullPath'] = path;

    if (parent) {
        passedRoute['fullPath'] = parent.fullPath + path;
        passedRoute['rootPath'] = parent.rootPath;
    } else if (path.split('/')[1]) {
        passedRoute['rootPath'] = '/' + path.split('/')[1];
    } else {
        passedRoute['rootPath'] = '/';
    }
};

const formatRouteRegex = (passedRoute: FormattedRoute): void => {
    const { path, fullPath } = passedRoute;

    if (path === '(*)') return;

    let regex = path
        .split('/')
        .map((section, i) => {
            if (section[0] === ':') return '';
            else if (i !== 0) return '\\/' + section;
        })
        .join('');

    let fullRegex = fullPath
        .split('/')
        .map((section, i) => {
            if (section[0] === ':') {
                // Named-params
                return '\\/(?:[^\\/]+?)';
            } else if (i !== 0) return '\\/' + section;
        })
        .join('');

    // Handle base-path
    if (path === '/') regex = '';

    if (fullPath === '/') fullRegex = '';

    passedRoute['regex'] = new RegExp('^' + regex + '\\/?$', 'i');
    passedRoute['fullRegex'] = new RegExp('^' + fullRegex + '\\/?$', 'i');
};

const formatQueryFromObject = (query: Record<string, string>): string => {
    const formattedQuery = Object.entries(query)
        .map(([key, value], i, arr) => {
            // Handle camel-case keys
            key = key
                .split('')
                .map((char, i) => {
                    if (char === char.toUpperCase() && i !== 0) {
                        return '-' + char.toLowerCase();
                    } else return char;
                })
                .join('');

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

            if (path && (fullRegex || regex)) {
                if (path.match(fullRegex) || path.match(regex)) {
                    return (matchedRoute = compare);
                }
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
    flattenRoutes,
    stripInvalidProperties,
    invalidIdentifier,
    formatRouteQueryFromString,
    formatParamsFromPath,
    formatPathProperties,
    formatRouteRegex,
    formatQueryFromObject,
    formatPathFromParams,
    compareRoutes,
};
