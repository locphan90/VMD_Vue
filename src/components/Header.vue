<template>
  <header>
    <div class="header-container">
      <div class="logo">
        <img src="#" alt="VMD Logo" />
      </div>
      <nav :class="{ open: isMenuOpen }">
        <a href="#">Trang Chủ</a>
        <a href="#">Về Chúng Tôi</a>
        <a href="#">Thương Hiệu</a>
        <a href="#">Ngành Hàng</a>
        <a href="#">Tin Tức</a>
        <a href="#">Liên Hệ</a>
      </nav>
      <div class="utils">
        <a href="#"><i class="fas fa-search"></i></a>
        <a href="#"><i class="fas fa-user"></i></a>
        <div class="language-selector">
          <img src="#" alt="Tiếng Việt" />
          <img src="#" alt="English" />
        </div>
        <div class="menu-toggle" @click="toggleMenu">
          <i class="fas fa-bars"></i>
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
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
header {
  background-color: #fff;
  padding: 15px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.logo img {
  max-width: 120px;
  height: auto;
}

nav {
  display: flex;
  gap: 20px;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 14px;
  transition: color 0.3s;
}

nav a:hover {
  color: #e74c3c;
}

.utils {
  display: flex;
  align-items: center;
  gap: 15px;
}

.utils a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.language-selector {
  display: flex;
  gap: 5px;
}

.language-selector img {
  width: 20px;
  height: 14px;
  cursor: pointer;
}

.menu-toggle {
  display: none;
  font-size: 20px;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  nav {
    position: absolute;
    top: 60px;
    right: 0;
    background: white;
    flex-direction: column;
    width: 200px;
    border: 1px solid #ddd;
    display: none;
  }

  nav.open {
    display: flex;
  }

  .menu-toggle {
    display: block;
  }
}
</style>
