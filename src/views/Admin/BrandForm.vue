<template>
  <div class="brand-wrapper">
    <!-- Form nhập thương hiệu -->
    <div class="brand-form">
      <h2>Thêm thương hiệu</h2>
      <div class="form-group">
        <label for="brandName">Tên thương hiệu</label>
        <input
          id="brandName"
          v-model="brandName"
          type="text"
          placeholder="Nhập tên thương hiệu"
        />
      </div>

      <div class="form-group">
        <label for="brandFile">File hình ảnh thương hiệu</label>
        <input
          id="brandFile"
          type="file"
          @change="handleFileChange"
          ref="fileInput"
        />
      </div>

      <button class="btn-save" @click="handleSubmit">Lưu</button>
    </div>

    <!-- Danh sách thương hiệu -->
    <div class="brand-list-wrapper">
      <h3>Danh sách Thương hiệu</h3>
      <div class="brand-list">
        <div class="brand-item" v-for="item in brandList" :key="item.id">
          <button class="btn-delete" @click="deleteBrand(item.id)">X</button>
          <img :src="item.val2" alt="logo" class="brand-img" />
          <span class="brand-name">{{ item.val }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const brandName = ref("");
const selectedFile = ref(null);
const brandList = ref([]);
const fileInput = ref(null);
const fetchBrands = async () => {
  try {
    const res = await axios.get("/api/MISC?cat=THUONGHIEU");
    console.log("Dữ liệu từ API:", res.data);
    brandList.value = res.data
      .filter((item) => item.status === "OK")
      .map((item) => ({
        ...item,
        val2: getFullFtpUrl(item.vaL2),
      }));
  } catch (err) {
    console.error("Lỗi tải thương hiệu:", err);
  }
};

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleSubmit = async () => {
  if (!brandName.value || !selectedFile.value) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    console.log("File chuẩn bị gửi:", selectedFile.value);
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const uploadRes = await axios.post("/api/ftp/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const fileUrl = uploadRes.data.filePath;

    const postData = {
      CAT: "THUONGHIEU",
      VAL: brandName.value,
      VAL2: fileUrl,
    };
console.log(postData);
    await axios.post("/api/MISC", postData);
    await fetchBrands();

    brandName.value = "";
    selectedFile.value = null;
    fileInput.value = ""; // ✅ reset input file

    alert("Lưu thương hiệu thành công!");
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    alert("Không thể lưu thương hiệu.");
  }
};

// const deleteBrand = async (id) => {
//   const confirmDelete = confirm("Bạn có chắc chắn muốn xoá thương hiệu này?");
//   if (!confirmDelete) return;

//   try {
//     await axios.put(`/api/MISC/${id}`, {
//       status: "XX",
//     });
//     await fetchBrands();
//   } catch (err) {
//     console.error("Lỗi xóa thương hiệu:", err);
//     alert("Xóa không thành công.");
//   }
// };
const deleteBrand = async (id) => {
  const confirmDelete = confirm("Bạn có chắc chắn muốn xoá thương hiệu này?");
  if (!confirmDelete) return;

  try {
    await axios.post(`/api/MISC/update/${id}`, {
      status: "XX",
    });
    await fetchBrands();
  } catch (err) {
    console.error("Lỗi xóa thương hiệu:", err);
    alert("Xóa không thành công.");
  }
};


onMounted(fetchBrands);
</script>

<style scoped>
.brand-wrapper {
  max-width: 1000px;
  margin: 30px auto;
  padding: 10px;
}

.brand-form,
.brand-list-wrapper {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}

h2,
h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
}

input[type="text"],
input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.btn-save {
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

.btn-save:hover {
  background-color: #c0392b;
}

.brand-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.brand-item {
  width: 160px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.brand-img {
  width: 100%;
  height: 100px;
  object-fit: contain;
  margin-bottom: 8px;
}

.brand-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
  margin-top: 5px;
}

.btn-delete {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  line-height: 22px;
  padding: 0;
  z-index: 10;
}

.btn-delete:hover {
  background: #c0392b;
}
.scroll-target {
  margin-top: 170px; /* đúng với chiều cao header */
}
</style>
