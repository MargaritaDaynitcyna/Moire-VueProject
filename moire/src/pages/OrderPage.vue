<template>
    <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText title="ФИО" :error="formError.name" placeholder="Введите ваше полное имя" v-model="formData.name"/>
            <BaseFormText title="Адрес доставки" :error="formError.address" placeholder="Введите ваш адрес" v-model="formData.address"/>
            <BaseFormText title="Телефон" :error="formError.phone" type="tel" placeholder="Введите ваш телефон" v-model="formData.phone"/>
            <BaseFormText title="Email" :error="formError.email" type="email" placeholder="Введи ваш Email" v-model="formData.email"/>
            <BaseFormTextarea title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания" v-model="formData.comment"/>

            <!-- <BaseFormField title="ФИО" :error="formError.name">
                <input class="form__input" v-model="formData.name" type="text" name="name" placeholder="Введите ваше полное имя">
            </BaseFormField> -->
            <!-- <BaseFormField title="Адрес доставки" :error="formError.address">
                <input class="form__input" v-model="formData.address" type="text" name="address" placeholder="Введите ваш адрес">
            </BaseFormField>
            <BaseFormField title="Телефон" :error="formError.phone">
                <input class="form__input" v-model="formData.phone" type="tel" name="phone" placeholder="Введите ваш телефон">
            </BaseFormField>
            <BaseFormField title="Email" :error="formError.email">
                <input class="form__input" v-model="formData.email" type="email" name="email" placeholder="Введи ваш Email">
            </BaseFormField>
            <BaseFormField title="ФИО" :error="formError.comments">
                <textarea class="form__input form__input--area" v-model="formData.comments" name="comments" placeholder="Ваши пожелания"></textarea>
            </BaseFormField> -->


          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <!-- <span class="form__error" v-if="formError.deliveryTypeId">{{ formError.deliveryTypeId }}</span> -->
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery of deliveries" :key="delivery.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery.id" v-model="formData.deliveryTypeId">
                  <span class="options__value">
                    {{ delivery.title }}: <b>{{ delivery.price | numberFormat }} ₽</b>
                  </span>
                </label>
              </li>
              <!-- <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="0" checked="">
                  <span class="options__value">
                    Курьером <b>290 ₽</b>
                  </span>
                </label>
              </li> -->
            </ul>

            <h3 class="cart__title">Оплата</h3>
            {{ formData.paymentTypeId }}
            <ul class="cart__options options">
              <li class="options__item" v-for="payment of payments" :key="payment.id">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="payment.id" v-model="formData.paymentTypeId">
                  <span class="options__value">
                   {{ payment.title }}
                  </span>
                </label>
              </li>
              <!-- <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" value="cash">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li> -->
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in products" :key="product.id">
              <h3>{{ product.product.title }}</h3>
              <b>{{ product.product.price | numberFormat }} ₽</b>
              <span>Артикул: {{ product.product.id }}</span>
            </li>
            <!-- <li class="cart__order">
              <h3>Гироскутер Razor Hovertrax 2.0ii</h3>
              <b>1 990 ₽</b>
              <span>Артикул: 150030</span>
            </li>
            <li class="cart__order">
              <h3>Электрический дрифт-карт Razor Lil’ Crazy</h3>
              <b>4 090 ₽</b>
              <span>Артикул: 150030</span>
            </li> -->
          </ul>
          
          <div class="cart__total">
            <p>Доставка: <b>бесплатно</b></p>
            <p>Итого: <b>3</b> товара на сумму <b>4 070 ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
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
// import BaseFormField from '@/components/BaseFormField.vue'
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';

import numberFormat from "@/helpers/numberFormat";
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';
// import { mapActions } from 'vuex';

export default {
    data() {
        return {
            formData: {
              // deliveryTypeId: 1,
              // paymentTypeId:1,
            },
            formError: {},
            formErrorMessage: '',
            deliveriesData: null,
            paymentsData: null,
        }
    },
    components: { BaseFormText, BaseFormTextarea },
    filters: {
      numberFormat
    },
    computed: {
      deliveries() {
        return this.deliveriesData;
      },
      payments() {
        return this.paymentsData;
      },
      products() {
         return this.$store.state.cartProductsData
      }
    },
    methods: {
      loadDeliveries() {
        clearTimeout(this.loadDeliveriesTimer);
        this.loadDeliveriesTimer = setTimeout(()=> {
          axios
          .get(API_BASE_URL+`/api/deliveries`)
          .then(response => {
            this.deliveriesData = response.data;
            // this.loadPayments();
            })
          // .catch(()=> this.productLoadingFailed = true)
          // .then(()=> this.productLoading = false)
        }, 100);
      },    
      loadPayments() {
        clearTimeout(this.loadPaymentsTimer);
        this.loadPaymentsTimer = setTimeout(()=> {
          axios
          // !!!!!!!!!!!!!!!!!
          .get(API_BASE_URL+`/api/payments`, {
            params: {
              deliveryTypeId: 1 || this.formData.deliveryTypeId
            }
          })
          .then(response => this.paymentsData = response.data)
          // .catch(()=> this.productLoadingFailed = true)
          // .then(()=> this.productLoading = false)
        }, 100);
      },   
      order() {
        this.formError = {};
        this.formErrorMessage = '',

         axios
          .post(API_BASE_URL+`/api/orders`, {
            ...this.formData
          }, {
            params: {
              userAccessKey: this.$store.state.userAccessKey
            }
          })
          .then(response => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({name: 'orderInfo', params: {id: response.data.id}});
          })
          .catch(error => {
            this.formError = error.response.data.error.request || {};
             this.formErrorMessage = error.response.data.error.message;
          })
      },
    },
  created() {
    this.loadDeliveries();
    this.loadPayments();
  },
    
}
</script>