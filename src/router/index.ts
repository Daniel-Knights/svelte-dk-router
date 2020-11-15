export { route, setRoutes, push, replace, beforeEach, afterEach } from './logic';
export { SLink, SView } from './components';
import { compile, parse } from 'svelte/compiler';

compile('./components/SLink.svelte');
export const Result = parse('./components/SView.svelte');
console.log(Result);

// parse('./components/SView.svelte')
