import Vue from "vue";
import Vuex from "vuex";
// import products from '@/data/products';
import axios from 'axios';
import {
    API_BASE_URL
} from '@/config.js';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        cartProducts: [],
        userAccessKey: null,
        cartProductsData: [],
    },
    mutations: {
        // addProductToCart(state, {productId, amount}) {
        //     const item = state.cartProducts.find(item => item.productId === productId);
        //     if (item) {
        //         item.amount += amount;
        //     } else {
        //         state.cartProducts.push({
        //             productId,
        //             amount,
        //         });
        //     }            
        // },
        updateCartProductAmount(state, {
            productId,
            amount
        }) {
            const item = state.cartProducts.find(item => item.productId === productId);
            if (item) {
                item.amount = amount;
            }
        },
        deleteCartProduct(state, productId) {
            state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)

        },
        updateUserAccessKey(state, accessKey) {
            state.userAccessKey = accessKey;
        },
        updateCartProductsData(state, items) {
            state.cartProductsData = items;
        },
        syncCartProducts(state) {
            state.cartProducts = state.cartProductsData.map(item => {
                return {
                    productId: item.product.id,
                    amount: item.quantity,
                }
            })
        }

    },
    getters: {
        cartDetailProducts(state) {
            return state.cartProducts.map(item => {
                const product = state.cartProductsData.find(p => p.product.id === item.productId).product
                return {
                    ...item,
                    product: {
                        ...product,
                        image: product.colors[0].gallery[0].file.url,
                    }
                    // product: products.find(product=>product.id===item.productId)
                }
            })

        },
        cartTotalPrice(state, getters) {
            return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
        }
    },
    actions: {
        loadCart(context) {
            return axios
                .get(API_BASE_URL + '/api/baskets', {
                    params: {
                        userAccessKey: context.state.userAccessKey
                    }
                })
                .then(response => {
                    if (!context.state.userAccessKey) {
                        localStorage.setItem('userAccessKey', response.data.user.accessKey)
                        context.commit('updateUserAccessKey', response.data.user.accessKey)
                    }
                    context.commit('updateCartProductsData', response.data.items)
                    context.commit('syncCartProducts')

                })
        },
        addProductToCart(context, {
            productId,
            color,
            size,
            amount
        }) {
            // promise ?
            return axios.post(API_BASE_URL + '/api/baskets/products', {
                    productId: productId,
                    colorId: color,
                    sizeId: size,
                    quantity: amount,
                }, {
                    params: {
                        userAccessKey: context.state.userAccessKey
                    }
                })
                .then(response => {
                        context.commit('updateCartProductsData', response.data.items)
                        context.commit('syncCartProducts')
                    }

                )

        },
        updateCartProductAmount(context, {basketItemId,amount}) {
            context.commit('updateCartProductAmount', {basketItemId,amount});
            if(amount<1) {
                return;
            }
            return axios.put(API_BASE_URL + '/api/baskets/products', {    
                    basketItemId: basketItemId,
                    quantity: amount,
                }, {
                    params: {
                        userAccessKey: context.state.userAccessKey
                    }
                })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items)
                })
                .catch(() => {
                    context.commit('syncCartProducts')
                })
        }
    },

});