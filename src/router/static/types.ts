/**
 * User-defined route.
 * @property `name?` - `string`
 * @property `title?` - `string`
 * @property `path` - `string`
 * @property `component` - `SvelteComponent`
 * @property `query?` - `string`
 * @property `params?` - `string`
 * @property `meta?` - `string`
 * @property `children?` - `string`
 */
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

/**
 * @extends Route
 * @property `fullPath` - `string`
 * @property `rootPath` - `string`
 * @property `regex` - `RegExp`
 * @property `fullRegex` - `RegExp`
 * @property `depth` - `number`
 * @property `crumbs` - `string[]`
 * @property `children?` - `FormattedRoute[]`
 * @property `parent?` - `FormattedRoute`
 * @property `rootParent?` - `FormattedRoute`
 */
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

/**
 * @property `identifier?` - `string`
 * @property `name?` - `string`
 * @property `path?` - `string`
 * @property `query?` - `Record<string, string>`
 * @property `params?` - `Record<string, string>`
 * @property `props?` - `unknown`
 */
interface PassedRoute {
    identifier?: string
    name?: string
    path?: string
    query?: Record<string, string>
    params?: Record<string, string>
    props?: unknown
}

/**
 * `context` object parameter for the `beforeEach` callback
 * @property `setProps` - Sets provided props if they haven't already been set
 * @property `redirect` - Redirect initial navigation to another route
 */
interface BeforeContext {
    setProps: (props: unknown) => void
    redirect: (identifier: string, options?: PassedRoute) => void
}

/**
 * `context` object parameter for the `afterEach` callback
 * @property `props` - Contains any props set on navigation
 * @property `redirect` - Redirect initial navigation to another route
 */
interface AfterContext {
    props: unknown
    redirect: (identifier: string, options?: PassedRoute) => void
}

/**
 * `beforeEach` navigation-guard callback.
 * @property `(to?, from?, setProps?)`
 * @returns `void | boolean | Promise<void | boolean>`
 */
interface BeforeEach {
    (to?: FormattedRoute, from?: FormattedRoute | null, context?: BeforeContext):
        | void
        | boolean
        | Promise<void | boolean>
}

/**
 * `afterEach` navigation-guard callback.
 * @property `(to?, from?, props?)`
 * @returns `void | Promise<void>`
 */
interface AfterEach {
    (
        to?: FormattedRoute,
        from?: FormattedRoute,
        context?: AfterContext
    ): void | Promise<void>
}

/**
 * @property `path` - string
 * @property `title` - string
 * @property `route` - FormattedRoute
 */
interface NewRoute {
    path: string
    title: string
    route: FormattedRoute
}

export type { Route, FormattedRoute, PassedRoute, BeforeEach, AfterEach, NewRoute }
