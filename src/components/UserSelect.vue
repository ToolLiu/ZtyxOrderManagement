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
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        
      };
    },
    watch: {
      
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
  </style>