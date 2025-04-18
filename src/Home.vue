<template>
  <div>
    <section ref="bannerSection" class="scroll-target">
      <Banner />
    </section>

    <section ref="aboutSection" class="scroll-target">
      <About />
    </section>

    <section ref="categoriesSection" class="scroll-target">
      <Categories />
    </section>

    <section ref="productSection" class="scroll-target">
      <Products title="SẢN PHẨM NỔI BẬT" type="NOIBAT" />
    </section>

    <section ref="brandsSection" class="scroll-target">
      <Brands />
    </section>

    <Products title="SẢN PHẨM MỚI" type="MOI" />
    <!-- Không cần scroll -->

    <section ref="partnersSection" class="scroll-target">
      <Partners />
    </section>

    <section ref="newsSection" class="scroll-target">
      <News />
    </section>

    <section ref="footerSection" class="scroll-target">
      <Newsletter />
    </section>
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
});

onBeforeUnmount(() => {
  eventBus.off("scrollTo", handleScroll);
});
</script>



<style scoped>
/* Nếu cần style riêng cho trang Home thì thêm vào đây */
.scroll-target {
  scroll-margin-top: 300px; /* Chỉnh theo đúng chiều cao header của bạn */
}
</style>
