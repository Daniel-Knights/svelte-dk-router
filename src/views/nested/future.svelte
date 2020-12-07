<script lang="ts">
    import { route, SView, SLink } from '../../router';

    export let id = undefined;

    // console.log(route, 'future');

    const params = { id: '67', name: 'hahahahehehe' };
</script>

<main id="future-view-rendered" data-testid={id}>FUTURE</main>
<!-- <SLink name={'blog more'} {params}>MORE</SLink> -->
<SView />
