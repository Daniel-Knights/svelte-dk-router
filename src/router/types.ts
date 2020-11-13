export interface Route {
    name: string;
    title?: string;
    path: string;
    component;
    query?: string;
    params?: Record<string, string>;
    meta?: Record<string, string>;
}
