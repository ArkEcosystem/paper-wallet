import "@/assets/css/tailwind.css";

import Vue from "vue";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

Vue.component(VueQrcode.name, VueQrcode);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount("#app");
