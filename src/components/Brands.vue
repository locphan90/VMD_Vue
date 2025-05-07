<template>
  <section class="brands">
    <h2 class="section-title">NHÃN HIỆU</h2>
    <div class="brand-grid">
      <div class="brand-card" v-for="(brand, index) in brands" :key="index">
        <router-link :to="`/nhanhieu/${brand.name}`" class="brand-logo">
          <img
            :src="brand.image"
            :alt="brand.name"
            @error="handleImageError($event, brand.name)"
          />
        </router-link>
        <div class="brand-name">{{ brand.name }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

export default {
  name: "Brands",
  data() {
    return {
      brands: [],
    };
  },
  async mounted() {
    await this.fetchBrands();
  },
  methods: {
    async fetchBrands() {
      try {
        const res = await axios.get("/api/MISC?cat=THUONGHIEU");
        this.brands = res.data
          .filter((item) => item.status === "OK")
          .map((item) => ({
            image: getFullFtpUrl(item.vaL2),
            name: item.val,
          }));
      } catch (err) {
        console.error("Lỗi khi tải nhãn hiệu:", err);
      }
    },
    handleImageError(event, name) {
      event.target.src = `https://via.placeholder.com/150?text=${encodeURIComponent(
        name
      )}`;
    },
  },
};
</script>

<style scoped>
.brands {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
}

.section-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: #333;
  position: relative;
}

.section-title::after {
  content: "";
  display: block;
  width: 50px;
  height: 3px;
  background-color: #e74c3c;
  margin: 10px auto;
}

.brand-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 👉 Canh giữa */
  gap: 16px;
}

.brand-card {
  width: 120px;
  height: 120px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.brand-card:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: #fdfdfd;
}

.brand-logo {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-name {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .brand-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .brand-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
