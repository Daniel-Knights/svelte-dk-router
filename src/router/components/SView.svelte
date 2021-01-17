<script>
    import { getContext, onMount, setContext } from 'svelte'
    import { writableDepthChart } from '../logic'

    let depthChart = {}
    let render = false
    let depth = getContext('depth') || 1

    writableDepthChart.subscribe(chart => (depthChart = chart))

    // Increment depth for each nested view
    setContext('depth', depth + 1)

    // Ensure staggered render of nested views
    onMount(() => (render = true))
</script>

{#if render && depthChart && depthChart[depth]}
    <svelte:component this={depthChart[depth].component} />
{/if}
