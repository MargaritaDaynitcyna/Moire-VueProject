import { createStore } from 'vuex';
import axios from 'axios';
import { API_BASE_URL } from '@/config.js';

export default createStore({
    state() {
        return {
            cartProducts: [],
            userAccessKey: null,
            cartProductsData: [],
            orderInfo: null,
        }
    },
    mutations: {
        updateOrderInfo(state, orderInfo) {
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
                return {
                    ...item,
                    product: state.cartProductsData.find(p => p.product.id === item.productId).product,
                    image: item.color.gallery[0].file.url,
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
            return axios.post(API_BASE_URL + '/api/baskets/products', {
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
                })
        },
        deleteCartProduct(context, {
            basketItemId
        }) {
            context.commit('deleteCartProduct', basketItemId);
            axios.delete(API_BASE_URL + '/api/baskets/products', {

                    data: {
                        basketItemId
                    },
                    params: {
                        userAccessKey: context.state.userAccessKey,
                    }
                })
                .then(response => {
                    context.commit('updateCartProductsData', response.data.items)
                    context.commit('syncCartProducts')
                })
        },
        updateCartProductAmount(context, {
            basketItemId,
            amount
        }) {
            context.commit('updateCartProductAmount', {
                basketItemId,
                amount
            });
            if (amount < 1) {
                return;
            }
            return axios.put(API_BASE_URL + '/api/baskets/products', {
                    basketItemId,
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