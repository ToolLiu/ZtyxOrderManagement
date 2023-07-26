<template>
  <div id="app">
    <div v-if="!loggedIn">
      <login @login-success="setUser"></login>
    </div>
    <div class="adm" v-else>
      <div id="nav">
        <div v-if="loggedIn && user.adm_id" class="user-info">
          您好，{{ user.adm_id }}
        </div>
        <router-link
          v-if="
            (user && user.adm_id == 'ztrk01') ||
            user.adm_id == 'ztrk02' ||
            user.adm_id == 'SeniorAdmin'
          "
          to="/order-management"
        >用户订单管理
        </router-link>
        <router-link
          v-if="
            (user && user.adm_id == 'ztrk01') ||
            user.adm_id == 'ztrk02' ||
            user.adm_id == 'SeniorAdmin' ||
            user.adm_id == 'Ceshi'
          "
          to="/unusual-orders"
          >异常订单管理
        </router-link>
        <!-- ---------------------广田管理------------------------ -->
        <router-link
          v-if="user && user.adm_id === 'Guangtian'"
          :to="{ name: 'ClienteleManagement', params: { destination: '广田' } }"
        >广田管理
        </router-link>
        <!-- ---------------------鸿运管理------------------------ -->
        <router-link
          v-if="user && user.adm_id === 'Hongyun'"
          :to="{ name: 'ClienteleManagement', params: { destination: '鸿运' } }"
        >鸿运管理
        </router-link>
        <!-- ---------------------顺昌管理------------------------ -->
        <router-link
          v-if="user && user.adm_id === 'Shunchang'"
          :to="{ name: 'ClienteleManagement', params: { destination: '顺昌' } }"
        >顺昌管理
        </router-link>
        <!-- --------------------新华太管理----------------------- -->
        <router-link
          v-if="user && user.adm_id === 'Xinhuatai'"
          :to="{
            name: 'ClienteleManagement',
            params: { destination: '新华太' },
          }"
        >新华太管理
        </router-link>
        <!-- ---------------------富鼎管理------------------------ -->
        <router-link
          v-if="user && user.adm_id === 'Fuding'"
          :to="{
            name: 'ClienteleManagement',
            params: { destination: '富鼎' },
          }"
        >富鼎管理
        </router-link>
        <!-- ---------------------测试TEST------------------------ -->
        <router-link
          v-if="user && user.adm_id === 'Ceshi'"
          :to="{
            name: 'ClienteleManagement',
            params: { destination: '测试' },
          }"
        >测试管理账号
        </router-link>
        <!-- -------------------派单和派单管理--------------------- -->
        <router-link
          v-if="
            (user && user.adm_id == 'ztrk01') ||
            user.adm_id == 'ztrk02' ||
            user.adm_id == 'SeniorAdmin' ||
            user.adm_id == 'Ceshi'
          "
          to="/vehicle-dispatch"
          >派单
        </router-link>
        <router-link
          v-if="
            (user && user.adm_id == 'ztrk01') ||
            user.adm_id == 'ztrk02' ||
            user.adm_id == 'SeniorAdmin' ||
            user.adm_id == 'Ceshi'
          "
          to="/upload-QRCode"
        >派单管理
        </router-link>
        <router-link
          v-if="
            (user && user.adm_id == 'ztrk01') ||
            user.adm_id == 'ztrk02' ||
            user.adm_id == 'SeniorAdmin' ||
            user.adm_id == 'Ceshi'
          "
          to="/blacklist-management"
        >黑名单管理
        </router-link>
        <!-- -----------------以上为路由界面配置------------------- -->
        <button v-if="loggedIn" @click="logout" class="logout-btn">
          退出登录
        </button>
      </div>
      <div id="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "./components/Login.vue";

export default {
  name: "App",
  components: {
    Login,
  },
  data() {
    return {
      loggedIn: false,
      user: {},
      // base_url: 'https://crr11.cn/api'
    };
  },
  methods: {
    checkLoginStatus() {
      const loggedIn = localStorage.getItem("loggedIn");
      const user = JSON.parse(localStorage.getItem("user"));
      this.loggedIn = loggedIn === "true";
      this.user = user;
    },
    logout() {
      this.loggedIn = false;
      this.user = null;
      localStorage.removeItem("destination"); // 添加这一行来清除 localStorage 中的 destination
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("user");
      this.$router.push({ name: "Login" });
    },
    setUser(user) {
      this.loggedIn = true;
      this.user = user;

      // 在登录成功后将 destination 保存到 localStorage
      if (user.adm_id === "Guangtian") {
        localStorage.setItem("destination", "广田");
      } else if (user.adm_id === "Hongyun") {
        localStorage.setItem("destination", "鸿运");
      } else if (user.adm_id === "Shunchang") {
        localStorage.setItem("destination", "顺昌");
      } else if (user.adm_id === "Xinhuatai") {
        localStorage.setItem("destination", "新华太");
      } else if (user.adm_id === "Fuding") {
        localStorage.setItem("destination", "富鼎");
      } else if (user.adm_id === "Ceshi") {
        localStorage.setItem("destination", "测试");
      } else {
        localStorage.removeItem("destination");
      }
    },
  },
  created() {
    this.checkLoginStatus();
  },
};
</script>

<style scoped>
.adm {
  display: flex;
  height: 100vh;
}
#app {
  display: flex;
}

#nav {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #2c3e50;
  padding: 20px;
  width: 150px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

#nav > a {
  color: #fff;
  text-decoration: none;
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

#nav > a:hover {
  background-color: #34495e;
}

#nav > .router-link-exact-active {
  background-color: #34495e;
}

#content {
  margin-left: 200px;
  padding: 20px;
}
.logout-btn {
  background-color: #e74c3c;
  border: none;
  color: #fff;
  cursor: pointer;
  /* margin-top: auto; */
  padding: 10px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>
