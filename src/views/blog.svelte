<script lang='ts'>
	import Post from '../components/Post.svelte';

	let post: object = {title: 'Post 1', body: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officia id aliquam quidem et eaque sunt quae cumque, magnam adipisci enim! Recusandae, vel nihil pariatur odio suscipit reiciendis illo. Quo libero expedita quasi inventore vitae maxime dolor corrupti et beatae placeat consequuntur dicta laudantium, esse, sed quos enim impedit vel suscipit.'}
</script>

<Post {...post} />

<style type='text/scss'>

</style>