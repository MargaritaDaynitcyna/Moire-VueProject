const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/moire-vue-app/'
})

// npm rm vue-template-compiler eslint-plugin-vue @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-plugin-router @vue/cli-plugin-vuex
// npm i vue@next vuex@next vue-router@next
// npm i -D @vue/compiler-sfc eslint-plugin-import eslint-plugin-node eslint-plugin-promise eslint-plugin-vue @vue/cli-service @vue/cli-plugin-babel @vue/cli-plugin-eslint eslint@6 babel-eslint
