<template>
  <div>
    <HeaderComponent/>
    <!-- <component :is="currentPageComponent" :page-params="currentPageParams"/> -->
    <router-view/>
    <FooterComponent/>

    <div id="teleport-target"></div>
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

  import HeaderComponent from '@/components/HeaderComponent.vue'
  import FooterComponent from '@/components/FooterComponent.vue'
  import { mapActions, mapMutations} from 'vuex';
  

  export default {
    components: {HeaderComponent, FooterComponent},

    created() {
      const userAccessKey = localStorage.getItem('userAccessKey');
      if(userAccessKey) {
        this.updateUserAccessKey(userAccessKey); 
      }
      this.loadCart();
    },
    methods: {
      ...mapActions(['loadCart']),
      ...mapMutations(['updateUserAccessKey'])
    }
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
