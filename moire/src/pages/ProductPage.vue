<template>
  <div v-if="productLoading">loading...</div>
  <div v-else-if="!productData"> ERROR...</div>

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
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper" v-for="color in product.colors" :key="color.id">
          <img
            width="570"
            height="570"
            :src="color.gallery[0].file.url"
            :alt="product.title"
          />
        </div>
        <!-- <ul class="pics__list">
          <li class="pics__item">
            <a href="" class="pics__link pics__link--current">
              <img width="98" height="98" src="img/product-square-2.jpg" srcset="img/product-square-2@2x.jpg 2x" alt="Название товара">
            </a>
          </li>
          <li class="pics__item">
            <a href="" class="pics__link">
              <img width="98" height="98" src="img/product-square-3.jpg" srcset="img/product-square-3@2x.jpg 2x" alt="Название товара">
            </a>
          </li>
        </ul> -->
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
            @submit.prevent="addToCart"
          >
            <div class="item__row item__row--center">
              <!-- <div class="form__counter">
                <button type="button" aria-label="Убрать один товар">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount">

                <button type="button" aria-label="Добавить один товар">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div> -->
              <BasePlusMinus :amount.sync="productAmount" />

              <b class="item__price"> {{ product.price | numberFormat }} ₽ </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="color in product.colors" :key="color.color.id">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        :value="color.color.id"                        
                        v-model="productColor"
                      />
                      <!-- checked="" -->
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
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category" v-model="productSize">
                    <option v-for="size in product.sizes" :key="size.id" :value="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit" :disabled="productAddSending">
              В корзину
            </button>
          </form>
        </div>
      </div>

      <div v-show="productAdded">product add to cart</div>
      <div v-show="productAddSending">addind...</div>


      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <!-- tabs__link--current ??? -->
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
// import products from "@/data/products";
// import categories from "@/data/categories";
// import gotoPage from "@/helpers/gotoPage";
import BasePlusMinus from "@/components/BasePlusMinus";
import numberFormat from "@/helpers/numberFormat";
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
import { mapActions } from 'vuex';

export default {
  data() {
    return {
      productAmount: 1,
      productSize: 0,
      // productColor: 0,
      //? заменить на вычисляемое свойство 5.1
      state: "info",
      productData: null,
      productLoading: false,
      productLoadingFailed: false,

      productAdded:false,
      productAddSending:false,
    };
  },
  // props: ['pageParams'], = .$route.params.
  components: { BasePlusMinus },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      // return products.find((product) => product.id === +this.$route.params.id);
      return this.productData;
    },

    category() {
      // return categories.find(
      //   (category) => category.id === this.product.categoryId
      // );
      return this.productData.category;
    },
    // productColor: {
    //   get() {
    //     return this.product.colors[0].color.id;
    //   },
    //   set(value) {
    //     this.$store.commit("addProductToCart", {
    //       color: value,
    //     });
    //   },
    // }
  },
  methods: {
    // gotoPage,
    ...mapActions(['addProductToCart']),

    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({
        productId: this.product.id,
        color: this.productColor,
        size: this.productSize,
        amount: this.productAmount,
      })
      .then(()=>{
        this.productAdded = true;
        this.productAddSending = false;
      });
      // this.$store.commit("addProductToCart", {
      //   productId: this.product.id,
      //   amount: this.productAmount,
      //   size: this.productSize,
      //   color: this.productColor,
      // });
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;

      clearTimeout(this.loadProductTimer);
      this.loadProductTimer = setTimeout(()=> {
        axios
        .get(API_BASE_URL+`/api/products/${+this.$route.params.id}`)
        .then(response => this.productData = response.data)
        .catch(()=> this.productLoadingFailed = true)
        .then(()=> this.productLoading = false)
      }, 100);
    },    
  },
  created() {
    this.loadProduct()
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },
      imediate: true
    }
  }
};
</script>