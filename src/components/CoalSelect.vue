<template>
  <div class="select-container">
    <div class="select-by-des">
      <select v-model="selectedDestination">
        <option disabled value="">--请选择--</option>
        <option
          v-for="(destination, index) in destinations"
          :key="index"
          :value="destination"
        >
          {{ destination }}
        </option>
      </select>
      <button @click="selectByDes">按目的地检索</button>
    </div>
    <div class="select-by-coal-var">
      <select v-model="selectedCoalVar">
        <option disabled value="">--请选择--</option>
        <option
          v-for="(coalVar, index) in coalVars"
          :key="index"
          :value="coalVar"
        >
          {{ coalVar }}
        </option>
      </select>
      <button @click="selectByCoalVar">按煤种检索</button>
    </div>
    <div class="select-by-license-plate">
      <input
        class="input-license-plate"
        type="text"
        v-model="selectedLicensePlate"
        @keyup.enter="selectByLicensePlate"
      />
      <button @click="selectByLicensePlate">查找车牌号</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      destinations: ["destination"],
      coalVars: ["coalvar"],
      selectedDestination: "",
      selectedCoalVar: "",
      selectedLicensePlate: "",
    };
  },
  watch: {
    selected(newVal) {
      console.log("选中的值已经改变：", newVal);
    },
  },
  methods: {
    selectByDes() {
      axios
        .post(`${this.$base_url}/coal/selectByDes`, {
          destination: this.selectedDestination,
        })
        .then((response) => {
          // console.log(response.data); // 打印从后端接收的数据
          this.$emit("update-orders", response.data); // 触发 update-orders 事件
        })
        .catch((error) => {
          console.error(error);
        });
    },
    selectByCoalVar() {
      axios
        .post(`${this.$base_url}/coal/selectByCoalVar`, {
          coal_variety: this.selectedCoalVar,
        })
        .then((response) => {
          // console.log(response.data); // 打印从后端接收的数据
          this.$emit("update-orders", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
    selectByLicensePlate() {
      axios
        .post(`${this.$base_url}/coal/selectByLicensePlate`, {
          u_license_plate: this.selectedLicensePlate,
        })
        .then((response) => {
          this.$emit("update-orders", response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
  mounted() {
    axios
      .get(`${this.$base_url}/coal/selectDestination`)
      .then((response) => {
        this.destinations = response.data;
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("前端获取（下拉框）目的地列表失败：", error);
      });
    axios
      .get(`${this.$base_url}/coal/selectCoalVar`)
      .then((response) => {
        this.coalVars = response.data;
        // console.log(response.data);
      })
      .catch((error) => {
        console.error("前端获取（下拉框）煤种列表失败：", error);
      });
  },
};
</script>

<style scoped>
.select-container{
  display: flex;
  width: 70%;
  justify-content: space-around;
}
.input-license-plate {
  height: 30px;
  width: 120px;
  border: 2px solid black;
  border-radius: 5px;
  font-size: 15px;
}
select {
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
</style>