import { route } from '../router';

const cleanupChildren = (): void => {
    route.children.forEach(child => {
        child.children = [];
        // @ts-ignore
        child.parent = {};
        // @ts-ignore
        child.rootParent = {};
    });
};

export { cleanupChildren };
