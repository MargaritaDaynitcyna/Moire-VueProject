<template>
  <div class="product__counter form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="minus" :class="{'button--disabled': amount === 1 }">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model.number="currentAmount" />

    <button type="button" aria-label="Добавить один товар" @click.prevent="plus">
      <svg width="10" height="10" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  props: ["modelValue"],
  computed: {
    currentAmount: {
      get() {
        return this.modelValue;
      },
      set(modelValue) {
        this.$emit("update:modelValue", modelValue);
      },
    },
  },
  // methods: {
  //   plus() {
  //     this.$emit("update:amount", this.amount + 1);
  //   },
  //   minus() {
  //     if (this.amount >= 2) {
  //       this.$emit("update:amount", this.amount - 1);
  //     }
  //   },
  // },
};
</script>