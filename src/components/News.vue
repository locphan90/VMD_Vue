<template>
  <section class="news">
    <h2 class="section-title">TIN TỨC</h2>
    <div class="news-grid">
      <router-link
        :to="`/news/${item.id}`"
        class="news-card"
        v-for="(item, index) in news"
        :key="index"
      >
        <div class="news-image">
          <img :src="item.image" />
        </div>
        <div class="news-content">
          <h3 class="news-title">{{ item.tieude }}</h3>
        </div>
      </router-link>
    </div>
  </section>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

export default {
  name: "News",
  data() {
    return {
      news: [],
    };
  },
  async mounted() {
    await this.fetchNews();
  },
  methods: {
    async fetchNews() {
      try {
        const res = await axios.get("/api/THONGTINSUKIEN");
        this.news = res.data
          .filter((item) => item.status === "OK")
          .map((item) => ({
            id: item.id,
            image: getFullFtpUrl(item.linkAnh),
            tieude: item.tieuDe,
          }));
      } catch (err) {
        console.error("Lỗi khi tải thương hiệu:", err);
      }
    },
  },
};
</script>

<style scoped>
.news {
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

.news-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.news-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-image {
  height: 150px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  padding: 15px;
  flex-grow: 1;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>
