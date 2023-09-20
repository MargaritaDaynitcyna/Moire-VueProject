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
        orderInfo: null,
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
        updateOrderInfo(state,orderInfo) {
            state.orderInfo = orderInfo;
        },
        resetCart(state) {
            state.cartProducts = [];
            state.cartProductsData = [];
        },
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
                const product = state.cartProductsData.find(p => p.product.id === item.productId).product;
                const image = state.cartProductsData.find(p => p.product.id === item.productId).color.gallery[0].file.url;
                const color = state.cartProductsData.find(p => p.product.id === item.productId).color.color;
                const size = state.cartProductsData.find(p => p.product.id === item.productId).size;
                const idInCart = state.cartProductsData.find(p => p.product.id === item.productId).id;



                return {
                    ...item,
                    product,
                    image,
                    color,
                    size,
                    idInCart,
                    // product: {
                    //     ...product,
                        // image: product.colors[0].gallery[0].file.url,
                    // }
                    // product: products.find(product=>product.id===item.productId)
                }
            })

        },
        cartTotalPrice(state, getters) {
            return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
        }
    },
    actions: {
        loadOrderInfo(context, orderId) {
            return axios
            .get(API_BASE_URL + '/api/orders/' + orderId, {
                params: {
                    userAccessKey: context.state.userAccessKey
                }
            })
            .then(response => {
                context.commit('updateOrderInfo', response.data)
            })
        },
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
                        userAccessKey: context.state.userAccessKey,
                    }
                })
                .then(response => {
                        context.commit('updateCartProductsData', response.data.items)
                        context.commit('syncCartProducts')
                    }

                )

        },
        deleteCartProduct(context, productId) {
            console.log(productId)
            console.log(`${productId.productId}`)
            console.log(context.state.userAccessKey)

            // context.commit('deleteCartProduct', {basketItemId});
            axios.delete(API_BASE_URL + '/api/baskets/products?userAccessKey=8d1b16cf761f63adfed87ba40c5ba528', {
                // basketItemId: `${productId.productId}`,
                basketItemId: '19856',
            }, {
                // params: {
                //     userAccessKey: context.state.userAccessKey,
                // }
            })
        //     .then(response => {
        //         context.commit('updateCartProductsData', response.data.items)
        //         context.commit('syncCartProducts')
        //     }

        // )
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