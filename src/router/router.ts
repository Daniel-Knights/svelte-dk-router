import { writable } from 'svelte/store';
import type { Route } from './types';

let routes: Route[];
let currentRoute: Route[] = [];

const loadState = () => {
    if (!routes) return;
    else
        currentRoute =
            routes.filter(singleRoute => {
                const state = window.history.state;
                const path = window.location.pathname;
                const query = new URLSearchParams(window.location.search);

                if (query) {
                    for (const pair of query.entries()) {
                        if (!singleRoute.query) singleRoute['query'] = {};

                        singleRoute.query[pair[0]] = pair[1];
                    }
                }

                singleRoute.path.split('/').forEach((param, i) => {
                    if (param.includes(':')) {
                        if (!singleRoute.params) singleRoute.params = {};

                        singleRoute.params[param.split(':')[1]] = path.split('/')[i];
                    }
                });

                if (state && singleRoute.name === state.name) {
                    return singleRoute;
                }

                if (path && singleRoute.path.split('/:')[0] === '/' + path.split('/')[1]) {
                    return singleRoute;
                }
            }) || routes;

    if (routes && currentRoute[0] && currentRoute[0].title) {
        document.title = currentRoute[0].title;
    }
};

export let route: Route = null;
export const writableRoute = writable(null);
writableRoute.subscribe(newRoute => (route = newRoute));

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
    window.history.pushState({ name: newRoute.name }, '', newPath);
};
