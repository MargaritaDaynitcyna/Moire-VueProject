<template>
  <main class="content container">
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
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="product.image"
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
                  <li class="colors__item">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        value="blue"
                        checked=""
                      />
                      <span
                        class="colors__value"
                        style="background-color: #73b6ea"
                      >
                      </span>
                    </label>
                  </li>
                  <li class="colors__item">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        value="yellow"
                      />
                      <span
                        class="colors__value"
                        style="background-color: #ffbe15"
                      >
                      </span>
                    </label>
                  </li>
                  <li class="colors__item">
                    <label class="colors__label">
                      <input
                        class="colors__radio sr-only"
                        type="radio"
                        name="color-item"
                        value="gray" />
                      <span
                        class="colors__value"
                        style="background-color: #939393"
                      >
                      </span
                    ></label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label
                  class="form__label form__label--small form__label--select"
                >
                  <select class="form__select" type="text" name="category">
                    <option value="value1">37-39</option>
                    <option value="value2">40-42</option>
                    <option value="value3">42-50</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <button class="item__button button button--primery" type="submit">
              В корзину
            </button>
          </form>
        </div>
      </div>

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
import products from "@/data/products";
import categories from "@/data/categories";
// import gotoPage from "@/helpers/gotoPage";
import BasePlusMinus from "@/components/BasePlusMinus";
import numberFormat from "@/helpers/numberFormat";

export default {
  data() {
    return {
      productAmount: 1,
      //? заменить на вычисляемое свойство 5.1
      state: "info",
    };
  },
  // props: ['pageParams'], = .$route.params.
  components: { BasePlusMinus },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      return products.find((product) => product.id === +this.$route.params.id);
    },

    category() {
      return categories.find(
        (category) => category.id === this.product.categoryId
      );
    },
  },
  methods: {
    // gotoPage,
    addToCart() {
      this.$store.commit("addProductToCart", {
        productId: this.product.id,
        amount: this.productAmount,
      });
    },
  },
};
</script>