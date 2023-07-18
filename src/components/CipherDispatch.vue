<template>
  <div class="container">
    <h1>添加特殊派单信息</h1>
    <div class="form-container">
      <form @submit.prevent="addCoalMsg">
        <div class="form-group">
          <label for="destination">目的地:</label>
          <input type="text" id="destination" v-model="form.destination" required />
        </div>
        <div class="form-group">
          <label for="quantity">数量:</label>
          <input type="number" id="quantity" v-model="form.requirement" required />
        </div>
        <div class="form-group">
          <label for="shippingFee">运费:</label>
          <input type="number" id="shippingFee" v-model="form.cost" required />
        </div>
        <div class="form-group">
          <label for="coalType">煤种:</label>
          <input type="text" id="coalType" v-model="form.coal_var" required />
        </div>
        <div class="form-group">
          <label for="coalType">验证信息:</label>
          <input type="text" id="cipher" v-model="form.cipher"/>
        </div>
        <button type="submit" class="submit-btn">添加到派单表</button>
      </form>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      form: {
        destination: '',
        quantity: '',
        coalType: '',
        cost: ''
      }
    };
  },
  methods: {
    async addCoalMsg() {
      const response = await fetch(`${this.$base_url}/coal/addCipherCoalMsg`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.form)
      });

      if (response.ok) {
        await Swal.fire({
          icon: 'success',
          title: '添加成功',
          showConfirmButton: false,
          timer: 2000
        });
        this.form = {
          destination: '',
          quantity: '',
          coalType: '',
          shippingFee: ''
        };
        const result = await response.json();
        console.log(result);
        // 这里可以进行后续操作，如显示提示信息或清除表单数据
      } else {
        console.error('提交数据失败');
      }
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* 使容器高度占据整个视口 */
}

.form-container {
  display: flex;
  justify-content: center;
}

form {
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-radius: 5px;
  background-color: #f2f2f2;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

h1 {
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
}

input {
  width: 300px;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  outline: none;
  background-color: #fff;
  box-shadow: inset 0 0 0 1px #ccc;
  transition: box-shadow 0.3s;
}

input:focus {
  box-shadow: inset 0 0 0 1px #007bff;
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

</style>
