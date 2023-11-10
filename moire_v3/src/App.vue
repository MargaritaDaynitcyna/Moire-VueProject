<template>
  <div>
    <HeaderComponent />
    <router-view />
    <FooterComponent />

    <div id="teleport-target"></div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import { mapActions, mapMutations } from "vuex";

export default {
  components: { HeaderComponent, FooterComponent },

  created() {
    const userAccessKey = localStorage.getItem("userAccessKey");
    if (userAccessKey) {
      this.updateUserAccessKey(userAccessKey);
    }
    this.loadCart();
  },
  methods: {
    ...mapActions(["loadCart"]),
    ...mapMutations(["updateUserAccessKey"]),
  },
};
</script>
