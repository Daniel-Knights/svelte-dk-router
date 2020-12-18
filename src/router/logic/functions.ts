import { PassedRoute, FormattedRoute, compareRoutes } from '../static';
import { error, invalidIdentifier } from '../static';
import { changeRoute, route as currentRoute } from './change';
import { routes } from './state';

const pushOrReplace = async (
    routeData: PassedRoute,
    replace: boolean
): Promise<void | FormattedRoute> => {
    const { identifier } = routeData;

    if (!identifier) return error('Path or name argument required');

    let errorString;

    if (typeof identifier === 'string') {
        errorString = identifier;

        if (identifier[0] === '/') {
            routeData.path = identifier;
        } else {
            routeData.name = identifier;
        }
    }

    if (typeof identifier === 'object') {
        const { path, name } = identifier;

        if (!name && !path) {
            return error('Path or name argument required');
        }

        errorString = path || name;
    }

    const filteredRoute = compareRoutes(routes, routeData);
    const { params, query, props } = routeData;

    if (!filteredRoute) {
        error(`Unknown route: "${errorString}"`);
        throw new Error(`Unknown route: "${errorString}"`);
    }

    const returnedRoute = await changeRoute(
        { ...filteredRoute, params, query, props },
        replace,
        invalidIdentifier(filteredRoute, identifier)
    );

    if (filteredRoute.path === '(*)') {
        error(`Unknown route: "${errorString}"`);
        throw new Error(`Unknown route: "${errorString}"`);
    }

    return returnedRoute;
};

// Push to the current history entry
const push = async (
    identifier: string,
    routeData?: PassedRoute
): Promise<void | FormattedRoute> => {
    return await pushOrReplace({ identifier, ...routeData }, false);
};

// Replace the current history entry
const replace = async (
    identifier: string,
    routeData?: PassedRoute
): Promise<void | FormattedRoute> => {
    return await pushOrReplace({ identifier, ...routeData }, true);
};

// Set or update query params
const setQuery = async (
    query: Record<string, string>,
    update = false,
    replace = true
): Promise<FormattedRoute | void> => {
    if (!query) {
        error('A query argument is required');
        throw new Error('A query argument is required');
    }
    if (typeof query !== 'object') {
        error('Query argument must be of type object');
        throw new Error('Query argument must be of type object');
    }

    let formattedQuery = { ...query };

    if (update) {
        formattedQuery = {
            ...currentRoute.query,
            ...formattedQuery,
        };
    }

    return await changeRoute({ ...currentRoute, query: formattedQuery }, replace);
};

// Update named-params
const setParams = async (
    params: Record<string, string>,
    replace = true
): Promise<FormattedRoute | void> => {
    if (!params) {
        error('Params are required');
        throw new Error('Params are required');
    } else if (!currentRoute.fullPath.includes('/:')) {
        error('Current route has no defined params');
        throw new Error('Current route has no defined params');
    }

    return await changeRoute({ ...currentRoute, params }, replace);
};

export { push, replace, setQuery, setParams };
