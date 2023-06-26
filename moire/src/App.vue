<template>
    <section class="catalog">
        <ProductList :products="products"></ProductList>

        <BasePagination :count="countProducts" v-model="page" :per-page="productsPerPage"></BasePagination>

      </section>
</template>

<script>
import Allproducts from './data/products'
import ProductList from './components/ProductList.vue'
import BasePagination from './components/BasePagination.vue'

export default {
  components: { ProductList, BasePagination },
  name: 'App',
  data() {
    return {
      // products: products = products,
      page: 1,
      productsPerPage: 3,
    }
  },
  computed: {
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return Allproducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return Allproducts.length;
    }
  },
  
}
</script>
