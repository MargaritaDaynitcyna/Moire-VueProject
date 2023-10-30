<template>
    <Teleport v-if="open" to="#teleport-target">
        <slot></slot>
    </Teleport>
</template>

<script>
export default {
    props: {
        open: {type: Boolean},
    },
}
</script>