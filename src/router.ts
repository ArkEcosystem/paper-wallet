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
    ],
});
