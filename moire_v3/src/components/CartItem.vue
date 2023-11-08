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
            <i :style="{backgroundColor: item.color.color.code}"></i>
            {{  item.color.color.title }}
          </span>
        </p>
        <p class="product__info--size">
          Размер: 
          <span>
            {{  item.size.title }}
          </span>
        </p>
    </div>
    <!-- <p class="product__info product__info--color">
      Размер:
      <span>
        <i :style="{backgroundColor: item.product.colors[0].color.code}"></i>
        {{  item.product.colors[0].color.title }}
      </span>
    </p> -->
    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <BasePlusMinus v-model="amount" class="product__counter" />

    <b class="product__price">
      {{ totalPricePretty }} ₽
    </b>

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

    <BaseModal :open="isShowDeletedMessage">
      Удалить товар из корзины?
      <button @click.prevent="deleteProduct(item.basketItemId)">yes</button>
      <button @click.prevent="isShowDeletedMessage = false">no</button>
    </BaseModal>
  </li>
</template>

<script>
import BasePlusMinus from "@/components/BasePlusMinus.vue";
import BaseModal from "@/components/BaseModal.vue";
  import numberFormat from "@/helpers/numberFormat.js";
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
     isShowDeletedMessage: false,
    }
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
          // productId: this.item.idInCart,
          amount: value,
        });
      },
    },
    totalPricePretty() {
      return numberFormat(this.item.amount * this.item.product.price)
    },
  },
  // methods: {
  //   ...mapMutations({ deleteProduct: "deleteCartProduct" }),

  //   deleteProduct(productId) {
  //     this.$store.commit('deleteCartProduct', productId)
  //   }

     methods: {
    // gotoPage,
    //   ...mapMutations({ deleteProduct: "deleteCartProduct" }),

    // deleteProduct(basketItemId) {
    //   this.$store.commit('deleteCartProduct', basketItemId)
    // }
      ...mapActions(['deleteCartProduct']),

      deleteProduct(basketItemId) {
        // console.log(this.item.idInCart)
        // this.productAdded = false;
        // this.productAddSending = true;
         this.isShowDeletedMessage = true;
        console.log(basketItemId);
        this.deleteCartProduct({
          basketItemId: basketItemId,
        })
        // .then(()=>{
        //   // this.productAdded = true;
        //   // this.productAddSending = false;
        // });
        // this.$store.commit("addProductToCart", {
        //   productId: this.product.id,
        //   amount: this.productAmount,
        //   size: this.productSize,
        //   color: this.productColor,
        // });
      },
    },
  // },
};
</script>