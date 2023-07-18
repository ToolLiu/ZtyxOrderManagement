import Vue from "vue";
import VueRouter from "vue-router";

import WelcomePage from '@/components/WelcomePage.vue';
import Login from "@/components/Login.vue";
import OrderManagement from "@/components/OrderManagement.vue";
import VehicleDispatch from "@/components/VehicleDispatch.vue";
import CipherDispatch from "@/components/CipherDispatch.vue";
import ClienteleManagement from "@/components/clientele/ClienteleManagement.vue"
import UploadQRCode from "@/components/UploadQRCode.vue"
import UnusualOrders from '@/components/UnusualOrders.vue'
import BlacklistManagement from '@/components/BlacklistManagement.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/welcome-page',
    name: 'WelcomePage',
    component: WelcomePage,
  },
  {
    path: "/login", // 添加 Login 路由
    name: "Login",
    component: Login,
  },
  {
    path: "/order-management",
    name: "OrderManagement",
    component: OrderManagement,
    props: true
  },
  {
    path: "/vehicle-dispatch",
    name: "VehicleDispatch",
    component: VehicleDispatch,
    props: true
  },
  {
    path: "/upload-QRCode",
    name: "UploadQRCode",
    component: UploadQRCode,
    props: true
  },
  {
    path: "/clientele-management/:destination",
    name: "ClienteleManagement",
    component: ClienteleManagement,
    props: true
  },
  {
    path: "/unusual-orders",
    name: "UnusualOrders",
    component: UnusualOrders,
    props: true
  },
  {
    path: "/cipher-dispatch",
    name: "CipherDispatch",
    component: CipherDispatch,
    props: true
  },
  {
    path: "/blacklist-management",
    name: "BlacklistManagement",
    component: BlacklistManagement,
    props: true
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
