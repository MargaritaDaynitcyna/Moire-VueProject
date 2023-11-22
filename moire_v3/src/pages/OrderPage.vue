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
          <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <span class="breadcrumbs__link"> Оформление заказа </span>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">Оформление заказа</h1>
      </div>
    </div>

    <section class="cart">
      <form
        class="cart__form form"
        action="#"
        method="POST"
        @submit.prevent="order"
      >
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText
              title="ФИО"
              :error="formError.name"
              placeholder="Введите ваше полное имя"
              v-model="formData.name"
            />
            <BaseFormText
              title="Адрес доставки"
              :error="formError.address"
              placeholder="Введите ваш адрес"
              v-model="formData.address"
            />
            <BaseFormText
              title="Телефон"
              :error="formError.phone"
              type="tel"
              placeholder="+7 XXX XXX XX XX"
              v-model="formData.phone"
            />
            <BaseFormText
              title="Email"
              :error="formError.email"
              type="email"
              placeholder="Введи ваш Email"
              v-model="formData.email"
            />
            <BaseFormTextarea
              title="Комментарий к заказу"
              :error="formError.comment"
              placeholder="Ваши пожелания"
              v-model="formData.comment"
            />
          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <div v-if="deliveryLoadingFailed">
                Что-то пошло не так...
                <button
                  @click.prevent="loadDeliveries()"
                  class="filter__reset button button--second"
                >
                  ПЕРЕЗАГРУЗИТЬ
                </button>
              </div>
              <div class="order__loading" v-if="deliveryLoading">
                <BasePreloader></BasePreloader>
              </div>
              <li
                v-else
                class="options__item"
                v-for="delivery of deliveries"
                :key="delivery.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    :value="delivery.id"
                    v-model="formData.deliveryTypeId"
                  />
                  <span class="options__value">
                    {{ delivery.title }}:
                    <b>{{ deliveriesPricePretty(delivery) }} ₽</b>
                  </span>
                </label>
              </li>
              <span class="form__error" v-if="formError.deliveryTypeId">{{
                formError.deliveryTypeId
              }}</span>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul v-if="deliverySelected" class="cart__options options">
              <div v-if="paymentLoadingFailed">
                Что-то пошло не так...
                <button
                  @click.prevent="loadPayments()"
                  class="filter__reset button button--second"
                >
                  ПЕРЕЗАГРУЗИТЬ
                </button>
              </div>
              <div class="order__loading" v-if="paymentLoading">
                <BasePreloader></BasePreloader>
              </div>
              <li
                v-else
                class="options__item"
                v-for="payment of payments"
                :key="payment.id"
              >
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    :value="payment.id"
                    v-model="formData.paymentTypeId"
                  />
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
              <span class="form__error" v-if="formError.paymentTypeId">{{
                formError.paymentTypeId
              }}</span>
            </ul>
            <p v-else>Способы оплаты появятся после выбора типа доставки</p>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li
              class="cart__order"
              v-for="product in products"
              :key="product.id"
            >
              <div>
                <h3>{{ product.product.title }}</h3>
                <p>
                  <span>{{ product.size.title }}</span
                  >,
                  <span :style="{ color: product.color.color.code }">{{
                    product.color.color.title
                  }}</span>
                </p>
              </div>
              <b>{{ productPricePretty(product) }} ₽</b>
              <span>Артикул: {{ product.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>
              Доставка:
              <b v-if="deliverySelected">{{ deliveryPricePretty }} ₽</b>
            </p>
            <p>
              Итого: <b>{{ products.length }}</b> товара на сумму
              <b class="nowrap">{{ totalPricePretty }} ₽</b>
            </p>
          </div>

          <!-- <router-link v-slot="{ navigate }" :to="{ name: 'main' }" custom> -->
          <button class="cart__button button button--primery" type="submit">
            <transition name="fade" mode="out-in">
              <span v-if="orderSending">оформляем..</span>
              <span v-else> Оформить заказ</span>
            </transition>
          </button>
          <!-- </router-link> -->
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from "@/components/BaseFormText.vue";
import BaseFormTextarea from "@/components/BaseFormTextarea.vue";
import BasePreloader from "@/components/BasePreloader.vue";
import numberFormat from "@/helpers/numberFormat.js";
import axios from "axios";
import { API_BASE_URL } from "@/config.js";
import { computed, defineComponent, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  components: { BaseFormText, BaseFormTextarea, BasePreloader },
  setup() {
    const $route = useRouter();
    const $store = useStore();
    const formData = ref({});
    const formError = ref({});
    const formErrorMessage = ref("");
    const deliveriesData = ref(null);
    const paymentsData = ref(null);

    const orderSending = ref(false);
    const orderSend = ref(false);

    const deliveryLoadingFailed = ref(false);
    const deliveryLoading = ref(false);

    const paymentLoadingFailed = ref(false);
    const paymentLoading = ref(false);

    const deliveries = computed(() => {
      return deliveriesData.value;
    });
    const deliveryPrice = computed(() => {
      return deliverySelected.value
        ? deliveries.value.find((del) => del.id === deliverySelected.value)
            .price
        : "";
    });
    const deliverySelected = computed(() => {
      return formData.value.deliveryTypeId;
    });
    const payments = computed(() => {
      return paymentsData.value;
    });
    const products = computed(() => {
      return $store.state.cartProductsData;
    });

    const deliveryPricePretty = computed(() => {
      return numberFormat(deliveryPrice.value);
    });
    const totalPricePretty = computed(() => {
      return numberFormat($store.getters.cartTotalPrice);
    });

    const productPricePretty = (product) => {
      return numberFormat(product.price * product.quantity);
    };
    const deliveriesPricePretty = (delivery) => {
      return numberFormat(delivery.price);
    };
    const loadDeliveries = () => {
      deliveryLoadingFailed.value = false;
      deliveryLoading.value = true;

      let loadDeliveriesTimer;
      clearTimeout(loadDeliveriesTimer);
      loadDeliveriesTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/deliveries`)
          .then((response) => {
            deliveriesData.value = response.data;
          })
          .catch(() => (deliveryLoadingFailed.value = true))
          .finally(() => (deliveryLoading.value = false));
      }, 100);
    };
    const loadPayments = () => {
      paymentLoadingFailed.value = false;
      paymentLoading.value = true;

      let loadPaymentsTimer;
      clearTimeout(loadPaymentsTimer);
      loadPaymentsTimer = setTimeout(() => {
        axios
          .get(API_BASE_URL + `/api/payments`, {
            params: {
              deliveryTypeId: formData.value.deliveryTypeId,
            },
          })
          .then((response) => (paymentsData.value = response.data))
          .catch(() => (paymentLoadingFailed.value = true))
          .finally(() => (paymentLoading.value = false));
      }, 100);
    };

    const order = () => {
      formError.value = {};
      formErrorMessage.value = "";
      orderSending.value = true;
      orderSend.value = false;

      axios
        .post(
          API_BASE_URL + `/api/orders`,
          {
            ...formData.value,
          },
          {
            params: {
              userAccessKey: $store.state.userAccessKey,
            },
          }
        )
        .then((response) => {
          $store.commit("resetCart");
          $store.commit("updateOrderInfo", response.data);
          $route.push({
            name: "orderInfo",
            params: { id: response.data.id },
          });
          orderSend.value = true;
        })
        .catch((error) => {
          formError.value = error.response.data.error.request || {};
          formErrorMessage.value = error.response.data.error.message;
        })
        .finally(() => {
          orderSending.value = false;
        });
    };

    // created() {
    loadDeliveries();
    // },
    watch(
      deliverySelected,
      () => {
        loadPayments();
      },
      { immediate: true }
    );
    return {
      formData,
      formError,
      formErrorMessage,
      deliveriesData,
      paymentsData,
      orderSending,
      orderSend,
      deliveryLoadingFailed,
      deliveryLoading,
      paymentLoadingFailed,
      paymentLoading,
      deliveries,
      deliveryPrice,
      deliverySelected,
      payments,
      products,
      deliveryPricePretty,
      totalPricePretty,
      productPricePretty,
      deliveriesPricePretty,
      loadDeliveries,
      loadPayments,
      order,
    };
  },
});
</script>