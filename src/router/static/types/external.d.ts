import type { Readable } from 'svelte/store'

declare module 'svelte-dk-router' {
    /**
     * Object containing all data for the current route.
     * @property `title` - Page-title
     * @property `name` - Routes' name
     * @property `path` - Routes' path
     * @property `component` - Svelte component
     * @property `children` - Nested-routes
     * @property `parent` - Parent-route
     * @property `rootParent` - Ancestor-route
     * @property `crumbs` - Array of route-names within the route-hierarchy
     * @property `depth` - Routes' depth within its route-hierarchy
     * @property `fullPath` - Path joined with any matching ancestor paths
     * @property `rootPath` - Ancestor-routes' path
     * @property `regex` - Generated regex for the routes' path
     * @property `fullRegex` - Generated regex for the routes' full-path
     */
    const route: FormattedRoute
    /**
     * Object containing all routes within the current route hierarchy,
     * listed by depth (`1` = root, `2` = child, etc.).
     * @example
     * {
     *   1: {title: "About", path: "/about", children: Array(2), name: "About", component: ƒ, …}
     *   2: {name: "Default About", path: "", children: Array(1), parent: {…}, component: ƒ, …}
     * }
     */
    const routeChart: Record<string, FormattedRoute>
    /**
     * Contains any props set on navigation through:
     *
     * - `<SLink>`
     * - `push`
     * - `replace`
     * - or `beforeEach`
     */
    const routeProps: unknown
    /**
     * Readable Svelte store which triggers on each navigation and returns the current route.
     * @example
     * routeStore.subscribe(newRoute => {
     *   breadcrumbNavigation.textContent = newRoute.crumbs.join('/')
     * })
     */
    const routeStore: Readable<FormattedRoute>
    /**
     * Readable Svelte store which triggers on each navigation and returns the current route-hierarchy,
     * listed by depth (`1` = root, `2` = child, etc.).
     * @example
     * routeChartStore.subscribe(newChart => {
     *   if (newChart[1].name === 'Home') {
     *     // Do something...
     *   }
     * })
     */
    const routeChartStore: Readable<Record<string, FormattedRoute>>

    /**
     * Uses `window.history.pushState` to update the current history entry. Returns a promise.
     * @param identifier - Name or path.
     * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
     * @returns The current route or throws an error.
     * @example
     * await push('/', { query: { id: '1' } })
     *   .then(route => ...)
     *   .catch(err => ...)
     */
    function push(
        identifier: string,
        routeData?: PassedRoute
    ): Promise<void | FormattedRoute>
    /**
     * Uses window.history.replaceState to update the current history entry. Returns a promise.
     * @param identifier - Name or path.
     * @param routeData - (Optional) - Any associated route-data, i.e. `params`, `query` and `props`.
     * @returns The current route or throws an error.
     * @example
     * await replace('/', { query: { id: '1' } })
     *   .then(route => ...)
     *   .catch(err => ...)
     */
    function replace(
        identifier: string,
        routeData?: PassedRoute
    ): Promise<void | FormattedRoute>
    /**
     * Navigation guard which runs *before* each route-change.
     * @param cb - **Arguments:**
     * @param to - Route navigating to
     * @param from - Route navigating from
     * @param context
     * @property `redirect` - Redirects initial navigation to another route
     * @property `setProps` - Sets route-props, accessible through the `routeProps` import and `props` parameter in the `afterEach` callback
     */
    function beforeEach(cb: BeforeEach)
    /**
     * Navigation guard which runs *after* each route-change.
     * @param cb - **Arguments:**
     * @param to - Route navigated to
     * @param from - Route navigated from
     * @param context
     * @property `redirect` - Redirects initial navigation to another route
     * @property `props` - Current props set through any of the available methods:
     *
     * - `<SLink>`
     * - `push`
     * - `replace`
     * - `beforeEach`.
     */
    function afterEach(cb: AfterEach)
    /**
     * Set or update query-params. Returns a promise.
     * @param query - Object of any valid key/value pairs.
     * @param update - (Optional, defaults to `false`) - Update or overwrite existing query.
     * @param replace - (Optional, defaults to `true`) - Use window.history.pushState or window.history.replaceState.
     * @returns The current route or throws an error.
     * @example
     * await setQuery({ id: '1' })
     *   .then(route => ...)
     *   .catch(err => ...)
     */
    function setQuery(
        query: Record<string, string>,
        update?: boolean,
        replace?: boolean
    ): Promise<void | FormattedRoute>
    /**
     * Set named-params. Returns a promise.
     * @param params - Any predefined key/value pairs.
     * @param replace - (Optional, defaults to `true`) - Use window.history.pushState or window.history.replaceState.
     * @returns The current route or throws an error.
     * @example
     * await setParams({ name: 'dan' })
     *   .then(route => ...)
     *   .catch(err => ...)
     */
    function setParams(
        params: Record<string, string>,
        replace?: boolean
    ): Promise<void | FormattedRoute>
    /**
     * Sets a provided array of routes.
     * @param userRoutes
     * @param hashMode - (Optional, defaults to `false` (history-mode)).
     */
    function setRoutes(userRoutes: Route[], hashMode?: boolean): void

    /** Alias for `window.location.hash`, updates on navigation */
    const hash: string
    /** Alias for `window.location.host`, updates on navigation */
    const host: string
    /** Alias for `window.location.hostname`, updates on navigation */
    const hostname: string
    /** Alias for `window.location.href`, updates on navigation */
    const href: string
    /** Alias for `window.location.origin`, updates on navigation */
    const origin: string
    /** Alias for `window.location.pathname`, updates on navigation */
    const pathname: string
    /** Alias for `window.location.port`, updates on navigation */
    const port: string
    /** Alias for `window.location.protocol`, updates on navigation */
    const protocol: string
    /** Alias for `window.location.search`, updates on navigation */
    const search: string
}
