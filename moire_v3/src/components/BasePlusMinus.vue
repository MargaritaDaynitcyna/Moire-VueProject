<template>
  <div class="product__counter form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="minus" :class="{'button--disabled': modelValue === 1 }">
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
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    plus() {
      this.$emit("update:modelValue", this.modelValue + 1);
    },
    minus() {
      if (this.modelValue >= 2) {
        this.$emit("update:modelValue", this.modelValue - 1);
      }
    },
  },
};
</script>