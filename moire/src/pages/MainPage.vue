<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info">
          {{ countProducts }} товара
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :color-id.sync="filterColorId"
        :material-id.sync="filterMaterialId"
        :collection-id.sync="filterCollectionId"
      />

      <section class="catalog">

        <div v-if="productsLoading">loading . . . </div>
        <div v-if="productsLoadingFailed">ERROR . . .<button @click.prevent="loadProducts()">! reload !</button> </div>

      <div class="catalog__quantity quantity">
        <span class="quantity__text">
          Показывать товаров по 
        </span>
        <select class="quantity__selcect" name="" id="" v-model.number="productsPerPage">
          <option value="3">3</option>
          <option value="6">6</option>
          <option value="9">9</option>
          <option value="12">12</option>
        </select>
      </div>


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
// import products from "@/data/products";
import ProductList from "@/components/ProductList.vue";
import BasePagination from "@/components/BasePagination.vue";
import ProductFilter from "@/components/ProductFilter.vue";
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';


export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      // products: products = products,
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorId: [],
      filterMaterialId: [],
      filterCollectionId: [],

      page: 1,
      productsPerPage: 3,

      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  computed: {
    // filteredProducts() {
    //   let filteredProducts = products;

    //   if (this.filterPriceFrom > 0) {
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.price > this.filterPriceFrom
    //     );
    //   }

    //   if (this.filterPriceTo > 0) {
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.price < this.filterPriceTo
    //     );
    //   }
    //   if (this.filterCategoryId) {
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.categoryId === this.filterCategoryId
    //     );
    //   }
    //   if (this.filterMaterialId) {
    //     // !!!!!!!!!
    //     // for (let i=0; i<this.filterMaterialId.length; i++) {
    //     //   filteredProducts = filteredProducts.filter((product) => {product.materialId === this.filterMaterialId[i];
    //     //   console.log(product.materialId === this.filterMaterialId[i])});
    //     // }
    //     // for (let mat of this.filterMaterialId) {
    //     //   console.log(mat)
    //     //   console.log(filteredProducts)
    //     //   filteredProducts = filteredProducts.filter((product) => {console.log(product.materialId === mat); product.materialId === mat; });
    //     // }
    //   }
    //   if (this.filterColllectionId) {
    //     // !!!!!!!!!
    //     // for (let i=0; i<this.filterMaterialId.length; i++) {
    //     //   filteredProducts = filteredProducts.filter((product) => {product.materialId === this.filterMaterialId[i];
    //     //   console.log(product.materialId === this.filterMaterialId[i])});
    //     // }
    //     // for (let mat of this.filterMaterialId) {
    //     //   console.log(mat)
    //     //   console.log(filteredProducts)
    //     //   filteredProducts = filteredProducts.filter((product) => {console.log(product.materialId === mat); product.materialId === mat; });
    //     // }
    //   }

    //   return filteredProducts;
    // },
    
    products() {
      // const offset = (this.page - 1) * this.productsPerPage;
      // return this.filteredProducts.slice(offset, offset + this.productsPerPage);
      // console.log(this.productsData)
      return this.productsData ? this.productsData.items.map((product) => {
          return {
            ...product,
            // image: product.colors[0].gallery[0].file.url,
          }
        }) : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
    
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;

      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(()=> {
        axios
        .get(API_BASE_URL+`/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
            colorIds: this.filterColorId,
            materialIds: this.filterMaterialId,
            seasonIds: this.filterCollectionId
           }
        })
        .then(response => this.productsData = response.data)
        .catch(()=> this.productsLoadingFailed = true)
        .then(()=> this.productsLoading = false)

      }, 100);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    productsPerPage() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterColorId() {
      this.loadProducts();
    },
    filterMaterialId() {
      this.loadProducts();
    },
    filterCollectionId() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },
};
</script>