<template>
  <header>
    <div class="top-bar">
      <div class="logo">
        <img src="#" alt="Logo" />
      </div>
      <div class="utils">
        <router-link to="/register" class="register-link"
          >ĐĂNG KÝ ĐẠI LÝ</router-link
        >
      </div>
      <div class="menu-toggle" @click="toggleMenu">☰</div>
    </div>
    <nav :class="{ open: isMenuOpen }">
      <ul>
        <li><router-link to="/">TRANG CHỦ</router-link></li>
        <li><router-link to="/sanpham">SẢN PHẨM</router-link></li>
        <li><router-link to="/lienhe">LIÊN HỆ</router-link></li>
        <li v-if="!isLoggedIn">
          <a href="#" @click.prevent="openLogin"> <i></i> ĐĂNG NHẬP </a>
        </li>
        <li v-else class="dropdown">
          <a href="#" @click.prevent="toggleUserMenu">{{ username }}</a>
          <ul v-if="showUserMenu" class="dropdown-menu">
            <li>
              <router-link to="/admin/products" @click.native="closeUserMenu">Nhập sản phẩm</router-link>
            </li>
            <li>
              <router-link to="/admin/brands">Nhập thương hiệu</router-link>
            </li>
            <li>
              <router-link to="/admin/events">Nhập thông tin sự kiện</router-link>
            </li>
            <li>
              <router-link to="/admin/partners">Nhập đối tác</router-link>
            </li>
            <li><router-link to="/doimatkhau">Đổi mật khẩu</router-link></li>
            <li><a href="#" @click.prevent="logout">Đăng xuất</a></li>
          </ul>
        </li>
      </ul>
    </nav>
    <!-- Form đăng nhập modal -->
    <LoginForm
      v-if="showLogin"
      @close="closeLogin"
      @login-success="handleLoginSuccess"
    />

    <!-- Form đổi mật khẩu modal -->
    <ChangePasswordForm
      v-if="showChangePassword"
      @close="closeChangePassword"
    />
  </header>
</template>

<script>
import LoginForm from "./LoginForm.vue";
import ChangePasswordForm from "./ChangePasswordForm.vue";

export default {
  name: "Header",
  components: { LoginForm, ChangePasswordForm },
  data() {
    return {
      isMenuOpen: false,
      showLogin: false,
      isLoggedIn: false,
      username: "",
      showUserMenu: false,
      showChangePassword: false,
      showAdminMenu: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    openLogin() {
      this.showLogin = true;
    },
    closeLogin() {
      this.showLogin = false;
    },
    handleLoginSuccess(username) {
      this.username = username;
      this.isLoggedIn = true;
      this.showLogin = false;
      this.showUserMenu = false;
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    logout() {
      this.isLoggedIn = false;
      this.username = "";
      this.showUserMenu = false;
      localStorage.clear(); // Dọn localStorage nếu có lưu
      alert("Bạn đã đăng xuất!");
    },
    changePassword() {
      this.showUserMenu = false;
      this.showChangePassword = true;
    },
    closeChangePassword() {
      this.showChangePassword = false;
    },
    closeUserMenu() {
      this.showUserMenu = false;
    },
  },
};
</script>

<style scoped>
header {
  width: 100%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
}

.utils {
  position: static;
}

.register-link {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  transition: color 0.3s;
}

.register-link:hover {
  color: #007bff;
}

.menu-toggle {
  font-size: 24px;
  cursor: pointer;
  display: none;
  background: none;
  border: none;
}

nav {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
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
}

nav ul li a:hover {
  color: #e74c3c;
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
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  list-style: none;
  margin: 8px 0 0 0;
  padding: 8px 0;
  min-width: 240px;
  z-index: 1000;
  text-align: left;
}

.dropdown-menu li {
  width: 100%;
}

.dropdown-menu li a {
  display: block;
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
  text-transform: none;
}

.dropdown-menu li a:hover {
  background-color: #e74c3c;
  color: white;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .top-bar {
    flex-wrap: wrap;
  }

  .menu-toggle {
    display: block;
    order: 3;
    width: 100%;
    text-align: right;
    margin-top: 10px;
  }

  nav {
    display: none;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  nav.open {
    display: block;
  }

  nav ul {
    flex-direction: column;
    text-align: left;
  }

  nav ul li {
    margin: 0;
    border-bottom: 1px solid #eee;
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
    background: transparent;
    padding: 0;
    margin: 0;
  }

  .dropdown-menu li a {
    padding: 10px;
    color: #333;
  }

  .dropdown-menu li a:hover {
    background: #e74c3c;
    /* color: #007bff; */
  }
}
</style>
