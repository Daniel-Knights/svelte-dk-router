export interface Route {
    name: string;
    title?: string;
    path: string;
    component;
    query?: Record<string, string>;
    params?: Record<string, string>;
    meta?: Record<string, string>;
}

export interface Callback {
    (to: Route, from: Route): void;
}
