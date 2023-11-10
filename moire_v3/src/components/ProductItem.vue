<template>
  <div>
    <router-link
      class="catalog__pic"
      :to="{ name: 'product', params: { id: product.id } }"
    >
      <img :src="srcImage" :alt="product.title" />
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{ name: 'product', params: { id: product.id } }">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price"> {{ productPricePretty }} ₽ </span>

    <!-- <BaseColorInput :colors="product.colors" v-model="colorItem"/> -->

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in product.colors" :key="color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            :value="color.id"
            v-model="colorItem"
          />
          <span
            class="colors__value"
            :style="{ backgroundColor: color.color.code }"
          >
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import gotoPage from "@/helpers/gotoPage";
import numberFormat from "@/helpers/numberFormat.js";
// import BaseColorInput from "@/components/BaseColorInput.vue";

export default {
  data() {
    return {
      colorItem: this.product.colors[0].id,
    };
  },
  // components: { BaseColorInput },
  computed: {
    srcImage() {
      return this.product.colors.find((color) => color.id === this.colorItem)
        .gallery
        ? this.product.colors.find((color) => color.id === this.colorItem)
            .gallery[0].file.url
        : "";
    },
    productPricePretty() {
      return numberFormat(this.product.price);
    },
  },
  methods: {
    gotoPage,
  },
  props: ["product"],
};
</script>