import { beforeEach, afterEach, push, setRoutes } from '../router';
import { testRoutes } from './static/routes';
import routes from '../routes';

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE));

test('beforeEach() - triggers with correct to/from routes', async () => {
    beforeEach(async (to, from) => {
        switch (to.query.stage) {
            case '1':
                expect(from).toMatchObject(testRoutes[0]);
                expect(to).toMatchObject(testRoutes[2].children[0]);
                break;
            case '2':
                expect(from).toMatchObject(testRoutes[2].children[0]);
                expect(to).toMatchObject(testRoutes[1]);
                break;
            case '3':
                expect(from).toMatchObject(testRoutes[2].children[0]);
                expect(to).toMatchObject(testRoutes[0]);
                break;
            default:
                expect(from).toBeNull;
                expect(to).toMatchObject(testRoutes[0]);
        }

        if (to.name === 'About') {
            await push('/', { query: { stage: '3' } });
        }
    });

    await push('Blog', {
        params: { id: '1', name: 'dan' },
        query: { stage: '1' },
    });
    push('About', { query: { stage: '2' } });
});

test('afterEach() - triggers with correct to/from routes', async () => {
    afterEach(async (to, from) => {
        switch (to.query.stage) {
            case '1':
                expect(from).toMatchObject(testRoutes[0]);
                expect(to).toMatchObject(testRoutes[2].children[0]);
                break;
            case '2':
                expect(from).toMatchObject(testRoutes[2].children[0]);
                expect(to).toMatchObject(testRoutes[1]);
                break;
            case '3':
                expect(from).toMatchObject(testRoutes[2].children[0]);
                expect(to).toMatchObject(testRoutes[0]);
                break;
            default:
                expect(from).toBeNull;
                expect(to).toMatchObject(testRoutes[0]);
        }

        if (to.name === 'About') {
            await push('/', { query: { stage: '3' } });
        }
    });

    await push('Blog', {
        params: { id: '1', name: 'dan' },
        query: { stage: '1' },
    });
    push('About', { query: { stage: '2' } });
});
