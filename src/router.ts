import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "home",
            component: Home,
        },
        // Wallet...
        {
            path: "/entropy",
            name: "entropy",
            component: () => import(/* webpackChunkName: "entropy" */ "./views/WalletFromEntropy.vue"),
        },
        {
            path: "/passphrase",
            name: "passphrase",
            component: () => import(/* webpackChunkName: "passphrase" */ "./views/WalletFromPassphrase.vue"),
        },
        {
            path: "/wallet",
            name: "wallet",
            component: () => import(/* webpackChunkName: "wallet" */ "./views/Wallet.vue"),
        },
        // Message...
        {
            path: "/message/sign",
            name: "message:sign",
            component: () => import(/* webpackChunkName: "message:sign" */ "./views/MessageSign.vue"),
        },
        {
            path: "/message/verify",
            name: "message:verify",
            component: () => import(/* webpackChunkName: "message:verify" */ "./views/MessageVerify.vue"),
        },
        {
            path: "/message",
            name: "message",
            component: () => import(/* webpackChunkName: "message" */ "./views/Message.vue"),
        },
    ],
});
