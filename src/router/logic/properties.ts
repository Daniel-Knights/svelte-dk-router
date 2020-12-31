let hash = window.location.hash,
    host = window.location.host,
    hostname = window.location.hostname,
    origin = window.location.origin,
    pathname = window.location.pathname,
    href = window.location.href,
    protocol = window.location.protocol,
    search = window.location.search

const updateLocationData = (): void => {
    hash = window.location.hash
    host = window.location.host
    hostname = window.location.hostname
    origin = window.location.origin
    pathname = window.location.pathname
    href = window.location.href
    protocol = window.location.protocol
    search = window.location.search
}

export {
    updateLocationData,
    hash,
    host,
    hostname,
    origin,
    pathname,
    href,
    protocol,
    search
}
