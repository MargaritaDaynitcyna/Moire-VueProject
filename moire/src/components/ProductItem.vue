<template>
<div>
      <router-link class="catalog__pic" :to="{name: 'product', params: {id: product.id}}">
        <img :src="product.image" :alt="product.title" />
        <!-- <img :src="product.colors[0].gallery[0].file.url" :alt="product.title" /> -->
      </router-link>

      <h3 class="catalog__title">
        <a href="#">
          {{ product.title }}
        </a>
      </h3>

      <span class="catalog__price">
        {{ product.price | numberFormat }}  ₽
      </span>

      <ul class="colors colors--black">
        <li class="colors__item" v-for="color in product.colors" :key="color.id">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" :value="color.code" v-model="colorItem"/>
            <span class="colors__value" :style="{ backgroundColor: color.color.code }">
            </span>
          </label>
        </li>
        <!-- <li class="colors__item">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" value="#8BE000" v-model="color"/>
            <span class="colors__value" style="background-color: #8be000">
            </span>
          </label>
        </li>
        <li class="colors__item">
          <label class="colors__label">
            <input class="colors__radio sr-only" type="radio" value="#222" v-model="color"/>
            <span class="colors__value" style="background-color: #222"> </span>
          </label>
        </li> -->
      </ul>
    </div>
</template>

<script>
import gotoPage from '@/helpers/gotoPage';
import numberFormat from '@/helpers/numberFormat';


export default {
  data() {
    return {
      colorItem: this.product.colors[0].color.code,
    };
  },
  filters: {
    numberFormat
  },
  methods: {
    gotoPage
  },
    props: ['product'],
};
</script>