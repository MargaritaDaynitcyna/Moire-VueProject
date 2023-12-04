<template>
  <main class="content container">
    <div class="product__preloader" v-if="!orderInfo">
      <BasePreloader></BasePreloader>
    </div>
    <div v-else>
      <div class="content__top">
        <ul class="breadcrumbs">
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
              Каталог
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
              Корзина
            </router-link>
          </li>
          <li class="breadcrumbs__item">
            <span class="breadcrumbs__link"> Оформление заказа </span>
          </li>
        </ul>

        <h1 class="content__title">
          Заказ оформлен <span class="nowrap">№ {{ orderInfo.id }}</span>
        </h1>
      </div>

      <section class="cart">
        <form class="cart__form form" action="#" method="POST">
          <div class="cart__field">
            <p class="cart__message">
              Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту
              придет письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся
              с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
            </p>

            <ul class="dictionary">
              <li class="dictionary__item">
                <span class="dictionary__key"> Получатель </span>
                <span class="dictionary__value">
                  {{ orderInfo.name }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key"> Адрес доставки </span>
                <span class="dictionary__value">
                  {{ orderInfo.address }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key"> Телефон </span>
                <span class="dictionary__value">
                  {{ orderInfo.phone }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key"> Email </span>
                <span class="dictionary__value">
                  {{ orderInfo.email }}
                </span>
              </li>
              <li class="dictionary__item">
                <span class="dictionary__key"> Способ оплаты </span>
                <span class="dictionary__value">
                  {{ orderInfo.paymentType }}
                </span>
              </li>
            </ul>
          </div>

          <div class="cart__block">
            <ul class="cart__orders">
              <li
                class="cart__order"
                v-for="product in orderInfo.basket.items"
                :key="product.id"
              >
                <h3>{{ product.product.title }}</h3>
                <b>{{ productPricePretty(product) }} ₽</b>
                <span>Артикул: {{ product.product.id }}</span>
              </li>
            </ul>

            <div class="cart__total">
              <p>
                Доставка:
                <b> {{ deliveryPricePretty }} ₽</b>
              </p>
              <p>
                Итого: <b> {{ orderInfo.basket.items.length }}</b> товара/ов на
                сумму
                <b class="nowrap"> {{ totalPricePretty }} ₽</b>
              </p>
            </div>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat.js";
import BasePreloader from "@/components/BasePreloader.vue";
import { defineComponent, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: { BasePreloader },
  setup() {
    const $route = useRoute();
    const $store = useStore();

    const orderInfo = computed(() => {
      return $store.state.orderInfo;
    });
    const deliveryPricePretty = computed(() => {
      return numberFormat(orderInfo.value.deliveryType.price);
    });
    const totalPricePretty = computed(() => {
      return numberFormat(orderInfo.value.totalPrice);
    });
    const productPricePretty = (product) => {
      return numberFormat(product.price * product.quantity);
    };

    if (
      $store.state.orderInfo &&
      $store.state.orderInfo.id === $route.params.id
    ) {
      return;
    };
    $store.dispatch("loadOrderInfo", $route.params.id);

    return {
      orderInfo,
      deliveryPricePretty,
      totalPricePretty,
      productPricePretty,
    }
  },
});
</script>