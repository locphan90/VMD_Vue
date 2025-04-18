<template>
  <div>
    <Header />
    <main class="main-content">
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
import eventBus from "./eventBus";

// Tạo ref cho footer
const footerSection = ref(null);

// Xử lý scroll tới footer
function handleScroll(target) {
  if (target === "footer") {
    footerSection.value?.scrollIntoView({ behavior: "smooth" });
  }
}

onMounted(() => {
  eventBus.on("scrollTo", handleScroll);
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  if (!username || !role) {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
  }
});

onBeforeUnmount(() => {
  eventBus.off("scrollTo", handleScroll);
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

.main-content {
  padding-top: 135px; /* hoặc đúng chiều cao header của bạn */
}

@media (max-width: 480px) {
  body {
    font-size: 14px;
  }

  .section-title {
    font-size: 18px;
  }
}
</style>