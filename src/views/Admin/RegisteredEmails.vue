<template>
  <section class="email-list">
    <h2 class="section-title">Danh sách đăng ký</h2>

    <div class="filter-box">
      <input v-model="search" placeholder="Tìm kiếm email..." />
    </div>

    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Email</th>
          <th>Ngày đăng ký</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedList" :key="item.id">
          <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
          <td>{{ item.email }}</td>
          <td>{{ formatDate(item.fstUpdate) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">◀</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        ▶
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "@/utils/axios"; // sử dụng axios đã cấu hình sẵn baseURL

const currentPage = ref(1);
const pageSize = 20;
const emailList = ref([]);
const search = ref("");

const fetchData = async () => {
  try {
    const res = await axios.get("/api/dangky");
    emailList.value = res.data.sort(
      (a, b) => new Date(b.ngayDangKy) - new Date(a.ngayDangKy)
    );
  } catch (err) {
    console.error("Lỗi tải danh sách:", err);
  }
};

onMounted(() => {
  document.title = "VMD - ADMIN";
  fetchData();
})

const filteredList = computed(() =>
  emailList.value.filter((item) =>
    item.email.toLowerCase().includes(search.value.toLowerCase())
  )
);

const totalPages = computed(() =>
  Math.ceil(filteredList.value.length / pageSize)
);

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredList.value.slice(start, start + pageSize);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const pad = (n) => (n < 10 ? "0" + n : n);
  return `${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
</script>

<style scoped>
.email-list {
  max-width: 800px;
  margin: 40px auto;
  padding: 0 15px;
}

.section-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 20px;
}

.filter-box {
  text-align: right;
  margin-bottom: 10px;
}

.filter-box input {
  padding: 8px;
  width: 250px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f8f8;
}

.pagination {
  margin-top: 15px;
  text-align: center;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 4px;
  background: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
  font-weight: bold;
}

@media (max-width: 600px) {
  .filter-box input {
    width: 100%;
    margin-top: 10px;
  }
}
</style>
