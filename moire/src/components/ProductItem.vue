<template>
  <div>
    <router-link
      class="catalog__pic"
      :to="{ name: 'product', params: { id: product.id } }"
    >
      <img :src="srcImage" :alt="product.title" />
      <!-- <img :src="product.colors[0].gallery[0].file.url" :alt="product.title" /> -->
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{ name: 'product', params: { id: product.id } }">
        {{ product.title }}
      </router-link>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat }} ₽ </span>
    
    <BaseColorInput :colors="product.colors" :check.sync="colorItem"/>

   <!-- <ul class="colors colors--black">
      <li class="colors__item" v-for="color in product.colors" :key="color.id"> -->
        <!-- <BaseColorInput :color="color" :check.sync="colorItem"/> -->

        <!-- <label class="colors__label">
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
        </label> -->
      <!-- </li>
    </ul>  -->
  </div>
</template>

<script>
import gotoPage from "@/helpers/gotoPage";
import numberFormat from "@/helpers/numberFormat";
import BaseColorInput from "@/components/BaseColorInput";


export default {
  data() {
    return {
      // colorItem: this.product.colors[0].color.code,
      colorItem: this.product.colors[0].id,
    };
  },
  computed: {
    srcImage() {
      console.log(this.colorItem)
      return this.product.colors.find((color) => color.id === this.colorItem)
        .gallery
        ? this.product.colors.find((color) => color.id === this.colorItem)
            .gallery[0].file.url
        : "";
    },
  },
  filters: {
    numberFormat,
  },
  methods: {
    gotoPage,
  },
  props: ["product"],
  components: { BaseColorInput },
};
</script>