import { setRoutes } from '../router';
import {
    routesWithMissingProperties,
    childrenWithMissingProperties,
    routesWithDuplicateProperties,
    childrenWithDuplicateProperties,
} from './static/routes';

beforeAll(() => (console.error = jest.fn()));

test('setRoutes - Logs error on missing properties', () => {
    // @ts-ignore
    setRoutes(routesWithMissingProperties);

    expect(console.error).toHaveBeenCalled();
});

test('setRoutes - Logs error on missing children properties', () => {
    // @ts-ignore
    setRoutes(childrenWithMissingProperties);

    expect(console.error).toHaveBeenCalled();
});

test('setRoutes - Logs error on duplicate properties', () => {
    // @ts-ignore
    setRoutes(routesWithDuplicateProperties);

    expect(console.error).toHaveBeenCalled();
});

test('setRoutes - Logs error on duplicate children properties', () => {
    // @ts-ignore
    setRoutes(childrenWithDuplicateProperties);

    expect(console.error).toHaveBeenCalled();
});
