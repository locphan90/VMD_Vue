<template>
  <div>
    <header>
      <div class="top-bar">
        <div class="logo">
          <router-link to="/" @click="closeMenu">
            <img :src="logo" alt="Logo" />
          </router-link>
        </div>
        <div class="utils">
          <router-link
            to="/products"
            class="search-btn"
            title="Tìm kiếm"
            @click="closeMenu"
          >
            <i class="search-icon">&#128269;</i>
          </router-link>
          <router-link
            to="/dangkydaily"
            class="register-link"
            @click="closeMenu"
          >
            ĐĂNG KÝ ĐẠI LÝ
          </router-link>
        </div>
        <div class="menu-toggle" @click="toggleMenu">☰</div>
      </div>
      <nav :class="{ open: isMenuOpen }">
        <div class="mobile-menu-wrapper">
          <ul>
            <li>
              <router-link to="/" @click="closeMenu">TRANG CHỦ</router-link>
            </li>
            <li>
              <router-link to="/content/VECHUNGTOI" @click="closeMenu">VỀ CHÚNG TÔI</router-link>
            </li>
            <li class="dropdown">
              <router-link
                to="/products"
                @mouseenter="loadProductCategories"
                @click.prevent="toggleProductMenu(); closeMenu()"
              >
                SẢN PHẨM <span class="dropdown-arrow">▼</span>
              </router-link>
              <div
                class="dropdown-menu multi-column-dropdown product-menu"
                :class="{ show: showProductMenu }"
                @mouseenter="isHoveringProduct = true"
                @mouseleave="handleProductMenuMouseLeave"
              >
                <div class="columns-wrapper">
                  <div v-for="(column, colIndex) in productCategoriesColumns" :key="colIndex" class="column">
                    <ul>
                      <li v-for="category in column" :key="category.val">
                        <router-link
                          :to="`/danhmucsp/${category.val}`"
                          @click="
                            closeProductMenu();
                            closeMenu();
                          "
                        >
                          {{ category.val }}
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>

            <li>
              <router-link to="/nganhhang/fmcg" @click="closeMenu"
                >NGÀNH HÀNG</router-link
              >
            </li>
            <li>
              <router-link to="/allbrands" @click="closeMenu"
                >NHÃN HIỆU</router-link
              >
            </li>
            <li><router-link to="/congthuc" @click="closeMenu">CÔNG THỨC</router-link></li>
            <li>
              <router-link to="/content/HETHONGDAILY" @click="closeMenu">KHO - ĐẠI LÝ</router-link>
            </li>
            <li>
              <router-link to="/tintuc" @click="closeMenu">TIN TỨC</router-link>
            </li>
            <!-- Nếu chưa đăng nhập -->
            <li v-if="!isLoggedIn">
              <a
                href="#"
                @click.prevent="
                  openLogin();
                  closeMenu();
                "
              >
                <i></i> ĐĂNG NHẬP
              </a>
            </li>

            <!-- Nếu đã đăng nhập -->
            <li v-else class="dropdown">
              <a
                href="#"
                @mouseenter="handleUserMenuMouseEnter"
                @click.prevent="toggleUserMenu"
              >
                {{ username }} <span class="dropdown-arrow">▼</span>
              </a>
              <div
                class="dropdown-menu admin-menu"
                :class="{ show: showUserMenu }"
                @mouseenter="isHoveringUser = true"
                @mouseleave="handleUserMenuMouseLeave"
              >
                <div class="columns-wrapper admin-columns">
                  <div class="column">
                    <ul>
                      <li>
                        <router-link
                          to="/products"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Sản phẩm
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/products"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Nhập sản phẩm
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/productcat"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Nhập danh mục sản phẩm
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/brands"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Nhập nhãn hiệu
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/partners"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Nhập đối tác
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/nhapcongthuc"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Nhập công thức
                        </router-link>
                      </li>
                    </ul>
                  </div>
                  <div class="column">
                    <ul>
                      <li>
                        <router-link
                          to="/admin/events"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Nhập thông tin sự kiện
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/bannermanager"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Quản lý banner
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/dailymanager"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Quản lý đăng ký đại lý
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/danhsachtuyendung"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Quản lý tuyển dụng
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/emailmanager"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Quản lý email đăng ký
                        </router-link>
                      </li>
                      <li>
                        <router-link
                          to="/admin/staticpagemanager"
                          @click="
                            closeUserMenu();
                            closeMenu();
                          "
                        >
                          Sửa trang tĩnh
                        </router-link>
                      </li>
                      <li>
                        <a
                          href="#"
                          @click.prevent="
                            changePassword();
                            closeMenu();
                          "
                        >
                          <i></i> Đổi mật khẩu
                        </a>
                      </li>
                      <li>
                        <a
                          href="#"
                          @click.prevent="
                            logout();
                            closeMenu();
                          "
                          >Đăng xuất</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Form đăng nhập -->
      <div class="login-modal-overlay" v-if="showLogin">
        <div class="login-modal-container">
          <LoginForm
            @close="closeLogin"
            @login-success="handleLoginSuccess"
          />
        </div>
      </div>

      <!-- Form đổi mật khẩu -->
      <ChangePasswordForm
        v-if="showChangePassword"
        @close="closeChangePassword"
      />
    </header>

    <!-- Container cho nội dung TinyMCE -->
    <div class="content-container" v-if="showContentModal">
      <div class="content-modal">
        <div class="content-header">
          <h2>{{ contentTitle }}</h2>
          <button class="close-btn" @click="closeContentModal">×</button>
        </div>
        <div class="content-body" v-if="!contentLoading">
          <div v-html="contentHTML"></div>
        </div>
        <div class="content-loading" v-else>
          <div class="loader"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginForm from "./LoginForm.vue";
import ChangePasswordForm from "./ChangePasswordForm.vue";
import eventBus from "../eventBus";
import logo from "../assets/logo VMD.png";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const router = useRouter();
const route = useRoute();

const isHoveringUser = ref(false);
const isHoveringProduct = ref(false);
const isMenuOpen = ref(false);
const showLogin = ref(false);
const isLoggedIn = ref(false);
const username = ref("");
const showUserMenu = ref(false);
const showProductMenu = ref(false);
const productCategories = ref([]);
const categoriesLoaded = ref(false);
const showChangePassword = ref(false);

// Biến cho nội dung TinyMCE
const showContentModal = ref(false);
const contentHTML = ref("");
const contentLoading = ref(false);
const contentTitle = ref("");

// Tính toán số cột cho menu sản phẩm dựa trên số lượng danh mục
const productCategoriesColumns = computed(() => {
  const categories = productCategories.value;
  if (!categories || categories.length === 0) return [];
  
  // Xác định số cột dựa trên số lượng danh mục
  let columnCount = 1;
  if (categories.length > 20) {
    columnCount = 4;
  } else if (categories.length > 12) {
    columnCount = 3;
  } else if (categories.length > 6) {
    columnCount = 2;
  }
  
  // Tính số mục trên mỗi cột
  const itemsPerColumn = Math.ceil(categories.length / columnCount);
  
  // Chia danh mục thành các cột
  const columns = [];
  for (let i = 0; i < columnCount; i++) {
    const startIndex = i * itemsPerColumn;
    const endIndex = Math.min(startIndex + itemsPerColumn, categories.length);
    if (startIndex < categories.length) {
      columns.push(categories.slice(startIndex, endIndex));
    }
  }
  
  return columns;
});

const scrollToSection = (section) => {
  eventBus.emit("scrollTo", section);
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  // Đóng menu con khi đóng menu chính
  if (!isMenuOpen.value) {
    showUserMenu.value = false;
    showProductMenu.value = false;
  }
};

// Thêm hàm closeMenu mới để đóng menu khi click vào item
const closeMenu = () => {
  isMenuOpen.value = false;
  showUserMenu.value = false;
  showProductMenu.value = false;
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
  // Đảm bảo rằng menu user mặc định luôn đóng
  showUserMenu.value = false;

  // Lưu vào localStorage
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("username", name);
};

// Xử lý sự kiện hover cho menu user
const handleUserMenuMouseEnter = () => {
  // Chỉ áp dụng cho desktop
  if (window.innerWidth > 768) {
    showUserMenu.value = true;
    isHoveringUser.value = true;
    // Đóng menu sản phẩm nếu đang mở
    showProductMenu.value = false;
  }
};

const handleUserMenuMouseLeave = () => {
  // Chỉ áp dụng cho desktop
  if (window.innerWidth > 768) {
    isHoveringUser.value = false;
    setTimeout(() => {
      if (!isHoveringUser.value) {
        showUserMenu.value = false;
      }
    }, 200);
  }
};

const toggleUserMenu = (event) => {
  // Ngăn sự kiện click lan toả
  if (event) {
    event.stopPropagation();
  }
  showUserMenu.value = !showUserMenu.value;
  // Đóng menu sản phẩm nếu đang mở
  if (showUserMenu.value) {
    showProductMenu.value = false;
  }
};

const closeUserMenu = () => {
  showUserMenu.value = false;
};

// Chức năng mới để toggle menu sản phẩm khi click trên mobile
const toggleProductMenu = (event) => {
  if (event) {
    event.stopPropagation();
  }
  showProductMenu.value = !showProductMenu.value;
  // Đóng menu user nếu đang mở
  if (showProductMenu.value) {
    showUserMenu.value = false;
  }
};

const loadProductCategories = async () => {
  // Trên desktop, sử dụng hover
  if (window.innerWidth > 768) {
    showProductMenu.value = true;
    isHoveringProduct.value = true;
    // Đóng menu user nếu đang mở
    showUserMenu.value = false;
  }

  // Chỉ tải danh mục khi chưa được tải trước đó
  if (!categoriesLoaded.value) {
    try {
      const response = await axios.get("api/MISC?cat=DANHMUCSANPHAM");
      if (response.data && response.data.length > 0) {
        productCategories.value = response.data;
        categoriesLoaded.value = true;
      }
    } catch (error) {
      console.error("Lỗi khi tải danh mục sản phẩm:", error);
    }
  }
};

const closeProductMenu = () => {
  showProductMenu.value = false;
};

const handleProductMenuMouseLeave = () => {
  // Chỉ áp dụng cho desktop
  if (window.innerWidth > 768) {
    isHoveringProduct.value = false;
    setTimeout(() => {
      if (!isHoveringProduct.value) {
        showProductMenu.value = false;
      }
    }, 200);
  }
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

const checkMobileMenuBehavior = () => {
  // Nếu là desktop thì reset lại các menu
  if (window.innerWidth > 768) {
    // Đặt lại những behavior phù hợp cho desktop
    document.querySelector("nav").classList.remove("scroll-enabled");
  } else {
    // Đặt behavior cho mobile
    document.querySelector("nav").classList.add("scroll-enabled");
  }
}

onMounted(() => {
  const savedLogin = localStorage.getItem("isLoggedIn");
  const savedUsername = localStorage.getItem("username");

  if (savedLogin === "true" && savedUsername) {
    isLoggedIn.value = true;
    username.value = savedUsername;
    // Đảm bảo menu user đóng khi trang được load
    showUserMenu.value = false;
  }

  // Click bên ngoài để đóng menu user và menu product
  document.addEventListener("click", (e) => {
    if (showUserMenu.value) {
      const dropdown = document.querySelector(".dropdown-menu.admin-menu");
      const trigger = document.querySelector(
        ".dropdown:has(.dropdown-menu.admin-menu) > a"
      );
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        trigger &&
        !trigger.contains(e.target)
      ) {
        showUserMenu.value = false;
      }
    }

    if (showProductMenu.value) {
      const productDropdown = document.querySelector(
        "li.dropdown:not(:has(.dropdown-menu.admin-menu)) .dropdown-menu"
      );
      const productTrigger = document.querySelector(
        "li.dropdown:not(:has(.dropdown-menu.admin-menu)) > a"
      );
      if (
        productDropdown &&
        !productDropdown.contains(e.target) &&
        productTrigger &&
        !productTrigger.contains(e.target)
      ) {
        showProductMenu.value = false;
      }
    }
  });

  // Thêm event listener để kiểm tra kích thước màn hình
  window.addEventListener("resize", checkMobileMenuBehavior);
  checkMobileMenuBehavior();

  // Thêm scroll event listener để ẩn/hiện header
  let lastScrollTop = 0;
  const headerElement = document.querySelector("header");

  if (headerElement) {
    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scroll Down
        headerElement.classList.remove("scroll-up");
        headerElement.classList.add("scroll-down");
      } else {
        // Scroll Up
        headerElement.classList.remove("scroll-down");
        headerElement.classList.add("scroll-up");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
      // Thêm class 'scrolled' khi scroll để hiển thị shadow
      if (scrollTop > 50) {
        headerElement.classList.add("scrolled");
      } else {
        headerElement.classList.remove("scrolled");
      }
    });
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

/* Thêm mũi tên cho dropdown */
.dropdown-arrow {
  margin-left: 5px;
  font-size: 10px;
  transition: transform 0.3s;
}

.dropdown:has(.dropdown-menu.show) .dropdown-arrow {
  transform: rotate(180deg);
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
  pointer-events: none;
  max-height: 80vh; /* Limit maximum height */
  overflow-y: auto; /* Enable scrolling if needed */
  max-width: 90vw; /* Ensure it doesn't exceed viewport width */
}

.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Ensure dropdown menus stay within viewport */
.dropdown-menu {
  max-height: 80vh;
  overflow-y: auto;
  max-width: 90vw;
}

/* Adjust position for admin menu to ensure visibility */
.admin-menu {
  left: auto;
  right: 0;
}

/* Ensure dropdown menus are positioned correctly on smaller screens */
@media (max-width: 1200px) {
  .multi-column-dropdown {
    left: auto;
    right: 0;
    transform: translateY(10px);
  }
  
  .multi-column-dropdown.show {
    transform: translateY(0);
  }
  
  /* Adjust admin menu for smaller screens */
  .admin-menu {
    max-width: min(500px, 90vw);
    right: 0;
  }
  
  /* Ensure columns wrap properly on smaller screens */
  .admin-columns {
    flex-wrap: wrap;
  }
}

/* Additional adjustments for tablet-sized screens */
@media (max-width: 992px) and (min-width: 769px) {
  .dropdown-menu.admin-menu {
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .admin-columns .column {
    min-width: 180px;
  }
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

/* Multi-column dropdown styles */
.multi-column-dropdown {
  width: auto;
  min-width: 600px;
  max-width: 80vw;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  padding: 15px;
}

.multi-column-dropdown.show {
  transform: translateX(-50%) translateY(0);
}

.columns-wrapper {
  display: flex;
  gap: 20px;
}

.column {
  flex: 1;
}

.column ul {
  display: block;
  padding: 0;
  margin: 0;
}

.column li {
  margin-bottom: 5px;
}

/* Admin menu columns */
.admin-columns {
  display: flex;
  gap: 20px;
}

.admin-columns .column {
  min-width: 200px;
}

.admin-menu {
  width: auto;
  min-width: 500px;
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

/* Content Modal Styles */
.content-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.content-modal {
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #f8f8f8;
  border-bottom: 1px solid #eee;
}

.content-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e74c3c;
}

.content-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.content-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #e74c3c;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Content Styling */
.content-body :deep(h1),
.content-body :deep(h2),
.content-body :deep(h3) {
  color: #333;
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.content-body :deep(p) {
  margin-bottom: 1em;
  line-height: 1.6;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  margin-bottom: 1em;
  padding-left: 2em;
}

.content-body :deep(li) {
  margin-bottom: 0.5em;
}

.content-body :deep(a) {
  color: #e74c3c;
  text-decoration: none;
}

.content-body :deep(a:hover) {
  text-decoration: underline;
}

.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
}

.content-body :deep(blockquote) {
  border-left: 4px solid #e74c3c;
  padding-left: 1em;
  margin-left: 0;
  color: #666;
  font-style: italic;
}

.content-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.content-body :deep(th),
.content-body :deep(td) {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.content-body :deep(th) {
  background-color: #f8f8f8;
}

/* New Mobile Menu Styling */
.mobile-menu-wrapper {
  width: 100%;
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
    max-height: 80vh; /* Giới hạn chiều cao tối đa */
    overflow-y: auto; /* Cho phép cuộn */
  }

  /* Wrapper cho scroll trên mobile */
  .mobile-menu-wrapper {
    width: 100%;
    max-height: 100%;
  }

  /* Đảm bảo scroll chỉ áp dụng khi cần thiết */
  nav.scroll-enabled {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* Cho iOS */
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

  /* Sửa đổi style của dropdown menu trên mobile */
  .dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    background: #f8f8f8;
    padding: 0;
    margin: 0;
    border-radius: 0;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transform: none;
    transition: max-height 0.3s ease, opacity 0.3s ease;
  }

  .dropdown-menu.show {
    opacity: 1;
    max-height: 1000px; /* Đủ cao để hiển thị hết các items */
    transform: none;
    overflow-y: visible; /* Cho phép hiển thị tất cả nội dung */
  }

  /* Riêng cho menu admin có nhiều items hơn */
  .dropdown-menu.admin-menu.show {
    max-height: 400px;
    overflow-y: auto;
  }

  .dropdown-menu li {
    border-bottom: none;
  }

  .dropdown-menu li a {
    padding-left: 30px;
    font-size: 0.95em;
  }

  /* Reset multi-column styles on mobile */
  .multi-column-dropdown {
    min-width: auto;
    width: 100%;
    left: 0;
    transform: none !important;
    position: static;
  }

  .multi-column-dropdown.show {
    transform: none !important;
  }

  .columns-wrapper, .admin-columns {
    flex-direction: column;
    gap: 0;
  }
  
  .column {
    width: 100%;
  }
  
  .column ul {
    padding: 0;
  }

  /* Điều chỉnh spacing cho mobile */
  .content-container {
    padding: 10px;
  }

  .content-modal {
    max-height: 90vh;
    width: 95%;
  }

  /* Cải thiện UX trên mobile */
  nav ul li a,
  .dropdown-menu li a {
    padding: 15px;
    font-size: 16px;
  }

  /* Tăng kích thước vùng có thể nhấn */
  .search-btn {
    width: 44px;
    height: 44px;
  }

  .register-link {
    padding: 12px 16px;
    font-size: 14px;
  }

  /* Hiệu ứng hover tốt hơn cho màn hình cảm ứng */
  nav ul li a:active,
  .dropdown-menu li a:active {
    background-color: #f0f0f0;
  }

  /* Điều chỉnh logo cho mobile */
  .logo img {
    height: 50px;
  }
}

/* Chiều cao để các dropdown menu hiện toàn bộ */
@media (max-height: 700px) and (max-width: 768px) {
  .dropdown-menu.admin-menu.show {
    max-height: unset; /* Hủy giới hạn chiều cao */
    padding-bottom: 15px; /* Thêm padding để dễ nhìn */
  }

  /* Đảm bảo menu không bị cắt bởi màn hình */
  nav.open {
    max-height: 80vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
}

/* Các animation */
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

/* Đảm bảo đủ spacing cho nội dung chính dưới header */
:deep(#app) {
  padding-top: 130px; /* Điều chỉnh dựa trên chiều cao thực tế của header */
}

/* Responsive cho chiều cao padding của nội dung */
@media (max-width: 768px) {
  :deep(#app) {
    padding-top: 90px; /* Điều chỉnh cho mobile */
  }
}

/* Cải thiện chất lượng UI cho dropdown menu */
.dropdown-menu li a {
  position: relative;
  transition: all 0.2s ease;
}

.dropdown-menu li a:hover {
  padding-left: 20px;
}

/* Hiệu ứng active cho các menu item */
nav ul li a.router-link-active {
  color: #e74c3c;
}

nav ul li a.router-link-active:after {
  width: 100%;
}

.dropdown-menu li a.router-link-active {
  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

/* Hiệu ứng focus cho accessibility */
nav ul li a:focus,
.dropdown-menu li a:focus,
.search-btn:focus,
.register-link:focus {
  outline: 2px solid rgba(231, 76, 60, 0.5);
  outline-offset: 2px;
}

/* Cải thiện hiệu suất bằng cách sử dụng hardware acceleration */
.dropdown-menu,
nav.open,
.logo img,
.content-modal {
  transform: translateZ(0);
  backface-visibility: hidden;
}

a:focus:not(:focus-visible),
button:focus:not(:focus-visible) {
  outline: none;
  box-shadow: none;
}

/* Hiệu ứng ripple cho các nút trên mobile */
@media (max-width: 768px) {
  .dropdown-menu li a:active::after,
  nav ul li a:active::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(231, 76, 60, 0.3);
    border-radius: 100%;
    transform: scale(1);
    opacity: 1;
    animation: ripple 0.6s linear;
  }

  @keyframes ripple {
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
}

/* Làm mượt hơn chuyển động của dropdown */
.dropdown-menu {
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out,
    max-height 0.3s ease-in-out;
}

/* Cải thiện khả năng truy cập */
.menu-toggle {
  padding: 8px;
  border-radius: 4px;
}

.menu-toggle:focus {
  outline: 2px solid rgba(231, 76, 60, 0.5);
  outline-offset: 2px;
}

/* Cải thiện hiển thị của modal content */
.content-body {
  line-height: 1.6;
  color: #333;
}

.content-body :deep(h1):first-child,
.content-body :deep(h2):first-child,
.content-body :deep(h3):first-child {
  margin-top: 0;
}

/* Cải thiện hiệu năng scroll */
.content-body,
nav.scroll-enabled {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

/* Đảm bảo menu admin hiển thị đầy đủ */
.dropdown-menu.admin-menu.show {
  display: block;
  height: auto;
  visibility: visible;
}

/* Thêm style mới để xử lý menu admin trên mobile */
@media (max-width: 768px) {
  .dropdown-menu.admin-menu {
    position: static;
    width: 100%;
    border: none;
    box-shadow: none;
  }

  /* Thêm hiệu ứng phân biệt cho menu admin */
  .dropdown-menu.admin-menu li a {
    background-color: #f0f0f0;
    margin: 2px 5px;
    border-radius: 4px;
    padding-left: 30px;
  }

  /* Cải thiện khả năng nhận diện các menu item admin */
  .dropdown-menu.admin-menu li a:before {
    content: "•";
    margin-right: 8px;
    color: #e74c3c;
  }
}

/* Đồng bộ style cho menu sản phẩm trên mobile */
@media (max-width: 768px) {
  .dropdown-menu.product-menu {
    position: static;
    width: 100%;
    border: none;
    box-shadow: none;
  }

  .dropdown-menu.product-menu li a {
    background-color: #f0f0f0;
    margin: 2px 5px;
    border-radius: 4px;
    padding-left: 30px;
    width: calc(100% - 10px); /* Đảm bảo chiều rộng phù hợp với container */
    box-sizing: border-box;
    white-space: normal; /* Cho phép text wrap */
    word-break: break-word; /* Đảm bảo text không tràn ra ngoài */
  }

  .dropdown-menu.product-menu li a:before {
    content: "•";
    margin-right: 8px;
    color: #e74c3c;
  }
  
  /* Đảm bảo hiển thị đúng trên mobile */
  .dropdown-menu.product-menu.show {
    display: block;
    height: auto;
    visibility: visible;
    max-height: none;
    overflow-y: visible;
    width: 100%; /* Đảm bảo chiều rộng đầy đủ */
  }
  
  /* Đảm bảo các cột hiển thị đầy đủ */
  .dropdown-menu.product-menu .columns-wrapper {
    display: block;
    width: 100%;
  }
  
  .dropdown-menu.product-menu .column {
    margin-bottom: 5px;
    width: 100%;
  }
  
  /* Đảm bảo không có giới hạn chiều cao cho menu sản phẩm */
  .dropdown-menu.product-menu.show .column ul {
    max-height: none;
    overflow: visible;
    width: 100%;
  }
  
  /* Đảm bảo mỗi mục menu có chiều rộng phù hợp */
  .dropdown-menu.product-menu .column li {
    width: 100%;
    box-sizing: border-box;
  }
}

/* Hiệu ứng khi scroll header */
@media (min-width: 769px) {
  header {
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  header.scrolled {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  header.scroll-up {
    transform: translateY(0);
  }

  header.scroll-down {
    transform: translateY(-100%);
  }
}

/* Fullscreen Login Modal */
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.login-modal-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive adjustments for login modal */
@media (max-width: 500px) {
  .login-modal-container {
    max-width: 90%;
    padding: 15px;
  }
}
</style>
