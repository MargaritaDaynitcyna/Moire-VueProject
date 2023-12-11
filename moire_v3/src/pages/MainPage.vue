<template>
  <main class="content container">
    <div class="content__top">
      <div class="content__row">
        <h1 class="content__title">Каталог</h1>
        <span class="content__info"> {{ countProducts }} товара/ов </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter
        v-model:price-from="filterPriceFrom"
        v-model:price-to="filterPriceTo"
        v-model:category-id="filterCategoryId"
        v-model:color-id="filterColorId"
        v-model:material-id="filterMaterialId"
        v-model:collection-id="filterCollectionId"
        v-model:page="page"
      />

      <section class="catalog">
        <div v-if="productsLoadingFailed">
          Что-то пошло не так...
          <button
            @click.prevent="loadProducts()"
            class="filter__reset button button--second"
          >
            ПЕРЕЗАГРУЗИТЬ
          </button>
        </div>

        <div class="catalog__quantity quantity">
          <span class="quantity__text"> Товаров на странице </span>
          <select
            class="quantity__selcect"
            name=""
            id=""
            v-model.number="productsPerPage"
          >
            <option value="6">6</option>
            <option value="9">9</option>
            <option value="12">12</option>
            <option value="18">18</option>
          </select>
        </div>

        <div class="product__preloader" v-if="productsLoading">
          <BasePreloader></BasePreloader>
        </div>
        <div v-if="countProducts === 0 && !productsLoading">
          Товаров с выбранными параметрами не существует
        </div>
        <ProductList
          :products="products"
          :class="{ 'catalog--disabled': productsLoading }"
        ></ProductList>

        <BasePagination  v-if="countProducts !== 0"
          :count="countProducts"
          v-model="page"
          :per-page="productsPerPage"
        ></BasePagination>
      </section>
    </div>
  </main>
</template>

<script>
import ProductList from "@/components/ProductList.vue";
import BasePagination from "@/components/BasePagination.vue";
import BasePreloader from "@/components/BasePreloader.vue";
import ProductFilter from "@/components/ProductFilter.vue";
import axios from "axios";
import { API_BASE_URL } from "@/config.js";
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  components: { ProductList, BasePagination, ProductFilter, BasePreloader },
  setup() {

    const productsData = ref(null);

    const products = computed(() => {
      return productsData.value
        ? productsData.value.items.map((product) => {
            return {
              ...product,
            };
          })
        : [];
    });
    const countProducts = computed(() => {
      return productsData.value ? productsData.value.pagination.total : 0;
    });

    const page = ref(1);
    const productsPerPage = ref(6);
    const filterPriceFrom = ref(0);
    const filterPriceTo = ref(0);
    const filterCategoryId = ref(0);
    const filterColorId = ref([]);
    const filterMaterialId = ref([]);
    const filterCollectionId = ref([]);
    
    const productsLoading = ref(false);
    const productsLoadingFailed = ref(false);

    const loadProducts = () => {
      productsLoading.value = true;
      productsLoadingFailed.value = false;

      let loadProductsTimer;
      clearTimeout(loadProductsTimer);
      loadProductsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products`, {
            params: {
              page: page.value,
              limit: productsPerPage.value,
              categoryId: filterCategoryId.value,
              minPrice: filterPriceFrom.value,
              maxPrice: filterPriceTo.value,
              colorIds: filterColorId.value,
              materialIds: filterMaterialId.value,
              seasonIds: filterCollectionId.value,
            },
          })
          .then((response) => {productsData.value = response.data})
          .catch(() => (productsLoadingFailed.value = true))
          .then(() => (productsLoading.value = false));
      }, 100);
    };

    watch(
        productsPerPage,
      () => {
        page.value = 1;
        loadProducts();
      }
    );
    watch(
      [
        page,
        filterCategoryId,
        filterPriceFrom,
        filterPriceTo,
        filterColorId,
        filterMaterialId,
        filterCollectionId,
      ],
      () => {
        loadProducts();
      }
    );


    loadProducts();

    return {
      filterPriceFrom,
      filterPriceTo,
      filterCategoryId,
      filterColorId,
      filterMaterialId,
      filterCollectionId,
      page,
      productsPerPage,
      productsData,
      productsLoading,
      productsLoadingFailed,
      products,
      countProducts,
      loadProducts,
    };
  },
});
</script>