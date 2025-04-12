// Header.vue
<template>
  <header>
    <div class="header-container">
      <div class="logo">
        <img src="#" alt="VMD Logo">
      </div>
      <div class="nav-links">
        <a href="#" v-for="(link, index) in navLinks" :key="index">{{ link }}</a>
      </div>
      <div class="utils">
        <a href="#"><i class="fas fa-search"></i> Tìm Kiếm</a>
        <a href="#"><i class="fas fa-user"></i> Đăng Ký Đại Lý</a>
        <div class="language-selector">
          <img 
            v-for="(lang, index) in languages" 
            :key="index" 
            src="#" 
            :alt="lang" 
            @click="changeLanguage(lang)"
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      navLinks: ['Trang Chủ', 'Về Chúng Tôi', 'Thương Hiệu', 'Ngành Hàng', 'Tin Tức', 'Liên Hệ'],
      languages: ['Tiếng Việt', 'English'],
      currentLanguage: 'Tiếng Việt'
    }
  },
  methods: {
    changeLanguage(lang) {
      this.currentLanguage = lang;
      // Logic to change application language would be implemented here
    }
  }
}
</script>

<style scoped>
header {
  background-color: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.logo {
  width: 120px;
}

.logo img {
  width: 100%;
  height: auto;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #e74c3c;
}

.utils {
  display: flex;
  gap: 15px;
  align-items: center;
}

.utils a {
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.utils a:hover {
  color: #e74c3c;
}

.language-selector {
  display: flex;
  gap: 10px;
}

.language-selector img {
  width: 20px;
  height: 14px;
  cursor: pointer;
}

/* Responsive styles */
@media (max-width: 480px) {
  .nav-links {
    display: none;
  }
}
</style>