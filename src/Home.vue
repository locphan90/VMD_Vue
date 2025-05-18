<template>
  <div>
    <Banner />
    <About />
    <Categories />
    <ResponsiveBanner banner-image="/images/banner 1.jpg">
      <!-- Nội dung tùy chọn bên trong banner -->
      <!-- <h1>Tiêu đề banner</h1>
      <p>Mô tả hoặc slogan của bạn</p> -->
    </ResponsiveBanner>
    <Products title="SẢN PHẨM NỔI BẬT" type="NOIBAT" />
    <Brands />
    <ResponsiveBanner banner-image="/images/banner 2.jpg">
      <!-- Nội dung tùy chọn bên trong banner -->
      <!-- <h1>Tiêu đề banner</h1>
      <p>Mô tả hoặc slogan của bạn</p> -->
    </ResponsiveBanner>
    <Products title="SẢN PHẨM MỚI" type="MOI" />
    <Partners />
    <News />
    <Newsletter />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import eventBus from "./eventBus";

import Banner from "./components/Banner.vue";
import About from "./components/About.vue";
import Categories from "./components/Categories.vue";
import Products from "./components/Products.vue";
import Brands from "./components/Brands.vue";
import Partners from "./components/Partners.vue";
import News from "./components/News.vue";
import Newsletter from "./components/Newsletter.vue";
import ResponsiveBanner from "./components/ResponsiveBanner.vue";

// Tạo ref cho từng section
const bannerSection = ref(null);
const aboutSection = ref(null);
const categoriesSection = ref(null);
const productSection = ref(null);
const brandsSection = ref(null);
const partnersSection = ref(null);
const newsSection = ref(null);
const newsletterSection = ref(null);

function handleScroll(target) {
  const sectionMap = {
    banner: bannerSection,
    about: aboutSection,
    categories: categoriesSection,
    product: productSection,
    brands: brandsSection,
    partners: partnersSection,
    news: newsSection,
    newsletter: newsletterSection,
  };

  const sectionRef = sectionMap[target];
  if (sectionRef?.value) {
    sectionRef.value.scrollIntoView({ behavior: "smooth" });
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
  document.title = "VMD - CÔNG TY CỔ PHẦN PHÁT TRIỂN THỊ TRƯỜNG VIỆT NAM";
});

onBeforeUnmount(() => {
  eventBus.off("scrollTo", handleScroll);
});
</script>

<style scoped>
</style>
