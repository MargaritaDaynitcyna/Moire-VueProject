<template>
  <Teleport v-if="open" to="#teleport-target">
    <div class="teleport-blackout"></div>
    <div class="teleport-modal" @click="onOutsideClick">
      <div
        ref="content"
        class="teleport-modal__content"
      >
        <button type="button" class="teleport-modal__close" @click.prevent="doClose">
          X
        </button>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    open: { type: Boolean },
  },
  methods: {
    onOutsideClick($event) {
      if (
        $event.target !== this.$refs.content
      ) {
        this.doClose();
      }
    },
    doClose() {
      this.$emit('update:open', false);
    },
  },
};
</script>

<style>
.teleport-blackout {
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.75;
  background-color: #000;
}
.teleport-modal {
  z-index: 5;
  overflow: auto;
  overflow-y: scroll;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
}
.teleport-modal__content {
  position: relative;
  min-width: 1000px;
  margin-top: auto;
  margin-bottom: auto;
  padding: 40px;
  background-color: #fff;
}
.teleport-modal__close {
  position: absolute;
  padding: 10px;
  top: -10px;
  right: -10px;
}
</style>