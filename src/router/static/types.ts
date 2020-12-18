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
    fullRegex: RegExp;
    depth: number;
    crumbs: string[];
    children?: FormattedRoute[];
    parent?: FormattedRoute;
    rootParent?: FormattedRoute;
}

export interface PassedRoute {
    identifier?: string;
    name?: string;
    path?: string;
    query?: Record<string, string>;
    params?: Record<string, string>;
    props?: Record<string, unknown>;
}

export interface Guard {
    (to?: FormattedRoute, from?: FormattedRoute):
        | void
        | boolean
        | Promise<void | boolean>;
}
