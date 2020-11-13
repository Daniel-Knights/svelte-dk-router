import { writable } from 'svelte/store';
import type { Route } from './types';

export let routes: Route[];
export let currentRoute: Route[] = [];

export const writableRoute = writable(null);

export const loadState = (): void => {
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
