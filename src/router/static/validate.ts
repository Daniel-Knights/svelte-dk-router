import type { Route, FormattedRoute } from './types';
import { error, warn, flattenRoutes } from './utils';

const validateRoutes = (routes: Route[] | FormattedRoute[]): void => {
    const flattened = flattenRoutes(routes);

    flattened.forEach((routeOne, indexOne) => {
        flattened.forEach((routeTwo, indexTwo) => {
            if (indexOne === indexTwo) return;

            if (routeOne.name === routeTwo.name) {
                error(
                    'The "name" property must be unique. Duplicates detected: "' +
                        routeOne.name +
                        '"'
                );
            }

            if (
                routeOne.fullPath === routeTwo.fullPath &&
                routeOne.parent !== routeTwo &&
                routeTwo.parent !== routeOne
            ) {
                error(
                    'Paths must be unique. Duplicates detected: "' +
                        routeOne.fullPath +
                        '"'
                );
            }
        });
    });
};

const validatePassedParams = (
    path: string,
    params: Record<string, string>,
    silentError = false
): boolean => {
    let valid = true;

    // Validate required params
    if (path && !silentError) {
        path.split('/').forEach((section, i) => {
            if (i === 0 || section.split('')[0] !== ':') return;

            section = section.split(':')[1];

            if (!params || !params[section]) {
                valid = false;
                error('Missing required param: "' + section + '"');
            }
        });
    }

    if (params) {
        // Compare passed params with path params
        Object.keys(params).forEach(passedParam => {
            if (!path || !path.includes('/:' + passedParam)) {
                warn('Invalid param: "' + passedParam + '"');

                // Cleanup
                delete params[passedParam];
            }
        });
    }

    return valid;
};

export { validateRoutes, validatePassedParams };
