<template>
  <footer>
    <div class="footer-container">
      <div class="company-info">
        <div class="footer-logo">
          <img src="#" alt="VMD Logo" />
        </div>
        <p>CÔNG TY CỔ PHẦN PHÁT TRIỂN THỊ TRƯỜNG VIỆT NAM</p>
        <p>Địa chỉ: Lầu 5, 88 Lê Lai, Phường Bến Thành, Quận 1, TP.HCM</p>
        <p>Email: info@vmd.com.vn</p>
        <p>Hotline: 1900 2022 (8:00-17:00)</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook-f"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-tiktok"></i></a>
        </div>
      </div>
      <div class="footer-menu">
        <h3>DANH MỤC</h3>
        <ul>
          <li><a href="#">Chính sách đại lý</a></li>
          <li><a href="#">Chính sách bảo mật</a></li>
          <li><a href="#">Chính sách giao nhận hàng</a></li>
          <li><a href="#">Hỏi đáp đại lý</a></li>
          <li><a href="#">Chính sách đổi trả</a></li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      &copy; 2025 VMD. All rights reserved.
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
footer {
  background-color: #333;
  color: #fff;
  padding: 40px 0 0;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  padding: 0 15px;
}

.footer-logo img {
  width: 120px;
  margin-bottom: 15px;
}

.company-info p {
  margin-bottom: 10px;
  font-size: 14px;
}

.footer-menu h3 {
  margin-bottom: 15px;
  font-size: 18px;
}

.footer-menu ul {
  list-style: none;
  padding: 0;
}

.footer-menu li {
  margin-bottom: 10px;
}

.footer-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}

.footer-menu a:hover {
  color: #e74c3c;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-links a {
  color: #fff;
  font-size: 18px;
}

.copyright {
  background-color: #222;
  padding: 15px 0;
  margin-top: 40px;
  text-align: center;
  font-size: 14px;
}
</style>
