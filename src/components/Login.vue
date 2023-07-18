<template>
  <div class="login">
    <h2>管理员登录</h2>
    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="adm_id">管理员账号:</label>
        <input
          type="text"
          id="adm_id"
          v-model="adm_id"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label for="adm_psw">管理员密码:</label>
        <input
          type="password"
          id="adm_psw"
          v-model="adm_psw"
          required
          class="form-control"
        />
      </div>
      <div class="form-group">
        <button type="submit" class="submit-btn">Login</button>
      </div>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserLogin",
  data() {
    return {
      adm_id: "",
      adm_psw: "",
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${this.$base_url}/user/login`, {
          adm_id: this.adm_id,
          adm_psw: this.adm_psw,
        });
        if (response.data.success) {
          this.$emit("login-success", { adm_id: this.adm_id });
          // 将用户信息存储到localStorage中
          localStorage.setItem("loggedIn", "true");
          // localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem("user", JSON.stringify({ adm_id: this.adm_id }));

          // 跳转到App.vue界面的默认页面
          let destinationRoute = "WelcomePage"; // 默认跳转页面
          this.$router.push({ name: destinationRoute });
        } else {
          this.error = "用户名或密码错误。";
        }
      } catch (error) {
        this.error = "An error occurred while logging in.";
      }
    },
  },
};
</script>

<style>
.login {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-family: "Arial", sans-serif;
}

h2 {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: #333;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-size: 16px;
  color: #333;
}

.form-control {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 16px;
  outline: none;
}

.form-control:focus {
  border-color: #007bff;
}

.submit-btn {
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 20px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
  