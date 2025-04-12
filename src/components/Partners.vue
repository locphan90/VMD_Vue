<template>
  <section class="partners">
    <h2 class="section-title">ĐỐI TÁC</h2>
    <div class="partner-grid">
      <div class="partner-card" v-for="(partner, index) in partners" :key="index">
        <img :src="partner.image" :alt="partner.name" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Partners',
  data() {
    return {
      partners: [
        { image: '/api/placeholder/180/80', name: 'WinMart' },
        { image: '/api/placeholder/180/80', name: 'CoopMart' },
        { image: '/api/placeholder/180/80', name: 'VietMark' },
        { image: '/api/placeholder/180/80', name: 'Circle K' },
        { image: '/api/placeholder/180/80', name: 'AEON' },
        { image: '/api/placeholder/180/80', name: 'GS25' },
      ],
    };
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
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #e74c3c;
  margin: 10px auto;
}

.partner-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.partner-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 80px;
}

.partner-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
