<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="color in colors" :key="color.id">
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          name="color-item"
          :value="color.id"
          v-model="currentCheck"
        />
        <span
          class="colors__value"
          :style="{ backgroundColor: color.color.code }"
        >
        </span>
      </label>
    </li>
  </ul>
</template>


<script>
export default {
  props: ["colors", "modelValue"],
  computed: {
    currentCheck: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
};
</script>