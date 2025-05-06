<template>
  <section class="categories">
    <h2 class="section-title">NGÀNH HÀNG</h2>
    <div class="category-icons">
      <router-link to="/nganhhang/fmcg">
        <div class="category-icon animate">
          <img src="/images/FMCG.png" alt="FMCG" />
          <span>FMCG</span>
        </div>
      </router-link>
      <router-link to="/nganhhang/me-va-be">
        <div class="category-icon animate">
          <img src="/images/mother-day.png" alt="Mẹ & Bé" />
          <span>Mẹ & Bé</span>
        </div>
      </router-link>
      <router-link to="/nganhhang/healthcare">
        <div class="category-icon animate">
          <img src="/images/healthcare.png" alt="HealthCare" />
          <span>HealthCare</span>
        </div>
      </router-link>
      <router-link to="/nganhhang/industry">
        <div class="category-icon animate">
          <img src="/images/factory.png" alt="Industry" />
          <span>Industry</span>
        </div>
      </router-link>
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
  width: 100px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.category-icon img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-bottom: 8px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.category-icon span {
  display: block;
  font-size: 14px;
  color: #333;
  transition: color 0.3s ease;
}

.category-icon:hover {
  transform: scale(1.08);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: #fdfdfd;
}

.category-icon:hover span {
  color: #e74c3c;
}

/* Hiệu ứng fade-in + slide-up */
.animate {
  animation: fadeSlideUp 0.8s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeSlideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    width: 80px;
  }

  .category-icon img {
    width: 50px;
    height: 50px;
  }

  .category-icon span {
    font-size: 12px;
  }
}
</style>
