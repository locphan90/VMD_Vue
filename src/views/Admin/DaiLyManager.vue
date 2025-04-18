<template>
  <div class="manager-wrapper scroll-target">
    <h2>Danh sách đăng ký Đại lý (Chờ duyệt)</h2>

    <div class="grid">
      <div class="grid-header">
        <span>Họ tên</span>
        <span>Email</span>
        <span>SĐT</span>
        <span>Địa chỉ</span>
        <span>Nội dung</span>
        <span>Hành động</span>
      </div>

      <div class="grid-row" v-for="item in daiLyListChoDuyet" :key="item.id">
        <span>{{ item.hoTen }}</span>
        <span>{{ item.email }}</span>
        <span>{{ item.phone }}</span>
        <span>{{ item.address }}</span>
        <span>{{ item.noiDung }}</span>
        <span class="actions">
          <button class="btn-accept" @click="updateStatus(item.id, 'OK')">Duyệt</button>
          <button class="btn-reject" @click="updateStatus(item.id, 'XX')">Không duyệt</button>
        </span>
      </div>
    </div>

    <!-- Lưới đã duyệt hoặc không duyệt -->
    <h2 style="margin-top: 40px;">Danh sách Đại lý đã xử lý</h2>

    <div class="grid">
      <div class="grid-header">
        <span>Họ tên</span>
        <span>Email</span>
        <span>SĐT</span>
        <span>Địa chỉ</span>
        <span>Người duyệt</span>
        <span>Ngày duyệt</span>
      </div>

      <div class="grid-row" v-for="item in daiLyListDaXuLy" :key="item.id">
        <span>{{ item.hoTen }}</span>
        <span>{{ item.email }}</span>
        <span>{{ item.phone }}</span>
        <span>{{ item.address }}</span>
        <span>{{ getUserName(item.nguoiDuyet) }}</span>
        <span>{{ formatDate(item.ngayDuyet) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const daiLyListChoDuyet = ref([]);
const daiLyListDaXuLy = ref([]);

const fetchData = async () => {
  try {
    const res = await axios.get("https://localhost:7210/api/DaiLy");
    const all = res.data;

    daiLyListChoDuyet.value = all.filter((x) => x.status === "QQ");
    daiLyListDaXuLy.value = all.filter((x) => x.status !== "QQ");
  } catch (err) {
    console.error("Lỗi tải danh sách:", err);
  }
};

const users = ref([]);

const fetchUsers = async () => {
  const res = await axios.get("https://localhost:7210/api/User");
  users.value = res.data;
};

// Hàm hiển thị tên người duyệt từ ID
const getUserName = (id) => {
  const found = users.value.find((u) => u.id === id);
  return found ? found.userName : "Không rõ";
};

const updateStatus = async (id, status) => {
  try {
    const userId = parseInt(localStorage.getItem("userId"));
    if (!userId) {
      alert("Không tìm thấy thông tin người duyệt. Vui lòng đăng nhập lại.");
      return;
    }

    const ngayDuyet = new Date().toISOString();

    await axios.put(`https://localhost:7210/api/DaiLy/${id}`, {
      Status: status,
      NguoiDuyet: userId, // ✅ chính xác ID user
      NgayDuyet: ngayDuyet,
    });

    await fetchData();
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    alert("Không thể cập nhật trạng thái!");
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
};

onMounted(() => {
  fetchData();
  fetchUsers();
});
</script>

<style scoped>
.manager-wrapper {
  max-width: 1100px;
  margin: 40px auto;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #2c3e50;
}

.grid {
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
}

.grid-header,
.grid-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.grid-header {
  font-weight: bold;
  background-color: #f2f2f2;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-accept {
  padding: 6px 10px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-reject {
  padding: 6px 10px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-accept:hover {
  background: #27ae60;
}

.btn-reject:hover {
  background: #c0392b;
}
.scroll-target {
  margin-top: 170px; /* đúng với chiều cao header */
}
</style>
