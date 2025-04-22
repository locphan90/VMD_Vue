<template>
  <div class="banner-display-container">
    <div class="banner-layout">
      <!-- Banner Chính (Slideshow) bên trái -->
      <div class="main-banner-container">
        <div class="main-banner-slideshow">
          <transition-group name="fade" tag="div" class="slides-container">
            <div
              v-for="(banner, index) in mainBanners"
              :key="banner.id"
              class="slide"
              v-show="currentMainBannerIndex === index"
              @click="navigateToBanner(banner)"
            >
              <img
                :src="banner.vaL2"
                :alt="`Banner chính ${index + 1}`"
                class="banner-image"
              />
            </div>
          </transition-group>

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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

// State cho banner
const mainBanners = ref([]);
const secondaryBanners = ref([]);
const loading = ref(true);
const error = ref(null);

// State cho slideshow
const currentMainBannerIndex = ref(0);
const slideshowInterval = ref(null);
const slideshowDuration = 5000; // 5 giây cho mỗi slide

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
  if (mainBanners.value.length <= 1) return;

  currentMainBannerIndex.value =
    (currentMainBannerIndex.value + 1) % mainBanners.value.length;
  resetSlideshowTimer();
};

const prevMainBanner = () => {
  if (mainBanners.value.length <= 1) return;

  currentMainBannerIndex.value =
    (currentMainBannerIndex.value - 1 + mainBanners.value.length) %
    mainBanners.value.length;
  resetSlideshowTimer();
};

const setMainBannerIndex = (index) => {
  currentMainBannerIndex.value = index;
  resetSlideshowTimer();
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

// Hooks
onMounted(() => {
  fetchBanners();
});

onBeforeUnmount(() => {
  // Xóa interval khi component unmount để tránh memory leak
  if (slideshowInterval.value) {
    clearInterval(slideshowInterval.value);
  }
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
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.slide:hover .banner-image {
  transform: scale(1.03);
}

/* Hiệu ứng chuyển đổi */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
.slide {
  position: relative;
}

/* Responsive Design */
@media (max-width: 768px) {
  .slide {
    position: relative !important;
  }
  .banner-layout {
    flex-direction: column;
    height: auto;
  }

  .main-banner-container {
    height: 300px;
  }

  .secondary-banners-container {
    width: 100%;
    flex-direction: row;
    height: 120px;
  }

  .secondary-banner {
    flex: 1;
  }

  .main-banner-container {
    height: 300px;
  }

  .main-banner-slideshow,
  .slides-container,
  .slide,
  .banner-image {
    height: 100%;
  }
}

@media (max-width: 480px) {
  .secondary-banners-container {
    flex-direction: column;
    height: auto;
  }

  .secondary-banner {
    height: 120px;
  }
}
</style>