<template>
  <section class="about">
    <div class="about-image">
      <img src="#" alt="Laboratory equipment" />
    </div>
    <div class="about-content">
      <h2>VỀ VMD</h2>
      <p>
        VMD được thành lập năm 2025 với đội ngũ sáng tạo dày dạn kinh nghiệm trong lĩnh vực phát triển sản phẩm tiêu thụ nhanh tại Việt Nam. Với vốn và tầm thế giới, VMD khai công mạng lưới phòng thí nghiệm đạt chuẩn (ISO các loại) và 1 & X nhà máy.
      </p>
    </div>
  </section>
</template>

<script>
export default {
  name: 'About',
};
</script>

<style scoped>
.about {
  max-width: 1200px;
  margin: 40px auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  padding: 0 15px;
  align-items: center;
}

.about-image {
  border-radius: 10px;
  overflow: hidden;
}

.about-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.about-content h2 {
  margin-bottom: 15px;
  color: #333;
  font-size: 24px;
}

.about-content p {
  color: #555;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .about {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .about-content h2 {
    font-size: 20px;
  }

  .about-content p {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .about-content h2 {
    font-size: 18px;
  }

  .about-content p {
    font-size: 13px;
  }
}
</style>