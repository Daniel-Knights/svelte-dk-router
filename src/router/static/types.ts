export interface Route {
    name: string;
    title?: string;
    path: string;
    component;
    query?: Record<string, string>;
    params?: Record<string, string>;
    meta?: Record<string, string>;
}

export interface RouteWithRegex extends Route {
    regex: RegExp;
}

export interface PassedRoute {
    name?: string;
    path?: string;
    query?: Record<string, string>;
    params?: Record<string, string>;
    meta?: Record<string, string>;
}

export interface Guard {
    (to?: Route, from?: Route): void | boolean | Promise<void | boolean>;
}
