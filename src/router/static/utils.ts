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
    routes: Route[] | FormattedRoute[],
    route: Route | FormattedRoute
): void | Route | FormattedRoute => {
    const { name, path } = route;
    let matchedRoute, fallbackRoute;

    const matchRoute = passedRoutes => {
        passedRoutes.forEach(compare => {
            if (matchedRoute) return;

            const { regex, fullRegex } = compare as FormattedRoute;

            if (compare.path === '(*)') fallbackRoute = compare;

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
    formatPathFromParams,
    compareRoutes,
};
