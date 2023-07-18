<template>
  <div class="main-container">
    <div class="header">
      <h1>{{ this.destination }}派单管理</h1>
      <h3>已完成检索，共{{ orders.length }}条数据</h3>
    </div>
    <div class="table-container">
      <!-- 把表格放在一个单独的 div 中，我们将在这个 div 上添加滚动条 -->
      <table>
        <thead v-if="!loading">
          <tr>
            <th class="remark">备注</th>
            <th class="name">姓名</th>
            <th class="license-plate">车牌号</th>
            <th class="tel">电话号</th>
            <th class="cost">运费</th>
            <th class="coal_var">煤种</th>
            <th class="coal_bill_number">提煤单号</th>
            <th class="freight_time">收货时间</th>
            <th class="weighing_list">磅单</th>
            <th class="freight_rate_list">运费单</th>
            <th class="weight">矿净</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>
              <textarea
                class="remark-input"
                type="text/javascript"
                v-model="order.remark"
                @change="setRemark(order, $event)"
              />
            </td>
            <td>{{ order.u_name }}</td>
            <td>{{ order.u_license_plate }}</td>
            <td>{{ order.tel_num }}</td>
            <td>
              <input
                class="weight-input"
                type="number"
                v-model="order.cost"
                @change="clienteleSetCost(order, $event)"
                min="0"
                step="1"
              />
            </td>
            <td>{{ order.coal_var }}</td>
            <td>{{ order.coal_bill_number }}</td>
            <td>
              <button v-if="!order.freight_time" @click="setFreightTime(order)">
                已收货
              </button>
              <span v-else>{{ formatDate(order.freight_time) }}</span>
            </td>
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
            <td>
              <input
                class="weight-input"
                type="number"
                v-model="order.weight_kj"
                @change="updateWeight(order, 'weight_kj', $event)"
                min="0"
                step="0.01"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
    updateWeight(order, weightType, event) {
      let inputValue = event.target.value; // 获取输入的值
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      // 将输入的值转换为一个数字，然后保留两位小数
      let numberValue = parseFloat(inputValue).toFixed(2);
      // 为了确保在处理了异常输入（如非数字字符串）后还能得到一个数值，我们在 parseFloat 结果为 NaN 时赋予其默认值 0.00
      if (isNaN(numberValue)) {
        numberValue = parseFloat(0).toFixed(2);
      }
      axios
        .post(`${this.$base_url}/coal/clienteleSetWeight`, {
          coal_order_id: coal_order_id,
          value: numberValue,
          weightType: weightType,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
      // console.log(coal_order_id, weightType, numberValue);
    },
    clienteleSetCost(order, event) {
      let inputValue = parseInt(event.target.value); // 获取输入的值
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      axios
        .post(`${this.$base_url}/coal/clienteleSetCost`, {
          coal_order_id: coal_order_id,
          value: inputValue,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setFreightTime(order) {
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      let now = new Date();
      let year = now.getFullYear(); // 获取完整的年份
      let month = (now.getMonth() + 1).toString().padStart(2, "0"); //  获取月份，并将其补齐为两位数
      let date = now.getDate().toString().padStart(2, "0");
      let hours = now.getHours().toString().padStart(2, "0");
      let minutes = now.getMinutes().toString().padStart(2, "0");
      let seconds = now.getSeconds().toString().padStart(2, "0");
      let dateTime =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;
        axios
        .post(`${this.$base_url}/coal/clienteleSetFreightTime`, {
          coal_order_id: coal_order_id,
          freight_time: dateTime
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    setRemark(order,event){
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      let remark = event.target.value;
      axios
        .post(`${this.$base_url}/coal/clienteleSetRemark`, {
          coal_order_id: coal_order_id,
          remark: remark
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
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
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  flex: 0 0 auto; /* 添加这行 */
}
.table-container {
  overflow-x: auto;
  max-width: 100%;
}
table {
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
.tel .coal_var {
  width: 80px;
}
.freight_time {
  width: 105px;
  text-align: center;
}
.image-container {
  display: flex;
  width: 140px;
  flex-wrap: nowrap;
  overflow-x: auto;
}
.coal_bill_number,
.remark {
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
  width: 55px;
}
.weight-input {
  text-align: center;
  height: 30px;
  width: 50px;
  font-size: 18px;
  border: none;
  border-bottom: 2px solid rgb(87, 87, 87); /* 只添加底部边框 */
}
.remark-input {
  height: 85px;
  width: 100px;
  resize: none;
  font-size: 18px;
  overflow: hidden;
  border: none;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
  