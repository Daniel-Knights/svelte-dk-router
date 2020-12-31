interface Route {
    name?: string
    title?: string
    path: string
    component
    query?: Record<string, string>
    params?: Record<string, string>
    meta?: Record<string, unknown>
    children?: Route[]
}

interface FormattedRoute extends Route {
    fullPath: string
    rootPath: string
    regex: RegExp
    fullRegex: RegExp
    depth: number
    crumbs: string[]
    children?: FormattedRoute[]
    parent?: FormattedRoute
    rootParent?: FormattedRoute
}

interface PassedRoute {
    identifier?: string
    name?: string
    path?: string
    query?: Record<string, string>
    params?: Record<string, string>
    props?: unknown
}

interface SetProps {
    (props: unknown): void
}

interface BeforeEach {
    (to?: FormattedRoute, from?: FormattedRoute, setProps?: SetProps):
        | void
        | boolean
        | Promise<void | boolean>
}
interface AfterEach {
    (to?: FormattedRoute, from?: FormattedRoute, props?: unknown):
        | void
        | boolean
        | Promise<void | boolean>
}

export type { Route, FormattedRoute, PassedRoute, BeforeEach, AfterEach }
