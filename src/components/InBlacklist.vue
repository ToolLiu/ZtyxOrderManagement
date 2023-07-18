<template>
    <div class="dialog">
      <div class="dialog-content">
        <h2>输入车牌号</h2>
        <input v-model="inputValue" type="text" placeholder="请输入信息" class="input" required/>
        <div class="buttons">
          <button @click="submit" class="button submit">确定</button>
          <button @click="cancel" class="button cancel">取消</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: [''],
    data() {
      return {
        inputValue: '',
      };
    },
    methods: {
      submit() {
        this.$emit('submit', this.inputValue);
      },
      cancel() {
        this.$emit('cancel');
      },
    },
  };
  </script>
  
  <style scoped>
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog-content {
    background-color: #f9f9f9;
    padding: 30px;
    border-radius: 10px;
    width: 350px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  .input {
    width: 88%;
    padding: 10px 15px;
    font-size: 16px;
    color: #333;
    border: 1px solid #dcdcdc;
    border-radius: 5px;
    margin-bottom: 20px;
    outline: none;
    transition: border-color 0.3s;
  }
  
  .input:focus {
    border-color: #86b7fe;
  }
  
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
  
  .button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    outline: none;
  }
  
  .submit {
    background-color: #4c87af;
    color: white;
    margin-right: 50px;
    transition: background-color 0.3s;
  }
  
  .submit:hover {
    background-color: #0fa1c5;
  }
  
  .cancel {
    background-color: #925551;
    color: white;
    transition: background-color 0.3s;
  }
  
  .cancel:hover {
    background-color: #a53232;
  }
  </style>
  