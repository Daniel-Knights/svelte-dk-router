import type { FormattedRoute } from '../router/static';

const cleanupChildren = (route: FormattedRoute): void => {
    if (!route || !route.children) return;

    route.children.forEach(child => {
        child.children = [];
        // @ts-ignore
        child.parent = {};
        // @ts-ignore
        child.rootParent = {};
    });
};

export { cleanupChildren };
