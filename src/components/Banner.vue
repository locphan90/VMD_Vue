<template>
  <section class="banner">
    <div class="banner-large">
      <img src="#" alt="Futa Đào Trà Sả" />
      <div class="slider-nav slider-prev"><i class="fas fa-chevron-left"></i></div>
      <div class="slider-nav slider-next"><i class="fas fa-chevron-right"></i></div>
    </div>
    <div class="banner-small">
      <div class="banner-item">
        <img src="#" alt="Welcome Coffesh" />
      </div>
      <div class="banner-item">
        <img src="#" alt="Coffee Beans" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Banner',
};
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
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.banner-large img {
  width: 100%;
  height: auto;
  display: block;
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
  height: auto;
  display: block;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.7);
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

@media (max-width: 768px) {
  .banner {
    grid-template-columns: 1fr;
  }

  .banner-small {
    grid-template-rows: 1fr;
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .slider-nav {
    width: 24px;
    height: 24px;
  }
}
</style>
