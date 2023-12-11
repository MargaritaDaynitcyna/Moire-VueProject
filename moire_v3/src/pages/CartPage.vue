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
          <span class="breadcrumbs__link"> Корзина </span>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Корзина</h1>
        <span class="content__info"> {{ products.length }} товара/ов </span>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem
              v-for="item in products"
              :key="item.basketItemId"
              :item="item"
            />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span class="nowrap">{{ totalPricePretty }} ₽</span>
          </p>

          <router-link v-slot="{ navigate }" :to="{ name: 'order' }" custom>
            <button
              class="cart__button button button--primery"
              type="button"
              v-show="!isCartIsEmpty"
              @click="navigate"
            >
              Оформить заказ
            </button>
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat.js";
import CartItem from "@/components/CartItem.vue";
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  components: { CartItem },
  setup() {
    const $store = useStore();

    const products = computed(() => {
      return $store.getters.cartDetailProducts;
    });

    const isCartIsEmpty = computed(() => {
      return products.value.length === 0 ? true : false;
    });

    const totalPricePretty = computed(() => {
      return numberFormat($store.getters.cartTotalPrice);
    });

    return {
      products,
      isCartIsEmpty,
      totalPricePretty,
    };
  },
});
</script>