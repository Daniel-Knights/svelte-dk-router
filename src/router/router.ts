import { writable } from 'svelte/store';
import type { Route } from './types';

let routes: Route[];
let currentRoute: Route[] = [];

const loadState = () => {
    if (!routes) return;
    else
        currentRoute =
            routes.filter(writableRoute => {
                const state = window.history.state;
                const path = window.location.pathname;

                if (state && writableRoute.name === state.name) {
                    return writableRoute;
                }

                if (path && writableRoute.path === path) {
                    return writableRoute;
                }
            }) || routes;

    if (routes && currentRoute[0] && currentRoute[0].title) {
        document.title = currentRoute[0].title;
    }
};

export let route: Route = null;
export const writableRoute = writable(null);
writableRoute.subscribe(value => (route = value));

export const setRoutes = (userRoutes: Route[]): void => {
    userRoutes.forEach(userRoute => {
        if (!userRoute.name || !userRoute.path || !userRoute.component) {
            return console.error(
                'Svelte-Router [Error]: name, path and component are required properties'
            );
        }
    });

    routes = userRoutes;
    loadState();
    writableRoute.set(currentRoute[0]);
};

export const changeRoute = (
    name: string | void,
    path: string | void,
    query: Record<string, string> | void,
    params: Record<string, string> | void
): void => {
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

    if (query) {
        const formattedQuery = Object.entries(query)
            .map(([key, value], i, arr) => {
                if (i !== arr.length - 1) {
                    return key + '=' + value + '&';
                } else return key + '=' + value;
            })
            .join('');

        newPath += '?' + formattedQuery;
    }

    if (newTitle) document.title = newTitle;
    window.history.pushState({ name: newRoute.name }, '', newPath);
};
