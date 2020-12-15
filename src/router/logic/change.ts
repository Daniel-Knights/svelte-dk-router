import type { PassedRoute, FormattedRoute } from '../static';
import {
    setUrl,
    formatQueryFromObject,
    validatePassedParams,
    formatPathFromParams,
} from '../static';
import { hashHistory, routes, writableRoute } from './state';
import { beforeCallback, afterCallback } from './guard';
import { chartState } from './nested';

// Current route data
let route: FormattedRoute = null;
// Previous route data
let fromRoute: FormattedRoute = null;
// New route data
let newPath: string, newTitle: string, newRoute: FormattedRoute;

let routeProps,
    propsPageCount = 0;

// Update route each time writableRoute is updated
writableRoute.subscribe(newRoute => {
    route = { ...newRoute };
});

const setProps = (props: Record<string, unknown>): void => {
    propsPageCount = 0;
    routeProps = props;
};

const changeRoute = async (
    passedRoute: PassedRoute,
    replace?: boolean,
    passedPath?: string
): Promise<void | FormattedRoute> => {
    const { name, path, query, params, props } = passedRoute;
    let fullPath;

    // Clear route-props
    propsPageCount += 1;
    if (propsPageCount > 0) routeProps = null;

    if (passedRoute['fullPath']) {
        fullPath = passedRoute['fullPath'];
    }

    let routeExists = false;

    const setNewRouteData = routeData => {
        const hasDefaultChild = routeData.children && !routeData.children[0].path;

        if (routeData.title) newTitle = routeData.title;

        // Cleanup
        if (routeData.query) {
            delete routeData.query;

            if (hasDefaultChild) {
                delete routeData.children[0].query;
            }
        }
        if (routeData.params) {
            delete routeData.params;

            if (hasDefaultChild) {
                delete routeData.children[0].params;
            }
        }

        routeExists = true;
        newPath = routeData.fullPath;
        newRoute = routeData;

        // Check for default child
        if (newRoute.children) {
            newRoute.children.forEach(child => {
                if (child.path === '') {
                    newRoute = child;
                }
            });
        }
    };

    // Set new route data
    const matchRoute = passedRoutes => {
        passedRoutes.forEach(routeData => {
            if (routeExists) return;
            if (name && routeData.name === name) {
                // If route changed by name
                setNewRouteData(routeData);
            } else if (fullPath && fullPath.match(routeData.fullRegex)) {
                // If route changed by path
                setNewRouteData(routeData);
            } else if (routeData.children) {
                // Recursively filter child routes
                matchRoute(routeData.children);
            }

            if (!newRoute) {
                if (path && path.match(routeData.regex)) {
                    // If route changed by path
                    setNewRouteData(routeData);
                }
            }
        });
    };

    matchRoute(routes);

    if (!routeExists) return;

    if (newPath === '(*)') {
        newPath = path;
    }

    if (!validatePassedParams(newRoute.fullPath, params)) return;

    // Query handling
    if (query) {
        newRoute['query'] = query;
        newPath += '?' + formatQueryFromObject(query);
    }

    // Named-params handling
    if (params) {
        newRoute['params'] = params;
        newPath = formatPathFromParams(newPath, params);
    }

    if (props) setProps(props);

    // Set fromRoute before route is updated
    if (!replace) fromRoute = route;

    // Before route change navigation guard
    if (beforeCallback) {
        const beforeResult = await beforeCallback(newRoute, fromRoute);

        if (beforeResult === false) return;
    }

    writableRoute.set(newRoute);
    chartState(newRoute);

    // Update page title
    const title = document.getElementsByTagName('title')[0];

    if (newTitle && title) {
        title.innerHTML = newTitle;
    }

    if (passedPath) newPath = passedPath;

    // Update URL/state
    setUrl(newPath, replace, hashHistory);

    // After route change navigation guard
    if (afterCallback) {
        await afterCallback(route, fromRoute);
    }

    return route;
};

export { route, fromRoute, routeProps, changeRoute };
