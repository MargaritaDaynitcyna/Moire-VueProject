<template>
  <ul class="catalog__list">
    <li class="catalog__item" v-for="(product) in products" :key="product.title">
      <!-- key сменить на id -->
      <ProductItem :product="product"></ProductItem>
    </li>
  </ul>
</template>

<script>
import ProductItem from './ProductItem.vue'

export default {
    components: { ProductItem },

    props: ['products'],
};
</script>