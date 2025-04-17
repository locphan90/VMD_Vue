<template>
  <div class="blog-post-manager">
    <h2>{{ isEditing ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới' }}</h2>
    
    <!-- Form nhập liệu -->
    <div class="form-container">
      <div class="form-group">
        <label for="tieuDe">Tiêu đề:</label>
        <input 
          type="text" 
          id="tieuDe" 
          v-model="formData.tieuDe" 
          class="form-control"
          placeholder="Nhập tiêu đề bài viết"
        />
      </div>
      
      <div class="form-group">
        <label for="linkAnh">Hình ảnh:</label>
        <div class="file-upload-container">
          <input 
            type="file" 
            id="linkAnh" 
            @change="handleFileUpload" 
            class="file-input"
            accept="image/*"
          />
          <button @click="triggerFileInput" class="btn btn-secondary">Chọn ảnh</button>
          <span v-if="formData.linkAnh" class="selected-file">{{ getFileName(formData.linkAnh) }}</span>
        </div>
        <div v-if="formData.linkAnh" class="image-preview">
          <img :src="formData.linkAnh" alt="Preview" />
        </div>
      </div>
      
      <div class="form-group">
        <label for="ngayDang">Ngày đăng:</label>
        <input 
          type="date" 
          id="ngayDang" 
          v-model="formData.ngayDang" 
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="noiDung">Nội dung:</label>
        <editor
          v-model="formData.noiDung"
          :api-key="tinymceApiKey"
          :init="editorConfig"
        />
      </div>

      <div class="form-group">
        <label>Trạng thái:</label>
        <div class="status-selection">
          <label class="radio-label">
            <input type="radio" v-model="formData.status" value="OK" /> Active
          </label>
          <label class="radio-label">
            <input type="radio" v-model="formData.status" value="XX" /> Inactive
          </label>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="savePost" class="btn btn-primary">{{ isEditing ? 'Cập nhật' : 'Thêm mới' }}</button>
        <button @click="resetForm" class="btn btn-secondary">Hủy</button>
      </div>
    </div>
    
    <!-- Lưới hiển thị bài viết -->
    <div class="posts-grid">
      <h3>Danh sách bài viết</h3>
      
      <table class="posts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tiêu đề</th>
            <th>Ngày đăng</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.id">
            <td>{{ post.id }}</td>
            <td>{{ post.tieuDe }}</td>
            <td>{{ formatDate(post.ngayDang) }}</td>
            <td>
              <div class="status-toggle">
                <label class="switch">
                  <input 
                    type="checkbox" 
                    :checked="post.status === 'OK'" 
                    @change="toggleStatus(post)"
                  />
                  <span class="slider round"></span>
                </label>
                <span class="status-text">{{ post.status === 'OK' ? 'Active' : 'Inactive' }}</span>
              </div>
            </td>
            <td class="action-buttons">
              <button @click="editPost(post)" class="btn btn-edit">Sửa</button>
              <button @click="deletePost(post.id)" class="btn btn-delete">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue';
import axios from 'axios';
import Editor from '@tinymce/tinymce-vue';

export default {
  name: 'BlogPostManager',
  components: {
    Editor
  },
  setup() {
    // State variables
    const posts = ref([]);
    const formData = reactive({
      id: null,
      tieuDe: '',
      linkAnh: '',
      noiDung: '',
      ngayDang: new Date().toISOString().split('T')[0],
      status: 'OK'
    });
    const isEditing = ref(false);
    const tinymceApiKey = '6q1jkwu75mpqv0rx5y0uj9ldflybe17q9hetjj02lp5skf2t';
    
    // TinyMCE configuration
    const editorConfig = {
      height: 400,
      menubar: true,
      plugins: [
        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
        'fullscreen', 'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
      ],
      toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | image | help',
      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
    };

    // Load posts on component mount
    onMounted(async () => {
      await fetchPosts();
    });

    // Fetch all posts
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://localhost:7210/api/ThongTinSuKien');
        posts.value = response.data;
      } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
      }
    };

    // Handle file upload
    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        const response = await axios.post('https://localhost:7210/api/ftp/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Giả sử API trả về đường dẫn ảnh trong response.data
        formData.linkAnh = response.filePath;
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Không thể tải lên tệp. Vui lòng thử lại sau.');
      }
    };

    // Trigger file input click
    const triggerFileInput = () => {
      document.getElementById('linkAnh').click();
    };

    // Get file name from path
    const getFileName = (path) => {
      if (!path) return '';
      return path.split('/').pop();
    };

    // Format date for display
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    };

    // Save post (create or update)
    const savePost = async () => {
      try {
        if (isEditing.value) {
          // Update existing post
          await axios.put(`https://localhost:7210/api/ThongTinSuKien/${formData.id}`, formData);
          alert('Cập nhật bài viết thành công!');
        } else {
          // Create new post
          await axios.post('https://localhost:7210/api/ThongTinSuKien', formData);
          alert('Thêm bài viết mới thành công!');
        }
        
        // Refresh posts list and reset form
        await fetchPosts();
        resetForm();
      } catch (error) {
        console.error('Error saving post:', error);
        alert('Có lỗi xảy ra khi lưu bài viết. Vui lòng thử lại.');
      }
    };

    // Edit post
    const editPost = (post) => {
      formData.id = post.id;
      formData.tieuDe = post.tieuDe;
      formData.linkAnh = post.linkAnh;
      formData.noiDung = post.noiDung;
      formData.ngayDang = new Date(post.ngayDang).toISOString().split('T')[0];
      formData.status = post.status;
      isEditing.value = true;
      
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Delete post
    const deletePost = async (id) => {
      if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
      
      try {
        await axios.delete(`https://localhost:7210/api/ThongTinSuKien/${id}`);
        alert('Xóa bài viết thành công!');
        await fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Không thể xóa bài viết. Vui lòng thử lại sau.');
      }
    };

    // Toggle post status
    const toggleStatus = async (post) => {
      const updatedPost = { ...post };
      updatedPost.status = updatedPost.status === 'OK' ? 'XX' : 'OK';
      
      try {
        await axios.put(`https://localhost:7210/api/ThongTinSuKien/${post.id}`, updatedPost);
        await fetchPosts();
      } catch (error) {
        console.error('Error updating post status:', error);
        alert('Không thể cập nhật trạng thái bài viết.');
      }
    };

    // Reset form
    const resetForm = () => {
      formData.id = null;
      formData.tieuDe = '';
      formData.linkAnh = '';
      formData.noiDung = '';
      formData.ngayDang = new Date().toISOString().split('T')[0];
      formData.status = 'OK';
      isEditing.value = false;
    };

    return {
      posts,
      formData,
      isEditing,
      tinymceApiKey,
      editorConfig,
      handleFileUpload,
      triggerFileInput,
      getFileName,
      formatDate,
      savePost,
      editPost,
      deletePost,
      toggleStatus,
      resetForm
    };
  }
}
</script>

<style scoped>
.blog-post-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2, h3 {
  color: #333;
  margin-bottom: 20px;
}

.form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.file-upload-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.file-input {
  display: none;
}

.selected-file {
  margin-left: 10px;
  font-style: italic;
  color: #666;
}

.image-preview {
  margin-top: 10px;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-selection {
  display: flex;
  gap: 20px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.posts-grid {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.posts-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.posts-table th, 
.posts-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.posts-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.posts-table tr:hover {
  background-color: #f9f9f9;
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(30px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.status-text {
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-edit:hover {
  background-color: #0b7dda;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #d32f2f;
}
</style>