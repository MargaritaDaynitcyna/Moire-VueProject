<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="color in colors" :key="color.id">
      <label class="colors__label">
        <input
          class="colors__radio sr-only"
          type="radio"
          name="color-item"
          :value="color.id"
          v-model="currentCheck"
        />
        <span
          class="colors__value"
          :style="{ backgroundColor: color.color.code }"
        >
        </span>
      </label>
    </li>
  </ul>
</template>


<script>
export default {
    props: ["colors", "check"],
// model: {
//     prop: 'check',
//     event: 'change'
//   },
  computed: {
            currentCheck: {
              get() {
                return this.check;
              },
              set(value) {
                console.log(this.check)
                this.$emit('update:check', value);
              }
            }
  },
  //  watch: {
  //           check(value) {
  //               this.currentCheck = value;
  //           },
  //  },
//   data () {
//   return {
//       // hoverLocal: this.check
//       currentCheck: 0
//   }
// },
  // props: {
  //   checked: Boolean
  // },
 
  //   data() {
  // return {
  //   pr
  //   // colorItem: this.product.colors[0].color.code,
  //   // productSize: this.product.sizes[0].id,
  // };
  //   },
    // methods: {
    //   ch(check) {
    //     // this.$emit("update:pr", this.pr);
    //     // this.$emit('change', this.check)
    //     this.$emit('change', check)

    //   }
    // },
};
// 
</script>