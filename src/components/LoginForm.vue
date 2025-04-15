<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="login-form">
      <h2>Đăng nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">Tên đăng nhập:</label>
          <input type="text" id="username" v-model="username" required />
        </div>

        <div class="form-group">
          <label for="password">Mật khẩu:</label>
          <input type="password" id="password" v-model="password" required />
        </div>

        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  emits: ['close', 'login-success'],
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        console.log('Gửi yêu cầu login:', this.username, this.password);

        const response = await axios.post('https://localhost:7210/api/auth/login', {
          UserName: this.username,
          Password: this.password // ❗️Không mã hoá, gửi plain text như Postman
        });

        console.log('Phản hồi API:', response.data);

        // Kiểm tra phản hồi từ server
        if (response.data && response.data.message === 'Đăng nhập thành công!') {
          this.$emit('login-success', response.data.userName);

          // Option: Lưu user info hoặc token
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('username', response.data.userName);
          localStorage.setItem('role', response.data.role);  
        } else {
          alert('Tài khoản hoặc mật khẩu không đúng!');
        }
      } catch (error) {
        console.error('Chi tiết lỗi khi đăng nhập:', error.response ? error.response.data : error.message);
        alert('Có lỗi xảy ra khi đăng nhập: ' + (error.response ? error.response.data.message : error.message));
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.login-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.login-form h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 6px;
  color: #555;
  font-weight: 600;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background-color: #c0392b;
}
</style>
