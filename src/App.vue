<template>
  <div>
    <Header :username="username" />
    <main class="main-contenthome">
      <router-view />
    </main>
    <footer ref="footerSection">
      <Footer />
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
// import eventBus from './eventBus'; // nếu chưa dùng thì có thể bỏ

const username = ref(null);

// Đọc username khi app khởi động
onMounted(() => {
  username.value = localStorage.getItem("username");

  const storedRole = localStorage.getItem("role");
  if (!username.value || !storedRole) {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }
});

// Scroll to footer nếu cần dùng
const footerSection = ref(null);
function handleScroll(target) {
  if (target === "footer") {
    footerSection.value?.scrollIntoView({ behavior: "smooth" });
  }
}

// onMounted(() => {
//   eventBus.on('scrollTo', handleScroll);
// });

onBeforeUnmount(() => {
  // eventBus.off('scrollTo', handleScroll);
});
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
  line-height: 1.6;
}
* {
  box-sizing: border-box;
}
img {
  max-width: 100%;
  height: auto;
  display: block;
}
.app-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
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
.main-contenthome {
  padding-top: 135px;
}
@media (max-width: 480px) {
  body {
    font-size: 14px;
  }
  .section-title {
    font-size: 18px;
  }
}
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
  .section-title {
    font-size: 18px;
  }
  .main-contenthome {
    padding-top: 80px;
  }
}
</style>
