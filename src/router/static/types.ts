export interface Route {
    name?: string;
    title?: string;
    path: string;
    component;
    query?: Record<string, string>;
    params?: Record<string, string>;
    meta?: Record<string, unknown>;
    children?: Route[];
}

export interface FormattedRoute extends Route {
    fullPath: string;
    rootPath: string;
    regex: RegExp;
    depth: number;
    trace: string[];
    children?: FormattedRoute[];
    parent?: FormattedRoute;
    rootParent?: FormattedRoute;
}

export interface PassedRoute {
    name?: string;
    path?: string;
    query?: Record<string, string>;
    params?: Record<string, string>;
    meta?: Record<string, unknown>;
}

export interface Guard {
    (to?: Route, from?: Route): void | boolean | Promise<void | boolean>;
}
