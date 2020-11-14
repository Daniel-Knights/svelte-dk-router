import { routes } from './state';
import { changeRoute } from './router';
import type { Guard, PassedRoute, RouteWithRegex } from './types';
import { error, validateParams } from './utils';

let filteredRoute: RouteWithRegex, beforeCallback: Guard, afterCallback: Guard;

const processIdentifier = (identifier: string | PassedRoute): boolean | RouteWithRegex => {
    filteredRoute = routes.filter(route => {
        const { name, regex } = route;

        if (typeof identifier === 'string') {
            if (identifier.split('')[0] === '/' && identifier.match(regex)) {
                return route;
            }

            if (name === identifier) return route;
        } else if (identifier.name && identifier.name === name) {
            return route;
        } else if (identifier.path && identifier.path.match(regex)) {
            return route;
        }
    })[0];

    if (!filteredRoute) {
        error('Invalid route');
        return false;
    }

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

    if (!validateParams(filteredRoute.path, filteredRoute.params)) return false;

    return filteredRoute;
};

const push = (identifier: string | PassedRoute): void => {
    if (!processIdentifier(identifier)) return;

    changeRoute(filteredRoute);
};

const replace = (identifier: string | PassedRoute): void => {
    if (!processIdentifier(identifier)) return;

    changeRoute(filteredRoute, true);
};

// Set function to run before each route change
const beforeEach = (cb: Guard): void => {
    beforeCallback = cb;
};

// Set function to run after each route change
const afterEach = (cb: Guard): void => {
    afterCallback = cb;
};

export { beforeCallback, afterCallback, push, replace, beforeEach, afterEach };
