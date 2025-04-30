<!-- ContentDisplay.vue -->
<template>
  <div class="content-container">
    <div v-if="loading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else class="content-wrapper">
      <div class="content-header">
        <h1>{{ title }}</h1>
      </div>
      <div class="content-body" v-html="content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from "/src/utils/axios";

// nhận props từ ngoài vào
const props = defineProps({
  category: {
    type: String,
    required: true
  }
});

// khai báo các biến reactive
const title = ref('');
const content = ref('');
const loading = ref(true);
const error = ref(null);

// hàm lấy nội dung
async function fetchContent(category) {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`/api/misc?cat=${category}`);
    const items = response.data; // API trả ra là mảng

    console.log('API trả về:', items);

    if (Array.isArray(items) && items.length > 0 && items[0].status === "OK") {
      const item = items[0]; // lấy phần tử đầu tiên
      title.value = item.val;
      content.value = item.vaL3; // Nội dung TinyMCE
    } else {
      error.value = "Không thể tải nội dung";
    }
  } catch (err) {
    error.value = "Đã xảy ra lỗi khi tải dữ liệu";
    console.error("Error fetching content:", err);
  } finally {
    loading.value = false;
  }
}

// theo dõi props.category để tự động fetch khi thay đổi
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      fetchContent(newCategory);
    }
  },
  { immediate: true } // chạy luôn lần đầu
);
</script>



<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.content-header {
  /* margin-bottom: 10px; */
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 15px;
}

.content-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.content-body {
  line-height: 1.6;
}

.loading, .error {
  text-align: center;
  padding: 50px 0;
}

.error {
  color: #d9534f;
}
</style>