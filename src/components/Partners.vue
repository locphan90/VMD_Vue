<template>
  <section class="partners">
    <h2 class="section-title">ĐỐI TÁC</h2>
    <div class="partner-grid">
      <div
        class="partner-card"
        v-for="(partner, index) in partners"
        :key="index"
      >
        <a :href="partner.linkweb || '#'" target="_blank" rel="noopener">
          <div class="partner-logo">
            <img
              :src="partner.image"
              :alt="partner.name"
              @error="handleImageError($event, partner.name)"
            />
          </div>
          <div class="partner-name">{{ partner.name }}</div>
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

export default {
  name: "Partners",
  data() {
    return {
      partners: [],
    };
  },
  async mounted() {
    await this.fetchPartners();
  },
  methods: {
    async fetchPartners() {
      try {
        const res = await axios.get("/api/MISC?cat=DOITAC");
        this.partners = res.data
          .filter((item) => item.status === "OK")
          .map((item) => ({
            image: getFullFtpUrl(item.vaL2),
            name: item.val,
            linkweb: item.vaL3?.startsWith("http") ? item.vaL3 : `https://${item.vaL3}`,
          }));
      } catch (err) {
        console.error("Lỗi khi tải đối tác:", err);
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
.partners {
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

.partner-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* 👉 Canh giữa */
  gap: 16px;
}

.partner-card {
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

.partner-card:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: #fdfdfd;
}

.partner-logo {
  width: 100%;
  height: 70%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.partner-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.partner-name {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.partner-card a {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

/* Responsive */
@media (max-width: 768px) {
  .partner-grid {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .partner-grid {
    gap: 12px;
  }
}
</style>

