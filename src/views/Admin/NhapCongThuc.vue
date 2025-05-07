<template>
  <div class="recipe-form-container">
    <h1 class="form-title">Quản lý công thức</h1>

    <!-- Form Nhập Công Thức -->
    <div class="form-panel">
      <h2 class="panel-title">{{ isEditing ? 'Cập nhật công thức' : 'Thêm công thức mới' }}</h2>

      <form @submit.prevent="handleSubmit">
        <!-- Tên công thức -->
        <div class="form-group">
          <label for="recipeName" class="form-label">Tên công thức</label>
          <input
            type="text"
            id="recipeName"
            v-model="formData.tenCongThuc"
            class="form-control"
            placeholder="Nhập tên công thức"
            required
          />
        </div>

        <!-- Nguyên liệu - TinyMCE -->
        <div class="form-group">
          <label for="ingredients" class="form-label">Nguyên liệu</label>
          <div class="editor-container">
            <editor
              id="ingredients"
              v-model="formData.nguyenLieu"
              :init="editorConfig"
              placeholder="Nhập nguyên liệu cần thiết..."
            />
          </div>
        </div>

        <!-- Cách làm - TinyMCE -->
        <div class="form-group">
          <label for="instructions" class="form-label">Cách làm</label>
          <div class="editor-container">
            <editor
              id="instructions"
              v-model="formData.cachLam"
              :init="editorConfig"
              placeholder="Nhập các bước thực hiện..."
            />
          </div>
        </div>

        <!-- Upload hình ảnh -->
        <div class="form-group">
          <label for="image" class="form-label">Hình ảnh</label>
            <div class="upload-container">
                <input
              type="file"
              id="image"
              ref="fileInput"
              @change="handleImageUpload"
              accept="image/*"
              class="hidden-input"
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="btn btn-secondary"
            >
              {{ imageFile ? 'Chọn ảnh khác' : 'Chọn ảnh' }}
            </button>
            <span v-if="imageFile" class="file-name">{{ imageFile.name }}</span>
          </div>

          <!-- Preview hình ảnh -->
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Preview" />
          </div>
        </div>

        <!-- Buttons -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="btn btn-secondary">Hủy</button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật' : 'Lưu công thức') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Lưới hiển thị công thức -->
    <div class="grid-panel">
      <h2 class="panel-title">Danh sách công thức</h2>
      
      <!-- Tìm kiếm -->
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchQuery" 
          @input="handleSearch" 
          placeholder="Tìm kiếm công thức..." 
          class="search-input"
        />
      </div>
      
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên công thức</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="paginatedRecipes.length === 0">
              <td colspan="3" class="empty-message">Không có dữ liệu</td>
            </tr>
            <tr v-for="recipe in paginatedRecipes" :key="recipe.id">
              <td>{{ recipe.id }}</td>
              <td>{{ recipe.tenCongThuc }}</td>
              <td class="action-cell">
                <button
                  class="edit-btn table-btn"
                  @click="editRecipe(recipe)"
                  title="Sửa"
                >
                  ✎
                </button>
                <button
                  class="delete-btn table-btn"
                  @click="confirmDelete(recipe.id)"
                  title="Xóa"
                >
                  X
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Phân trang -->
      <div class="pagination-container" v-if="totalPages > 1">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1" 
          @click="changePage(1)"
          title="Trang đầu"
        >
          «
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
          title="Trang trước"
        >
          ‹
        </button>
        
        <div class="pagination-info">
          <span>Trang {{ currentPage }} / {{ totalPages }}</span>
        </div>
        
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
          title="Trang sau"
        >
          ›
        </button>
        <button 
          class="pagination-btn" 
          :disabled="currentPage === totalPages" 
          @click="changePage(totalPages)"
          title="Trang cuối"
        >
          »
        </button>
        
        <div class="pagination-size">
          <span>Hiển thị</span>
          <select v-model="pageSize" @change="handlePageSizeChange" class="page-size-select">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
          <span>mục mỗi trang</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'CongThuc',
  components: {
    editor: Editor
  },
  data() {
    return {
      formData: {
        tenCongThuc: '',
        nguyenLieu: '',
        cachLam: '',
        fileFTP: ''
      },
      editorConfig: {
        apiKey: '6q1jkwu75mpqv0rx5y0uj9ldflybe17q9hetjj02lp5skf2t',
        height: 300,
        menubar: false,
        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        language: 'vi',
        language_url: '/path/to/vi.js'
      },
      imageFile: null,
      imagePreview: null,
      isEditing: false,
      isSubmitting: false,
      recipes: [],
      
      // Phân trang
      currentPage: 1,
      pageSize: 10,
      
      // Tìm kiếm
      searchQuery: '',
      filteredRecipes: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRecipes.length / this.pageSize);
    },
    paginatedRecipes() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredRecipes.slice(startIndex, endIndex);
    }
  },
  mounted() {
    this.fetchRecipes();
  },
  methods: {
    showMessage(text, type = 'success') {
      alert(text);
    },
    async fetchRecipes() {
      try {
        const response = await axios.get('api/CongThuc');
        this.recipes = response.data;
        this.filteredRecipes = [...this.recipes]; // Khởi tạo filteredRecipes
      } catch (error) {
        console.error('Lỗi khi lấy danh sách công thức:', error);
        this.showMessage('Không thể tải danh sách công thức', 'error');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    async handleSubmit() {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      try {
        if (this.imageFile) {
          const formData = new FormData();
          formData.append('file', this.imageFile);
          const uploadResponse = await axios.post('api/ftp/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          this.formData.fileFTP = uploadResponse.data.filePath;
        }
        let response;
        if (this.isEditing) {
          response = await axios.post(`api/CongThuc/${this.formData.id}`, this.formData);
        } else {
          response = await axios.post('api/CongThuc', this.formData);
        }
        this.showMessage(this.isEditing ? 'Cập nhật công thức thành công' : 'Thêm công thức thành công');
        this.resetForm();
        this.fetchRecipes();
      } catch (error) {
        console.error('Lỗi khi lưu công thức:', error);
        this.showMessage('Có lỗi xảy ra. Vui lòng thử lại sau.', 'error');
      } finally {
        this.isSubmitting = false;
      }
    },
    editRecipe(recipe) {
      this.isEditing = true;
      this.formData = { ...recipe };
      this.imagePreview = recipe.fileFTP ? getFullFtpUrl(recipe.fileFTP) : null;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    confirmDelete(id) {
      if (confirm('Bạn có chắc chắn muốn xóa công thức này?')) {
        this.deleteRecipe(id);
      }
    },
    async deleteRecipe(id) {
      try {
        await axios.delete(`api/CongThuc/${id}`);
        this.showMessage('Xóa công thức thành công');
        this.fetchRecipes();
      } catch (error) {
        console.error('Lỗi khi xóa công thức:', error);
        this.showMessage('Không thể xóa công thức', 'error');
      }
    },
    resetForm() {
      this.formData = { id: null, tenCongThuc: '', nguyenLieu: '', cachLam: '', fileFTP: '' };
      this.imageFile = null;
      this.imagePreview = null;
      this.isEditing = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    // Phương thức phân trang
    changePage(page) {
      if (page < 1) {
        this.currentPage = 1;
      } else if (page > this.totalPages) {
        this.currentPage = this.totalPages;
      } else {
        this.currentPage = page;
      }
    },
    handlePageSizeChange() {
      // Khi thay đổi số lượng hiển thị mỗi trang, quay lại trang 1
      this.currentPage = 1;
    },
    
    // Phương thức tìm kiếm
    handleSearch() {
      this.currentPage = 1; // Reset về trang 1 khi tìm kiếm
      if (!this.searchQuery.trim()) {
        this.filteredRecipes = [...this.recipes];
        return;
      }
      
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredRecipes = this.recipes.filter(recipe => 
        recipe.tenCongThuc.toLowerCase().includes(query) || 
        recipe.id.toString().includes(query)
      );
    }
  }
};
</script>

<style scoped>
/* Container styles */
.recipe-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* Panel styles */
.form-panel, .grid-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 30px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* Form group styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Button styles */
.btn {
  display: inline-block;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #e74c3c;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #c0392b;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #d2d8e0;
}

.btn-danger {
  background-color: #e53e3e;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c53030;
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

/* Upload styles */
.upload-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.hidden-input {
  display: none;
}

.file-name {
  font-size: 14px;
  color: #666;
}

.image-preview {
  margin-top: 12px;
}

.image-preview img {
  height: 160px;
  object-fit: cover;
  border-radius: 4px;
}

/* Table styles */
.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

.data-table th,
.data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.data-table tr:hover {
  background-color: #f8f9fa;
}

.action-buttons {
  text-align: center;
}

.btn-edit, .btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
}

.btn-edit {
  color: #4a90e2;
  margin-right: 8px;
}

.btn-edit:hover {
  color: #3a7bc8;
}

.btn-delete {
  color: #e53e3e;
}

.btn-delete:hover {
  color: #c53030;
}

.empty-message {
  text-align: center;
  color: #888;
  padding: 20px;
}

/* Alert styles */
.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  font-size: 14px;
}

.alert-success {
  background-color: #def7ec;
  color: #0f766e;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.modal-content {
  margin-bottom: 24px;
  color: #555;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.action-cell {
  white-space: nowrap;
  width: 100px;
}

.table-btn {
  width: 32px;
  height: 32px;
  margin: 0 5px 0 0;
  padding: 0;
  line-height: 32px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.edit-btn {
  background-color: #3498db;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Phân trang */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #4a90e2;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 12px;
  font-size: 14px;
  color: #6c757d;
}

.pagination-size {
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6c757d;
}

.page-size-select {
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  font-size: 14px;
}

/* Tìm kiếm */
.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>');
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}
</style>