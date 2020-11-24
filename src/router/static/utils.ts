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
        path.split('/:').forEach((param, i) => {
            if (i === 0) return;

            if (!params || !params[param]) {
                valid = false;
                error('Missing required param: "' + param + '"');
            }
        });
    }

    if (params) {
        // Compare passed params with path params
        Object.keys(params).forEach(passedParam => {
            if (!path.includes(':' + passedParam)) {
                warn('Invalid param: "' + passedParam + '"');
            }
        });
    }

    return valid;
};

const formatPathFromParams = (path: string, params: Record<string, string>): string => {
    let formattedParams = path;

    Object.entries(params).forEach(([key, value]) => {
        if (formattedParams.includes(':')) {
            formattedParams = formattedParams.replace(':' + key, value);
        } else {
            formattedParams += '/' + value;
        }
    });

    return formattedParams;
};

const compareRoutes = (
    routes: Route[] | FormattedRoute[],
    route: Route | FormattedRoute,
    routeIndex?: number
): void | Route | FormattedRoute => {
    const { name, path, params } = route;
    let matchedRoute, formattedPath;

    if (params) {
        formattedPath = formatPathFromParams(path, params);
    } else formattedPath = path;

    const matchRoute = passedRoutes => {
        passedRoutes.forEach((compare, compareIndex) => {
            if (matchedRoute) return;

            const { regex } = compare as FormattedRoute;

            let sameRoute;

            if (routeIndex) {
                sameRoute = routeIndex === compareIndex;
            }

            if (name === compare.name) {
                matchedRoute = compare;

                if (sameRoute === false)
                    error(
                        'The "name" property must be unique, duplicates detected: "' + name + '"'
                    );
            }

            if (formattedPath === compare || '/#' + formattedPath === compare) {
                matchedRoute = compare;

                if (sameRoute === false)
                    error(
                        'The "path" property must be unique, duplicates detected: "' +
                            formattedPath +
                            '"'
                    );
            }

            if (path === compare.rootPath && compare.path.includes(':')) {
                validatePassedParams(compare.path, params);
            }

            if (formattedPath && formattedPath.match(regex)) {
                matchedRoute = compare;
            }

            if (compare.children) matchRoute(compare.children);
        });
    };

    matchRoute(routes);

    return matchedRoute;
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
