<template>
  <div class="product__preloader" v-if="fetchStatus.isLoading">
    <BasePreloader></BasePreloader>
  </div>
  <div v-else-if="!productData" class="content container">
    Что-то пошло не так...
    <button
      @click.prevent="doLoadProduct()"
      class="filter__reset button button--second"
    >
      ПЕРЕЗАГРУЗИТЬ
    </button>
  </div>

  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            {{ category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <span class="breadcrumbs__link">
            {{ product.title }}
          </span>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="srcImage" :alt="product.title" />
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="doAddToCart"
          >
            <div class="item__row item__row--center">
              <BasePlusMinus v-model="productAmount" />

              <b class="item__price"> {{ productPricePretty }} ₽ </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>

                <ul class="colors colors--black">
                  <li
                    class="colors__item"
                    v-for="color in product.colors"
                    :key="color.id"
                  >
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        :value="color.id"
                        v-model="productColor"
                      />
                      <span
                        class="colors__value"
                        :style="{ backgroundColor: color.color.code }"
                      >
                      </span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label
                  class="form__label form__label--small form__label--select"
                >
                  <select
                    class="form__select"
                    name="category"
                    v-model="productSize"
                  >
                    <option
                      v-for="size in product.sizes"
                      :key="size.id"
                      :value="size.id"
                    >
                      {{ size.title }}
                    </option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button
              class="item__button button button--primery"
              type="submit"
              :disabled="isProductAddSending"
            >
              <transition name="fade" mode="out-in">
                <span v-if="isProductAddSending">добавляем..</span>
                <span v-else>В корзину</span>
              </transition>
            </button>

            <transition name="fade" mode="out-in">
              <div class="added-message" v-if="isProductAdded">Товар добавлен в корзину</div>
            </transition>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a
              class="tabs__link"
              :class="{ tabs__link_current: state === 'info' }"
              @click.prevent="state = 'info'"
            >
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a
              class="tabs__link"
              :class="{ tabs__link_current: state === 'delivery' }"
              @click.prevent="state = 'delivery'"
            >
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content" v-if="state === 'info'">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br />
            30% полиэстер<br />
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br />
            Гладить при макс. 110ºC<br />
            Не использовать машинную сушку<br />
            Отбеливать запрещено<br />
            Не подвергать химчистке<br />
          </p>
        </div>
        <div class="item__content" v-else-if="state === 'delivery'">
          <h3>Доставка:</h3>

          <p>
            1. Курьерская доставка по Москве и Московской области – 290 ₽<br />
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете
            посмотреть здесь<br />
          </p>

          <h3>Возврат:</h3>

          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине
            БЕСПЛАТНО.<br />
            Вы можете вернуть товары в любой магазин. Магазин должен быть
            расположен в стране, в которой Вы осуществили покупку. БЕСПЛАТНЫЙ
            возврат в Пункт выдачи заказов.<br />
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи
            заказов, позвоните по телефону 8 800 600 90 09<br />
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import BasePlusMinus from "@/components/BasePlusMinus.vue";
import BasePreloader from "@/components/BasePreloader.vue";
import numberFormat from "@/helpers/numberFormat";
import axios from "axios";
import { API_BASE_URL } from "@/config.js";
import { defineComponent, ref, computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: { BasePlusMinus, BasePreloader },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const productAmount = ref(1);
    const productSize = ref(0);
    const productColor = ref(0);
    const state = ref("info");
    const productData = ref(null);

    const product = computed(() => {
      return productData.value;
    });
    const productPricePretty = computed(() => {
      return numberFormat(product.value.price);
    });
    const category = computed(() => {
      return productData.value.category;
    });
    const productColorId = computed(() => {
      return product.value.colors.find(
        (color) => color.id === productColor.value
      ).color.id;
    });
    const srcImage = computed(() => {
      return product.value.colors.find(
        (color) => color.id === productColor.value
      ).gallery
        ? product.value.colors.find((color) => color.id === productColor.value)
            .gallery[0].file.url
        : "";
    });

    const isProductAdded = ref(false);
    const isProductAddSending = ref(false);
    const doAddToCart = () => {
      isProductAdded.value = false;
      isProductAddSending.value = true;
      $store
        .dispatch("addProductToCart", {
          productId: product.value.id,
          colorId: productColorId.value,
          sizeId: productSize.value,
          quantity: productAmount.value,
        })
        .then(() => {
          isProductAdded.value = true;
          isProductAddSending.value = false;
        });
    };

    const fetchStatus = reactive({
      isLoading: false,
      isFailed: false,
    });
    const doLoadProduct = () => {
      fetchStatus.isLoading = true;
      fetchStatus.isFailed = false;
      let loadProductTimer;
      clearTimeout(loadProductTimer);
      loadProductTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/products/${+$route.params.id}`)
          .then((response) => {
            productData.value = response.data;
            productSize.value = response.data.sizes[0].id;
            productColor.value = response.data.colors[0].id;
          })
          .catch(() => (fetchStatus.isFailed = true))
          .then(() => (fetchStatus.isLoading = false));
      }, 100);
    };

    // watch(() => $route.fullPath, ()=> {
    //   doLoadProduct();
    // }, {immediate: true });
    doLoadProduct();
    // onBeforeRouteUpdate(()=>{
    //   doLoadProduct();
    // });

    return {
      productAmount,
      productSize,
      productColor,
      state,
      productData,
      fetchStatus,
      isProductAdded,
      isProductAddSending,
      product,
      productPricePretty,
      category,
      productColorId,
      srcImage,
      doAddToCart,
      doLoadProduct,
    };
  },
});

</script>