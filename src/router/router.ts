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

export const writableRoute = writable(null);

export const setRoutes = (userRoutes: Route[]): void => {
    routes = userRoutes;
    loadState();
    writableRoute.set(currentRoute[0]);
};

export const changeRoute = (
    name: string | void,
    path: string | void,
    query: Record<string, string> | void
): void => {
    if (!name && !path) {
        return console.error('Router [error]: Name or path required');
    }

    let newPath, newTitle, newRoute;

    routes.forEach(routeData => {
        if (name && routeData.name === name) {
            writableRoute.set(routeData);
            newPath = routeData.path;
            newRoute = routeData;
        } else if (path && routeData.path === path) {
            writableRoute.set(routes[routes.indexOf(routeData)]);
            newPath = routeData.path;
            newRoute = routeData;
        } else return;

        if (routeData.title) newTitle = routeData.title;
    });

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
