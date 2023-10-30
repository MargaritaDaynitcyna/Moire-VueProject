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
                <b>{{ (product.price * product.quantity)}} ₽</b>
                <span>Артикул: {{ product.product.id }}</span>
              </li>
            </ul>

            <div class="cart__total">
              <p>
                Доставка:
                <b> {{ orderInfo.deliveryType.price}} ₽</b>
              </p>
              <p>
                Итого: <b> {{ orderInfo.basket.items.length }}</b> товара на
                сумму
                <b class="nowrap"> {{ orderInfo.totalPrice}} ₽</b>
              </p>
            </div>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<script>
// import { mapActions } from "vuex";
import numberFormat from "@/helpers/numberFormat";
import BasePreloader from "@/components/BasePreloader";

export default {
  // ...mapActions(["loadOrderInfo"]),
  filters: {
    numberFormat,
  },
  components: { BasePreloader },
  computed: {
    orderInfo() {
      // console.log(this.$store.state.orderInfo.basket.items)

      return this.$store.state.orderInfo;
    },
  },
  created() {
    if (
      this.$store.state.orderInfo &&
      this.$store.state.orderInfo.id === this.$route.params.id
    ) {
      return;
    }
    this.$store.dispatch("loadOrderInfo", this.$route.params.id);
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.$store.dispatch("loadOrderInfo", this.$route.params.id);
      },
      imediate: true
    },
  },
};
</script>