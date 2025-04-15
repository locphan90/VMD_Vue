<template>
  <div class="product-form">
    <h2>Nhập sản phẩm</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>CAT:</label>
        <select v-model="product.cat">
          <option value="Mới">Mới</option>
          <option value="Nổi bật">Nổi bật</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tên SP:</label>
        <input type="text" v-model="product.tenSP" required />
      </div>

      <div class="form-group">
        <label>Giá Tham Khảo:</label>
        <input
          type="text"
          v-model="product.giaThamKhao"
          @input="onPriceInput"
          required
        />
      </div>

      <div class="form-group">
        <label>Mô tả:</label>
        <input type="text" v-model="product.mota" />
      </div>

      <div class="form-group">
        <label>Loại:</label>
        <select v-model="product.loai">
          <option value="New">New</option>
          <option value="Sale">Sale</option>
        </select>
      </div>

      <div class="form-group">
        <label>Ngành:</label>
        <select v-model="product.nganh">
          <option value="FMCG">FMCG</option>
          <option value="Mẹ & Bé">Mẹ & Bé</option>
          <option value="HealthCare">HealthCare</option>
          <option value="Industry">Industry</option>
        </select>
      </div>

      <div class="form-group">
        <label>File sản phẩm:</label>
        <input type="file" @change="onFileChange" />
      </div>

      <button type="submit">Lưu sản phẩm</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { formatInputCurrency } from "../../utils/formatter.js";

export default {
  name: "ProductForm",
  data() {
    return {
      product: {
        cat: "Mới",
        tenSP: "",
        giaThamKhao: "",
        mota: "",
        loai: "New",
        nganh: "FMCG",
        fileFTP: "",
      },
    };
  },
  methods: {
    onPriceInput(event) {
      this.product.giaThamKhao = formatInputCurrency(event.target.value);
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    async handleSubmit() {
      // Kiểm tra file trước
      if (!this.selectedFile) {
        alert("Vui lòng chọn file sản phẩm!");
        return;
      }

      // Bước 1: Upload file lên FTP
      const formData = new FormData();
      formData.append("file", this.selectedFile);

      try {
        const uploadResponse = await axios.post(
          "https://localhost:7210/api/ftp/upload",
          formData
        );

        const uploadedPath = uploadResponse.data.filePath; // ✅ đúng thuộc tính
        this.product.fileFTP = uploadedPath;
        console.log("path", uploadedPath);
        // Bước 2: Lưu thông tin sản phẩm
        const cleanGia = Number(this.product.giaThamKhao.replace(/\D/g, ""));

        const payload = {
          cat: this.product.cat,
          tenSP: this.product.tenSP,
          giaThamKhao: cleanGia,
          mota: this.product.mota,
          loai: this.product.loai,
          nganh: this.product.nganh,
          fileFTP: this.product.fileFTP,
        };
        console.log("Payload gửi:", payload);
        await axios.post("https://localhost:7210/api/sanpham", payload);

        alert("Thêm sản phẩm thành công!");
        this.resetForm();
      } catch (error) {
        console.error("Lỗi khi lưu sản phẩm:", error);
        alert("Có lỗi xảy ra khi lưu sản phẩm!");
      }
    },
    resetForm() {
      this.product = {
        cat: "Mới",
        tenSP: "",
        giaThamKhao: "",
        mota: "",
        loai: "New",
        nganh: "FMCG",
        fileFTP: "",
      };
    },
  },
};
</script>

<style scoped>
.product-form {
  max-width: 600px;
  margin: 50px auto; /* ✅ Khoảng cách so với header & footer */
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.product-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

input:focus,
select:focus {
  border-color: #e74c3c;
  outline: none;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #e74c3c;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
}

button:hover {
  background-color: #c0392b;
}
</style>
