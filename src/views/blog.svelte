<script lang="ts">
    import { onMount } from 'svelte';
    import { route, SView, SLink } from '../router';
    import Post from '../components/Post.svelte';

    export let id = undefined;

    let post: object = {
        title: 'Post 1',
        body:
            'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia id aliquam quidem et eaque sunt quae cumque, magnam adipisci enim! Recusandae, vel nihil pariatur odio suscipit reiciendis illo. Quo libero expedita quasi inventore vitae maxime dolor corrupti et beatae placeat consequuntur dicta laudantium, esse, sed quos enim impedit vel suscipit.',
    };

    let params = { name: 'john', id: '6' };

    onMount(() => {
        console.log(route);
    });
</script>

<main id="blog-view-rendered" data-testid={id}>
    <Post {...post} />
    <SLink name={'Future'} {params}>NESTED</SLink>
    <SView />
</main>
