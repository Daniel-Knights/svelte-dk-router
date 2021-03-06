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
export interface Route {
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
export interface FormattedRoute extends Route {
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
export interface PassedRoute {
    identifier?: string
    name?: string
    path?: string
    query?: Record<string, string>
    params?: Record<string, string>
    props?: unknown
}

/**
 * @property `path` - string
 * @property `title` - string
 * @property `route` - FormattedRoute
 */
export interface NewRoute {
    path: string
    title: string
    route: FormattedRoute
}

/**
 * `beforeEach` navigation-guard callback.
 * @property `(to?, from?, setProps?)`
 * @returns `void | boolean | Promise<void | boolean>`
 */
export type BeforeEach = {
    (
        to?: FormattedRoute,
        from?: FormattedRoute | null,
        setProps?: (props: unknown) => void
    ): void | boolean | Promise<void | boolean>
}

/**
 * `afterEach` navigation-guard callback.
 * @property `(to?, from?, props?)`
 * @returns `void | Promise<void>`
 */
export type AfterEach = {
    (to?: FormattedRoute, from?: FormattedRoute, props?: unknown): void | Promise<void>
}
