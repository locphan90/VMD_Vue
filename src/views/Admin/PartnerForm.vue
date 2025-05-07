<template>
  <div class="partner-wrapper">
    <!-- Form nhập đối tác -->
    <div class="partner-form">
      <h2>Thêm đối tác</h2>
      <div class="form-group">
        <label for="partnerName">Tên đối tác</label>
        <input
          id="partnerName"
          v-model="partnerName"
          type="text"
          placeholder="Nhập tên đối tác"
        />
      </div>

      <div class="form-group">
        <label for="partnerFile">File hình ảnh đối tác</label>
        <input id="partnerFile" type="file" @change="handleFileChange" />
      </div>

      <div class="form-group">
        <label for="partnerName">Link web đối tác</label>
        <input
          id="partnerWeb"
          v-model="partnerWeb"
          type="text"
          placeholder="Nhập web đối tác"
        />
      </div>

      <button class="btn-save" @click="handleSubmit">Lưu</button>
    </div>

    <!-- Danh sách thương hiệu -->
    <div class="partner-list-wrapper">
      <h3>Danh sách đối tác</h3>
      <div class="partner-list">
        <div class="partner-item" v-for="item in partnerList" :key="item.id">
          <button class="btn-delete" @click="deletePartner(item.id)">X</button>
          <img :src="item.val2" alt="logo" class="partner-img" />
          <span class="partner-name">{{ item.val }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const partnerName = ref("");
const partnerWeb = ref("");
const selectedFile = ref(null);
const partnerList = ref([]);

const fetchPartners = async () => {
  try {
    const res = await axios.get("/api/MISC?cat=DOITAC");
    partnerList.value = res.data
      .filter((item) => item.status === "OK")
      .map((item) => ({
        ...item,
        val2: getFullFtpUrl(item.vaL2),
      }));
  } catch (err) {
    console.error("Lỗi tải đối tác:", err);
  }
};

const handleFileChange = (e) => {
  selectedFile.value = e.target.files[0];
};

const handleSubmit = async () => {
  if (!partnerName.value || !selectedFile.value) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  try {
    // Upload file
    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const uploadRes = await axios.post("/api/ftp/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const fileUrl = uploadRes.data.filePath;
    console.log(uploadRes.data.filePath);
    const postData = {
      cat: "DOITAC",
      val: partnerName.value,
      val2: fileUrl,
      val3: partnerWeb.value,
    };

    await axios.post("/api/MISC", postData);
    await fetchPartners();

    partnerName.value = "";
    partnerWeb.value="";
    selectedFile.value = null;
    alert("Lưu đối tác thành công!");
  } catch (error) {
    console.error("Lỗi khi lưu:", error);
    alert("Không thể lưu đối tác.");
  }
};

const deletePartner = async (id) => {
  const confirmDelete = confirm("Bạn có chắc chắn muốn xoá đối tác này?");
  if (!confirmDelete) return;

  try {
    await axios.post(`/api/MISC/update/${id}`, {
      Status: "XX",
    });
    await fetchPartners();
  } catch (err) {
    console.error("Lỗi xóa đối tác:", err);
    alert("Xóa không thành công.");
  }
};

onMounted(fetchPartners);
</script>

<style scoped>
.partner-wrapper {
  max-width: 1000px;
  margin: 30px auto;
  padding: 10px;
}

.partner-form,
.partner-list-wrapper {
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

.partner-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.partner-item {
  width: 160px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  background: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
}

.partner-img {
  width: 100%;
  height: 100px;
  object-fit: contain;
  margin-bottom: 8px;
}

.partner-name {
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
