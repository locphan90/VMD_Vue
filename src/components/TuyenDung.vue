<template>
  <div class="recruitment-form">
    <h1 class="form-title">Đơn Ứng Tuyển</h1>

    <div v-if="isSubmitted" class="success-message">
      <h2>Cảm ơn bạn đã gửi đơn ứng tuyển!</h2>
      <p>Đơn ứng tuyển của bạn đã được gửi thành công cho nhà tuyển dụng.</p>
      <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
      <button @click="resetForm" class="reset-button">Gửi đơn mới</button>
    </div>

    <form v-else @submit.prevent="submitForm" class="form-container">
      <div class="form-group">
        <label for="hoTen">Họ và tên <span class="required">*</span></label>
        <input
          type="text"
          id="hoTen"
          v-model="formData.hoTen"
          required
          class="form-control"
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div class="form-group">
        <label for="email">Email <span class="required">*</span></label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          class="form-control"
          placeholder="example@email.com"
        />
        <span v-if="errors.email" class="error-message">{{
          errors.email
        }}</span>
      </div>

      <div class="form-group">
        <label for="soDienThoai"
          >Số điện thoại <span class="required">*</span></label
        >
        <input
          type="tel"
          id="soDienThoai"
          v-model="formData.soDienThoai"
          required
          class="form-control"
          placeholder="0909123456"
        />
        <span v-if="errors.soDienThoai" class="error-message">{{
          errors.soDienThoai
        }}</span>
      </div>

      <div class="form-group">
        <label for="viTri"
          >Vị trí ứng tuyển <span class="required">*</span></label
        >
        <input
          type="text"
          id="viTri"
          v-model="formData.viTri"
          required
          class="form-control"
          placeholder="Nhân viên kinh doanh"
        />
      </div>

      <div class="form-group">
        <label for="noiDung">Nội dung <span class="required">*</span></label>
        <textarea
          id="noiDung"
          v-model="formData.noiDung"
          rows="5"
          required
          class="form-control"
          placeholder="Mô tả ngắn về bản thân và mong muốn của bạn..."
        ></textarea>
      </div>

      <div class="form-group">
        <label for="fileCV"
          >File CV (PDF) <span class="required">*</span></label
        >
        <input
          type="file"
          id="fileCV"
          @change="handleFileUpload"
          accept=".pdf"
          required
          class="form-control"
        />
        <span v-if="errors.fileCV" class="error-message">{{
          errors.fileCV
        }}</span>
      </div>

      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? "Đang gửi..." : "Gửi Đơn Ứng Tuyển" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "TuyenDung",

  data() {
    return {
      formData: {
        hoTen: "",
        email: "",
        soDienThoai: "",
        viTri: "",
        noiDung: "",
        fileCV: null,
        status: "OK", // Luôn mặc định là OK
      },
      errors: {
        email: "",
        soDienThoai: "",
        fileCV: "",
      },
      isSubmitting: false,
      isSubmitted: false,
    };
  },

  created() {
    // Lấy dữ liệu từ API khi component được khởi tạo
    this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        const response = await axios.get("api/tuyendung");
        if (response.data) {
          // Cập nhật formData với dữ liệu từ API
          const { hoTen, email, soDienThoai, viTri, noiDung } = response.data;
          this.formData = {
            ...this.formData,
            hoTen,
            email,
            soDienThoai,
            viTri,
            noiDung,
          };
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.errors.fileCV = "";

      if (!file) {
        return;
      }

      // Kiểm tra định dạng file
      if (file.type !== "application/pdf") {
        this.errors.fileCV = "File CV phải có định dạng PDF";
        return;
      }

      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errors.fileCV = "File CV không được vượt quá 5MB";
        return;
      }

      this.formData.fileCV = file;
    },

    validateForm() {
      let isValid = true;

      // Kiểm tra email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        this.errors.email = "Email không hợp lệ";
        isValid = false;
      } else {
        this.errors.email = "";
      }

      // Kiểm tra số điện thoại
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(this.formData.soDienThoai)) {
        this.errors.soDienThoai = "Số điện thoại không hợp lệ";
        isValid = false;
      } else {
        this.errors.soDienThoai = "";
      }

      // Kiểm tra file CV
      if (!this.formData.fileCV) {
        this.errors.fileCV = "Vui lòng tải lên file CV";
        isValid = false;
      }

      return isValid;
    },

    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        // Tải file CV lên trước
        const fileFormData = new FormData();
        fileFormData.append("file", this.formData.fileCV);

        // Upload file tới API file upload
        const fileResponse = await axios.post("api/ftp/upload", fileFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Lấy đường dẫn file từ phản hồi
        const filePathCV =
          fileResponse.data.filePath ||
          fileResponse.data.path ||
          fileResponse.data;

        // Chuẩn bị FormData để gửi thông tin ứng tuyển
        const payload = {
          hoTen: this.formData.hoTen,
          email: this.formData.email,
          soDienThoai: this.formData.soDienThoai,
          viTri: this.formData.viTri,
          noiDung: this.formData.noiDung,
          fileCV: filePathCV,
          status: this.formData.status,
        };
console.log(payload);
        await axios.post("api/tuyendung", payload);
        // Hiển thị thông báo thành công
        this.isSubmitted = true;
      } catch (error) {
        console.error("Lỗi khi gửi đơn ứng tuyển:", error);
        alert("Có lỗi xảy ra khi gửi đơn ứng tuyển. Vui lòng thử lại sau.");
      } finally {
        this.isSubmitting = false;
      }
    },

    resetForm() {
      this.formData = {
        hoTen: "",
        email: "",
        soDienThoai: "",
        viTri: "",
        noiDung: "",
        fileCV: null,
        status: "OK",
      };
      this.errors = {
        email: "",
        soDienThoai: "",
        fileCV: "",
      };
      this.isSubmitted = false;
    },
  },
};
</script>

<style scoped>
.recruitment-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-title {
  text-align: center;
  margin-bottom: 30px;
  color: #2c3e50;
}

.form-container {
  background-color: #f9f9f9;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-control:focus {
  border-color: #3498db;
  outline: none;
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

textarea.form-control {
  resize: vertical;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  margin-top: 30px;
  text-align: center;
}

.submit-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #1a252f;
}

.submit-button:disabled {
  background-color: #95a5a6;
  cursor: not-allowed;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 20px;
}

.reset-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 15px;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: #2980b9;
}
</style>