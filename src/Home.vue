<template>
  <div>
    <Banner />
    <About />
    <Categories />
    <Products title="Sản phẩm nổi bật" />
    <Brands />
    <Products title="Sản phẩm mới" />
    <Partners />
    <News />
    <Newsletter />
  </div>
</template>

<script>
import Banner from './components/Banner.vue';
import About from './components/About.vue';
import Categories from './components/Categories.vue';
import Products from './components/Products.vue';
import Brands from './components/Brands.vue';
import Partners from './components/Partners.vue';
import News from './components/News.vue';
import Newsletter from './components/Newsletter.vue';

export default {
  name: 'Home',
  components: {
    Banner,
    About,
    Categories,
    Products,
    Brands,
    Partners,
    News,
    Newsletter,
  },
};
</script>

<style scoped>
/* Nếu cần style riêng cho trang Home thì thêm vào đây */
</style>
