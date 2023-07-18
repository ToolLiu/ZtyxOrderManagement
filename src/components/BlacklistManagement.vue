<template>
  <div class="container">
    <h1 class="text-center my-3">黑名单管理</h1>
    <button class="btn btn-primary my-2" @click="openInBlacklist">添加黑名单</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>编号</th>
          <th>车牌号</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in blacklist" :key="item.blacklist_id">
          <td>{{ item.blacklist_id }}</td>
          <td>{{ item.u_license_plate }}</td>
          <td>
            <button class="btn btn-danger" @click="removeFromBlacklist(item.blacklist_id)">移出黑名单</button>
          </td>
        </tr>
      </tbody>
    </table>
    <InBlacklist @submit="addInBlacklist" @cancel="handleCancel" v-if="showInBlacklist"></InBlacklist>
  </div>
</template>

<script>
import axios from "axios";
import InBlacklist from './InBlacklist.vue'

export default {
  name: "BlacklistManagement",
  components:{
    InBlacklist
  },
  data() {
    return {
      blacklist: [],
      showInBlacklist:false
    };
  },
  methods: {
    loadOrders() {
      axios
        .get(`${this.$base_url}/user/getBlacklist`)
        .then((response) => {
          this.blacklist = response.data;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    addInBlacklist(value){
        axios
        .post(`${this.$base_url}/user/inBlacklist`, {
          u_license_plate: value,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
        this.showInBlacklist = false
    },
    openInBlacklist(){
      this.showInBlacklist = true
    },
    handleCancel(){
      this.showInBlacklist = false
    },
    removeFromBlacklist(blacklist_id){
      let value = Number(blacklist_id)
      if (confirm("是否将该用户移出黑名单？")) {
        axios
        .post(`${this.$base_url}/user/outBlacklist`, {
          blacklist_id: value,
        })
        .then(() => {
          this.loadOrders();
        })
        .catch((error) => {
          console.error(error);
        });
        this.showInBlacklist = false
      }
    }
  },
  mounted() {
    this.loadOrders();
  },
};
</script>

<style scoped>
.container {
  max-width: 2800px;
  margin: auto;
  background-color: #fafafa;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.1);
}

h1 {
  color: #333;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.button:hover {
  background-color: #45a049;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.table th,
.table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: center;
  background-color: #4caf50;
  color: white;
}

.table td {
  text-align: center;
}
</style>
