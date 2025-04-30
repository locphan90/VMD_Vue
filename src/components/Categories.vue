<template>
  <section class="categories">
    <h2 class="section-title">NGÀNH HÀNG</h2>
    <div class="category-icons">
      <div class="category-icon">
        <img src="/images/FMCG.png" alt="FMCG" />
      </div>
      <router-link to="/generalview">
        <div class="category-icon">
          <img src="/images/mother-day.png" alt="Mẹ & Bé" />
        </div>
      </router-link>
      <div class="category-icon">
        <img src="/images/healthcare.png" alt="HealthCare" />
      </div>
      <div class="category-icon">
        <img src="/images/factory.png" alt="Industry" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Categories",
};
</script>

<style scoped>
.categories {
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

.category-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.category-icon {
  width: 80px;
  text-align: center;
}

.category-icon img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

@media (max-width: 768px) {
  .category-icons {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .category-icons {
    gap: 15px;
  }

  .category-icon {
    width: 60px;
  }

  .category-icon img {
    width: 50px;
    height: 50px;
  }
}
</style>
