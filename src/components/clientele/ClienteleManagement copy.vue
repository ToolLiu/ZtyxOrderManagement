<template>
  <div class="main-container">
    <div class="header">
      <h1 class="title-h1">派单管理</h1>
      <h3 class="title-h3">已完成检索，共{{ orders.length }}条数据</h3>
    </div>
    <table>
      <thead v-if="!loading">
        <tr>
          <th class="name">姓名</th>
          <th class="license-plate">车牌号</th>
          <th class="tel">电话号</th>
          <th class="destination">目的地</th>
          <th class="cost">运费</th>
          <th class="coal_var">煤种</th>
          <th class="coal_bill_number">提煤单号</th>
          <th class="order_time">下单时间</th>
          <th class="weighing_list">磅单</th>
          <th class="freight_rate_list">运费单</th>
          <th class="weight">矿净</th>
          <th class="weight">皮重</th>
          <th class="weight">毛重</th>
          <th class="weight">净重</th>
          <th class="weight">亏吨</th>
          <th class="operate">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.u_name }}</td>
          <td>{{ order.u_license_plate }}</td>
          <td>{{ order.tel_num }}</td>
          <td>{{ order.destination }}</td>
          <td>{{ order.cost }}</td>
          <td>{{ order.coal_var }}</td>
          <td>{{ order.coal_bill_number }}</td>
          <td>{{ formatDate(order.order_time) }}</td>
          <td>
            <div class="image-container">
              <img
                :src="getImageUrl(order.weighing_list)"
                alt=""
                @click="showImageDialog(getImageUrl(order.weighing_list))"
              />
            </div>
          </td>
          <td>
            <div class="image-container">
              <img
                :src="getImageUrl(order.freight_rate_list)"
                alt=""
                @click="showImageDialog(getImageUrl(order.freight_rate_list))"
              />
            </div>
          </td>
          <td>{{ order.weight_kj }}</td>
          <td>{{ order.weight_pz }}</td>
          <td>{{ order.weight_mz }}</td>
          <td>{{ order.weight_jz }}</td>
          <td>{{ order.weight_kd }}</td>
          <td>操作</td>
        </tr>
      </tbody>
    </table>

    <div class="loading" v-if="loading">正在从数据库提取数据，请稍候...</div>

    <div class="image-dialog" v-if="imageDialog.show">
      <div class="image-dialog-content">
        <button class="close-btn" @click="imageDialog.show = false">X</button>
        <img :src="imageDialog.imageUrl" alt="" />
      </div>
    </div>
    <ClienteleSelect
      :destination="this.destination"
      v-on:update-orders="onUpdateOrders"
    ></ClienteleSelect>
  </div>
</template>
  
  <script>
import axios from "axios";
import ClienteleSelect from "./ClienteleSelect.vue";

export default {
  name: "OrderManagement",
  components: {
    ClienteleSelect,
  },
  data() {
    return {
      destination: localStorage.getItem("destination") || "",
      orders: [],
      imageDialog: {
        show: false,
        imageUrl: "",
      },
      loading: true, // 添加 loading 状态
      showAddCoalBillNum: false,
      selectedCoalOrderId: null,
    };
  },
  props: {
    url: {
      type: String,
    },
    port: {
      type: String,
    },
  },

  methods: {
    loadOrders() {
      axios
        .post(`${this.$base_url}/coal/selectByDes`, {
          destination: this.destination,
        })
        .then((response) => {
          this.orders = response.data;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },

    getImageUrl(imagePath) {
      if (!imagePath) {
        return null;
      }
      // 根据路径生成完整的URL
      const serverRoot = "https://www.crr11.cn/public/";
      // console.log(serverRoot+imagePath);
      return serverRoot + imagePath;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    showImageDialog(imageUrl) {
      // console.log(imageUrl);
      this.imageDialog.imageUrl = imageUrl;
      this.imageDialog.show = true;
    },
    onUpdateOrders(orders) {
      this.orders = orders; // 将传递的订单列表赋值给 orders 数据
    },
    openAddCoalBillNum(coalOrderId) {
      this.selectedCoalOrderId = coalOrderId;
      this.showAddCoalBillNum = true;
    },
    coalBillNumCancel() {
      this.showAddCoalBillNum = false;
    },
  },
  watch: {
    "$route.params.destination": {
      immediate: true,
      handler(newDestination) {
        this.destination = newDestination; // 更新 destination 属性
        this.loadOrders(); // 调用 loadOrders() 方法获取数据
      },
    },
  },
  created() {
    // this.loadOrders()
  },

  mounted() {},
};
</script>
  
<style scoped>
.main-container {
  display: block;
  overflow-x: auto; /* 添加水平滚动条 */
  max-width: 100%;
}
.title-h1 {
  position: absolute;
}
.title-h3 {
  position: absolute;
  top: 100px;
}
table {
  margin-top: 150px;
  border-collapse: collapse;
  width: max-content; /* 设置宽度为最大内容宽度 */
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #f2f2f2;
}
.name,
.cost {
  width: 60px;
}
.license-plate {
  width: 100px;
}
.tel,
.destination,
.coal_var {
  width: 80px;
}
.order_time {
  width: 105px;
  text-align: center;
}
.image-container {
  display: flex;
  width: 140px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.coal_bill_number {
  width: 120px;
}
img {
  height: 120px;
  margin-right: 10px;
}
.weighing_list,
.freight_rate_list {
  width: 150px;
}
.image-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.image-dialog-content {
  background-color: white;
  padding: 20px;
  border-radius: 4px;
  max-width: 100%;
  max-height: 100%;
  overflow: auto;
  position: relative;
}

.image-dialog img {
  width: auto; /* 修改此处 */
  height: 900px; /* 修改此处 */
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.weight {
  width: 80px;
}
</style>
  