<script lang="ts">
    import { onMount } from 'svelte';

    import { route, SView, SLink } from '../router';

    import Post from '../components/Post.svelte';

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

<style type="text/scss">
</style>

<Post {...post} />
<SLink name={'blog future'} {params}>NESTED</SLink>
<SView />
