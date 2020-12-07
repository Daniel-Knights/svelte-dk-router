import { setRoutes } from '../router';
import userRoutes from '../routes';

beforeAll(() => (console.error = jest.fn()));

test('setRoutes - Logs error on missing properties', () => {
    const memoComponent = userRoutes[0].component;

    delete userRoutes[0].component;

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalled();

    userRoutes[0]['component'] = memoComponent;
});

test('setRoutes - Logs error on missing children properties', () => {
    const memoPath = userRoutes[1].children[0].children[0].path;
    const memoComponent = userRoutes[2].children[1].component;

    delete userRoutes[1].children[0].children[0].path;
    delete userRoutes[2].children[1].component;

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalled();

    userRoutes[1].children[0].children[0]['path'] = memoPath;
    userRoutes[2].children[1]['component'] = memoComponent;
});

test('setRoutes - Logs error on duplicate properties', () => {
    const memoPathOne = userRoutes[0].path;
    const memoPathTwo = userRoutes[1].path;

    userRoutes[0].path = 'Duplicate';
    userRoutes[1].path = 'Duplicate';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalled();

    userRoutes[0].path = memoPathOne;
    userRoutes[1].path = memoPathTwo;
});

test('setRoutes - Logs error on duplicate children properties', () => {
    const memoNameOne = userRoutes[1].children[1].name;
    const memoNameTwo = userRoutes[2].children[0].name;

    userRoutes[1].children[1].name = 'Duplicate';
    userRoutes[2].children[0].name = 'Duplicate';

    // @ts-ignore
    setRoutes(userRoutes);

    expect(console.error).toHaveBeenCalled();

    userRoutes[1].children[1].name = memoNameOne;
    userRoutes[2].children[0].name = memoNameTwo;
});
