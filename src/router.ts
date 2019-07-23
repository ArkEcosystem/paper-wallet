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
            path: "/wallet-from-entropy",
            name: "wallet-from-entropy",
            component: () => import(/* webpackChunkName: "wallet-from-entropy" */ "./views/WalletFromEntropy.vue"),
        },
        {
            path: "/wallet-from-passphrase",
            name: "wallet-from-passphrase",
            component: () =>
                import(/* webpackChunkName: "wallet-from-passphrase" */ "./views/WalletFromPassphrase.vue"),
        },
        {
            path: "/wallet/:wallet",
            name: "wallet",
            component: () => import(/* webpackChunkName: "wallet" */ "./views/Wallet.vue"),
        },
    ],
});
