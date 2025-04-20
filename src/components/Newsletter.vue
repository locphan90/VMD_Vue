<template>
  <section class="newsletter">
    <form class="newsletter-form" @submit.prevent="submitForm">
      <div class="center-text">ĐĂNG KÝ NHẬN THÔNG TIN</div>
      <input
        type="email"
        v-model="email"
        placeholder="Vui lòng nhập Email..."
        required
      />
      <button type="submit">ĐĂNG KÝ</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import axios from "@/utils/axios";

const email = ref('');

const submitForm = async () => {
  try {
    const response = await axios.post("/api/DangKy", { email: email.value });

    alert("Đăng ký thành công!");
    email.value = "";
  } catch (error) {
    const message =
      error.response?.data || error.message || "Đăng ký thất bại!";
    alert("Lỗi: " + message);
  }
};
</script>



<style scoped>
.newsletter {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
  text-align: center;
}

.section-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: #333;
  position: relative;
}

.section-title::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background-color: #e74c3c;
  margin: 10px auto;
}

.newsletter-form {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.newsletter-form input {
  flex: 1;
  min-width: 250px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.newsletter-form button {
  background-color: #e74c3c;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.newsletter-form button:hover {
  background-color: #c0392b;
}

.center-text {
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .newsletter-form {
    flex-direction: column;
    align-items: center;
  }

  .newsletter-form input {
    width: 100%;
    max-width: 400px;
  }

  .newsletter-form button {
    width: 100%;
    max-width: 400px;
  }
}
</style>
