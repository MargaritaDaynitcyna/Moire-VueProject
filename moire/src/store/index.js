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
            basketItemId,
            amount
        }) {
            const item = state.cartProducts.find(item => item.basketItemId === basketItemId);
            if (item) {
                item.amount = amount;
            }
        },
        // deleteCartProduct(state, productId) {
        //     state.cartProducts = state.cartProducts.filter(item => item.productId !== productId)
        // },
        deleteCartProduct(state, basketItemId) {
            state.cartProducts = state.cartProducts.filter(item => item.basketItemId !== basketItemId)
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
                    basketItemId: item.id,
                    size: item.size,
                    color: item.color,
                }
            })
        }

    },
    getters: {
        cartDetailProducts(state) {
            return state.cartProducts.map(item => {
                // const product = state.cartProductsData.find(p => p.product.id === item.productId).product;
                // const image = state.cartProductsData.find(p => p.product.id === item.productId).color.gallery[0].file.url;
                // const color = state.cartProductsData.find(p => p.product.id === item.productId).color.color;
                // const size = state.cartProductsData.find(p => p.product.id === item.productId).size;
                // const idInCart = state.cartProductsData.find(p => p.product.id === item.productId).id;
                // const basketItemId = item.basketItemId.toString();


                // переписать короче с двоеточием 
                return {
                    ...item,
                    product: state.cartProductsData.find(p => p.product.id === item.productId).product,
                    image: item.color.gallery[0].file.url,
                    // color,
                    // size,
                    // idInCart,
                    // basketItemId,
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
            colorId,
            sizeId,
            quantity
        }) {
            // promise ?
            return axios.post(API_BASE_URL + '/api/baskets/products', {
                // убрать повторение
                    productId: productId,
                    colorId: colorId,
                    sizeId: sizeId,
                    quantity: quantity,
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
        deleteCartProduct(context, basketItemId) {
            console.log(basketItemId)
            console.log(context.state.userAccessKey)

            context.commit('deleteCartProduct', basketItemId);
            axios.delete(API_BASE_URL + '/api/baskets/products', {
                
                data: {basketItemId: basketItemId.basketItemId},
                params: {
                    userAccessKey: context.state.userAccessKey,
                }
            })
            .then(response => {
                context.commit('updateCartProductsData', response.data.items)
                context.commit('syncCartProducts')
            })
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