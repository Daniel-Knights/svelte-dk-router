import type { Route } from './types';
import { routes, writableRoute } from './state';
import { beforeCallback, afterCallback } from './methods';

export let route: Route = null;
export let fromRoute: Route = null;
writableRoute.subscribe(newRoute => {
    route = newRoute;
});

export const changeRoute = (
    name: string | void,
    path: string | void,
    query: Record<string, string> | void,
    params: Record<string, string> | void
): void => {
    fromRoute = route;

    if (!name && !path) {
        return console.error('Svelte-Router [Error]: name or path required');
    }

    let newPath, newTitle, newRoute;

    routes.forEach(routeData => {
        if (name && routeData.name === name) {
            writableRoute.set(routeData);
            newPath = routeData.path;
            newRoute = routeData;
        } else if (path && routeData.path.split('/:')[0] === path) {
            writableRoute.set(routes[routes.indexOf(routeData)]);
            newPath = routeData.path;
            newRoute = routeData;
        } else return;

        if (routeData.title) newTitle = routeData.title;
    });

    if (query) {
        writableRoute.update(routeValue => {
            routeValue['query'] = query;

            return routeValue;
        });

        const formattedQuery = Object.entries(query)
            .map(([key, value], i, arr) => {
                if (i !== arr.length - 1) {
                    return key + '=' + value + '&';
                } else return key + '=' + value;
            })
            .join('');

        newPath += '?' + formattedQuery;
    }

    if (params) {
        Object.keys(params).forEach(passedParam => {
            if (newPath.includes(':' + passedParam)) {
                writableRoute.update(routeValue => {
                    if (!routeValue.params) {
                        routeValue['params'] = {};
                    }

                    routeValue.params[passedParam] = params[passedParam];

                    return routeValue;
                });
            } else {
                console.warn('Svelte-Router [Warn]: Invalid param: "' + passedParam + '"');
            }

            newPath = newPath.replace(':' + passedParam, params[passedParam]);
        });

        newPath.split('/:').forEach((param, i) => {
            if (i === 0) return;
            if (!params[param]) {
                console.error('Svelte-Router [Error]: Missing required param: "' + param + '"');
            }
        });
    }

    if (newTitle) document.title = newTitle;

    if (beforeCallback) beforeCallback(route, fromRoute);
    window.history.pushState({ name: newRoute.name }, '', newPath);
    if (afterCallback) afterCallback(route, fromRoute);
};
