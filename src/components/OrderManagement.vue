<template>
  <div>
    <h1>订单管理</h1>
    <h3>已完成检索，共{{ orders.length }}条数据</h3>
    <button @click="exportToExcel">导出excel</button>
    <table id="coal_table">
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
          <th class="list_operate">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <input
              class="u-name-input"
              type="text"
              v-model="order.u_name"
              @change="updateUserName(order, $event)"
            />
          </td>
          <td>
            <input
              class="u-license-plate-input"
              type="text"
              v-model="order.u_license_plate"
              @change="updateLicensePlate(order, $event)"
            />
          </td>
          <td>{{ order.tel_num }}</td>
          <td>{{ order.destination }}</td>
          <td>{{ order.cost }}</td>
          <td>{{ order.coal_var }}</td>
          <td>
            <input
              class="coal-bill-number-input"
              type="text"
              v-model="order.coal_bill_number"
              @change="updateCoalBillNubber(order, $event)"
            />
          </td>
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
          <td>
            <button @click="delThisCoalOrder(order.coal_order_id)">
              删除记录
            </button>
          </td>
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
    <CoalSelect v-on:update-orders="onUpdateOrders"></CoalSelect>
  </div>
</template>

<script>
import axios from "axios";
import CoalSelect from "./CoalSelect.vue";
import { saveAs } from "file-saver";
import XLSX from "xlsx";

export default {
  name: "OrderManagement",
  components: {
    CoalSelect,
  },
  data() {
    return {
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
        .get(`${this.$base_url}/coal/getCoalOrders`)
        .then((response) => {
          this.orders = response.data;
          // console.log('Weighing list:', this.orders[0].weighing_list);
          this.loading = false; // 数据加载完成，设置 loading 状态为 false
        })
        .catch((error) => {
          console.error(error);
          this.loading = false; // 数据加载完成，设置 loading 状态为 false
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
    updateCoalBillNubber(order, event) {
      let inputValue = "ELTE230" + event.target.value; // 获取输入的值
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      axios
        .post(`${this.$base_url}/coal/addCoalBillNum`, {
          coal_bill_number: inputValue,
          coal_order_id: coal_order_id,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
      this.showAddCoalBillNum = false;
    },
    updateUserName(order, event) {
      let inputValue = event.target.value; // 获取输入的值
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      axios
        .post(`${this.$base_url}/coal/updateUserName`, {
          u_name: inputValue,
          coal_order_id: coal_order_id,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    updateLicensePlate(order, event) {
      let inputValue = event.target.value; // 获取输入的值
      let coal_order_id = order.coal_order_id; //  获取coal_oeder_id
      axios
        .post(`${this.$base_url}/coal/updateLicensePlate`, {
          u_license_plate: inputValue,
          coal_order_id: coal_order_id,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    delThisCoalOrder(coalOrderId) {
      if (confirm("是否确认删除？")) {
        axios
          .post(`${this.$base_url}/coal/delByCoalOrderId`, {
            coal_order_id: coalOrderId,
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        // 用户点击了取消，不执行操作
      }
    },
    exportToExcel() {
      let table = document.getElementById("coal_table");
      let wb = XLSX.utils.table_to_book(table);
      let data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // 将表格转为 JSON 数组

      // 删除 '操作' 列
      data.forEach((row) => {
        delete row["操作"];
      });

      // 修改 '磅单' 列 和 '运费单' 列
      this.orders.forEach((order, index) => {
        if (data[index]) {
          data[index]["磅单"] = "www.crr11.cn/public/" + order.weighing_list;
          data[index]["运费单"] =
            "www.crr11.cn/public/" + order.freight_rate_list;
          data[index]["姓名"] = order.u_name;
          data[index]["车牌号"] = order.u_license_plate;
          data[index]["提煤单号"] = order.coal_bill_number;
          data[index]["下单时间"] = this.formatDate(order.order_time);
        }
      });

      // 重新将 JSON 数组转为表格
      let newWs = XLSX.utils.json_to_sheet(data);
      let newWb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(newWb, newWs, "Sheet1");

      let wbout = XLSX.write(newWb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          "orders.xlsx"
        );
      } catch (e) {
        if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    },
  },
  mounted() {
    this.loadOrders();
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
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
  width: 80px;
}
.license-plate {
  width: 100px;
}
.tel,
.destination,
.coal_var {
  width: 120px;
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
.list_operate {
  width: 120px;
}
.coal_bill_number {
  width: 130px;
}
img {
  height: 120px;
  margin-right: 10px;
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
.coal-bill-number-input {
  text-align: center;
  height: 30px;
  width: 120px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid rgb(87, 87, 87); /* 只添加底部边框 */
}
.u-name-input {
  text-align: center;
  height: 30px;
  width: 70px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid rgb(87, 87, 87); /* 只添加底部边框 */
}
.u-license-plate-input {
  text-align: center;
  height: 30px;
  width: 90px;
  font-size: 16px;
  border: none;
  border-bottom: 2px solid rgb(87, 87, 87); /* 只添加底部边框 */
}
</style>
