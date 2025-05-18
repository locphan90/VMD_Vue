<template>
  <div class="banner-display-container">
    <div class="banner-layout">
      <!-- Banner Chính (Slideshow) bên trái -->
      <div class="main-banner-container">
        <div class="main-banner-slideshow">
          <!-- Sử dụng v-if thay vì v-show để đảm bảo hiển thị đúng trên mobile -->
          <div class="slides-container">
            <div
              v-for="(banner, index) in mainBanners"
              :key="banner.id"
              class="slide"
              :class="{ 'active-slide': currentMainBannerIndex === index }"
              @click="navigateToBanner(banner)"
            >
              <img
                :src="banner.vaL2"
                :alt="`Banner chính ${index + 1}`"
                class="banner-image"
                loading="lazy"
              />
            </div>
          </div>

          <!-- Nút điều hướng slideshow -->
          <div class="slideshow-controls">
            <button @click="prevMainBanner" class="control-btn prev-btn">
              <i class="fas fa-chevron-left"></i>
            </button>
            <button @click="nextMainBanner" class="control-btn next-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>

          <!-- Chỉ báo vị trí slide -->
          <div class="slideshow-indicators">
            <span
              v-for="(banner, index) in mainBanners"
              :key="banner.id"
              :class="[
                'indicator',
                { active: currentMainBannerIndex === index },
              ]"
              @click="setMainBannerIndex(index)"
            ></span>
          </div>
        </div>
      </div>

      <!-- 3 Banner Phụ bên phải -->
      <div class="secondary-banners-container">
        <!-- Hiển thị các banner phụ có dữ liệu -->
        <div
          v-for="(banner, index) in filteredSecondaryBanners"
          :key="`banner-${index}`"
          class="secondary-banner"
          @click="navigateToBanner(banner)"
        >
          <img
            :src="banner.vaL2"
            :alt="`Banner phụ ${index + 1}`"
            class="banner-image"
            loading="lazy"
          />
        </div>

        <!-- Placeholder cho banner phụ nếu chưa có đủ 3 cái -->
        <div
          v-for="index in missingSecondaryBannersCount"
          :key="`empty-${index}`"
          class="secondary-banner empty"
        >
          <div class="empty-banner-placeholder">
            <span>Chưa có banner</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

// State cho banner
const mainBanners = ref([]);
const secondaryBanners = ref([]);
const loading = ref(true);
const error = ref(null);
const isMobile = ref(false);

// State cho slideshow
const currentMainBannerIndex = ref(0);
const slideshowInterval = ref(null);
const slideshowDuration = 5000; // 5 giây cho mỗi slide
const isTransitioning = ref(false);

// Theo dõi kích thước màn hình
const handleResize = () => {
  isMobile.value = window.innerWidth <= 768;
};

// Tính số lượng banner phụ còn thiếu để điền placeholder
const missingSecondaryBannersCount = computed(() => {
  const actualCount = secondaryBanners.value.filter(
    (banner) => banner !== null
  ).length;
  return Math.max(0, 3 - actualCount);
});

// Hàm lấy dữ liệu banner từ API
const fetchBanners = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await axios.get("api/MISC?cat=BANNER");

    if (response.data) {
      // Lọc banner chính (val=1 và status=OK)
      mainBanners.value = response.data
        .filter((banner) => banner.val === "1" && banner.status === "OK")
        .map((banner) => ({
          ...banner,
          vaL2: getFullFtpUrl(banner.vaL2), // Chuyển đổi URL để hiển thị hình ảnh
        }));

      // Lấy banner phụ (val=2, val=3, val=4 và status=OK)
      const secondary1 = response.data.find(
        (banner) => banner.val === "2" && banner.status === "OK"
      );
      const secondary2 = response.data.find(
        (banner) => banner.val === "3" && banner.status === "OK"
      );
      const secondary3 = response.data.find(
        (banner) => banner.val === "4" && banner.status === "OK"
      );

      // Chuyển đổi các URL của banner phụ nếu tồn tại
      secondaryBanners.value = [
        secondary1
          ? { ...secondary1, vaL2: getFullFtpUrl(secondary1.vaL2) }
          : null,
        secondary2
          ? { ...secondary2, vaL2: getFullFtpUrl(secondary2.vaL2) }
          : null,
        secondary3
          ? { ...secondary3, vaL2: getFullFtpUrl(secondary3.vaL2) }
          : null,
      ];

      // Bắt đầu slideshow nếu có nhiều hơn 1 banner chính
      if (mainBanners.value.length > 1) {
        startSlideshow();
      }
    }
  } catch (err) {
    console.error("Error fetching banners:", err);
    error.value = "Không thể tải dữ liệu banner. Vui lòng thử lại sau.";
  } finally {
    loading.value = false;
  }
};

// Hàm điều hướng khi click vào banner
const navigateToBanner = (banner) => {
  if (banner && banner.vaL3) {
    // Kiểm tra xem URL có bắt đầu bằng http hoặc https không
    let url = banner.vaL3;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Mở link trong tab mới
    window.open(url, "_blank");
  }
};

// Hàm điều khiển slideshow banner chính
const nextMainBanner = () => {
  if (mainBanners.value.length <= 1 || isTransitioning.value) return;

  isTransitioning.value = true;
  currentMainBannerIndex.value =
    (currentMainBannerIndex.value + 1) % mainBanners.value.length;
  resetSlideshowTimer();
  
  // Đặt lại trạng thái chuyển đổi sau khi hoàn thành
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500); // Thời gian bằng với thời gian chuyển đổi CSS
};

const prevMainBanner = () => {
  if (mainBanners.value.length <= 1 || isTransitioning.value) return;

  isTransitioning.value = true;
  currentMainBannerIndex.value =
    (currentMainBannerIndex.value - 1 + mainBanners.value.length) %
    mainBanners.value.length;
  resetSlideshowTimer();
  
  // Đặt lại trạng thái chuyển đổi sau khi hoàn thành
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500); // Thời gian bằng với thời gian chuyển đổi CSS
};

const setMainBannerIndex = (index) => {
  if (isTransitioning.value) return;
  
  isTransitioning.value = true;
  currentMainBannerIndex.value = index;
  resetSlideshowTimer();
  
  // Đặt lại trạng thái chuyển đổi sau khi hoàn thành
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500); // Thời gian bằng với thời gian chuyển đổi CSS
};

const filteredSecondaryBanners = computed(() => {
  return secondaryBanners.value.filter((banner) => banner !== null);
});

const startSlideshow = () => {
  // Xóa interval cũ nếu có
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value);
  }

  // Tạo interval mới
  slideshowInterval.value = setInterval(() => {
    nextMainBanner();
  }, slideshowDuration);
};

const resetSlideshowTimer = () => {
  // Reset timer khi người dùng tương tác với slideshow
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value);
    startSlideshow();
  }
};

// Preload hình ảnh để tránh giật khi chuyển slide
const preloadImages = () => {
  if (mainBanners.value.length > 0) {
    mainBanners.value.forEach(banner => {
      const img = new Image();
      img.src = banner.vaL2;
    });
  }
  
  if (secondaryBanners.value.length > 0) {
    secondaryBanners.value.forEach(banner => {
      if (banner) {
        const img = new Image();
        img.src = banner.vaL2;
      }
    });
  }
};

// Hooks
onMounted(() => {
  fetchBanners();
  // Khởi tạo giá trị isMobile
  handleResize();
  window.addEventListener('resize', handleResize);
  
  // Preload hình ảnh sau khi fetch
  watch(mainBanners, () => {
    preloadImages();
  });
});

onBeforeUnmount(() => {
  // Xóa interval khi component unmount để tránh memory leak
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value);
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.banner-display-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.banner-layout {
  display: flex;
  gap: 20px;
  width: 100%;
  height: 400px; /* Chiều cao cố định cho layout */
}

/* Banner Chính (Slideshow) */
.main-banner-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  will-change: transform; /* Tối ưu hiệu suất */
}

.main-banner-slideshow {
  width: 100%;
  height: 100%;
  position: relative;
}

.slides-container {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0); /* Kích hoạt GPU acceleration */
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  backface-visibility: hidden; /* Tối ưu hiệu suất */
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  z-index: 1; /* Đảm bảo slide hiển thị trên các phần tử khác */
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: none; /* Ẩn tất cả slide mặc định */
}

.slide.active-slide {
  z-index: 2; /* Slide đang hiển thị có z-index cao hơn */
  opacity: 1;
  display: block; /* Hiển thị slide đang active */
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform; /* Tối ưu hiệu suất */
}

.slide:hover .banner-image {
  transform: scale(1.03);
}

/* Nút điều khiển slideshow */
.slideshow-controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  z-index: 10;
}

.control-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent; /* Loại bỏ highlight khi tap trên mobile */
}

.control-btn:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

/* Chỉ báo vị trí slide */
.slideshow-indicators {
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  -webkit-tap-highlight-color: transparent; /* Loại bỏ highlight khi tap trên mobile */
}

.indicator.active {
  background-color: white;
  transform: scale(1.2);
}

.indicator:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

/* 3 Banner Phụ */
.secondary-banners-container {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.secondary-banner {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  will-change: transform; /* Tối ưu hiệu suất */
}

.secondary-banner.empty {
  background-color: #f0f0f0;
  cursor: default;
}

.empty-banner-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-style: italic;
}

.secondary-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  will-change: transform; /* Tối ưu hiệu suất */
}

.secondary-banner:hover img {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .banner-display-container {
    padding: 10px;
  }
  
  .banner-layout {
    flex-direction: column;
    height: auto;
    gap: 15px;
  }

  .main-banner-container {
    height: 250px; /* Chiều cao banner chính trên mobile */
    width: 100%;
    flex: none;
  }
  
  .slide {
    position: absolute;
    height: 100%;
    width: 100%;
  }
  
  .slide.active-slide {
    display: block !important;
  }

  .secondary-banners-container {
    width: 100%;
    flex-direction: column;
    height: auto;
    gap: 15px;
  }

  .secondary-banner {
    flex: none;
    height: 180px;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .banner-display-container {
    padding: 10px;
  }
  
  .banner-layout {
    gap: 10px;
  }
  
  .main-banner-container {
    height: 200px; /* Giảm chiều cao hơn nữa trên điện thoại nhỏ */
  }
  
  .secondary-banner {
    height: 150px;
  }
  
  .control-btn {
    width: 32px;
    height: 32px;
  }
  
  .slideshow-indicators {
    bottom: 10px;
  }
  
  .indicator {
    width: 8px;
    height: 8px;
  }
}
</style>
