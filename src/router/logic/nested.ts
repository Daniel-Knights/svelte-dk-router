import { writable } from 'svelte/store';
import type { FormattedRoute } from '../static';

// Track current depth of nested routes
const writableDepthChart = writable({});

const chartState = async (route: FormattedRoute): Promise<void> => {
    const { rootParent, trace } = route;
    const tempChart = { 1: rootParent };
    let tempDepth = 1;

    const filterChildren = passedRoute => {
        // Populate tempChart with matching nested route
        passedRoute.children.forEach(child => {
            if (child.name === trace[tempDepth]) {
                tempChart[child.depth] = child;
                tempDepth += 1;
            }

            if (tempDepth !== route.depth && child.children) {
                filterChildren(child);
            }
        });
    };

    // Determine if filtering is necessary
    if (route.rootParent) {
        filterChildren(route.rootParent);
    } else {
        tempChart[1] = route;
    }

    await writableDepthChart.set(tempChart);
};

export { writableDepthChart, chartState };
