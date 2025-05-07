<template>
  <section class="about">
    <div class="about-image">
      <img src="/images/hinhdaidien.png" alt="Laboratory equipment" />
    </div>
    <div class="about-content">
      <h2>VỀ VMD</h2>
      <p>
        Công ty Cổ Phần Phát Triển Thị trường Việt Nam VMD là một trong những doanh nghiệp hàng đầu trong lĩnh vực phân phối, phát triển thị trường, kinh doanh đa ngành và cung cấp các giải pháp toàn diện cho các đối tác trong và ngoài nước. 
       <br> Với sứ mệnh thúc đẩy tăng trưởng kinh tế và mở rộng thị trường, VMD không ngừng nỗ lực để mang đến những dịch vụ chất lượng cao, đóng góp tích cực vào sự phát triển bền vững của nền kinh tế Việt Nam và khu vực
        Lĩnh vực hoạt động chính<br> VMD hoạt động đa ngành với các lĩnh vực trọng tâm bao gồm:... 
        <router-link to="/content/VECHUNGTOI">Xem thêm</router-link>
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