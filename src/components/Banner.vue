<template>
  <section class="banner">
    <div class="banner-large">
      <img :src="images[0]" alt="Hình lớn" />
      <div class="slider-nav slider-prev" @click="rotateLeft">
        <i class="fas fa-chevron-left"></i>
      </div>
      <div class="slider-nav slider-next" @click="rotateRight">
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
    <div class="banner-small">
      <div
        class="banner-item"
        v-for="(img, index) in images.slice(1)"
        :key="index"
      >
        <img :src="img" :alt="'Hình nhỏ ' + (index + 1)" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Banner",
  data() {
    return {
      images: [
        "https://picsum.photos/id/1011/1200/600",
        "https://picsum.photos/id/1025/600/200",
        "https://picsum.photos/id/103/600/200",
        "https://picsum.photos/id/1050/600/200",
      ],
    };
  },
  methods: {
    rotateLeft() {
      const first = this.images.shift(); // Lấy phần tử đầu
      this.images.push(first);           // Đẩy xuống cuối
    },
    rotateRight() {
      const last = this.images.pop();    // Lấy phần tử cuối
      this.images.unshift(last);         // Đưa lên đầu
    },
  },
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
  height: 100%;
  object-fit: cover;
  aspect-ratio: 3 / 2;
  display: block;
}

.banner-small {
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  gap: 15px;
}

.banner-item {
  border-radius: 10px;
  overflow: hidden;
}

.banner-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  aspect-ratio: 3 / 1;
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
    grid-template-rows: unset;
    grid-template-columns: repeat(3, 1fr);
  }

  .banner-item img {
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 480px) {
  .slider-nav {
    width: 24px;
    height: 24px;
  }

  .banner-small {
    grid-template-columns: 1fr;
  }
}
</style>
