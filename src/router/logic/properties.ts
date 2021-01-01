let hash = window.location.hash,
    host = window.location.host,
    hostname = window.location.hostname,
    origin = window.location.origin,
    pathname = window.location.pathname,
    port = window.location.port,
    href = window.location.href,
    protocol = window.location.protocol,
    search = window.location.search

const updateLocationData = (): void => {
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
