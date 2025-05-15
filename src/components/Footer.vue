<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="company-info">
        <div class="footer-logo">
          <img :src="logo" alt="VMD Logo" />
        </div>
        <p><strong>CÔNG TY CỔ PHẦN PHÁT TRIỂN THỊ TRƯỜNG VIỆT NAM</strong></p>
        <p>Địa chỉ: 53 Trần Bình Trọng, Phường 5, Quận Bình Thạnh, TP. Hồ Chí Minh</p>
        <p>Trụ sở ĐKKD: 20/1 Ấp Mới 1, xã Tân Xuân, Hóc Môn</p>
        <p>Email: info@vmd.com.vn</p>
        <p>Hotline: 0396 455 567</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>

      <div class="footer-menu">
        <h3>CHÍNH SÁCH</h3>
        <ul>
          <li>
            <router-link to="/content/CHINHSACHDAILY"
              >Chính sách đại lý</router-link
            >
          </li>
          <li>
            <router-link to="/content/CHINHSACHBAOMAT"
              >Chính sách bảo mật</router-link
            >
          </li>
          <li>
            <router-link to="/content/CHINHSACHGIAONHANHANG"
              >Chính sách giao nhận hàng</router-link
            >
          </li>
          <li>
            <router-link to="/content/HOIDAPDAILY">Hỏi đáp đại lý</router-link>
          </li>
          <li>
            <router-link to="/content/CHINHSACHDOITRA"
              >Chính sách đổi trả</router-link
            >
          </li>
          <li>
            <router-link to="/tuyendung"
              >Tuyển dụng</router-link
            >
          </li>
        </ul>
      </div>

      <div class="footer-menu">
        <h3>HỖ TRỢ KHÁCH HÀNG</h3>
        <ul>
          <li><router-link to="/content/LIENHE">Liên hệ</router-link></li>
          <li>
            <router-link to="/content/TRUNGTAMHOTRO"
              >Trung tâm hỗ trợ</router-link
            >
          </li>
          <li>
            <router-link to="/content/HUONGDANMUAHANG"
              >Hướng dẫn mua hàng</router-link
            >
          </li>
          <li>
            <router-link to="/content/DIEUKHOANSUDUNG"
              >Điều khoản sử dụng</router-link
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="copyright">
      &copy; {{ currentYear }} VMD. All rights reserved.
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
import logo from "../assets/logo VMD.png";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background-color: #fff;
  color: #333;
  padding: 40px 0 0;
  border-top: 1px solid #eee;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 0 15px;
}

.footer-logo img {
  width: 120px;
  margin-bottom: 15px;
}

.company-info p {
  margin-bottom: 8px;
  font-size: 14px;
}

.footer-menu h3 {
  margin-bottom: 15px;
  font-size: 18px;
  color: #000;
}

.footer-menu ul {
  list-style: none;
  padding: 0;
}

.footer-menu li {
  margin-bottom: 10px;
}

.footer-menu a {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-menu a:hover {
  color: #e74c3c;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.social-links a {
  color: #333;
  font-size: 18px;
  transition: color 0.3s;
}

.social-links a:hover {
  color: #e74c3c;
}

.copyright {
  background-color: #f9f9f9;
  padding: 15px 0;
  text-align: center;
  font-size: 14px;
  color: #777;
  margin-top: 30px;
}
</style>
