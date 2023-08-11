<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{backgroundColor: item.product.colors[0].color.code}"></i>
        {{  item.product.colors[0].color.title }}
      </span>
    </p>
    <!-- <p class="product__info product__info--color">
      Размер:
      <span>
        <i :style="{backgroundColor: item.product.colors[0].color.code}"></i>
        {{  item.product.colors[0].color.title }}
      </span>
    </p> -->
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <BasePlusMinus :amount.sync="amount" class="product__counter" />

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} ₽
    </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct(item.productId)"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import BasePlusMinus from "@/components/BasePlusMinus";
import numberFormat from "@/helpers/numberFormat";
import { mapMutations } from "vuex";

export default {
  props: ["item"],
  components: { BasePlusMinus },
  filters: {
    numberFormat,
  },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.commit("updateCartProductAmount", {
          productId: this.item.productId,
          amount: value,
        });
      },
    },
  },
  methods: {
    ...mapMutations({ deleteProduct: "deleteCartProduct" }),

    // deleteProduct(productId) {
    //   this.$store.commit('deleteCartProduct', productId)
    // }
  },
};
</script>