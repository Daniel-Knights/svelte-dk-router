/** Alias for `window.location.hash` */
let hash = window.location.hash
/** Alias for `window.location.host` */
let host = window.location.host
/** Alias for `window.location.hostname` */
let hostname = window.location.hostname
/** Alias for `window.location.origin` */
let origin = window.location.origin
/** Alias for `window.location.pathname` */
let pathname = window.location.pathname
/** Alias for `window.location.port` */
let port = window.location.port
/** Alias for `window.location.href` */
let href = window.location.href
/** Alias for `window.location.protocol` */
let protocol = window.location.protocol
/** Alias for `window.location.search` */
let search = window.location.search

/** Update `window.location` properties on route-change */
function updateLocationData(): void {
    hash = window.location.hash
    host = window.location.host
    hostname = window.location.hostname
    href = window.location.href
    origin = window.location.origin
    pathname = window.location.pathname
    port = window.location.port
    protocol = window.location.protocol
    search = window.location.search
}

export {
    updateLocationData,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search
}
