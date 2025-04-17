<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="change-password-form">
      <h2>Đổi Mật Khẩu</h2>
      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label for="oldPassword">Mật khẩu cũ:</label>
          <input type="password" id="oldPassword" v-model="oldPassword" required />
        </div>

        <div class="form-group">
          <label for="newPassword">Mật khẩu mới:</label>
          <input type="password" id="newPassword" v-model="newPassword" required />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Xác nhận mật khẩu mới:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>

        <button type="submit">Xác nhận</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  emits: ['close'],
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      username: '' // bạn có thể lấy từ localStorage hoặc props
    };
  },
  mounted() {
    // Lấy username từ localStorage hoặc nơi bạn lưu
    this.username = localStorage.getItem('username') || '';
  },
  methods: {
    async handleChangePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        alert('Mật khẩu mới và xác nhận không khớp!');
        return;
      }

      try {
        const payload = {
          UserName: this.username,
          OldPassword: this.oldPassword,
          NewPassword: this.newPassword
        };

        const token = localStorage.getItem('token'); // nếu cần xác thực

        const res = await axios.post(
          'https://localhost:7210/api/Auth/change-password',
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert('Đổi mật khẩu thành công!');
        this.$emit('close');
      } catch (error) {
        console.error('Lỗi đổi mật khẩu:', error);
        alert(
          error.response?.data?.message ||
            'Không thể đổi mật khẩu. Vui lòng kiểm tra lại.'
        );
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

.change-password-form {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.change-password-form h2 {
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
