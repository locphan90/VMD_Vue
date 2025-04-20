<template>
  <div class="product-form">
    <h2>Nhập sản phẩm</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Loại:</label>
        <select v-model="product.cat">
          <option value="MOI">Mới</option>
          <option value="NOIBAT">Nổi bật</option>
        </select>
      </div>

      <div class="form-group">
        <label>Tên sản phẩm:</label>
        <input type="text" v-model="product.tenSP" required />
      </div>

      <div class="form-group">
        <label>Giá tham khảo:</label>
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
        <label>Chi tiết sản phẩm:</label>
        <textarea v-model="product.chiTietSP" rows="5"></textarea>
      </div>
      <div class="form-group">
        <label>Phân loại:</label>
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
  <label>Thương hiệu:</label>
  <select v-model="product.thuongHieu">
    <option v-for="item in thuongHieuList" :key="item.val" :value="item.val">
      {{ item.val }}
    </option>
  </select>
</div>
      <div class="form-group">
        <label>File hình ảnh sản phẩm:</label>
        <input type="file" @change="onFileChange" />
      </div>
      <div class="form-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="product.ShowUp" />
          Hiển thị lên trang chủ
        </label>
      </div>

      <button type="submit">Lưu sản phẩm</button>
    </form>
    <hr style="margin: 40px 0" />
    <!-- Danh sách sản phẩm đã nhập trong ngày -->

    <div class="product-grid">
      <div class="product-card" v-for="item in todayProducts" :key="item.id">
        <!-- Nút xóa -->
        <button
          class="delete-btn"
          @click="deleteProduct(item.id)"
          title="Xóa sản phẩm"
        >
          X
        </button>

        <!-- Hình ảnh sản phẩm -->
        <div class="product-image">
          <img :src="item.fileFTP" alt="Hình sản phẩm" />
        </div>

        <!-- Thông tin -->
        <div class="product-info">
          <strong>{{ item.tenSP }}</strong>
          <span class="product-price">
            {{ item.giaThamKhao.toLocaleString() }}
            <span class="currency">đ</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/utils/axios";
import { formatInputCurrency } from "@/utils/formatter";
import getFullFtpUrl from "@/utils/pathHelper";
const thuongHieuList = ref([]);
const fetchThuongHieu = async () => {
  try {
    const res = await axios.get("/api/MISC?cat=THUONGHIEU");
    thuongHieuList.value = res.data;
  } catch (err) {
    console.error("Lỗi khi tải thương hiệu:", err);
  }
};
const product = ref({
  cat: "Mới",
  tenSP: "",
  giaThamKhao: "",
  mota: "",
  chiTietSP: "", // 👈 thêm dòng này
  thuongHieu:"",
  loai: "New",
  nganh: "FMCG",
  fileFTP: "",
  showUp: false,
});

const selectedFile = ref(null);
const products = ref([]);

const onPriceInput = (event) => {
  product.value.giaThamKhao = formatInputCurrency(event.target.value);
};

const onFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};
const handleSubmit = async () => {
  if (!selectedFile.value) {
    alert("Vui lòng chọn file sản phẩm!");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {

    const formData = new FormData();
    formData.append("file", selectedFile.value);

    const uploadRes = await axios.post("/api/ftp/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    product.value.fileFTP = uploadRes.data.filePath;

    const cleanGia = Number(product.value.giaThamKhao.replace(/\D/g, ""));
    const payload = {
      ...product.value,
      giaThamKhao: cleanGia,
    };
    console.log(payload);
    await axios.post("/api/sanpham", payload);
    alert("Thêm sản phẩm thành công!");
    resetForm();
    await fetchTodayProducts();
  } catch (error) {
    console.error("Lỗi khi lưu sản phẩm:", error.response?.data || error);
    alert("Có lỗi xảy ra khi lưu sản phẩm!");
  }
};

const resetForm = () => {
  product.value = {
    cat: "Mới",
    tenSP: "",
    giaThamKhao: "",
    mota: "",
    chiTietSP: "",
    loai: "New",
    nganh: "FMCG",
    thuongHieu: "",
    fileFTP: "",
    showUp: false,
  };
  selectedFile.value = null;
};

// Lấy danh sách sản phẩm đã nhập trong ngày
const todayProducts = ref([]);
const fetchTodayProducts = async () => {
  try {
    const res = await axios.get("/api/sanpham");
    const today = new Date().toISOString().split("T")[0];
    // todayProducts = res.data.filter((p) => p.status !== "XX");
    todayProducts.value = res.data
      .filter((sp) => {
        const updatedDate = new Date(sp.fstUpdate).toISOString().split("T")[0];
        return sp.status !== "XX" && updatedDate === today;
      })
      .map((sp) => ({
        ...sp,
        fileFTP: getFullFtpUrl(sp.fileFTP), // ✅ xử lý đường dẫn ảnh tại đây
      }));
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm hôm nay:", err);
  }
};

const deleteProduct = async (id) => {
  if (confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
    try {
      await axios.put(`/api/sanpham/${id}`, {
        status: "XX",
      });
      fetchTodayProducts();
    } catch (error) {
      console.error("Lỗi khi xoá:", error);
    }
  }
};

onMounted(() => {
  fetchTodayProducts();
  fetchThuongHieu();
});
</script>


<style scoped>
.product-form {
  max-width: 725px;
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
.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  gap: 8px; /* khoảng cách giữa checkbox và text */
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
}

.scroll-target {
  margin-top: 170px; /* đúng với chiều cao header */
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  max-width: 100%;
}

.product-card {
  width: calc((100% - 40px) / 3); /* 3 sản phẩm mỗi hàng, 2 khoảng cách 20px */
  text-decoration: none;
  color: inherit;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  box-sizing: border-box;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
  pointer-events: none;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 10px;
}

.product-price {
  font-weight: bold;
  color: #e74c3c;
}

.currency {
  font-size: 0.7em;
  vertical-align: super;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  line-height: 22px;
  padding: 0;
  z-index: 10;
  width: 28px;
  height: 28px;
  font-size: 16px;
  line-height: 28px;
}

.delete-btn:hover {
  background: #c0392b;
}

.checkbox-showup {
  margin-top: 8px;
  font-size: 12px;
  text-align: left;
  color: #007bff;
}

textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
}

textarea:focus {
  border-color: #e74c3c;
  outline: none;
}
@media (max-width: 992px) {
  .product-card {
    width: calc((100% - 20px) / 2); /* 2 sản phẩm trên mỗi hàng */
  }
}

@media (max-width: 600px) {
  .product-card {
    width: 100%; /* 1 sản phẩm trên mỗi hàng */
  }
}
</style>
