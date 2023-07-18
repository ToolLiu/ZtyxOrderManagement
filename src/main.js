import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';

Vue.config.productionTip = false;

Vue.prototype.$base_url = 'https://www.crr11.cn/api';
// Vue.prototype.$base_url = '139.224.134.138:8121';
// Vue.prototype.$base_url = 'http://localhost:8121';

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
