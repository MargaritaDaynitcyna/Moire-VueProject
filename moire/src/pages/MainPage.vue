<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info">
          {{ filteredProducts.length }} товара
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :material-id.sync="filterMaterialId"
        :collectionId.sync="filterCollectionId"
      />

      <section class="catalog">
        <ProductList :products="products"></ProductList>

        <BasePagination
          :count="countProducts"
          v-model="page"
          :per-page="productsPerPage"
        ></BasePagination>
      </section>
    </div>
  </main>
</template>

<script>
import products from "@/data/products";
import ProductList from "@/components/ProductList.vue";
import BasePagination from "@/components/BasePagination.vue";
import ProductFilter from "@/components/ProductFilter.vue";

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      // products: products = products,
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterMaterialId: [],
      filterCollectionId: [],

      page: 1,
      productsPerPage: 3,
    };
  },
  computed: {
    filteredProducts() {
      let filteredProducts = products;

      if (this.filterPriceFrom > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price > this.filterPriceFrom
        );
      }

      if (this.filterPriceTo > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price < this.filterPriceTo
        );
      }
      if (this.filterCategoryId) {
        filteredProducts = filteredProducts.filter(
          (product) => product.categoryId === this.filterCategoryId
        );
      }
      if (this.filterMaterialId) {
        // !!!!!!!!!
        // for (let i=0; i<this.filterMaterialId.length; i++) {
        //   filteredProducts = filteredProducts.filter((product) => {product.materialId === this.filterMaterialId[i];
        //   console.log(product.materialId === this.filterMaterialId[i])});
        // }
        // for (let mat of this.filterMaterialId) {
        //   console.log(mat)
        //   console.log(filteredProducts)
        //   filteredProducts = filteredProducts.filter((product) => {console.log(product.materialId === mat); product.materialId === mat; });
        // }
      }
      if (this.filterColllectionId) {
        // !!!!!!!!!
        // for (let i=0; i<this.filterMaterialId.length; i++) {
        //   filteredProducts = filteredProducts.filter((product) => {product.materialId === this.filterMaterialId[i];
        //   console.log(product.materialId === this.filterMaterialId[i])});
        // }
        // for (let mat of this.filterMaterialId) {
        //   console.log(mat)
        //   console.log(filteredProducts)
        //   filteredProducts = filteredProducts.filter((product) => {console.log(product.materialId === mat); product.materialId === mat; });
        // }
      }

      return filteredProducts;
    },
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return this.filteredProducts.length;
    },
  },
};
</script>