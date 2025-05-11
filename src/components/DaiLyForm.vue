<template>
  <div class="daily-form-wrapper">
    <h2>Đăng ký Đại lý</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Họ tên</label>
        <input type="text" v-model="form.hoTen" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="form.email" required />
      </div>
      <div class="form-group">
        <label>Số điện thoại</label>
        <input type="text" v-model="form.phone" required />
      </div>
      <div class="form-group">
        <label>Địa chỉ</label>
        <input type="text" v-model="form.address" required />
      </div>
      <div class="form-group">
        <label>Ngành:</label>
        <select v-model="form.nganh">
          <option value="FMCG">FMCG</option>
          <option value="Mẹ & Bé">Mẹ & Bé</option>
          <option value="HealthCare">HealthCare</option>
          <option value="Industry">Industry</option>
        </select>
      </div>
      <div class="form-group">
        <label>Nội dung đăng ký</label>
        <textarea v-model="form.NoiDung" rows="4"></textarea>
      </div>
      <button type="submit" class="btn-submit">Gửi đăng ký</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/utils/axios";

const form = ref({
  hoTen: "",
  email: "",
  phone: "",
  address: "",
  nganh: "", 
  noiDung: "",
});

const handleSubmit = async () => {
  try {
    const postData = {
      ...form.value,
      FstUpdate: new Date().toISOString(),
      Status: "QQ", // trạng thái chờ duyệt
    };
    console.log(postData);
    await axios.post("/api/DaiLy", postData);
    alert("Đăng ký đại lý thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    form.value = {
      hoTen: "",
      email: "",
      phone: "",
      address: "",
      nganh: "",
      noiDung: "",
    };
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    alert("Gửi đăng ký thất bại. Vui lòng thử lại.");
  }
};
</script>

<style scoped>
.daily-form-wrapper {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 16px;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
  color: #444;
}

input,
textarea,
select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.btn-submit {
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

.btn-submit:hover {
  background-color: #c0392b;
}

.scroll-target {
  margin-top: 170px; /* đúng với chiều cao header */
}
</style>