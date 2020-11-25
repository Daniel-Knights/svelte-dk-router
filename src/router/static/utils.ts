import type { Route, FormattedRoute } from './types';
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

const validatePassedParams = (
    path: string,
    params: Record<string, string>,
    silentError = false
): boolean => {
    let valid = true;

    // Validate required params
    if (path && !silentError) {
        path.split('/').forEach((section, i) => {
            if (i === 0 || section.split('')[0] !== ':') return;

            section = section.split(':')[1];

            if (!params || !params[section]) {
                valid = false;
                error('Missing required param: "' + section + '"');
            }
        });
    }

    if (params) {
        // Compare passed params with path params
        Object.keys(params).forEach(passedParam => {
            if (!path.includes('/:' + passedParam)) {
                warn('Invalid param: "' + passedParam + '"');

                // Cleanup
                delete params[passedParam];
            }
        });
    }

    return valid;
};

const formatPathFromParams = (path: string, params: Record<string, string>): string => {
    if (!validatePassedParams(path, params) || !params) {
        return path;
    }

    Object.entries(params).forEach(([key, value]) => {
        if (path.includes('/:')) {
            path = path.replace('/:' + key, '/' + value);
        }
    });

    return path;
};

const validateRoute = (passedRoute, compareRoute) => {
    const { name, path, index } = passedRoute;

    if (!index || index === compareRoute.index) return;

    if (name === compareRoute.name)
        error('The "name" property must be unique, duplicates detected: "' + name + '"');

    if (path === compareRoute.path || '/#' + path === compareRoute.path) {
        error('The "path" property must be unique, duplicates detected: "' + path + '"');
    }
};

const compareRoutes = (
    routes: Route[] | FormattedRoute[],
    route: Route | FormattedRoute,
    routeIndex?: number
): void | Route | FormattedRoute => {
    const { name, path } = route;
    let matchedRoute, fallbackRoute;

    const matchRoute = passedRoutes => {
        passedRoutes.forEach((compare, compareIndex) => {
            if (matchedRoute) return;

            const { regex, fullRegex } = compare as FormattedRoute;

            if (compare.path === '(*)') fallbackRoute = compare;

            validateRoute(
                { ...route, index: routeIndex },
                { ...compare, index: compareIndex }
            );

            if (path && (regex || fullRegex))
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
    formatQuery,
    validatePassedParams,
    formatPathFromParams,
    compareRoutes,
};
