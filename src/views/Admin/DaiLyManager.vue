<template>
  <div class="manager-wrapper">
    <h2>Danh sách đăng ký Đại lý (Chờ duyệt)</h2>

    <!-- Hiển thị dạng thẻ (card) cho màn hình điện thoại -->
    <div class="card-container">
      <div class="agent-card" v-for="item in daiLyListChoDuyet" :key="item.id">
        <div class="card-header">
          <h3>{{ item.hoTen }}</h3>
          <div class="status-badge pending">Chờ duyệt</div>
        </div>
        <div class="card-content">
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ item.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">SĐT:</span>
            <span class="value">{{ item.phone }}</span>
          </div>
          <div class="info-row">
            <span class="label">Địa chỉ:</span>
            <span class="value">{{ item.address }}</span>
          </div>
          <div class="info-row">
            <span class="label">Ngành:</span>
            <span class="value">{{ item.nganh || 'Chưa cập nhật' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Nội dung:</span>
            <span class="value">{{ item.noiDung }}</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="btn-accept" @click="updateStatus(item.id, 'OK')">Duyệt</button>
          <button class="btn-reject" @click="updateStatus(item.id, 'XX')">Không duyệt</button>
        </div>
      </div>
    </div>

    <!-- Danh sách đã xử lý -->
    <h2 style="margin-top: 40px;">Danh sách Đại lý đã xử lý</h2>

    <div class="card-container">
      <div class="agent-card" v-for="item in daiLyListDaXuLy" :key="item.id">
        <div class="card-header">
          <h3>{{ item.hoTen }}</h3>
          <div class="status-badge" :class="item.status === 'OK' ? 'approved' : 'rejected'">
            {{ item.status === 'OK' ? 'Đã duyệt' : 'Không duyệt' }}
          </div>
        </div>
        <div class="card-content">
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ item.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">SĐT:</span>
            <span class="value">{{ item.phone }}</span>
          </div>
          <div class="info-row">
            <span class="label">Địa chỉ:</span>
            <span class="value">{{ item.address }}</span>
          </div>
          <div class="info-row">
            <span class="label">Ngành:</span>
            <span class="value">{{ item.nganh || 'Chưa cập nhật' }}</span>
          </div>
          <div class="info-row">
            <span class="label">Người duyệt:</span>
            <span class="value">{{ getUserName(item.nguoiDuyet) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Ngày duyệt:</span>
            <span class="value">{{ formatDate(item.ngayDuyet) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from '@/utils/axios';

const daiLyListChoDuyet = ref([]);
const daiLyListDaXuLy = ref([]);

const fetchData = async () => {
  try {
    const res = await axios.get("/api/DaiLy");
    const all = res.data;

    daiLyListChoDuyet.value = all.filter((x) => x.status === "QQ");
    daiLyListDaXuLy.value = all.filter((x) => x.status !== "QQ");
  } catch (err) {
    console.error("Lỗi tải danh sách:", err);
  }
};

const users = ref([]);

const fetchUsers = async () => {
  const res = await axios.get("/api/User");
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

    await axios.post(`/api/DaiLy/update/${id}`, {
      Status: status,
      NguoiDuyet: userId,
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
  document.title="VMD - ADMIN"
});
</script>

<style scoped>
.manager-wrapper {
  max-width: 1100px;
  margin: 20px auto;
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.5rem;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.agent-card {
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  margin-bottom: 15px;
}

.card-header {
  background: #f2f2f2;
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.status-badge.pending {
  background-color: #f39c12;
}

.status-badge.approved {
  background-color: #2ecc71;
}

.status-badge.rejected {
  background-color: #e74c3c;
}

.card-content {
  padding: 15px;
}

.info-row {
  display: flex;
  padding: 7px 0;
  border-bottom: 1px dashed #eee;
  flex-direction: column;
}

.label {
  font-weight: 500;
  color: #555;
  margin-bottom: 4px;
}

.value {
  color: #333;
  word-break: break-word;
}

.card-actions {
  display: flex;
  padding: 12px 15px;
  background: #efefef;
  gap: 10px;
  justify-content: flex-end;
}

.btn-accept {
  padding: 8px 15px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-reject {
  padding: 8px 15px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-accept:hover {
  background: #27ae60;
}

.btn-reject:hover {
  background: #c0392b;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .info-row {
    flex-direction: row;
  }
  
  .label {
    width: 100px;
    margin-bottom: 0;
  }
  
  .value {
    flex: 1;
  }
}

@media (min-width: 1024px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

.scroll-target {
  margin-top: 170px; /* đúng với chiều cao header */
}
</style>