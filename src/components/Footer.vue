// Footer.vue - continued
<template>
  <footer>
    <div class="footer-container">
      <div class="company-info">
        <div class="footer-logo">
          <img src="#" alt="VMD Logo">
        </div>
        <p>CÔNG TY CỔ PHẦN PHÁT TRIỂN THỊ TRƯỜNG VIỆT NAM</p>
        <p>Địa chỉ: Lầu 5, 88 Lê Lai, Phường Bến Thành, Quận 1, TP.HCM</p>
        <p>Email: info@vmd.com.vn</p>
        <p>Hotline: 1900 2022 (8:00-17:00)</p>
        <div class="social-links">
          <a href="#" v-for="(social, index) in socialLinks" :key="index">
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>
      <div class="footer-menu">
        <h3>DANH MỤC</h3>
        <ul>
          <li v-for="(link, index) in footerLinks" :key="index">
            <a href="#">{{ link }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="copyright">
      <p>&copy; {{ new Date().getFullYear() }} VMD. Tất cả quyền được bảo lưu.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      socialLinks: [
        { icon: 'fab fa-facebook-f' },
        { icon: 'fab fa-youtube' },
        { icon: 'fab fa-instagram' },
        { icon: 'fab fa-tiktok' }
      ],
      footerLinks: [
        'Chính sách đại lý',
        'Chính sách bảo mật',
        'Chính sách giao nhận hàng',
        'Hỏi đáp đại lý',
        'Chính sách đổi trả'
      ]
    }
  }
}
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
  grid-template-columns: 2fr 1fr 1fr;
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

/* Responsive styles */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
  }
}
</style>