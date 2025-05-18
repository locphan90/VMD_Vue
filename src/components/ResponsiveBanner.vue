<template>
  <div class="banner-container">
    <div class="banner" :style="bannerStyle">
      <img :src="bannerImage" alt="Banner Image" class="banner-image" :style="{ objectPosition: imagePosition }" />
      <div class="banner-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsiveBanner',
  props: {
    bannerImage: {
      type: String,
      default: '/api/placeholder/1200/350'
    },
    position: {
      type: String,
      default: 'center',
      validator: (value) => {
        const validPositions = ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'];
        return validPositions.includes(value);
      }
    },
    aspectRatio: {
      type: String,
      default: '1200/350' // Tỉ lệ mặc định 1200x350
    },
    maxWidth: {
      type: String,
      default: '1200px'
    }
  },
  computed: {
    imagePosition() {
      return this.position;
    },
    bannerStyle() {
      return {
        aspectRatio: this.aspectRatio,
        maxWidth: this.maxWidth
      };
    }
  }
}
</script>

<style scoped>
.banner-container {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 0 auto; /* Thêm margin auto để canh giữa */
  /* Sử dụng aspect-ratio từ props thay vì height cố định */
}

.banner-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* Crop và căn chỉnh hình ảnh */
}

/* Banner content for optional overlay text */
.banner-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 1rem;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .banner {
    /* Giữ nguyên tỉ lệ ở màn hình lớn */
  }
}

@media (max-width: 768px) {
  .banner {
    /* Cho phép tỉ lệ giữ nguyên, không giới hạn chiều cao */
  }
}

@media (max-width: 480px) {
  .banner-content {
    padding: 0.5rem;
  }
}
</style>