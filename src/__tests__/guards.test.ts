import { beforeEach, afterEach, push, setRoutes } from '../router';
import { aboutRoute, blogDefaultChildRoute, homeRoute } from './static/routes';
import { cleanupChildren } from './utils';
import routes from '../routes';

// @ts-ignore
beforeAll(() => setRoutes(routes, process.env.HASH_MODE));

test('beforeEach() - triggers with correct to/from routes', async () => {
    beforeEach(async (to, from) => {
        cleanupChildren(to);
        cleanupChildren(from);

        switch (to.query.stage) {
            case '1':
                expect(from).toMatchObject(homeRoute);
                expect(to).toMatchObject(blogDefaultChildRoute);
                break;
            case '2':
                expect(from).toMatchObject(blogDefaultChildRoute);
                expect(to).toMatchObject(aboutRoute);
                break;
            case '3':
                expect(from).toMatchObject(blogDefaultChildRoute);
                expect(to).toMatchObject(homeRoute);
                break;
            default:
                expect(from).toBeNull;
                expect(to).toMatchObject(homeRoute);
        }

        if (to.name === 'About') {
            await push({ path: '/', query: { stage: '3' } });
        }
    });

    await push({
        name: 'Blog',
        params: { id: '1', name: 'dan' },
        query: { stage: '1' },
    });
    push({ name: 'About', query: { stage: '2' } });
});

test('afterEach() - triggers with correct to/from routes', async () => {
    afterEach(async (to, from) => {
        cleanupChildren(to);
        cleanupChildren(from);

        switch (to.query.stage) {
            case '1':
                expect(from).toMatchObject(homeRoute);
                expect(to).toMatchObject(blogDefaultChildRoute);
                break;
            case '2':
                expect(from).toMatchObject(blogDefaultChildRoute);
                expect(to).toMatchObject(aboutRoute);
                break;
            case '3':
                expect(from).toMatchObject(blogDefaultChildRoute);
                expect(to).toMatchObject(homeRoute);
                break;
            default:
                expect(from).toBeNull;
                expect(to).toMatchObject(homeRoute);
        }

        if (to.name === 'About') {
            await push({ path: '/', query: { stage: '3' } });
        }
    });

    await push({
        name: 'Blog',
        params: { id: '1', name: 'dan' },
        query: { stage: '1' },
    });
    push({ name: 'About', query: { stage: '2' } });
});
