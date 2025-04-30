<!-- ProductCategoryManager.vue -->
<template>
  <div class="category-manager-container">
    <h1 class="page-title">Quản lý danh mục sản phẩm</h1>

    <!-- Form thêm danh mục -->
    <div class="add-category-form">
      <h2>Thêm danh mục mới</h2>
      <div class="form-group">
        <label for="categoryName">Tên danh mục:</label>
        <input
          type="text"
          id="categoryName"
          v-model="newCategory"
          placeholder="Nhập tên danh mục sản phẩm"
          :disabled="isSubmitting"
        />
      </div>
      <button
        class="btn-add"
        @click="addCategory"
        :disabled="!newCategory || isSubmitting"
      >
        {{ isSubmitting ? "Đang thêm..." : "Thêm danh mục" }}
      </button>
      <div v-if="addError" class="error-message">
        {{ addError }}
      </div>
    </div>

    <!-- Lưới danh sách danh mục -->
    <div class="category-list">
      <h2>Danh sách danh mục</h2>

      <div v-if="isLoading" class="loading-message">Đang tải dữ liệu...</div>

      <div v-else-if="loadError" class="error-message">
        {{ loadError }}
      </div>

      <div v-else-if="categories.length === 0" class="empty-message">
        Chưa có danh mục sản phẩm nào.
      </div>

      <table v-else class="category-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>ID</th>
            <th>Tên danh mục</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(category, index) in categories" :key="category.id">
            <td>{{ index + 1 }}</td>
            <td>{{ category.id }}</td>
            <td>{{ category.val }}</td>
            <td>
              <button
                class="btn-delete"
                @click="confirmDelete(category)"
                :disabled="deletingId === category.id"
              >
                {{ deletingId === category.id ? "Đang xóa..." : "Xóa" }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal xác nhận xóa -->
    <div v-if="showDeleteModal" class="delete-modal">
      <div class="modal-content">
        <h3>Xác nhận xóa</h3>
        <p>Bạn có chắc chắn muốn xóa danh mục "{{ selectedCategory.val }}"?</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showDeleteModal = false">
            Hủy
          </button>
          <button class="btn-confirm" @click="deleteCategory">Xóa</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";

// Biến reactive
const categories = ref([]);
const newCategory = ref("");
const isLoading = ref(true);
const isSubmitting = ref(false);
const loadError = ref(null);
const addError = ref(null);
const showDeleteModal = ref(false);
const selectedCategory = ref(null);
const deletingId = ref(null);

// Hàm fetch danh mục sản phẩm
const fetchCategories = async () => {
  isLoading.value = true;
  loadError.value = null;

  try {
    const response = await axios.get("/api/misc?cat=DANHMUCSANPHAM");
    if (response.data && Array.isArray(response.data)) {
      categories.value = response.data;
    } else {
      throw new Error("Dữ liệu không hợp lệ");
    }
  } catch (error) {
    console.error("Lỗi khi tải danh mục:", error);
    loadError.value = "Không thể tải danh sách danh mục. Vui lòng thử lại sau.";
  } finally {
    isLoading.value = false;
  }
};

// Hàm thêm danh mục mới
const addCategory = async () => {
  if (!newCategory.value.trim()) {
    addError.value = "Vui lòng nhập tên danh mục";
    return;
  }

  isSubmitting.value = true;
  addError.value = null;

  try {
    const response = await axios.post("/api/misc", {
      cat: "DANHMUCSANPHAM",
      val: newCategory.value.trim(),
      vaL2: "",
    });

    if (response.data && response.data.status === "OK") {
      newCategory.value = "";
      fetchCategories();
    } else {
      throw new Error("Thêm danh mục không thành công");
    }
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
    addError.value = "Không thể thêm danh mục. Vui lòng thử lại sau.";
  } finally {
    isSubmitting.value = false;
  }
};

// Xác nhận xóa
const confirmDelete = (category) => {
  selectedCategory.value = category;
  showDeleteModal.value = true;
};

// Xóa danh mục
const deleteCategory = async () => {
  if (!selectedCategory.value || !selectedCategory.value.id) return;

  deletingId.value = selectedCategory.value.id;
  showDeleteModal.value = false;
  try {
    const response = await axios.post(
      `/api/misc/update/${selectedCategory.value.id}`,
      {
        status: "XX",
      }
    );
    if (response.status === 200) {
      categories.value = categories.value.filter(
        (c) => c.id !== selectedCategory.value.id
      );
    } else {
      throw new Error("Xóa danh mục không thành công");
    }
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    alert("Không thể xóa danh mục. Vui lòng thử lại sau.");
  } finally {
    deletingId.value = null;
    selectedCategory.value = null;
  }
};

// Lifecycle hook
onMounted(() => {
  fetchCategories();
});
</script>


<style scoped>
.category-manager-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

/* Form thêm danh mục */
.add-category-form {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 30px;
}

.add-category-form h2 {
  font-size: 18px;
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-add {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-add:hover {
  background-color: #45a049;
}

.btn-add:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Lưới danh sách */
.category-list h2 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
}

.category-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.category-table th,
.category-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.category-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.category-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.category-table tr:hover {
  background-color: #f1f1f1;
}

.btn-delete {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.btn-delete:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Modal xác nhận xóa */
.delete-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-cancel {
  background-color: #ccc;
  color: #333;
  border: none;
  padding: 8px 15px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-confirm {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 8px 15px;
  cursor: pointer;
  border-radius: 4px;
}

/* Thông báo */
.loading-message,
.empty-message {
  padding: 20px;
  text-align: center;
  color: #666;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.error-message {
  padding: 10px;
  margin-top: 10px;
  color: #a94442;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
  border-radius: 4px;
}
</style>