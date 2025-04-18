<template>
  <section class="brands">
    <h2 class="section-title">THƯƠNG HIỆU</h2>
    <div class="brand-grid">
      <div class="brand-card" v-for="(brand, index) in brands" :key="index">
        <img :src="brand.image" :alt="brand.name" />
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
        console.error("Lỗi khi tải thương hiệu:", err);
      }
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
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #e74c3c;
  margin: 10px auto;
}

.brand-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 👈 canh giữa khi ít */
  gap: 16px; /* 👈 khoảng cách giữa các thẻ */
}

.brand-card {
  width: 102.59px;
  height: 102.59px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-card img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 👌 cắt ảnh gọn đẹp */
}

/* Responsive: nếu màn hình nhỏ thì giãn đều vẫn giữ kích thước */
@media (max-width: 768px) {
  .brand-grid {
    gap: 12px;
  }
}
</style>
