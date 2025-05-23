<template>
  <div class="ftpfile-manager">
    <!-- Close Button -->
    <div class="close-button-container">
      <button @click="closeManager" class="btn-close">×</button>
    </div>
    
    <!-- Upload Form Section -->
    <div class="upload-section">
      <h2>Upload File</h2>
      <div class="form-group">
        <label for="file-type">Loại:</label>
        <select id="file-type" v-model="newFile.Loai" class="form-control">
          <option value="Hướng dẫn sử dụng sản phẩm">
            Hướng dẫn sử dụng sản phẩm
          </option>
          <option value="Chi tiết sản phẩm">Chi tiết sản phẩm</option>
          <option value="Tin tức">Tin tức</option>
        </select>
      </div>

      <div class="form-group">
        <label for="file-upload">Chọn File:</label>
        <div class="file-input-container">
          <input
            type="file"
            id="file-upload"
            ref="fileInput"
            @change="handleFileChange"
            class="file-input"
          />
          <div class="file-name">
            {{ selectedFileName || "Chưa chọn file" }}
          </div>
        </div>
      </div>

      <button @click="uploadFile" class="btn-upload">Tải lên</button>
    </div>

    <!-- Selected Image Preview (NEW) -->
    <div v-if="selectedImage" class="selected-image-preview">
      <h2>Hình ảnh đã chọn</h2>
      <div class="preview-container">
        <img :src="selectedImage.url" alt="Selected Image" class="preview-image" />
        <div class="image-info">
          <p><strong>Tên:</strong> {{ getFileName(selectedImage.fileFTP) }}</p>
          <p><strong>Loại:</strong> {{ selectedImage.loai }}</p>
          <p><strong>Đường dẫn:</strong> {{ selectedImage.fileFTP }}</p>
          <button @click="insertImageToDocument" class="btn-insert">Chèn vào document</button>
        </div>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <h2>Danh sách hình ảnh</h2>

      <div class="filters">
        <div class="form-group filter-input">
          <label for="filter-date">Ngày: >=</label>
          <input
            type="date"
            id="filter-date"
            v-model="filters.fromDate"
            class="form-control"
          />
        </div>

        <div class="form-group filter-input">
          <label for="filter-type">Loại:</label>
          <select id="filter-type" v-model="filters.loai" class="form-control">
            <option value="">Tất cả</option>
            <option value="Hướng dẫn sử dụng sản phẩm">
              Hướng dẫn sử dụng sản phẩm
            </option>
            <option value="Chi tiết sản phẩm">Chi tiết sản phẩm</option>
            <option value="Tin tức">Tin tức</option>
          </select>
        </div>

        <div class="btn-filter-container">
          <button @click="getFilteredFiles" class="btn-filter">Lọc</button>
        </div>
      </div>
    </div>

    <!-- Gallery Section -->
    <div class="gallery-section">
      <div v-if="files.length === 0" class="no-files">Không có file nào</div>

      <div class="file-grid" v-else>
        <div v-for="file in files" :key="file.id" class="file-item">
          <div class="file-thumbnail">
            <img :src="getFullFileUrl(file.fileFTP)" alt="File thumbnail" />
          </div>
          <div class="file-actions">
            <div class="file-name">{{ getFileName(file.fileFTP) }}</div>
            <div class="file-type">{{ file.loai }}</div>
            <button @click="copyFileLink(file.fileFTP)" class="btn-copy">
              Copy Link
            </button>
            <!-- <button @click="selectFile(file)" class="btn-select">Chọn</button> -->
            <button @click="deleteFile(file.id)" class="btn-delete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

export default {
  name: "FtpFileManager",
  emits: ["file-selected", "image-selected", "close"],
  data() {
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayFormatted = `${year}-${month}-${day}`;

    return {
      newFile: {
        Loai: "Hướng dẫn sử dụng sản phẩm",
        FileFTP: null,
        Status: "OK",
      },
      selectedFileName: "",
      selectedImage: null, // NEW: Để lưu trữ hình ảnh được chọn
      filters: {
        fromDate: todayFormatted,
        loai: "",
      },
      files: [],
    };
  },
  mounted() {
    // Load files on component mount
    this.getFilteredFiles();
    
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  },
  beforeUnmount() {
    // Restore body scrolling when component is unmounted
    document.body.style.overflow = '';
  },
  methods: {
    closeManager() {
      // Reset component state before closing
      this.selectedImage = null;
      this.selectedFileName = "";
      this.newFile.FileFTP = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = "";
      }
      
      // Emit close event to parent component
      this.$emit('close');
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFileName = file.name;
        this.newFile.FileFTP = file;
      } else {
        this.selectedFileName = "";
        this.newFile.FileFTP = null;
      }
    },
    async uploadFile() {
      if (!this.newFile.FileFTP) {
        alert("Vui lòng chọn file để tải lên");
        return;
      }

      try {
        // Step 1: Upload file to FTP server
        const uploadFormData = new FormData();
        uploadFormData.append("file", this.newFile.FileFTP);

        const uploadResponse = await axios.post(
          "/api/ftp/upload",
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Get the file path from the response
        const filePath = uploadResponse.data.filePath;

        // Step 2: Create record in database
        const ftpFileData = {
          Loai: this.newFile.Loai,
          FileFTP: filePath,
          FstUpdate: new Date().toISOString(),
          Status: this.newFile.Status,
        };
        console.log(ftpFileData);
        await axios.post("/api/ftpfile", ftpFileData);

        alert("File đã được tải lên thành công!");
        // Reset form
        this.newFile.FileFTP = null;
        this.selectedFileName = "";
        this.$refs.fileInput.value = "";

        // Refresh file list
        this.getFilteredFiles();
      } catch (error) {
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
        console.error("Upload error:", error);
      }
    },
    async getFilteredFiles() {
      try {
        const { fromDate, loai } = this.filters;
        let url = `/api/FtpFile/filter?fromDate=${fromDate}`;

        if (loai) {
          url += `&loai=${encodeURIComponent(loai)}`;
        }
        const response = await axios.get(url);
        this.files = response.data;
      } catch (error) {
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
        console.error("Filter error:", error);
      }
    },
    async deleteFile(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa file này?")) {
        return;
      }

      try {
        await axios.post(`/api/ftpfile/delete/${id}`);
        alert("File đã được xóa thành công!");
        // Remove file from list
        this.files = this.files.filter((file) => file.id !== id);
      } catch (error) {
        alert(`Lỗi: ${error.response?.data?.message || error.message}`);
        console.error("Delete error:", error);
      }
    },
    copyFileLink(filePath) {
      // Create a temporary input element
      const temp = document.createElement("input");
      document.body.appendChild(temp);
      temp.value = getFullFtpUrl(filePath) ; // Sửa lại để copy trực tiếp đường dẫn fileFTP
      temp.select();

      // Copy the text
      document.execCommand("copy");

      // Remove the temporary element
      document.body.removeChild(temp);

      alert("Đã sao chép link vào clipboard!");
    },
    // New method to select a file and emit event
    selectFile(file) {
      // Lấy đường dẫn đầy đủ của file
      const fullUrl = this.getFullFileUrl(file.fileFTP);
      
      // Tạo đối tượng chứa thông tin của file đã chọn
      const selectedFile = {
        id: file.id,
        loai: file.loai,
        fileFTP: file.fileFTP,
        fstUpdate: file.fstUpdate,
        status: file.status,
        url: fullUrl   // Thêm URL đầy đủ để dễ dàng hiển thị ảnh
      };
      
      // Cập nhật hình ảnh đã chọn để hiển thị trong component
      this.selectedImage = selectedFile;
      
      // Gửi sự kiện lên component cha
      this.$emit("file-selected", selectedFile);
      this.$emit("image-selected", selectedFile);
    },
    
    // Phương thức để chèn hình ảnh vào document
    insertImageToDocument() {
      if (!this.selectedImage) return;
      
      // Tạo thẻ img với đường dẫn đầy đủ
      const imgTag = `<img src="${this.selectedImage.url}" alt="${this.getFileName(this.selectedImage.fileFTP)}" />`;
      
      // Copy thẻ img vào clipboard để người dùng có thể dán vào document
      const temp = document.createElement("input");
      document.body.appendChild(temp);
      temp.value = imgTag;
      temp.select();
      document.execCommand("copy");
      document.body.removeChild(temp);
      
      alert("Đã copy thẻ hình ảnh vào clipboard. Bạn có thể dán vào document của bạn!");
    },
    // Method to open this component as a modal from another component
    openAsModal() {
      // This method can be called from a parent component
      this.getFilteredFiles(); // Refresh data when opened
    },
    // Lấy URL đầy đủ từ đường dẫn fileFTP
    getFullFileUrl(filePath) {
      return getFullFtpUrl(filePath);
    },
    // Lấy tên file từ đường dẫn
    getFileName(filePath) {
      if (!filePath) return "Không có tên";
      const parts = filePath.split('/');
      return parts[parts.length - 1];
    }
  },
};
</script>

<style scoped>
.ftpfile-manager {
  font-family: Arial, sans-serif;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-sizing: border-box;
}

/* Close button styling */
.close-button-container {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.btn-close {
  background-color: #f44336;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 24px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 0;
}

.btn-close:hover {
  background-color: #d32f2f;
}

h2 {
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.file-input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
}

.file-input {
  flex: 1;
}

.file-name {
  margin-left: 10px;
  color: #666;
}

button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.btn-delete {
  background-color: #f44336;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.btn-copy {
  background-color: #2196f3;
  margin-right: 8px;
}

.btn-copy:hover {
  background-color: #0b7dda;
}

.btn-select {
  background-color: #ff9800;
  margin-right: 8px;
}

.btn-select:hover {
  background-color: #e68a00;
}

.upload-section,
.filter-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filters {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.filters .filter-input {
  flex-grow: 1;
}

.btn-filter-container {
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px; /* Match the margin-bottom of form-group */
}

.btn-filter {
  height: 38px; /* Adjust to match the height of the inputs */
  margin: 0;
}

.gallery-section {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.no-files {
  text-align: center;
  padding: 30px;
  color: #666;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.file-item {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.file-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.file-thumbnail {
  height: 150px;
  overflow: hidden;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-actions {
  padding: 15px;
}

.file-name {
  font-weight: bold;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.selected-image-preview {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.preview-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
}

.image-info {
  flex: 1;
}

.image-info p {
  margin: 8px 0;
}

.btn-insert {
  background-color: #8e44ad;
  margin-top: 10px;
}

.btn-insert:hover {
  background-color: #703688;
}

/* Responsive styles */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 10px;
  }
  
  .preview-container {
    flex-direction: column;
  }
  
  .preview-image {
    width: 100%;
    height: auto;
    max-height: 200px;
  }
}
</style>