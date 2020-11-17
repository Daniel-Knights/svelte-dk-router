import type { PassedRoute, RouteWithRegex } from '../static';
import { error } from '../static';
import { currentPath } from '../static/utils';
import { changeRoute } from './change';
import { hashHistory, routes } from './state';

let filteredRoute: RouteWithRegex;

const processIdentifier = (identifier: string | PassedRoute): boolean | RouteWithRegex => {
    // Filter route using identifier
    filteredRoute = routes.filter(route => {
        const { name, regex } = route;

        if (typeof identifier === 'string') {
            if (identifier.split('')[0] === '/' && identifier.match(regex)) {
                return route;
            }

            if (name === identifier) return route;
        } else if (identifier.name === name || identifier.path.match(regex)) {
            return route;
        }
    })[0];

    if (!filteredRoute) {
        error('Invalid route');
        return false;
    }

    if (currentPath(hashHistory).match(filteredRoute.regex)) {
        error('Duplicate route navigation is not permitted');
        return false;
    }

    //  Cleanup query if not passed
    if (!identifier.query) delete filteredRoute.query;

    // Set route object properties
    if (typeof identifier === 'object') {
        if (identifier.query) {
            filteredRoute['query'] = identifier.query;
        }
        if (identifier.params) {
            filteredRoute['params'] = identifier.params;
        }
        if (identifier.meta) {
            filteredRoute['meta'] = identifier.meta;
        }
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

export { push, replace };
