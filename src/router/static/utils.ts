import type { Route, RouteWithRegex } from './types';

const error = (msg: string): void => {
    return console.error('Svelte-Router [Error]: ' + msg);
};
const warn = (msg: string): void => {
    return console.warn('Svelte-Router [Warn]: ' + msg);
};

const validatePassedParams = (path: string, params: Record<string, string>): boolean => {
    let valid = true;

    // Validate required params
    path.split('/:').forEach((param, i) => {
        if (i === 0) return;

        if (!params || !params[param]) {
            valid = false;
            error('Missing required param: "' + param + '"');
        }
    });

    return valid;
};

const compareRoutes = (
    routes: Route[] | RouteWithRegex[],
    route: Route | RouteWithRegex,
    routeIndex: number
): void | Route | RouteWithRegex => {
    const { name, path } = route;
    let matchedRoute;

    routes.forEach((compare, compareIndex) => {
        const sameRoute = routeIndex === compareIndex;

        if (name === compare.name) {
            matchedRoute = compare;

            if (!sameRoute)
                error('The "name" property must be unique, duplicates detected: "' + name + '"');
        }

        if (path === compare.path) {
            matchedRoute = compare;

            if (!sameRoute)
                error('The "path" property must be unique, duplicates detected: "' + path + '"');
        }

        if (path.match((compare as RouteWithRegex).regex)) matchedRoute = compare;
    });

    return matchedRoute;
};

export { error, warn, validatePassedParams, compareRoutes };
