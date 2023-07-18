<template>
  <div>
    <div class="select-by-license-plate">
      <input
        class="input-license-plate"
        type="text"
        v-model="selectedLicensePlate"
        @keyup.enter="selectByLicensePlate"
      />
      <button @click="selectByLicensePlate">查找车牌号</button>
    </div>
    <div class="select-by-data_coal_var">
      <span>开始日期:</span>
      <input
        class="data-input"
        type="date"
        v-model="data_begin"
        placeholder="选择日期"
      />
      <span>截至日期:</span>
      <input
        class="data-input"
        type="date"
        v-model="data_end"
        placeholder="选择日期"
      />
      <span>煤种:</span>
      <input
        class="data-input"
        type="input"
        v-model="selectedCoalVar"
        placeholder="请输入煤种"
      />
      <button @click="selectByDataCoalvar">时间煤种搜索</button>
    </div>
  </div>
</template>
  
<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      selectedLicensePlate: "",
      selectedCoalVar: "",
      data_begin: "",
      data_end: "",
    };
  },
  props: {
    destination: String,
  },
  watch: {
    selected(newVal) {
      console.log("选中的值已经改变：", newVal);
    },
  },
  methods: {
    selectByLicensePlate() {
      axios
        .get(`${this.$base_url}/coal/clienteleSelectByLicensePlate`, {
          params: {
            destination: this.destination,
            u_license_plate: this.selectedLicensePlate,
          },
        })
        .then((response) => {
          //   console.log(response.data[0]);
          this.$emit("update-orders", response.data[0]); // 调用父组件的update-orders
        })
        .catch((error) => {
          console.error(error);
          this.$message.error("查询数据时发生错误，请稍后再试。");
        });
    },
    selectByDataCoalvar() {
      axios
        .post(`${this.$base_url}/coal/clienteleSelectByDataCoalvar`, {
          destination: this.destination,
          begin_time: this.data_begin,
          end_time: this.data_end,
          coal_var: this.selectedCoalVar,
        })
        .then((response) => {
          if (Object.prototype.hasOwnProperty.call(response.data, "message")) {
            Swal.fire({
              icon: "info",
              title: response.data.message,
              showConfirmButton: false,
              timer: 2000,
            });
          } else {
            this.$emit("update-orders", response.data[0]); // 调用父组件的update-orders
          }
        })
        .catch((error) => {
          console.error(error);
          this.$message.error("查询数据时发生错误，请稍后再试。");
        });
    },
  },
  created() {
    // console.log(this.destination);
  },
  mounted() {},
};
</script>
  
  <style scoped>
.select-by-license-plate {
  position: absolute;
  top: 50px;
  left: 500px;
}
.select-by-data_coal_var {
  position: absolute;
  top: 50px;
  left: 760px;
}
.input-license-plate {
  height: 30px;
  width: 120px;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 15px;
}
button {
  margin-left: 10px;
  height: 30px;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 15px;
  background-color: #4caeaf;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.1s ease;
}
button:active {
  background-color: #2d7779;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
}
.data-input {
  margin-left: 5px;
  height: 30px;
  width: 100px;
  background-color: #f8f8f8;
  border: 2px solid #202020;
  border-radius: 5px;
  color: #1a1a1a;
}
</style>