/**
 * User-defined routes.
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
 * User route once processed.
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
 * Passed-route information
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
 * Set-props function for `beforeEach` callback.
 * @property `(props)` - `unknown`
 * @returns `void`
 */
interface SetProps {
    (props: unknown): void
}

/**
 * `beforeEach` navigation-guard callback.
 * @property `(to?, from?, setProps?)`
 * @returns `void | boolean | Promise<void | boolean>`
 */
interface BeforeEach {
    (to?: FormattedRoute, from?: FormattedRoute, setProps?: SetProps):
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
    (to?: FormattedRoute, from?: FormattedRoute, props?: unknown): void | Promise<void>
}

export type { Route, FormattedRoute, PassedRoute, BeforeEach, AfterEach }
