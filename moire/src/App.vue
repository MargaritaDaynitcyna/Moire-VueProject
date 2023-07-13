<template>
  <div>
    <Header/>
    <!-- <component :is="currentPageComponent" :page-params="currentPageParams"/> -->
    <router-view/>
    <Footer/>
  </div>
</template>

<script>
  // import MainPage from './pages/MainPage.vue';
  // import ProductPage from './pages/ProductPage.vue';
  // import NotFoundPage from './pages/NotFoundPage.vue';
  // import eventBus from './eventBus'

  // const routes = {
  //   main: 'MainPage',
  //   product: 'ProductPage',

  // }

  import Header from '@/components/Header'
  import Footer from '@/components/Footer'

  export default {
    components: {Header, Footer}
  //   data() {
  //     return {
  //       currentPage: 'main',
  //       currentPageParams: {}
  //     }
  //   },
  //   methods: {
  //     goToPage(pageName, pageParams) {
  //       this.currentPage = pageName;
  //       this.currentPageParams = pageParams || {};
  //     }
  //   },
  //   computed: {
  //     currentPageComponent() {
  //       return routes[this.currentPage] || 'NotFoundPage';
  //     }
  //   },
  //   components: {MainPage, ProductPage, NotFoundPage},
  //   created() {
  //     eventBus.$on('gotoPage', (pageName, pageParams)=>this.goToPage(pageName, pageParams))
  //   },
  };
</script>
