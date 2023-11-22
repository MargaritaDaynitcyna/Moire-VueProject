<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.image"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{ item.product.title }}
    </h3>
    <div class="product__info">
      <p class="product__info--color">
        Цвет:
        <span>
          <i :style="{ backgroundColor: item.color.color.code }"></i>
          {{ item.color.color.title }}
        </span>
      </p>
      <p class="product__info--size">
        Размер:
        <span>
          {{ item.size.title }}
        </span>
      </p>
    </div>
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <BasePlusMinus v-model="amount" class="product__counter" />

    <b class="product__price"> {{ totalPricePretty }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="isShowDeletedMessage = true"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>

    <BaseModal v-model="isShowDeletedMessage">
      <div class="teleport-modal__title">Удалить товар из корзины?</div>
      <div class="teleport-modal__buttons">
        <button
          class="button button--second"
          @click.prevent="isShowDeletedMessage = false"
        >
          нет
        </button>
        <button
          class="button button--primery"
          @click.prevent="deleteProduct(item.basketItemId)"
        >
          да
        </button>
      </div>
    </BaseModal>
  </li>
</template>

<script>
import BasePlusMinus from "@/components/BasePlusMinus.vue";
import BaseModal from "@/components/BaseModal.vue";
import numberFormat from "@/helpers/numberFormat.js";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isShowDeletedMessage: false,
    };
  },
  props: ["item"],
  components: { BasePlusMinus, BaseModal },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch("updateCartProductAmount", {
          basketItemId: this.item.basketItemId,
          amount: value,
        });
      },
    },
    totalPricePretty() {
      return numberFormat(this.item.amount * this.item.product.price);
    },
  },
  methods: {
    ...mapActions(["deleteCartProduct"]),

    deleteProduct(basketItemId) {
      this.isShowDeletedMessage = true;
      this.deleteCartProduct({
        basketItemId: basketItemId,
      });
    },
  },
};
</script>