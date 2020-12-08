<script lang="ts">
    import { SView, SLink } from '../../router';

    export let id = undefined;
</script>

<main id="more-view-rendered" data-testid={id}>MORE</main>
<SLink name={'hello'}>EVEN MORE</SLink>
<SView />
