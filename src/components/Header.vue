<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
    <div class="top-bar">
      <div class="logo">
        <img :src="logo" alt="Logo" />
      </div>
      <div class="utils">
        <router-link to="/products" class="search-btn" title="Tìm kiếm">
          <i class="search-icon">&#128269;</i>
        </router-link>
        <router-link to="/dangkydaily" class="register-link"
          >ĐĂNG KÝ ĐẠI LÝ
        </router-link>
      </div>
      <div class="menu-toggle" @click="toggleMenu">☰</div>
    </div>
    <nav :class="{ open: isMenuOpen }">
      <ul>
        <li><router-link to="/">TRANG CHỦ</router-link></li>
        <li>
          <a href="#" @click.prevent="scrollToSection('about')">VỀ CHÚNG TÔI</a>
        </li>

        <li><router-link to="/allbrands">THƯƠNG HIỆU</router-link></li>
        <li>
          <a href="#" @click.prevent="scrollToSection('categories')"
            >NGÀNH HÀNG</a
          >
        </li>
        <li><router-link to="/allevents">TIN TỨC</router-link></li>
        <li>
          <a href="#" @click.prevent="scrollToSection('footer')">LIÊN HỆ</a>
        </li>
        <li>
          <a href="#" @click.prevent="scrollToSection('categories')"
            >HỆ THỐNG ĐẠI LÝ</a
          >
        </li>

        <!-- Nếu chưa đăng nhập -->
        <li v-if="!isLoggedIn">
          <a href="#" @click.prevent="openLogin"> <i></i> ĐĂNG NHẬP </a>
        </li>

        <!-- Nếu đã đăng nhập -->
        <li v-else class="dropdown" @click="toggleUserMenu">
          <a href="#">{{ username }}</a>
          <ul
            class="dropdown-menu"
            :class="{ show: showUserMenu }"
            @mouseenter="isHovering = true"
            @mouseleave="handleMouseLeave"
          >
            <li>
              <router-link to="/products" @click.native="closeUserMenu"
                >Sản phẩm</router-link
              >
            </li>
            <li>
              <router-link to="/admin/products" @click.native="closeUserMenu"
                >Nhập sản phẩm</router-link
              >
            </li>
            <li>
              <router-link to="/admin/brands" @click.native="closeUserMenu"
                >Nhập thương hiệu</router-link
              >
            </li>
            <li>
              <router-link to="/admin/events" @click.native="closeUserMenu"
                >Nhập thông tin sự kiện</router-link
              >
            </li>
            <li>
              <router-link
                to="/admin/bannermanager"
                @click.native="closeUserMenu"
                >Quản lý banner</router-link
              >
            </li>
            <li>
              <router-link
                to="/admin/dailymanager"
                @click.native="closeUserMenu"
                >Quản lý đăng ký đại lý</router-link
              >
            </li>
            <li>
              <router-link
                to="/admin/emailmanager"
                @click.native="closeUserMenu"
                >Quản lý email đăng ký</router-link
              >
            </li>

            <li>
              <router-link to="/admin/partners" @click.native="closeUserMenu"
                >Nhập đối tác</router-link
              >
            </li>
            <li>
              <router-link to="/admin/gtdlmanager" @click.native="closeUserMenu"
                >Sửa trang hệ thống đại lý</router-link
              >
            </li>
            <li>
              <a href="#" @click.prevent="changePassword">
                <i></i> Đổi mật khẩu
              </a>
            </li>
            <li><a href="#" @click.prevent="logout">Đăng xuất</a></li>
          </ul>
        </li>
      </ul>
    </nav>

    <!-- Form đăng nhập -->
    <LoginForm
      v-if="showLogin"
      @close="closeLogin"
      @login-success="handleLoginSuccess"
    />

    <!-- Form đổi mật khẩu -->
    <ChangePasswordForm
      v-if="showChangePassword"
      @close="closeChangePassword"
    />
  </header>
</template>

<script setup>

import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginForm from "./LoginForm.vue";
import ChangePasswordForm from "./ChangePasswordForm.vue";
import eventBus from "../eventBus";
import logo from '../assets/logo VMD.png'
import { onMounted } from "vue";

const isHovering = ref(false);
const isMenuOpen = ref(false);
const showLogin = ref(false);
const isLoggedIn = ref(false);
const username = ref("");
const showUserMenu = ref(false);
const showChangePassword = ref(false);
const router = useRouter();
const route = useRoute();

const scrollToSection = (section) => {
  eventBus.emit("scrollTo", section);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const openLogin = () => {
  showLogin.value = true;
};

const closeLogin = () => {
  showLogin.value = false;
};

const handleLoginSuccess = (name) => {
  username.value = name;
  isLoggedIn.value = true;
  showLogin.value = false;

  // Lưu vào localStorage
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", name);
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

const logout = () => {
  isLoggedIn.value = false;
  username.value = "";
  showUserMenu.value = false;
  localStorage.clear();
  if (route.name === "AllProducts") {
    router.go();
  } else {
    router.push("/");
  }
  alert("Bạn đã đăng xuất!");
};

const changePassword = () => {
  showUserMenu.value = false;
  showChangePassword.value = true;
};

const closeChangePassword = () => {
  showChangePassword.value = false;
};

const handleMouseLeave = () => {
  isHovering.value = false;
  setTimeout(() => {
    if (!isHovering.value) {
      showUserMenu.value = false;
    }
  }, 200);
};
onMounted(() => {
  const savedLogin = localStorage.getItem("isLoggedIn");
  const savedUsername = localStorage.getItem("username");

  if (savedLogin === "true" && savedUsername) {
    isLoggedIn.value = true;
    username.value = savedUsername;
  }
});
</script>

<style scoped>
header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.top-bar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
}

.logo img {
  height: 60px;
  transition: transform 0.3s;
}

.logo img:hover {
  transform: scale(1.05);
}

.utils {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f8f8f8;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background-color: #e74c3c;
  color: white;
  transform: scale(1.05);
}

.search-icon {
  font-size: 20px;
  line-height: 1;
}

.register-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 4px;
  transition: all 0.3s;
  background-color: #f8f8f8;
}

.register-link:hover {
  color: white;
  background-color: #e74c3c;
}

.menu-toggle {
  font-size: 24px;
  cursor: pointer;
  display: none;
  background: none;
  border: none;
  transition: color 0.3s;
}

.menu-toggle:hover {
  color: #e74c3c;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

nav ul li {
  margin: 0 15px;
  position: relative;
}

nav ul li a {
  text-decoration: none;
  text-transform: uppercase;
  color: #333;
  padding: 15px 5px;
  display: inline-block;
  transition: color 0.3s, border-bottom 0.3s;
  font-weight: 500;
  position: relative;
}

nav ul li a:after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 10px;
  left: 0;
  background-color: #e74c3c;
  transition: width 0.3s ease;
}

nav ul li a:hover {
  color: #e74c3c;
}

nav ul li a:hover:after {
  width: 100%;
}

/* Dropdown menu */
.dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 8px 0 0 0;
  padding: 8px 0;
  min-width: 240px;
  z-index: 1000;
  text-align: left;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s;
}

.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
}

.dropdown-menu li {
  width: 100%;
  margin: 0;
}

.dropdown-menu li a {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  text-transform: none;
  border-radius: 4px;
  margin: 2px 5px;
}

.dropdown-menu li a:hover {
  background-color: #e74c3c;
  color: white;
}

.dropdown-menu li a:after {
  display: none;
}

.main-content {
  padding-top: 120px;
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  list-style: none;
  margin: 8px 0 0 0;
  padding: 8px 0;
  min-width: 240px;
  z-index: 1000;
  text-align: left;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
}

.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .top-bar {
    flex-wrap: wrap;
    padding: 10px;
  }

  .menu-toggle {
    display: block;
    order: 3;
    margin-top: 10px;
  }

  nav {
    display: none;
    width: 100%;
    background: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 8px 8px;
  }

  nav.open {
    display: block;
    animation: slideDown 0.3s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  nav ul {
    flex-direction: column;
    text-align: left;
    padding: 10px 0;
  }

  nav ul li {
    margin: 0;
    border-bottom: 1px solid #eee;
  }

  nav ul li:last-child {
    border-bottom: none;
  }

  nav ul li a {
    padding: 12px 15px;
    display: block;
  }

  nav ul li a:after {
    display: none;
  }

  .utils {
    order: 2;
    width: auto;
  }

  .logo {
    order: 1;
    width: auto;
  }

  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    background: #f8f8f8;
    padding: 0;
    margin: 0;
    border-radius: 0;
    opacity: 1;
    transform: none;
  }

  .dropdown-menu li a {
    padding: 10px 20px;
    color: #333;
  }

  .dropdown-menu li a:hover {
    background: #e74c3c;
    color: white;
  }

  .search-btn {
    width: 35px;
    height: 35px;
  }

  .register-link {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>