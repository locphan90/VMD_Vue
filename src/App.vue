<template>
  <div>
    <Header />
    <Banner />
    <About />
    <Categories />
    <Products title="Sản phẩm nổi bật" />
    <Brands />
    <Products title="Sản phẩm mới" />
    <Partners />
    <News />
    <Newsletter />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Banner from './components/Banner.vue';
import About from './components/About.vue';
import Categories from './components/Categories.vue';
import Products from './components/Products.vue';
import Brands from './components/Brands.vue';
import Partners from './components/Partners.vue';
import News from './components/News.vue';
import Newsletter from './components/Newsletter.vue';
import Footer from './components/Footer.vue';

export default {
  components: {
    Header,
    Banner,
    About,
    Categories,
    Products,
    Brands,
    Partners,
    News,
    Newsletter,
    Footer,
  },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  color: #333;
}
</style>