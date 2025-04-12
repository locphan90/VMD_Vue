// Banner.vue
<template>
  <section class="banner">
    <div class="banner-large">
      <img :src="mainBanner.image" :alt="mainBanner.alt">
      <div class="slider-nav slider-prev" @click="prevSlide"><i class="fas fa-chevron-left"></i></div>
      <div class="slider-nav slider-next" @click="nextSlide"><i class="fas fa-chevron-right"></i></div>
    </div>
    <div class="banner-small">
      <div class="banner-item" v-for="(banner, index) in smallBanners" :key="index">
        <img :src="banner.image" :alt="banner.alt">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Banner',
  data() {
    return {
      currentSlide: 0,
      banners: [
        { image: '/api/placeholder/600/300', alt: 'Futa Đào Trà Sả' },
        { image: '/api/placeholder/600/300', alt: 'Banner 2' },
        { image: '/api/placeholder/600/300', alt: 'Banner 3' }
      ],
      smallBanners: [
        { image: '/api/placeholder/300/140', alt: 'Welcome Coffesh' },
        { image: '/api/placeholder/300/140', alt: 'Coffee Beans' }
      ]
    }
  },
  computed: {
    mainBanner() {
      return this.banners[this.currentSlide];
    }
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.banners.length;
    },
    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.banners.length) % this.banners.length;
    }
  },
  mounted() {
    // Auto slide every 5 seconds
    setInterval(this.nextSlide, 5000);
  }
}
</script>

<style scoped>
.banner {
  max-width: 1200px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
  padding: 0 15px;
}

.banner-large {
  height: 300px;
  background-color: #e2ffe0;
  overflow: hidden;
  border-radius: 10px;
  position: relative;
}

.banner-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-small {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 15px;
}

.banner-item {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Navigation for sliders */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-color: rgba(255,255,255,0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.slider-prev {
  left: 10px;
}

.slider-next {
  right: 10px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .banner {
    grid-template-columns: 1fr;
  }
}
</style>