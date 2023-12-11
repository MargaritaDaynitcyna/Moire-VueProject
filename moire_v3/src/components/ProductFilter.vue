<template>
  <aside class="filter">
    <button
      class="filter__btn"
      id="filterIcon"
      name="Фильтрация"
      @click.prevent="openFilters"
    >
      <img v-if="!filtersIsOpen"
        class="filter__icon"
        src="/img/svg/filter.svg"
        alt="Иконка фильтрации"
      />
      <img v-else
        class="filter__icon"
        src="/img/svg/close.svg"
        alt="Иконка закрытия"
      />
    </button>
    <form
      class="filter__form form"
      :class="{ 'filter_is-open': filtersIsOpen }"
      id="filterForm"
      action="#"
      method="get"
      @submit.prevent="submit"
    >
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="min-price"
            v-model.number="currentPriceFrom"
          />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input
            class="form__input"
            type="text"
            name="max-price"
            v-model.number="currentPriceTo"
          />
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select
            class="form__select"
            name="category"
            v-model.number="currentCategoryId"
          >
            <option value="0">Все категории</option>
            <option
              :value="category.id"
              v-for="category in categories"
              :key="category.id"
            >
              {{ category.title }}
            </option>
          </select>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="check-list colors colors--black">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                class="colors__check sr-only"
                type="checkbox"
                name="colors"
                :value="color.id"
                v-model="currentColorId"
              />
              <span
                class="colors__value"
                :style="{ backgroundColor: color.code }"
              >
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="material in materials"
            :key="material.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="material"
                :value="material.id"
                v-model="currentMaterialId"
              />
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list">
          <li
            class="check-list__item"
            v-for="collection in collections"
            :key="collection.id"
          >
            <label class="check-list__label">
              <input
                class="check-list__check sr-only"
                type="checkbox"
                name="collection"
                :value="collection.id"
                v-model="currentCollectionId"
              />
              <span class="check-list__desc">
                {{ collection.title }}
                <span>({{ collection.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <button
        class="filter__submit button button--primery"
        type="submit"
        :class="{ 'filter__submit--disabled': parameterNotSet }"
      >
        Применить
      </button>
      <button
        class="filter__reset button button--second"
        type="button"
        @click.prevent="reset"
        v-show="!parametersNotApply"
      >
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "@/config.js";

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColorId: [],
      currentMaterialId: [],
      currentCollectionId: [],

      categoriesData: [],
      colorsData: [],
      materialsData: [],
      collectionsData: [],

      filtersIsOpen: false,
    };
  },
  props: [
    "priceFrom",
    "priceTo",
    "categoryId",
    "colorId",
    "materialId",
    "collectionId",
    "page",
  ],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },
    collections() {
      return this.collectionsData ? this.collectionsData.items : [];
    },
    parameterNotSet() {
      return true
        ? this.currentPriceFrom === 0 &&
            this.currentPriceTo === 0 &&
            this.currentCategoryId === 0 &&
            this.currentColorId.length === 0 &&
            this.currentMaterialId.length === 0 &&
            this.currentCollectionId.length === 0
        : false;
    },
    parametersNotApply() {
      return true
        ? this.priceFrom === 0 &&
            this.priceTo === 0 &&
            this.categoryId === 0 &&
            this.colorId.length === 0 &&
            this.materialId.length === 0 &&
            this.collectionId.length === 0
        : false;
    },
  },
  watch: {
    priceFrom(value) {
      this.currentPriceFrom = value;
    },
    priceTo(value) {
      this.currentPriceTo = value;
    },
    categoryId(value) {
      this.currentCategoryId = value;
    },
    colorId(value) {
      this.currentColorId = value;
    },
    materialId(value) {
      this.currentMaterialId = value;
    },
    collectionId(value) {
      this.currentCollectionId = value;
    },
  },
  methods: {
    submit() {
      this.$emit("update:priceFrom", this.currentPriceFrom);
      this.$emit("update:priceTo", this.currentPriceTo);
      this.$emit("update:categoryId", this.currentCategoryId);
      this.$emit("update:colorId", this.currentColorId);
      this.$emit("update:materialId", this.currentMaterialId);
      this.$emit("update:collectionId", this.currentCollectionId);
      this.$emit('update:page', 1);
      if (this.filtersIsOpen) {
        this.closeFilters();
      }
    },
    reset() {
      this.$emit("update:priceFrom", 0);
      this.$emit("update:priceTo", 0);
      this.$emit("update:categoryId", 0);
      this.$emit("update:colorId", []);
      this.$emit("update:materialId", []);
      this.$emit("update:collectionId", []);
      if (this.filtersIsOpen) {
        this.closeFilters();
      }
    },
    loadCategories() {
      axios
        .get(API_BASE_URL + "/api/productCategories")
        .then((response) => (this.categoriesData = response.data));
    },
    loadColors() {
      axios
        .get(API_BASE_URL + "/api/colors")
        .then((response) => (this.colorsData = response.data));
    },
    loadMaterials() {
      axios
        .get(API_BASE_URL + "/api/materials")
        .then((response) => (this.materialsData = response.data));
    },
    loadCollections() {
      axios
        .get(API_BASE_URL + "/api/seasons")
        .then((response) => (this.collectionsData = response.data));
    },
    openFilters() {
      if (!this.filtersIsOpen) {
        this.filtersIsOpen = true;
      } else {
        this.closeFilters();
      }
    },
    closeFilters() {
      this.filtersIsOpen = false;
    },
  },
  created() {
    this.loadCategories();
    this.loadColors();
    this.loadMaterials();
    this.loadCollections();
  },
};
</script>