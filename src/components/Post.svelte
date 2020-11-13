<script lang='ts'>
    export let title: string, body: string;
</script>

<div class="post">
    <h3>{title}</h3>
    <p>{body}</p>
</div>

<style type='text/scss'>
.post {
    max-width: 300px;
    height: 200px;
    border: 3px solid var(--orange);
}
</style>